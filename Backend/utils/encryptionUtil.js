const crypto = require('crypto');

const algorithm = 'aes-256-cbc';
const key = process.env.LOCK_SECRET_KEY;

function encrypt(text) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
    let encrypted = cipher.update(text, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return iv.toString('base64') + ':' + encrypted;
}

function decrypt(lock_id) {
    const [ivBase64, encryptedBase64] = lock_id.split(':');
    const iv = Buffer.from(ivBase64, 'base64');
    const encryptedText = Buffer.from(encryptedBase64, 'base64');
    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
    let decrypted = decipher.update(encryptedText, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

function encryptSpots(spots) {
    if (!spots || !Array.isArray(spots)) {
        return ""
    }

    try {
        const spotString = spots.join(',');
        return encrypt(spotString);
    } catch (error) {
        return ""
    }
}

function decryptSpots(lock_id) {
    try {
        const spotString = decrypt(lock_id);
        return spotString.split(',');

    } catch (error) {
        return []
    }
}

module.exports = {
    encryptSpots,
    decryptSpots
};
