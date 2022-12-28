import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { ConfigAppService } from '../appConfig/config-app.service';
import { DecryptService } from '../services/decrypt.service';
import { ConsentService } from '../services/consent.service';

declare const window: any;
declare const Android: any;
@Component({
  selector: 'app-consent',
  templateUrl: './consent.component.html',
  styleUrls: ['./consent.component.css']
})

export class ConsentComponent implements OnInit {

  lang;
  msisdn;
  decryptedObj
  data
  queryParam

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private appConfig: ConfigAppService,
    private decrService: DecryptService,
    private consentService : ConsentService,

  ) {
    // console.log("route",this.route);
    this.queryParam = route.snapshot.queryParams
    // console.log("queryParam",this.queryParam);


  }
  
  ngOnInit() {
    this.checkQueryParam()
  }
  checkQueryParam(){
    if(!this.queryParam || !this.queryParam['data']) {
      this.consentService.setData({language:'en',popupCase:'invalid_param_40300'})
      this.router.navigate(['error'])
    }
    else{
      this.decryption(this.queryParam['data'])
    }
  }
  decryption(data){
    let encrypted = data
    // if(encrypted) encrypted = '8483BA74AC4FE493E30947C5BC29162E25C612A4AA04B443DEDA082BE34A5F1094A328AFA46733C5FBF845FFEDE4B4ABB1B6D26494AC16D0E0F775B8F398306A865A9718D832B994B03F9490EC5A2B0E'
    this.decryptedObj = this.decrService.onDecrypt(encrypted)
    if (this.decryptedObj) {
      if (this.decryptedObj.language && this.decryptedObj.mobileno && this.decryptedObj.timestamp) {
        this.lang = this.decryptedObj.language.toLowerCase();
      } else  {
        this.consentService.setData({language:'en',popupCase:'invalid_param_40300'})
        this.router.navigate(['error'])
      }
    }
    else {
      this.consentService.setData({language:'en',popupCase:'invalid_param_40300'})
      this.router.navigate(['error'])
    }
    
  }
}
