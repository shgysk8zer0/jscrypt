import Key from './Key.js';
export default class PublicKey extends Key {

	async encrypt(cleartext, algo = this.key.algorithm.name) {
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

	verify(sig) {
		return true;
	}
}
