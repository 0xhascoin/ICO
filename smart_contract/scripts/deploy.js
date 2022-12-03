const { ethers } = require("hardhat");
require("dotenv").config();
const { CRYPTO_DEVS_NFT_CONTRACT_ADDRESS } = require("../constants");

// This is a JavaScript function that uses the `ethers.js` library to deploy
// a smart contract called `CryptoDevToken` to the Ethereum blockchain.
async function main() {
  // The address of a contract that implements the `ICryptoDevs` interface.
  const cryptoDevsNFTContract = CRYPTO_DEVS_NFT_CONTRACT_ADDRESS;
  // Create a contract factory for the `CryptoDevToken` contract.
  const cryptoDevsTokenContract = await ethers.getContractFactory("CryptoDevToken");
  // Deploy a new instance of the `CryptoDevToken` contract, passing in the
  // `cryptoDevsNFTContract` address as an argument.
  const deployedCryptoDevsTokenContract = await cryptoDevsTokenContract.deploy(cryptoDevsNFTContract);
  // Wait for the deployment to be completed.
  await deployedCryptoDevsTokenContract.deployed();
  // Log the contract's address to the console.
  console.log("Contract address: ", deployedCryptoDevsTokenContract.address)
  // Output: "Contract address: 0x4fC29f78F789631898ecDBf480D5E87E43bbcBC4"
};


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });