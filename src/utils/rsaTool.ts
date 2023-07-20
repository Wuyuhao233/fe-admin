import { JSEncrypt } from 'jsencrypt';

export const rsaTool = async (data: string, key: string) => {
  try {
    const encrypt = new JSEncrypt();
    encrypt.setPublicKey(key);
    return encrypt.encrypt(data);
  } catch (error) {
    console.log('error', error);
  }
};
