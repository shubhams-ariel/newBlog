
import Cookies from "js-cookie";
import CryptoJS from "crypto-js";


const SECRET_KEY = import.meta.env.VITE_SECRET_KEY || "dev_secret_key";


export const setEncryptedCookie = (name: string, value: string, days = 7) => {
  const encrypted = CryptoJS.AES.encrypt(value, SECRET_KEY).toString();
  Cookies.set(name, encrypted, { expires: days, secure: true, sameSite: "Strict" });
};

export const getDecryptedCookie = (name: string): string | null => {
  const encrypted = Cookies.get(name);
  if (!encrypted) return null;
  try {
    const bytes = CryptoJS.AES.decrypt(encrypted, SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (err) {
    console.error("Decryption failed:", err);
    return null;
  }
};


export const removeCookie = (name: string) => {
  Cookies.remove(name);
};
