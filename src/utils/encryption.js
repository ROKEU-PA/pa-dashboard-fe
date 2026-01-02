// src/utils/encryption.js
import CryptoJS from "crypto-js";

let ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;

export const encryptPassword = (password) => {
  try {
    return CryptoJS.AES.encrypt(password, ENCRYPTION_KEY).toString();
  } catch (error) {
    console.error("Encryption error:", error);
    throw new Error("Failed to encrypt password");
  }
};

export const decryptPassword = (encryptedPassword) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedPassword, ENCRYPTION_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error("Decryption error:", error);
    throw new Error("Failed to decrypt password");
  }
};
