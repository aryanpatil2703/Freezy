// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MockPYUSD
 * @dev This is a simple ERC20 token contract to simulate PYUSD for local testing.
 * It allows the owner (the deployer) to mint new tokens to any address.
 * PYUSD on mainnet has 6 decimals, so we will use that here.
 */
contract MockPYUSD is ERC20, Ownable {
    constructor() ERC20("PayPal USD", "PYUSD") Ownable(msg.sender) {
        // PYUSD has 6 decimals
    }

    // Override decimals to return 6, matching the real PYUSD
    function decimals() public pure override returns (uint8) {
        return 6;
    }

    /**
     * @notice Allows the contract owner to mint new PYUSD tokens.
     * @param to The address to receive the new tokens.
     * @param amount The amount of tokens to mint (in the smallest unit, e.g., 1_000_000 for 1 PYUSD).
     */
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}