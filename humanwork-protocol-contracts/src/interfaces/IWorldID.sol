// src/interfaces/IWorldID.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

// This file contains ONLY the interface for the World ID contract.
// Other contracts will import this file to know how to interact with World ID.
interface IWorldID {
    function verifyProof(
        uint256 root,
        uint256 groupId,a
        uint256 signalHash,
        uint256 nullifierHash,
        uint256 externalNullifierHash,
        uint256[8] calldata proof
    ) external view;
}