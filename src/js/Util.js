export function makeRandomStringId(length) {
    let result           = '';
    let alphabet       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-';
    let charactersLength = alphabet.length;
    for (let i = 0; i < length; i++ ) {
        result += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
    }
    return result;
}