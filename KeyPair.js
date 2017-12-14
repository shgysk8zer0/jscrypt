import PublicKey from './PublicKey.js';
import PrivateKey from './PrivateKey.js';


export default class KeyPair {
	constructor(publicKey, privateKey) {
		this.publicKey = new PublicKey(publicKey);
		this.privateKey = new PrivateKey(privateKey);
	}

	async encrypt(cleartext) {
		return this.publicKey.encrypt(cleartext);
	}

	async decrypt(crypted) {
		return this.privateKey.decrypt(crypted);
	}

	async sign(msg) {
		return this.privateKey.sign(msg);
	}

	async verify(msg, sig) {
		return this.publicKey.verify(msg, sig);
	}

	static async importFromStorage() {
		if (localStorage.hasOwnProperty('keyPair')) {
			let {
				publicKey,
				privateKey
			} = JSON.parse(localStorage.getItem('keyPair'));

			publicKey = await crypto.subtle.importKey(
				'jwk',
				publicKey,
				publicKey.algorithm,
				publicKey.ext,
				publicKey.key_ops
			);

			privateKey = await crypto.subtle.importKey(
				'jwk',
				privateKey,
				privateKey.algorithm,
				privateKey.ext,
				privateKey.key_ops
			);

			return new this(publicKey, privateKey);
		}
	}

	static async generateKeys({
		algo        = 'RSA-OAEP',
		length      = 4096,
		hashAlgo    = 'SHA-512',
		keyUsages   = ['encrypt', 'decrypt'],
		extractable = true
	} = {}) {
		if (
			!localStorage.hasOwnProperty('keyPair')
			|| confirm('This will delete your key set. Continue?')
		) {
			try {
				const keys = await crypto.subtle.generateKey({
					name: algo,
					modulusLength: length,
					publicExponent: crypto.getRandomValues(new Uint8Array(3)),
					hash: {name: hashAlgo}
				}, extractable, keyUsages);

				console.info(keys);

				let pub = await crypto.subtle.exportKey('jwk', keys.publicKey);
				let priv = await crypto.subtle.exportKey('jwk', keys.privateKey);

				pub.algorithm = keys.publicKey.algorithm;
				priv.algorithm = keys.privateKey.algorithm;

				localStorage.setItem(
					'keyPair',
					JSON.stringify({publicKey: pub, privateKey: priv})
				);

				return new this(keys.publicKey, keys.privateKey);
			} catch(e) {
				console.error(e);
			}
		} else {
			return this.importFromStorage();
		}
	}
}
(async (msg = 'Hello world!') => {
	try {
		const pair = await KeyPair.generateKeys();
		const enc = await pair.encrypt(msg);
		const dec = await pair.decrypt(enc);
		console.log(dec === msg);
		console.log(enc);
	} catch(e) {
		console.error(e);
	}
});
