// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "./interfaces/IEpochs.sol";
import "./interfaces/ITracker.sol";
import "./interfaces/IDeposits.sol";

/// external dependencies
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "./TrackerWrapper.sol";

/// @title Contract tracking effective deposits across epochs (Hexagon).
/// @author Golem Foundation
/// @notice This contract tracks effective deposits for particular epochs.
/// If deposit is lower than 100 GLM it is not taken into account.
/// For any epoch and participant, the lowest value of the deposit
/// is considered effective.
/// @dev Time is split into epochs, effective deposit is defined as min value
/// of GLM held by this contract on behalf of the depositor in particular epoch.
contract Tracker is Ownable {
    /// @notice Epochs contract address.
    IEpochs public immutable epochs;

    /// @notice Deposits contract address
    IDeposits public immutable deposits;

    /// @notice GLM token (token after migration).
    ERC20 public immutable glm;

    /// @notice GNT token (original GNT, before migration).
    ERC20 public immutable gnt;

    /// @notice TrackerWrapper address
    address public proxyAddress;

    struct EffectiveDeposit {
        bool isSet; // set to true to distinguish between null and zero values of ED
        uint256 amount;
    }

    /// @dev total effective deposit now
    uint256 public totalDeposit;

    /// @dev helper structure for effective deposit amounts tracking. See `depositAt` function
    /// GLMGE_it
    mapping(address => mapping(uint256 => EffectiveDeposit)) private effectiveDeposits;

    /// @dev Tracking total supply of GLM per epoch.
    mapping(uint256 => uint256) public tokenSupplyByEpoch;

    /// @dev total effective deposit in a particular epoch
    /// (sigma GLMGE_i for particular t)
    mapping(uint256 => EffectiveDeposit) private totalEffectiveDeposits;

    /// @param epochsAddress Address of Epochs contract.
    constructor(
        address epochsAddress,
        address depositsAddress,
        address glmAddress,
        address gntAddress
    ) {
        epochs = IEpochs(epochsAddress);
        deposits = IDeposits(depositsAddress);
        glm = ERC20(glmAddress);
        gnt = ERC20(gntAddress);
    }

    /// @dev Handle GLM deposit, compute epoch effective deposit.
    /// @param owner Owner of GLM
    /// @param oldDeposit Last value of owner's GLM deposit
    /// @param amount New funds being deposited.
    function processDeposit(
        address owner,
        uint256 oldDeposit,
        uint256 amount
    ) external onlyTrackerWrapper {
        uint256 oldTotal = totalDeposit;
        totalDeposit =
            totalDeposit -
            _applyDepositCutoff(oldDeposit) +
            _applyDepositCutoff(oldDeposit + amount);
        uint256 epoch = epochs.getCurrentEpoch();
        _updatePrevED(owner, epoch, oldDeposit, oldTotal);
        _updateCurrentED(owner, epoch, oldDeposit, oldTotal);
    }

    /// @dev Handle GLM withdrawal, compute epoch effective deposit.
    /// @param owner Owner of GLM
    /// @param oldDeposit Last value of owner's GLM deposit
    /// @param amount Amount of funds being withdrawed.
    function processWithdraw(
        address owner,
        uint256 oldDeposit,
        uint256 amount
    ) external onlyTrackerWrapper {
        uint256 oldTotal = totalDeposit;
        totalDeposit =
            totalDeposit -
            _applyDepositCutoff(oldDeposit) +
            _applyDepositCutoff(oldDeposit - amount);
        uint256 epoch = epochs.getCurrentEpoch();
        _updatePrevED(owner, epoch, oldDeposit, oldTotal);
    }

    /// @notice Check how much is staked at particular epoch. Note that contract tracks only minimal value of the stake particular depositor had at the epoch.
    /// @dev Call this to read ED for any user at particular epoch. Please note that worst-case gas cost is O(n) where n is
    /// the number of epochs contract has been active for.
    /// @param owner Owner of the deposit for which ED will be checked.
    /// @param epochNo Epoch number, for which ED will be checked.
    /// @return Effective deposit (GLM) in wei for particular epoch, particular owner.
    function depositAt(address owner, uint256 epochNo) external view returns (uint256) {
        uint256 currentEpoch = epochs.getCurrentEpoch();
        require(epochNo <= currentEpoch, "HN/future-is-unknown");
        require(epochNo > 0, "HN/epochs-start-from-1");
        for (uint256 iEpoch = epochNo; iEpoch <= currentEpoch; iEpoch = iEpoch + 1) {
            if (effectiveDeposits[owner][iEpoch].isSet) {
                return _applyDepositCutoff(effectiveDeposits[owner][iEpoch].amount);
            }
        }
        return _applyDepositCutoff(deposits.deposits(owner));
    }

    function totalDepositAt(uint256 epochNo) external view returns (uint256) {
        uint256 currentEpoch = epochs.getCurrentEpoch();
        require(epochNo <= currentEpoch, "HN/future-is-unknown");
        require(epochNo > 0, "HN/epochs-start-from-1");
        for (uint256 iEpoch = epochNo; iEpoch <= currentEpoch; iEpoch = iEpoch + 1) {
            if (totalEffectiveDeposits[iEpoch].isSet) {
                return totalEffectiveDeposits[iEpoch].amount;
            }
        }
        return totalDeposit;
    }

    function tokenSupplyAt(uint256 epochNo) external view returns (uint256) {
        uint256 currentEpoch = epochs.getCurrentEpoch();
        require(epochNo <= currentEpoch, "HN/future-is-unknown");
        require(epochNo > 0, "HN/epochs-start-from-1");
        for (uint256 iEpoch = epochNo; iEpoch <= currentEpoch; iEpoch = iEpoch + 1) {
            if (0 != tokenSupplyByEpoch[iEpoch]) {
                return tokenSupplyByEpoch[iEpoch];
            }
        }
        return tokenSupply();
    }

    /// @notice Compute total GLM token supply at this particular moment. Burned GLM is not part of the supply.
    function tokenSupply() public view returns (uint256) {
        address burnAddress = 0x0000000000000000000000000000000000000000;
        return
            glm.totalSupply() +
            gnt.totalSupply() -
            glm.balanceOf(burnAddress) -
            gnt.balanceOf(burnAddress);
    }

    function setProxyAddress(address _proxyAddress) external onlyOwner {
        proxyAddress = _proxyAddress;
    }

    /// @dev Sets ED in a situation when funds are moved after a period of inactivity.
    function _updatePrevED(
        address owner,
        uint256 epoch,
        uint256 oldDeposit,
        uint256 oldTotal
    ) private {
        EffectiveDeposit memory prevED = effectiveDeposits[owner][epoch - 1];
        if (!prevED.isSet) {
            prevED.isSet = true;
            prevED.amount = oldDeposit;
            effectiveDeposits[owner][epoch - 1] = prevED;
        }

        EffectiveDeposit memory epochED = totalEffectiveDeposits[epoch - 1];
        if (!epochED.isSet) {
            epochED.isSet = true;
            epochED.amount = oldTotal;
            totalEffectiveDeposits[epoch - 1] = epochED;
            tokenSupplyByEpoch[epoch] = tokenSupply();
        }
    }

    /// @dev Tracks ED as min(deposit) for current epoch.
    function _updateCurrentED(
        address owner,
        uint256 epoch,
        uint256 oldDeposit,
        uint256 oldTotal
    ) private {
        EffectiveDeposit memory currentED = effectiveDeposits[owner][epoch];
        EffectiveDeposit memory epochED = totalEffectiveDeposits[epoch];
        if (!currentED.isSet) {
            currentED.amount = oldDeposit;
            currentED.isSet = true;
            effectiveDeposits[owner][epoch] = currentED;
        } else {
            currentED.amount = _min(oldDeposit, currentED.amount);
            effectiveDeposits[owner][epoch] = currentED;
        }
        if (!epochED.isSet) {
            epochED.amount = oldTotal;
            epochED.isSet = true;
            totalEffectiveDeposits[epoch] = epochED;
        } else {
            epochED.amount = _min(oldTotal, epochED.amount);
            totalEffectiveDeposits[epoch] = epochED;
            tokenSupplyByEpoch[epoch] = tokenSupply();
        }
    }

    /// @dev return smaller of two number values
    function _min(uint256 a, uint256 b) private pure returns (uint256) {
        return a <= b ? a : b;
    }

    /// @dev Implements cutoff of 100 GLM. Amounts lower than that are not eligible for rewards.
    /// @param actualAmount Amount of GLM currently deposited.
    /// @return Amount of GLM adjusted by 100 GLM cutoff.
    function _applyDepositCutoff(uint256 actualAmount) private pure returns (uint256) {
        if (actualAmount < 100 ether) {
            return 0;
        }
        return actualAmount;
    }

    modifier onlyTrackerWrapper() {
        require(msg.sender == proxyAddress, "HN/invalid-caller");
        _;
    }
}
