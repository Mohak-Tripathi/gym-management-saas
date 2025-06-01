import jwt from 'jsonwebtoken';

    // {
    //     deviceId: deviceId,
    //     timestamp: Date.now(),
    //     nonce: crypto.randomBytes(16).toString('hex')
    //   }

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export function generateQRToken(deviceId: string) {
  return jwt.sign(
    {
      deviceId,
      type: 'GYM_ENTRY',
    },
    JWT_SECRET,
    // { expiresIn: '30s' } // Expires in 30 seconds
    { expiresIn: '1h' }   //temporary make it 1hr for testing


    
  );
}

export function verifyQRToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}
