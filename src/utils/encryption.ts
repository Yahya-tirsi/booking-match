import CryptoJS from 'crypto-js';

const SECRET_KEY = 'OXXlY48PN9QvQusurQ6R';

export const encryptionService = {
    encryptPassword(password: string): string {
        try {
            return CryptoJS.AES.encrypt(password, SECRET_KEY).toString();
        } catch (error) {
            console.error('Encryption error:', error);
            return password; // Fallback
        }
    },

    decryptPassword(encryptedPassword: string): string {
        try {
            const bytes = CryptoJS.AES.decrypt(encryptedPassword, SECRET_KEY);
            return bytes.toString(CryptoJS.enc.Utf8) || encryptedPassword;
        } catch (error) {
            console.error('Decryption error:', error);
            return encryptedPassword;
        }
    }
};