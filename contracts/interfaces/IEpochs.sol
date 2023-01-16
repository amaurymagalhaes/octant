// SPDX-License-Identifier: GPL-3.0-only

pragma solidity ^0.8.9;

interface IEpochs {
    function getCurrentEpoch() external view returns (uint32);

    function isStarted() external view returns (bool);

    function isDecisionWindowOpen() external view returns (bool);
}
