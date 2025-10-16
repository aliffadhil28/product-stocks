const characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789:-_";

const cyrb53 = (str, seed = 0) => {
    let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
    for (let i = 0, ch; i < str.length; i++) {
        ch = str.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
    h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
    h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);

    return 4294967296 * (2097151 & h2) + (h1 >>> 0);
};

// Generate encode keys
const keys = {};
for (let i = 0; i < characters.length; i++) {
    const char = characters[i];
    const hash = cyrb53(char).toString(36);
    keys[char] = hash;
}

/**
 * Encode action and method into a compact string
 * @param {string} action - The action name (e.g., controller name)
 * @param {string} method - The method name (e.g., action name)
 * @returns {string} - The encoded string
 */
const encodeActions = (action, method) => {
    const input = `${action}_${method}`;
    let encoded = "";

    for (let i = 0; i < input.length; i++) {
        const char = input[i];
        encoded += keys[char] || char;
    }

    return encoded;
};

export { encodeActions };