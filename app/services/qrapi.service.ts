import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { ConfigAppService } from '../appConfig/config-app.service';
import { DecryptService } from '../services/decrypt.service';
import { timeout, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class QrapiService {
  decryptedObj
  constructor(
    private http: HttpClient,
    private activatedRoute: ActivatedRoute,
    private appConfig: ConfigAppService,
    private decrService: DecryptService

  ) {

  }
  // url = "http://206.189.41.105:6565/api/v1/qrcode";

  geturl() {
    let ip = this.appConfig.getConfig().urlGetQrCode ? this.appConfig.getConfig().urlGetQrCode : ""
     console.log("ip",ip);
    
    let data = this.activatedRoute.snapshot.queryParamMap.get('data')
    // console.log("get url data service", data);
    
    let tmp = this.decrService.onDecrypt(data)
    let msisdn
    // if(tmp.mobileno) msisdn = tmp.mobileno.trim()
    // if (msisdn.charAt(0) === '0') msisdn = '66' + msisdn.substr(1);
    let url = ip + "/api/v1/qrcode?data=" + data
    // let url = "http://206.189.41.105:6565/api/v1/qrcode?data=" + data
    return this.http.get(url, { headers: {'x-method' : 'GET', 'Content-Type' : 'application/json'} }).pipe(timeout(30000), map(res => res));
  }

  geturlForCheckMobileId() {
    let ip = this.appConfig.getConfig().urlCheckMobileId ? this.appConfig.getConfig().urlCheckMobileId : ""
     console.log("ip",ip);
  
    let data = this.activatedRoute.snapshot.queryParamMap.get('data')
    // console.log("get url data service", data);
    
    let tmp = this.decrService.onDecrypt(data)
    let msisdn
    // if(tmp.mobileno) msisdn = tmp.mobileno.trim()
    // if (msisdn.charAt(0) === '0') msisdn = '66' + msisdn.substr(1);
    let url = ip + "/api/v1/qrcode/chkmobileid?data=" + data
    // let url = "http://206.189.41.105:6565/api/v1/qrcode/chkmobileid?data=" + data
    return this.http.get(url, { headers: {'x-method' : 'GET'} }).pipe(timeout(30000), map(res => res));
  }
}
