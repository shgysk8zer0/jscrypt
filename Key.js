const keys = new WeakMap();

export default class Key {
	constructor(key) {
		keys.set(this, Key.import(key));
	}

	get key() {
		return keys.ket(this);
	}

	toString() {
		return JSON.stringify(this.key);
	}

	static async import(key) {
		return crypto.subtle.importKey(
			'jwk',
			key,
			key.algorithm,
			key.ext,
			key.key_ops
		);
	}

	async export() {
		return crypto.subtle.exportKey('jwk', this.key);
	}

	static async generateKeyPair({
			algo        = 'RSA-OAEP',
			length      = 4096,
			hashAlgo    = 'SHA-512',
			keyUsages   = ['encrypt', 'decrypt'],
			extractable = true
	} = {}) {
		const keys = await crypto.subtle.generateKey({
			name: algo,
			modulusLength: length,
			publicExponent: crypto.getRandomValues(new Uint8Array(3)),
			hash: {name: hashAlgo}
		}, extractable, keyUsages);

		let publicKey = await crypto.subtle.exportKey('jwk', keys.publicKey);
		let privateKey = await crypto.subtle.exportKey('jwk', keys.privateKey);

		publicKey.algorithm = keys.publicKey.algorithm;
		privateKey.algorithm = keys.privateKey.algorithm;

		return {publicKey, privateKey};
	}
}
