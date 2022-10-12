// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "./interfaces/IEpochs.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/*
 * Contract tracking GLM deposits (staking) for Hexagon project.
 * Funds can be deposited or withdrawn at any moment.
 * Time is split into epochs, effective deposit is defined as min value
 * of GLM staked by an address in the epoch.
 *
 * To be more capital effective, do deposits at the end of an epoch,
 * and withdrawals at the beginning of an epoch.
 */

contract Deposits {
    ERC20 public immutable glm;
    IEpochs public immutable epochs;

    event Deposited(uint256 amount, uint256 when, address depositor);
    event Withdrawn(uint256 amount, uint256 when, address depositor);

    struct EffectiveDeposit {
        bool isSet; // set to true to distinguish between null and zero values of ES
        uint256 amount;
    }

    mapping(address => uint256) public deposits;
    mapping(address => mapping(uint256 => EffectiveDeposit)) effectiveDeposits;

    constructor(address epochsAddress, address glmAddress) {
        epochs = IEpochs(epochsAddress);
        glm = ERC20(glmAddress);
    }

    function deposit(uint256 amount) public {
        uint256 current = deposits[msg.sender];
        deposits[msg.sender] = current + amount;
        uint256 epoch = epochs.getCurrentEpoch();
        _updatePrevES(epoch, current);
        _updateCurrentES(epoch, current);
        require(
            glm.transferFrom(msg.sender, address(this), amount),
            "HN/cannot-transfer-from-sender"
        );
        emit Deposited(amount, block.timestamp, msg.sender);
    }

    function withdraw(uint256 amount) public {
        uint256 current = deposits[msg.sender];
        require(current >= amount, "HN/deposit-is-smaller");
        deposits[msg.sender] = current - amount;
        uint256 epoch = epochs.getCurrentEpoch();
        _updatePrevES(epoch, current);
        require(glm.transfer(msg.sender, amount));
        emit Withdrawn(amount, block.timestamp, msg.sender);
    }

    function stakeAt(address owner, uint256 epochNo) public view returns (uint256) {
        uint256 currentEpoch = epochs.getCurrentEpoch();
        require(epochNo <= currentEpoch, "HN/future-is-unknown");
        require(epochNo > 0, "HN/epochs-start-from-1");
        for (uint256 iEpoch = epochNo; iEpoch <= currentEpoch; iEpoch = iEpoch + 1) {
            if (effectiveDeposits[owner][iEpoch].isSet) {
                return effectiveDeposits[owner][iEpoch].amount;
            }
        }
        return deposits[owner];
    }

    function _updatePrevES(uint256 epoch, uint256 currentStake) private {
        EffectiveDeposit memory prevES = effectiveDeposits[msg.sender][epoch - 1];
        if (!prevES.isSet) {
            prevES.isSet = true;
            prevES.amount = currentStake;
        }
        effectiveDeposits[msg.sender][epoch - 1] = prevES;
    }

    function _updateCurrentES(uint256 epoch, uint256 currentStake) private {
        EffectiveDeposit memory currentES = effectiveDeposits[msg.sender][epoch];
        if (!currentES.isSet) {
            currentES.amount = currentStake;
        } else {
            currentES.amount = _min(currentStake, currentES.amount);
        }
        currentES.isSet = true;
        effectiveDeposits[msg.sender][epoch] = currentES;
    }

    function _min(uint256 a, uint256 b) private pure returns (uint256) {
        return a <= b ? a : b;
    }
}
