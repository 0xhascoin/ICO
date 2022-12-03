// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./ICryptoDevs.sol";

// This contract defines a token called "Crypto Dev Token", which follows the
// ERC20 standard and also uses the `Ownable` contract from the OpenZeppelin
// library.
contract CryptoDevToken is ERC20, Ownable {
    // The price of each token in ether.
    uint256 public constant tokenPrice = 0.001 ether;
    // The number of tokens that can be claimed for each NFT owned by a user.
    uint256 public constant tokensPerNFT = 10 * 10**18;
    // The maximum number of tokens that can be created.
    uint256 public constant maxTotalSupply = 10000 * 10**18;
    // The address of a contract that implements the ICryptoDevs interface.
    ICryptoDevs CryptoDevsNFT;
    // A mapping that tracks which tokens have already been claimed.
    mapping(uint256 => bool) public tokenIdsClaimed;

    // The contract constructor takes the address of a contract that implements
    // the ICryptoDevs interface and initializes the `CryptoDevsNFT` variable.
    constructor(address _cryptoDevsContract) ERC20("Crypto Dev Token", "CD") {
        CryptoDevsNFT = ICryptoDevs(_cryptoDevsContract);
    }

    // This function allows a user to buy tokens by sending a specified amount
    // of ether to the contract. The number of tokens the user receives is
    // determined by the `tokenPrice` constant.
    function mint(uint256 amount) public payable {
        // Calculate the amount of ether the user needs to send.
        uint256 _requiredAmount = tokenPrice * amount;
        // Check that the user has sent the correct amount of ether.
        require(msg.value >= _requiredAmount, "Ether sent is incorrect");
        // Convert the token amount to the correct decimal format.
        uint256 amountWithDecimals = amount * 10**18;
        // Check that the total supply of tokens won't exceed the max total supply.
        require((totalSupply() + amountWithDecimals) <= maxTotalSupply, "Exceeds the max total supply available.");
        // Call the `_mint` function (defined in the ERC20 contract) to mint the tokens.
        _mint(msg.sender, amountWithDecimals);
    }

    // This function allows a user to claim tokens by presenting a non-fungible
    // token (NFT) that they own. The number of tokens the user receives is
    // determined by the `tokensPerNFT` constant.
    function claim() public {
        // Get the address of the user calling this function.
        address sender = msg.sender;
        // Get the number of NFTs owned by the user.
        uint256 balance = CryptoDevsNFT.balanceOf(sender);
        // Check that the user actually owns some NFTs.
        require(balance > 0, "You don't own any Crypto Dev NFT's");
        // Initialize a variable to track the number of tokens that will be claimed.
        uint256 amount = 0;
        // Loop through all of the user's NFTs.
        for(uint256 i = 0; i < balance; i++) {
            // Get the token ID of the NFT at the current index.
            uint256 tokenId = CryptoDevsNFT.tokenOfOwnerByIndex(sender, i);
            // Check if the NFT has already been claimed.
            if(!tokenIdsClaimed[tokenId]) {
                // If not, increment the number of tokens that will be claimed.
                amount += 1;
                // Mark the NFT as claimed
                // Mark the NFT as claimed.
                tokenIdsClaimed[tokenId] = true;
            }
        }
        // Check that the user actually has some NFTs that haven't been claimed yet.
        require(amount > 0, "You have already claimed all the tokens.");
        // Call the `_mint` function (defined in the ERC20 contract) to mint the tokens.
        _mint(msg.sender, amount * tokensPerNFT);
    }

    // This function allows the contract owner to withdraw the contract's balance
    // (the amount of ether held by the contract).
    function withdraw() public onlyOwner {
        // Get the contract's balance.
        uint256 amount = address(this).balance;
        // Check that the contract has a balance.
        require(amount > 0, "Nothing to withdraw, contract balance empty");
        // Get the address of the contract owner.
        address _owner = owner();
        // Try to send the contract balance to the contract owner.
        (bool sent, ) = _owner.call{ value: amount }("");
        // Check if the transfer was successful.
        require(sent, "Failed to send ether");
    }

    // This function is a special function that is automatically called when the
    // contract receives ether. It is marked as `payable`, which means it can
    // receive ether as part of a function call.
    receive() external payable {}

    // This function is a special function that is automatically called when the
    // contract receives a function call that doesn't match any of the other functions.
    // It is also marked as `payable`, which means it can receive ether as part of
    // a function call.
    fallback() external payable {}

}