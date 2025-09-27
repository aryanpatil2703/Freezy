// script/Deploy.s.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../src/UserRegistry.sol";
import "../src/SimpleEscrow.sol";
import "../src/test/MockWorldID.sol";

/**
 * @title DeployContracts
 * @dev Deploys all contracts for the HumanWork Protocol in the correct order for testing.
 */
contract DeployContracts is Script {
    function run() external {
        // --- THIS IS THE FIX ---
        // 1. Read the private key from your .env file.
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        // 2. Tell Foundry to start broadcasting transactions using YOUR private key.
        vm.startBroadcast(deployerPrivateKey);

        // --- The rest of the script is the same ---
        MockWorldID mockWorldID = new MockWorldID();
        console.log("MockWorldID deployed at:", address(mockWorldID));

        UserRegistry userRegistry = new UserRegistry(address(mockWorldID));
        console.log("UserRegistry deployed at:", address(userRegistry));

        SimpleEscrow simpleEscrow = new SimpleEscrow(address(userRegistry));
        console.log("SimpleEscrow deployed at:", address(simpleEscrow));
        
        vm.stopBroadcast();
    }
}