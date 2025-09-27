// File Path: script/Deploy.s.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../src/UserRegistry.sol";
import "../src/SimpleEscrow.sol";

contract Deploy is Script {
    // The official WorldID Router address on World Chain Sepolia Testnet
    // THIS LINE HAS BEEN CORRECTED WITH THE PROPER CHECKSUM
    address constant WORLD_ID_ROUTER = 0x93a311A2958A436288f836264B4476a454E5A7eC;

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // 1. Deploy UserRegistry
        UserRegistry userRegistry = new UserRegistry(WORLD_ID_ROUTER);
        console.log("UserRegistry deployed to:", address(userRegistry));

        // 2. Deploy SimpleEscrow with the new UserRegistry address
        SimpleEscrow simpleEscrow = new SimpleEscrow(address(userRegistry));
        console.log("SimpleEscrow deployed to:", address(simpleEscrow));

        vm.stopBroadcast();
    }
}