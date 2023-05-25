// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.9;

interface IWithdrawalsTarget {
    function withdraw(uint256) external;
}
