import React, { useState } from 'react';
import ConnectWallet from './components/ConnectWallet';
import MintNFT from './components/MintNFT';
import MyNFTs from './components/MyNFTs';
import GenerateQRCode from './components/GenerateQRCode';

const App = () => {
  const [provider, setProvider] = useState(null);
  const [machineAddress, setMachineAddress] = useState('');

  return (
    <div>
      <h1>Blockchain Coffee Machine</h1>
      <ConnectWallet setProvider={setProvider} />
      <br></br>
      <MintNFT provider={provider} />
      <br></br>
      <MyNFTs provider={provider} />
      <GenerateQRCode machineAddress={machineAddress} />
    </div>
  );
};

export default App;
