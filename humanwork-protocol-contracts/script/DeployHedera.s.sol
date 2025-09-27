// File Path: script/DeployHedera.s.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../src/UserRegistry.sol";
import "../src/SimpleEscrow.sol";

// Changed contract name to DeployHedera to avoid conflicts
contract DeployHedera is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // 1. Deploy UserRegistry with a placeholder address for World ID
        // On Hedera, we pass the deployer's address (msg.sender) because
        // there is no World ID contract. The UserRegistry is designed to
        // skip verification on non-World Chain networks.
        UserRegistry userRegistry = new UserRegistry(msg.sender);
        console.log("UserRegistry (Hedera) deployed to:", address(userRegistry));

        // 2. Deploy SimpleEscrow with the new UserRegistry address
        SimpleEscrow simpleEscrow = new SimpleEscrow(address(userRegistry));
        console.log("SimpleEscrow (Hedera) deployed to:", address(simpleEscrow));

        vm.stopBroadcast();
    }
}