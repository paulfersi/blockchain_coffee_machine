import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import ConnectWallet from './components/ConnectWallet';
import MintNFT from './components/MintNFT';
import MyNFTs from './components/MyNFTs';

const App = () => {
  const [provider, setProvider] = useState(null);
  const [machineAddress, setMachineAddress] = useState('');

  return (
    <div className="container">
      <h1 className="text-center mb-4">Blockchain Coffee Machine</h1>
      <div className="row g-4">
        <div className="col-md-6">
          <ConnectWallet setProvider={setProvider} />
        </div>
        <div className="col-md-6">
          <MintNFT provider={provider} />
        </div>
      </div>
      <br></br>
      <div className="row g-2">
        <div className="col-md-12">
          <MyNFTs provider={provider} />
        </div>
      </div>
    </div>
  );
};

export default App;
