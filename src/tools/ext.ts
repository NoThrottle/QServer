import crypto from 'crypto';
import { json } from 'express';

export const signature = "q1GXIi/qE7sBIeZuKjXnJCB9eq1gLGIl7qz9gUIOjjCzu84gVDVL1XDmEVxHLrSz81Q4Sd9NttGjZSnLAIvXL1ETfghikcjfDtd0V1YwYckSRu+wBKWkxUJ/ke7zn5JEoA4IHute+Amt/ggFOvslg51QCXTuG+NV1hxw5py0wjvmL7BAK+rE37DCNbkAi8AClKLDBLEE/iHFT0n0zIO5jUIcO00d8/xTCZw836YQnwcAPE9uUBv1gCjD+WRHzmdAzY3hH3d0GFAv/1uyDAN1vXv6MLnm/4POnIl++cFqrAJpGoL6d7Lgn3RvEVpkndten3G4zj/grOKfCZDE3b6p5A==";

const privateKey = `
-----BEGIN PRIVATE KEY-----
MIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDz0GuUz/KuKNm/
7oLgl9Tjm+FFWzouzVRDn1GgVNFc3vKj4sEtdKZfIZoRgdR7DTYd6OU/AemSaYy7
OptgCkmkCkjmTkJIYcSi8EBzmbb7lWKZJCGV5IlC7AlpcbsWM2Zr1e8UgmZK0IZf
c9XP6Knf4Cn3B6iQSrmT1WO/gPFCnxT6RI+UxKSIgFF3Bf374MCWmSyxcS6wFu4c
xOxhbHXmP5+Xvw9iMWlshSfk48Hz1A5QRMCZEwqRc4v+omrE0Rg0nbDB19U7AhMa
pkCUxLtHFFGw7Xcw+JKwqakPRFVUBSbmyAsGS9bnFfT+3VzRUR2WNyTDA/3QT6Ss
yKLEy+oRAgMBAAECggEBAIqezBu+oz6r0SnTpKunB44lGU5CkPD9ItSTp2gd8S75
P0E4chazBMh/pUYg57rShxs4R+ar4q2wvyfQKXjQQJA4nLv8cKkQlSkCqdJP6f5e
L8HcDhBX8EaRRsShufnkXW4gIx8pCJmut0db54uev76eh52AyDDJm3tWzrCZ0hHK
nppQZd4Ub3D6WB24B075Gt47Qfrg6VAIElpQJuR9zLLEzMGtoxzp3J/ZKRzmNW6t
W8SFeJAmP6VY845btpndfpYdle+BvnQhotLN9YlrggUv4qVd0nFQc9o12pX4Vw7d
zmEcio7qk08SJcFQ1q71G6G9KH9TZkPRD6eikG7wWCUCgYEA/K1OIytOOozvNaC4
HE/llv2AkHxES2ml1wsAApEHNovcW6R8OUcWS5d7e+mTY0TcLFf86OMKrOoxd9Q5
hKVplEx4iC4cWSaxof4dafqYiL3jW8ebHZyj0cPN5B5rsf/Hbpc3YMXOQ0Iqr8kD
SrvivQCr6jQQd6XY3olqSJvqU/sCgYEA9wVGuV8bUKfE9ZwHLXBs15VGedO3/FbG
7UteG/wLrRIBDHYO3qKcsIn6w2AL3L5MNuc5/b+eRhAf5+IqQuIx3+CdK9cEVRcj
KnWlU+VnYGCvBxe6d1IX/z4YxD+DcbWP4AsPcqOqJNHAoi2cLnzRto/kE2oCcVHG
QwuMFNqdUGMCgYEAisFM2GlOkz6TmfqBQCLr7EeXk0B6bIM+q+GBhudHc7/IKZch
FH8iEi7Eg95XrrrAwaUr4GPVl/EfazNixqHjYanAwt+3d4mVIGUgl/MiUm0cbmkl
mFRNbcK9zNibwWq5hNSLd5wIUc0DDfcv1JlqwOmefoVKybmMZ2BEukzMmIMCgYEA
2tPAwGzBXOUStWXgcd97fEuQIFJvVcpl9Ubj+rSAf3RIm4pmR9IULsw86iFGwOmP
yL9z/xdmFbkpGpmfSJrrBeIMOg8DloGltHJ94GGD/7wGsajSleuSuJmBBTEit3PZ
HeeOascT7gQmu0Tea8xFV44GxTAPM+X2VeR/1uWHoPMCgYAJaJjh4UjQCc0Km/P4
HikDGXunwF9bq8pRgd98Nw0STdrDJZUbFSyvuadBCR45Cf42pCF5DHv10yXtB1Oa
rrgvZocDrt7cgZx3//wG+UInj7Oqk+pN2CVVRWUDJleEr5YVx9fw9O7+WbQWoDY+
2a0OA+ZJ9b/NKCNmTUXJw/pLtg==
-----END PRIVATE KEY-----`;

export const publicKey = `
-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA89BrlM/yrijZv+6C4JfU
45vhRVs6Ls1UQ59RoFTRXN7yo+LBLXSmXyGaEYHUew02HejlPwHpkmmMuzqbYApJ
pApI5k5CSGHEovBAc5m2+5VimSQhleSJQuwJaXG7FjNma9XvFIJmStCGX3PVz+ip
3+Ap9weokEq5k9Vjv4DxQp8U+kSPlMSkiIBRdwX9++DAlpkssXEusBbuHMTsYWx1
5j+fl78PYjFpbIUn5OPB89QOUETAmRMKkXOL/qJqxNEYNJ2wwdfVOwITGqZAlMS7
RxRRsO13MPiSsKmpD0RVVAUm5sgLBkvW5xX0/t1c0VEdljckwwP90E+krMiixMvq
EQIDAQAB
-----END PUBLIC KEY-----`;

export const salt = `8270ebcf-22e2-491b-84b8-d96f0f2e5edb`;

export function RSADecrypt(value : string) : string{

  const decipher = crypto.privateDecrypt(privateKey, Buffer.from(value, 'base64'));
  return decipher.toString('utf-8');

};

export function Error(value : string[] | string) : string{
  return JSON.stringify({"Error":value});
}

  

export function RSAEncrypt(value : string) : string{

  const cipher = crypto.publicEncrypt(publicKey, Buffer.from(value, 'utf-8'));
  return cipher.toString('base64');

};

export function generateRandomHexString(length: number): string {
  let buffer = crypto.randomBytes(length/2);

  // Convert the buffer to a hex string
  const hexString = Array.from(buffer)
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');

  return hexString;
}

export function Get512Hash(value : string) : string{

  let sha512Hash = crypto.createHash('sha512');
  sha512Hash.update(value, 'utf-8'); 
  return sha512Hash.digest('hex');

};

export function generatePepper(): string {
  const num: number = Math.floor(Math.random() * (268435455 - 16777216 + 1) + 16777216);
  return num.toString(16).toLowerCase();
}

declare global{
  interface String {
    isAlphanumericUnderscore(): boolean;
  }  
} 

String.prototype.isAlphanumericUnderscore = function (){
  return alphanumeric(String(this));
} 

function alphanumeric(input: string): boolean {
  for (let i = 0; i < input.length; i++) {
      const char1 = input.charAt(i);
      const cc = char1.charCodeAt(0);

      if (
          (cc >= 48 && cc <= 57) || // 0-9
          (cc >= 65 && cc <= 90) || // A-Z
          (cc >= 97 && cc <= 122) || // a-z
          cc === 95 // underscore (_)
      ) {
      } else {
          return false;
      }
  }
  return true;
}

//Below is unused

function generateKeyPair(){

    crypto.generateKeyPair('rsa', keyOptions, (err, publicKey, privateKey) => {
        if (err) {
          console.error('Error generating key pair:', err);
        } else {
          console.log('Public Key:', publicKey);
          console.log('Private Key:', privateKey);
        }
    });

};

const keyOptions = {
  modulusLength: 2048,
  publicKeyEncoding: {
    type: 'spki',
    format: 'pem'
  },
  privateKeyEncoding: {
    type: 'pkcs8',
    format: 'pem'
  }
};

