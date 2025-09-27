// File Path: src/interfaces/IUserRegistry.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IUserRegistry {
    function isRegistered(address user) external view returns (bool);
    function updateReputation(address user, uint256 newReputation) external;
}