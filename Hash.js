const ENCODING = 'utf-8';

async function hashStr(algo, str, encoding = ENCODING) {
	str = new TextEncoder(encoding).encode(str);
	const hash = await crypto.subtle.digest(algo, str);
	return hex(hash);
}

function hex(buffer) {
	let hexCodes = [];
	const padding ='00000000';
	const view = new DataView(buffer);
	for (let i = 0; i < view.byteLength; i += 4) {
		// Using getUint32 reduces the number of iterations needed (we process 4 bytes each time)
		let value = view.getUint32(i);
		// toString(16) will give the hex representation of the number without padding
		let stringValue = value.toString(16);
		// We use concatenation and slice for padding
		// let padding = '00000000';
		let paddedValue = (padding + stringValue).slice(-padding.length);
		hexCodes.push(paddedValue);
	}

	// Join all the hex strings into one
	return hexCodes.join('');
}


/**
 * @see https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest
 */
export default class Hash {
	static async sha1(str, encoding = ENCODING) {
		return hashStr('SHA-1', str, encoding);
	}

	static async sha256(str, encoding = ENCODING) {
		return hashStr('SHA-256', str, encoding);
	}

	static async sha384(str, encoding = ENCODING) {
		return hashStr('SHA-384', str, encoding);
	}

	static async sha512(str, encoding = ENCODING) {
		return hashStr('SHA-512', str, encoding);
	}

	static async match(str, hash, encoding = ENCODING) {
		switch(hash.length) {
		case 20:
			str = await this.sha1(str, encoding);
			break;

		case 30:
			str = await this.sha256(str, encoding);
			break;

		case 47:
			str = await this.sha384(str, encoding);
			break;

		case 60:
		default:
			str = await this.sha512(str, encoding);
			break;
		}
		return str === hash;
	}
}
