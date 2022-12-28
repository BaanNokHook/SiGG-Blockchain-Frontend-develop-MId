import { Injectable } from '@angular/core';
import { ConfigAppService } from '../appConfig/config-app.service';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})

export class DecryptService {
  constructor(private appConfig:ConfigAppService) {}

  onDecrypt(value){
    let decrKey = this.appConfig.getConfig().decryptKey
    let key = CryptoJS.enc.Utf8.parse(decrKey.padEnd(16, " "))
    let cipher = CryptoJS.enc.Hex.parse(value);
    let decrypted = CryptoJS.AES.decrypt({
      ciphertext: cipher
    },
      key,
      {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
        iv: ''
      }
    );
    // console.log("CryptoJS.enc.Utf8",CryptoJS.enc.Utf8);
    
    let tmp = CryptoJS.enc.Utf8.stringify(decrypted)
    let decryptedObj = null
    
    if(tmp && this.IsJsonString(tmp)) decryptedObj = JSON.parse(tmp)
    return decryptedObj
  }

  IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

}