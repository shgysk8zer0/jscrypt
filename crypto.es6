(async () => {
	/**
	 * Docs: https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto
	 * Suport page: https://vibornoff.github.io/webcrypto-examples/index.html
	 */
	class JSCrypt {
		constructor(publicKey, privateKey) {
			this.publicKey = publicKey;
			this.privateKey = privateKey;
		}

		/**
		 * @todo Convert to ArrayBuffer
		 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer
		 */
		async encrypt(cleartext) {
			return crypto.subtle.encrypt({name: this.publicKey.algorithm.hash.name}, this.publicKey, cleartext);
		}

		static async importFromStorage() {
			if (localStorage.hasOwnProperty('publicKey') && localStorage.hasOwnProperty('privateKey')) {
				let {publicKey,privateKey} = {
					publicKey: JSON.parse(localStorage.getItem('publicKey')),
					privateKey: JSON.parse(localStorage.getItem('privateKey'))
				};
				publicKey = await crypto.subtle.importKey('jwk', publicKey, publicKey.algorithm, publicKey.ext, publicKey.key_ops);
				privateKey = await crypto.subtle.importKey('jwk', privateKey, privateKey.algorithm, privateKey.ext, privateKey.key_ops);
				return new JSCrypt(publicKey, privateKey);
			}
		}

		static async generateKeys({
			algo        = 'RSA-OAEP',
			length      = 4096,
			hashAlgo    = 'SHA-256',
			keyUsages   = ['encrypt', 'decrypt'],
			extractable = true
		} = {}) {
			if (!(localStorage.hasOwnProperty('publicKey') && localStorage.hasOwnProperty('privateKey')) || confirm('This will delete your key set. Continue?')) {
				let keys = await crypto.subtle.generateKey({
					name: algo,
					modulusLength: length,
					publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
					hash: {name: hashAlgo}
				}, extractable, keyUsages);
				let pub = await crypto.subtle.exportKey('jwk', keys.publicKey);
				let priv = await crypto.subtle.exportKey('jwk', keys.privateKey);
				pub.algorithm = keys.publicKey.algorithm;
				priv.algorithm = keys.privateKey.algorithm;
				localStorage.setItem('publicKey', JSON.stringify(pub));
				localStorage.setItem('privateKey', JSON.stringify(priv));
				return new JSCrypt(keys.publicKey, keys.privateKey);
			} else {
				return JSCrypt.importFromStorage();
			}
		}
	}
	try {
		let jscrypt = await JSCrypt.importFromStorage();
		let encrypted = await jscrypt.encrypt('Hello World!');
		console.log(encrypted);
	} catch(e) {
		console.error(e);
	}
})();
