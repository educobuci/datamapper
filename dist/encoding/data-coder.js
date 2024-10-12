import inflection from 'inflection';
export class DataCoder {
    codable;
    constructor(codable) {
        this.codable = codable;
    }
    encode(object) {
        if (this.codable?.encode) {
            return this.codable?.encode(object);
        }
        else if (this.codable?.codingKeys) {
            return this.codable?.codingKeys.reduce((encoded, key) => {
                if (typeof key === 'string') {
                    encoded[key] = object[key];
                }
                else {
                    const [k, v] = Object.entries(key)[0];
                    encoded[v] = object[k];
                }
                return encoded;
            }, {});
        }
        return Object.entries(object).reduce((encoded, [key, value]) => {
            const newKey = inflection.underscore(key);
            encoded[newKey] = value;
            return encoded;
        }, {});
    }
    decode(data) {
        if (this.codable?.decode) {
            return this.codable?.decode(data);
        }
        else if (this.codable?.codingKeys) {
            return this.codable?.codingKeys.reduce((decoded, key) => {
                if (typeof key === 'string') {
                    decoded[key] = data[key];
                }
                else {
                    const [k, v] = Object.entries(key)[0];
                    decoded[k] = data[v];
                }
                return decoded;
            }, {});
        }
        else {
            return data;
        }
    }
}
//# sourceMappingURL=data-coder.js.map