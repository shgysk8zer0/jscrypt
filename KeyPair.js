(async () => {
	/**
	 * Docs: https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto
	 * Support page: https://vibornoff.github.io/webcrypto-examples/index.html
	 */
	class KeyPair {
		constructor(publicKey, privateKey) {
			this.publicKey = publicKey;
			this.privateKey = privateKey;
		}

		async encrypt(cleartext, algo = this.publicKey.algorithm.name) {
			try {
				const encoder = new TextEncoder('utf-8');
				return crypto.subtle.encrypt(
					{name: algo}, this.publicKey,
					encoder.encode(cleartext)
				);
			} catch(e) {
				console.log(e);
			}
		}

		async decrypt(crypted, algo = this.publicKey.algorithm.name) {
			try {
				const decoder = new TextDecoder('utf-8');
				if (typeof crypt === 'string') {
					const encoder = new TextEncoder('utf-8');
					crypted = encoder.encode(crypted);
				}
				let decrypted = await crypto.subtle.decrypt(
					{name: algo},
					this.privateKey, crypted
				);

				return decoder.decode(decrypted);
			} catch(e) {
				console.log(e);
			}
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

	try {
		const MESSAGE = 'Hello world!';
		const pair = await KeyPair.generateKeys();
		const enc = await pair.encrypt(MESSAGE);
		const dec = await pair.decrypt(enc);
		console.log(dec === MESSAGE);
		console.log(enc);
	} catch(e) {
		console.error(e);
	}
})();
