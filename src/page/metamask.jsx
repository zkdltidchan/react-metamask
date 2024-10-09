import React, { useState, useEffect } from 'react';
import { BrowserProvider, formatEther } from 'ethers';

const MetaMaskConnectPage = () => {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);
  const [network, setNetwork] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  // Check if MetaMask is installed
  const checkIfWalletIsConnected = async () => {
    if (window.ethereum) {
      try {
        const provider = new BrowserProvider(window.ethereum);  
        const accounts = await provider.send("eth_requestAccounts", []);
        setAccount(accounts[0]);
        await getBalance(accounts[0], provider);
        await getNetwork(provider);
      } catch (error) {
        setErrorMessage("Please install MetaMask");
      }
    } else {
      setErrorMessage("Please install MetaMask");
    }
  };

  // Get balance
  const getBalance = async (address, provider) => {
    try {
      const balance = await provider.getBalance(address);
      const formattedBalance = formatEther(balance);  // 使用 formatEther
      setBalance(formattedBalance);
    } catch (error) {
      setErrorMessage("Could not get balance");
    }
  };

  // Get network
  const getNetwork = async (provider) => {
    try {
      const network = await provider.getNetwork();
      setNetwork(network.name);
    } catch (error) {
      setErrorMessage("Could not get network");
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);


  const handleConnectWallet = async () => {
    try {
      const provider = new BrowserProvider(window.ethereum); 
      const accounts = await provider.send("eth_requestAccounts", []);
      setAccount(accounts[0]);
      await getBalance(accounts[0], provider);
      await getNetwork(provider);
    } catch (error) {
      setErrorMessage("Could not connect to MetaMask");
    }
  };

  return (
    <div>
      <h1>MetaMask Connect</h1>
      {account ? (
        <div>
          <p>Connected account: {account}</p>
          <p>Balance: {balance} ETH</p>
          <p>Network: {network}</p>
        </div>
      ) : (
        <button onClick={handleConnectWallet}>Connect Wallet</button>
      )}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  );
};

export default MetaMaskConnectPage;
