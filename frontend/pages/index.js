import { BigNumber, Contract, providers, utils } from "ethers";
import Head from "next/head";
import React, { useEffect, useRef, useState } from "react";
import Web3Modal from "web3modal";
import {
  NFT_CONTRACT_ABI,
  NFT_CONTRACT_ADDRESS,
  TOKEN_CONTRACT_ABI,
  TOKEN_CONTRACT_ADDRESS,
} from "../constants";
import styles from "../styles/Home.module.css";
// 0xB11CffdbbF2cd991F7d07BeB75629214238BcE27 NFT
// 0x4fC29f78F789631898ecDBf480D5E87E43bbcBC4 Token

export default function Home() {
  const zero = BigNumber.from(0); // Create a BigNumber 0
  const [walletConnected, setWalletConnected] = useState(false); // Tracks if user connected their wallet
  const [loading, setLoading] = useState(false); // Set to true when transaction is mining
  const [tokensToBeClaimed, setTokensToBeClaimed] = useState(zero); // Tracks number of tokens that can be claimed
  const [balanceOfCryptoDevTokens, setBalanceOfCryptoDevTokens] = useState(zero); // Tracks number of crypto dev tokens owned by an address
  const [tokenAmount, setTokenAmount] = useState(zero); // Tracks number of tokens user wants to mint
  const [tokensMinted, setTokensMinted] = useState(zero); // Tracks the total number of tokens that have been minted till now
  const [isOwner, setIsOwner] = useState(false); // Gets the owner of the contract through the signed address

  const web3ModalRef = useRef(); // Ref to the Web 3 Modal 

  /**
   * getTokensToBeClaimed: Checks the balance of tokens that can be claimed by the user
   */
  const getTokensToBeClaimed = async () => {
    try {
      const provider = await getProviderOrSigner(); // Get the provider from web3Modal, no need for signer, we are only reading
      const nftContract = new Contract(NFT_CONTRACT_ADDRESS, NFT_CONTRACT_ABI, provider); // Create an instance of the NFT contract
      const tokenContract = new Contract(TOKEN_CONTRACT_ADDRESS, TOKEN_CONTRACT_ABI, provider); // Create an instance of the token contract

      const signer = await getProviderOrSigner(true); // Get the signer from web3Modal, needed to extract the address of the currently connected account
      const address = await signer.getAddress(); // Get the address of the connected account
      const balance = await nftContract.balanceOf(address); // Call the balanceOf from the NFT contract to get the number of NFTs held by the user

      if (balance === zero) {
        setTokensToBeClaimed(zero);
      } else {
        let amount = 0; // Tracks number of unclaimed tokens
        // For all the NFTs, check if the tokens have already been claimed
        // Only increase the amount if the tokens have not been claimed
        // for a NFT - for a given tokenId
        for (let i = 0; i < balance; i++) {
          const tokenId = await nftContract.tokenOwnerByIndex(address, i); // Gets the ID of the current NFT in the loop
          const claimed = await tokenContract.tokenIdsClaimed(tokenId); // Checks whether the current NFT has been claimed or not
          if (!claimed) {
            amount += 1; // Increment if the token has not been claimed
          }
        }

        setTokensToBeClaimed(BigNumber.from(amount)); // Set the number of tokens left to be claimed as a BigNumber to the state
      }
    } catch (error) {
      console.error(error);
      setTokensToBeClaimed(zero);
    }
  }

  /**
   * getBalanceOfCryptoDevTokens: Checks the balance of CryptoDev tokens held by the address
   */
  const getBalanceOfCryptoDevTokens = async () => {
    try {
      const provider = getProviderOrSigner(); // Get the provider from web3Modal, no need for signer as only reading
      const tokenContract = new Contract(TOKEN_CONTRACT_ADDRESS, TOKEN_CONTRACT_ABI, provider); // Create an instance of the token contract
      const signer = getProviderOrSigner(true); // Get the signer from web3Modal, needed to extract the address of the currently connected wallet
      const address = await signer.getAddress(); // Get the address
      const balance = await tokenContract.balanceOf(address); // Get the number of tokens held by the user
      setBalanceOfCryptoDevTokens(balance); // Set the balance to the state, no need to convert to BigNumber as it already is
    } catch (error) {
      console.error(error);
      setBalanceOfCryptoDevTokens(zero);
    }
  }

  /**
   * mintCryptoDevToken: mints 'amount' number of tokens to a given address
   */
  const mintCryptoDevToken = async (amount) => {
    try {
      const signer = getProviderOrSigner(true); // Get the signer from web3Modal, needed to write
      const tokenContract = new Contract(TOKEN_CONTRACT_ADDRESS, TOKEN_CONTRACT_ABI, signer); // Create an instance of the token contract
      const value = 0.001 * amount; // Each token is of 0.001 ether. The value we need to send is 0.001 * amount
      const tx = await tokenContract.mint(amount, { value: utils.parseEther(value.toString()) }); // Value signifies the cost of one crypto dev token which is "0.001" eth.
      setLoading(true); // Starts the loading when transaction is being mined
      await tx.wait(); // Wait for the transaction to get mined
      setLoading(false); // Stops the loading when the transaction finished mining
      window.alert('Successfully claimed Crypto Dev Tokens'); // Alert on the frontend when transaction finished mining
      await getBalanceOfCryptoDevTokens(); // Checks the balance of CryptoDev tokens held by the address
      await getTotalTokensMinted(); // Retrieves how many tokens have been minted till now * out of the total supply
      await getTokensToBeClaimed(); // Checks the balance of tokens that can be claimed by the user

    } catch (error) {
      console.error(error);
    }
  }

  /**
   * getTotalTokensMinted: Retrieves how many tokens have been minted till now out of the total supply
   */




  return (
    <></>
  )
}
