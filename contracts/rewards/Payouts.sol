// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.9;

import "../interfaces/IEpochs.sol";
import "../interfaces/IRewards.sol";

import {PayoutsErrors, CommonErrors} from "../Errors.sol";

/// @title Contract tracking ETH payouts for Hexagon project.
/// @author Golem Foundation
contract Payouts {
    IRewards public immutable rewards;
    IEpochs public immutable epochs;
    address public immutable withdrawals;

    struct Payout {
        // packed into two 32 byte slots
        // 16 bits is enough to store amount of ETH
        /// @dev last checkpointed epoch (=> funds from the epoch are are withdrawn)
        uint32 checkpointEpoch; // 32
        /// @dev total ETH payout by the end of checkpointed epoch, in wei
        uint144 checkpointSum; // 128+16
        /// @dev any extra ETH payout, less than required to checkpoint next epoch, in wei
        uint144 extra; // 128+16
        /// @dev total ETH payout, in wei
        uint144 total; // 128+16
    }

    /// @dev tracks ETH payouts to GLM stakers
    mapping(address => Payout) public userPayouts;

    /// @dev tracks ETH payouts to proposals
    mapping(address => Payout) public proposalPayouts;

    constructor(
        address rewardsAddress,
        address epochsAddress,
        address withdrawalsAddress
    ) {
        rewards = IRewards(rewardsAddress);
        epochs = IEpochs(epochsAddress);
        withdrawals = withdrawalsAddress;
    }

    /// @param user GLM staker
    /// @param amount Payout amount
    function registerUserPayout(
        address user,
        uint144 amount
    ) public onlyWithdrawals {
        uint32 finalizedEpoch = epochs.getCurrentEpoch() - 1;
        Payout memory p = userPayouts[user];
        uint144 remaining = amount;
        bool stop = false;
        while (!stop) {
            uint144 stepFunds = uint144(
                rewards.claimableReward(p.checkpointEpoch + 1, user)
            );
            if (p.extra + remaining > stepFunds) {
                remaining = remaining - (stepFunds - p.extra);
                p.checkpointEpoch = p.checkpointEpoch + 1;
                require(
                    p.checkpointEpoch <= finalizedEpoch,
                    PayoutsErrors.REGISTERING_UNEARNED_FUNDS
                );
                p.checkpointSum = p.checkpointSum + stepFunds;
                p.extra = 0;
            } else {
                stop = true;
                p.extra = p.extra + remaining;
                p.total = p.total + amount;
                assert(p.total == p.checkpointSum + p.extra);
            }
        }
        userPayouts[user] = p;
    }

    /// @param proposal proposal address
    /// @param amount Payout amount
    function registerProposalPayout(
        address proposal,
        uint144 amount
    ) public onlyWithdrawals {
        uint32 finalizedEpoch = epochs.getCurrentEpoch() - 1;
        Payout memory p = proposalPayouts[proposal];
        uint144 remaining = amount;
        bool stop = false;
        while (!stop) {
            uint144 stepFunds = uint144(
                rewards.proposalReward(p.checkpointEpoch + 1, proposal)
            );
            if (p.extra + remaining > stepFunds) {
                remaining = remaining - (stepFunds - p.extra);
                p.checkpointEpoch = p.checkpointEpoch + 1;
                require(
                    p.checkpointEpoch <= finalizedEpoch,
                    PayoutsErrors.REGISTERING_UNEARNED_FUNDS
                );
                p.checkpointSum = p.checkpointSum + stepFunds;
                p.extra = 0;
            } else {
                stop = true;
                p.extra = p.extra + remaining;
                p.total = p.total + amount;
                assert(p.total == p.checkpointSum + p.extra);
            }
        }
        proposalPayouts[proposal] = p;
    }

    function userPayoutStatus(
        address user
    ) external view returns (Payout memory) {
        return userPayouts[user];
    }

    function proposalPayoutStatus(
        address proposal
    ) external view returns (Payout memory) {
        return proposalPayouts[proposal];
    }

    modifier onlyWithdrawals() {
        require(
            msg.sender == withdrawals,
            CommonErrors.UNAUTHORIZED_CALLER
        );
        _;
    }
}
