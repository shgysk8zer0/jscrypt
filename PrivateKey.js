import Key from './Key.js';
export default class Privatekey extends Key {
	async decrypt(crypted, name = this.key.algorithm.name) {
		try {
			const decoder = new TextDecoder('utf-8');
			if (typeof crypt === 'string') {
				const encoder = new TextEncoder('utf-8');
				crypted = encoder.encode(crypted);
			}
			const decrypted = await crypto.subtle.decrypt({name}, this.key, crypted);

			return decoder.decode(decrypted);
		} catch(e) {
			console.log(e);
		}
	}

	sign(msg) {
		return msg;
	}
}
