// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../src/UserRegistry.sol";
import "../src/SimpleEscrow.sol";

/**
 * @title DeployContracts
 * @dev Deploys the final contracts for the HumanWork Protocol to a live network.
 */
contract DeployContracts is Script {
    function run() external {
        // Read the private key from your .env file.
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        // --- CORRECTED World ID address with valid checksum ---
        address worldIdAddress = 0x98339D2e142A170D2224b5B7423a5a2509BF7884;

        // Start broadcasting transactions using your private key.
        vm.startBroadcast(deployerPrivateKey);

        // 1. Deploy the UserRegistry, passing the World ID address.
        UserRegistry userRegistry = new UserRegistry(worldIdAddress);
        console.log("UserRegistry deployed at:", address(userRegistry));

        // 2. Deploy the SimpleEscrow, passing the UserRegistry's address.
        SimpleEscrow simpleEscrow = new SimpleEscrow(address(userRegistry));
        console.log("SimpleEscrow deployed at:", address(simpleEscrow));
        
        // Stop broadcasting transactions.
        vm.stopBroadcast();
    }
}