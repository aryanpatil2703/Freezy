// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

// src/interfaces/IWorldID.sol
// src/interfaces/IWorldID.sol

// This file contains ONLY the interface for the World ID contract.
// Other contracts will import this file to know how to interact with World ID.
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

// src/UserRegistry.sol
// src/UserRegistry.sol

// Import the interface from its own dedicated file.

// (The rest of your contract code is unchanged)
contract UserRegistry {
    IWorldID internal immutable worldId;

    struct User {
        address wallet;
        string profileCID;
        string credentialsCID;
        string githubProofCID;
        bool isVerified;
        uint256 registrationTime;
        uint256 chainId;
    }

    mapping(address => User) public users;
    mapping(uint256 => bool) public nullifierHashes;
    mapping(address => bool) public isRegistered;

    event UserRegistered(address indexed user, string profileCID, uint256 chainId);
    event GitHubProofAdded(address indexed user, string githubProofCID);

    constructor(address _worldId) {
        worldId = IWorldID(_worldId);
    }

    function registerUser(
        string memory _profileCID,
        string memory _credentialsCID,
        uint256 root,
        uint256 nullifierHash,
        uint256[8] calldata proof
    ) external {
        require(!isRegistered[msg.sender], "User is already registered.");
        require(!nullifierHashes[nullifierHash], "This World ID has already been used.");

        uint256 signalHash = uint256(keccak256(abi.encodePacked(msg.sender)));
        uint256 externalNullifierHash = uint256(keccak256(abi.encodePacked("humanwork-protocol")));

        worldId.verifyProof(
            root,
            1,
            signalHash,
            nullifierHash,
            externalNullifierHash,
            proof
        );

        nullifierHashes[nullifierHash] = true;

        users[msg.sender] = User({
            wallet: msg.sender,
            profileCID: _profileCID,
            credentialsCID: _credentialsCID,
            githubProofCID: "",
            isVerified: true,
            registrationTime: block.timestamp,
            chainId: block.chainid
        });

        isRegistered[msg.sender] = true;
        emit UserRegistered(msg.sender, _profileCID, block.chainid);
    }

    function addGitHubProof(string memory _githubProofCID) external {
        require(isRegistered[msg.sender], "User is not registered.");
        users[msg.sender].githubProofCID = _githubProofCID;
        emit GitHubProofAdded(msg.sender, _githubProofCID);
    }
}

