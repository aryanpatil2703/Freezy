// src/test/MockWorldID.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

// Import the same interface file. Note the path is different ("../interfaces/...")
import "../interfaces/IWorldID.sol";

contract MockWorldID is IWorldID {
    function verifyProof(
        uint256,
        uint256,
        uint256,
        uint256,
        uint256,
        uint256[8] calldata
    ) external pure override {
        // No logic needed for local testing
    }
}