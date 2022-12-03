// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// This interface defines a set of rules that other contracts must follow
// in order to interact with a set of tokens on the Ethereum platform.
interface ICryptoDevs {
    // This function takes an Ethereum address (`owner`) and a number (`index`)
    // as input, and returns the token ID of the token at the specified index
    // owned by the given address.
    function tokenOfOwnerByIndex(address owner, uint256 index) external view returns (uint256 tokenId);
    
    // This function takes an Ethereum address (`owner`) as input, and returns
    // the number of tokens owned by that address.
    function balanceOf(address owner) external view returns (uint256 balance);
}
