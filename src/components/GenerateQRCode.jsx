import React, { useEffect, useState } from "react";

const GenerateQRCode = ({ machineAddress }) => {
  const [QRCode, setQRCode] = useState(null);

  useEffect(() => {
    import("qrcode.react").then((module) => {
      setQRCode(module.QRCode);
    });
  }, []);

  if (!QRCode) return <p>Loading QR Code...</p>;
  if (!machineAddress) return <p>No machine selected.</p>;

  return (
    <div>
      <h3>QR Code for Payments</h3>
      <QRCode value={machineAddress} size={256} />
      <p>Send ETH to the above address.</p>
    </div>
  );
};

export default GenerateQRCode;
