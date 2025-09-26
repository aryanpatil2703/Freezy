// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

// This is a mock contract to simulate the real World ID for local testing.
// It has the same verifyProof function but with no logic inside.
interface IWorldID {
    function verifyProof(
        uint256 root,
        uint256 groupId,
        uint256 signalHash,
        uint256 nullifierHash,
        uint256 externalNullifierHash,
        uint256[8] calldata proof
    ) external view;
}

contract MockWorldID is IWorldID {
    function verifyProof(
        uint256,
        uint256,
        uint256,
        uint256,
        uint256,
        uint256[8] calldata
    ) external pure override {
        // For local testing, we don't need to actually verify the proof.
        // This function exists only to allow our UserRegistry to deploy correctly.
    }
}