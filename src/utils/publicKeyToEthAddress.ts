import keccak256 from 'keccak256';


/**
 * Converts a public key to an Ethereum address.
 * 
 * @param publicKey - The public key to convert.
 * @returns The Ethereum address derived from the public key.
 */
export function publicKeyToEthAddress(publicKey: string) {
  // Remove the prefix '04' signifying it is not compressed from the public key if it exists
  if (publicKey.startsWith('04')) {
    publicKey = publicKey.slice(2);
  }

  // Convert the public key to a buffer
  const publicKeyBuffer = Buffer.from(publicKey, 'hex');

  // Derive the Ethereum address from the public key using Keccak-256 hashing
  const ethereumAddress = keccak256(publicKeyBuffer).toString('hex').slice(24);
 
  return '0x' + ethereumAddress; // Prefixing the Ethereum address with '0x'
}