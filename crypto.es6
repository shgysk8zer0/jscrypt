/**
 * Docs: https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto
 * Suport page: https://vibornoff.github.io/webcrypto-examples/index.html
 */
export default class Crypto {
    constructor(publicKey, privateKey) {
      this.publicKey = publicKey;
      this.privateKey = privateKey;
    }
    
    static generateKeys() {
       crypto.subtle.generateKey({
          name: 'RSA-OAEP',
          modulusLength: 4096,
          publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
          hash: {name: "SHA-256"}
      }, true, [
        'encrypt',
        'decrypt'
      ]).then(keys => {
        console.log(keys);
        crypto.subtle.exportKey('jwk', keys.publicKey).then(key => localStorage.setItem('publicKey', JSON.stringify(key)));
        crypto.subtle.exportKey('jwk', keys.privateKey).then(key => localStorage.setItem('privateKey', JSON.stringify(key)));
      }).catch(console.error);
    }
  }
  Crypto.generateKeys();
  console.log(new Crypto());