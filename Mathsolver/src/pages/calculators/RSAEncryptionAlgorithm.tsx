import React, { useState } from 'react';

// Helper: Calculate GCD
const gcd = (a: number, b: number): number => {
  return b === 0 ? a : gcd(b, a % b);
};

// Helper: Find modular inverse using Extended Euclidean Algorithm
const modInverse = (e: number, phi: number): number => {
  let [a, m] = [e, phi];
  let [m0, x0, x1] = [m, 0, 1];

  while (a > 1) {
    const q = Math.floor(a / m);
    [a, m] = [m, a % m];
    [x0, x1] = [x1 - q * x0, x0];
  }

  return x1 < 0 ? x1 + m0 : x1;
};

// Helper: Fast modular exponentiation (for encryption/decryption)
const modPow = (base: number, exp: number, mod: number): number => {
  let result = 1;
  base = base % mod;
  while (exp > 0) {
    if (exp % 2 === 1) result = (result * base) % mod;
    exp = Math.floor(exp / 2);
    base = (base * base) % mod;
  }
  return result;
};

// Main Component
const RSAEncryptor: React.FC = () => {
  const [p, setP] = useState('');
  const [q, setQ] = useState('');
  const [message, setMessage] = useState('');
  const [publicKey, setPublicKey] = useState<{ e: number; n: number } | null>(null);
  const [privateKey, setPrivateKey] = useState<{ d: number; n: number } | null>(null);
  const [encrypted, setEncrypted] = useState<number | null>(null);
  const [decrypted, setDecrypted] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isPrime = (num: number) => {
    if (num <= 1) return false;
    for (let i = 2; i * i <= num; i++) {
      if (num % i === 0) return false;
    }
    return true;
  };

  const generateKeys = () => {
    const prime1 = parseInt(p);
    const prime2 = parseInt(q);

    if (!isPrime(prime1) || !isPrime(prime2)) {
      setError('Both p and q must be prime numbers.');
      return;
    }

    const n = prime1 * prime2;
    const phi = (prime1 - 1) * (prime2 - 1);

    // Find e such that 1 < e < phi and gcd(e, phi) = 1
    let e = 3;
    while (e < phi && gcd(e, phi) !== 1) {
      e++;
    }

    const d = modInverse(e, phi);

    setPublicKey({ e, n });
    setPrivateKey({ d, n });
    setEncrypted(null);
    setDecrypted(null);
    setError(null);
  };

  const encryptMessage = () => {
    const m = parseInt(message);
    if (!publicKey) return;
    const { e, n } = publicKey;
    const c = modPow(m, e, n);
    setEncrypted(c);
    setDecrypted(null);
  };

  const decryptMessage = () => {
    if (!privateKey || encrypted === null) return;
    const { d, n } = privateKey;
    const m = modPow(encrypted, d, n);
    setDecrypted(m);
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">RSA Encryption (Number Theory)</h2>

      <label className="block text-gray-700 dark:text-gray-200 mt-4">Prime Number p</label>
      <input
        type="number"
        value={p}
        onChange={(e) => setP(e.target.value)}
        className="w-full p-2 border rounded mb-3"
        placeholder="Enter a prime number"
      />

      <label className="block text-gray-700 dark:text-gray-200">Prime Number q</label>
      <input
        type="number"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        className="w-full p-2 border rounded mb-3"
        placeholder="Enter another prime number"
      />

      <button onClick={generateKeys} className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
        Generate Keys
      </button>

      {publicKey && privateKey && (
        <div className="mt-4 text-gray-800 dark:text-gray-100">
          <p>🔑 Public Key: (e={publicKey.e}, n={publicKey.n})</p>
          <p>🔒 Private Key: (d={privateKey.d}, n={privateKey.n})</p>
        </div>
      )}

      <label className="block text-gray-700 dark:text-gray-200 mt-4">Message (number)</label>
      <input
        type="number"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="w-full p-2 border rounded mb-3"
        placeholder="Enter a number message"
      />

      <button
        onClick={encryptMessage}
        className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 mb-2"
      >
        Encrypt
      </button>

      {encrypted !== null && (
        <p className="text-green-800 bg-green-100 p-3 rounded mb-2">🔐 Encrypted Message: {encrypted}</p>
      )}

      <button
        onClick={decryptMessage}
        className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700"
      >
        Decrypt
      </button>

      {decrypted !== null && (
        <p className="text-purple-800 bg-purple-100 p-3 rounded mt-2">🔓 Decrypted Message: {decrypted}</p>
      )}

      {error && <p className="text-red-700 bg-red-100 p-3 mt-4 rounded">{error}</p>}
    </div>
  );
};

export default RSAEncryptor;
