import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { ConfigAppService } from '../appConfig/config-app.service';
import { DecryptService } from '../services/decrypt.service';
import { ConsentService } from '../services/consent.service';
import { QrapiService } from '../services/qrapi.service';
declare const window: any;
declare const Native: any;
declare const Android: any;

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css']
})
export class InfoComponent implements OnInit {


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
    private consentService: ConsentService,
    private urlApi: QrapiService

  ) {
    this.queryParam = route.snapshot.queryParams;
  }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.checkQueryParam()
    this.data = this.queryParam['data']
  }
  checkQueryParam() {
    if (!this.queryParam || !this.queryParam['data']) {
      this.consentService.setData({ language: 'en', popupCase: 'invalid_param_40300' })
      this.router.navigate(['error'])
    }
    else {
      this.decryption(this.queryParam['data'])
    }
  }
  decryption(data) {
    let encrypted = data
    this.decryptedObj = this.decrService.onDecrypt(encrypted)
    if (this.decryptedObj) {
      if (this.decryptedObj.language && this.decryptedObj.mobileno && this.decryptedObj.timestamp) {
        this.lang = this.decryptedObj.language.toLowerCase();
      } else {
        this.consentService.setData({ language: 'en', popupCase: 'invalid_param_40300' })
        this.router.navigate(['error'])
      }
    }
    else {
      this.consentService.setData({ language: 'en', popupCase: 'invalid_param_40300' })
      this.router.navigate(['error'])
    }

  }
  changePage() {
    this.onCheckMobileId()
  }

  async onCheckMobileId() {
    let language = this.lang || 'en'
    this.urlApi.geturlForCheckMobileId().subscribe(res => {
      // console.log("res",res);
      let tmpRes = res['resultData']
      // console.log("res['resultData']['mobileid_ exists']",tmpRes.mobileid_exists);
      if (res['resultCode'] == 20000 && tmpRes.mobileid_exists == "true") {
        this.router.navigate([`/consent`], { queryParams: { data: this.data } })
        // this.router.navigate([`/consent`])
      }else if(res['resultCode'] == 20400){
        this.consentService.setData({ language: language, popupCase: 'session_expire_20400' })
        this.router.navigate(['error'])
      } else {
        // this.consentService.setData({ language: language, popupCase: 'empty_resultData_20000' })
        // this.router.navigate(['error'])
        if (language == 'th') {
          Swal.fire({
            text: '',
            confirmButtonText: 'ตกลง',
            customClass: {
              confirmButton: 'modal-confirmbtn',
              popup: 'width-content-modal'
            },
            // width: '85%',
            html:
              `<h2 class="modal-header-text-th">หมายเลขของคุณยังไม่ได้สมัคร <br>บริการแทนบัตร (Mobile ID Service)</h2><div class="modal-body-height"><span class="modal-body-text-th">เพื่อสมัครบริการ  กรุณาเตรียมซิมพร้อมมือถือ <br> และบัตรประชาชนของคุณ ติดต่อที่ เอไอเอส ช็อป</span><br><br><span class="modal-body-text-th">  เช็กสาขา เอไอเอส ช็อป <a href="http://www.ais.co.th/servicecenter/en/index.html#" style="font-weight: bold;">คลิก</a></span></div>`,
          }).then((result) => {
            if (result.value) {
              console.log('page not found call fn back');
              this.closeModalBackToApp()
            }
          })
        } else {
          Swal.fire({
            title: '',
            text: '',
            confirmButtonText: 'OK',
            customClass: {
              confirmButton: 'modal-confirmbtn',
              popup: 'width-content-modal'
            },
            // width: '85%',
            html:
              `<h2 class="modal-header-text-en">Your number has not registered for <br> Mobile ID Service.</h2><div class="modal-body-height-en"><span class="modal-body-text-en">To register the service, <br> please bring your SIM with your mobile phone, <br> and your ID Card (Thai ID Card),<br> and contact AIS Shop.</span><br><br><span class="modal-click-text">  To check AIS Shop location, <a href="http://www.ais.co.th/servicecenter/en/index.html#" style="font-weight: bold;">click</a></span></div>`,
          }).then((result) => {
            if (result.value) {
              console.log('page not found call fn back');
              this.closeModalBackToApp()
            }
          })
        }
      }

    }, error => {
      if (error.error['resultCode'] == 50000) {
        this.consentService.setData({ language: language, popupCase: 'system_error_50000' })
        this.router.navigate(['error'])
      } else if (error.error['resultCode'] == 40300) {
        this.consentService.setData({ language: language, popupCase: 'invalid_param_40300' })
        this.router.navigate(['error'], { queryParams: { data: this.queryParam['data'] } })
      } else if (error.error['resultCode'] == 40301) {
        this.consentService.setData({ language: language, popupCase: 'public_onChain_false_40301' })
        this.router.navigate(['error'])
      } else if (error.error['resultCode'] == 40400) {
        this.consentService.setData({ language: language, popupCase: 'unknow_url_40400' })
        this.router.navigate(['error'])
      }else if (error.error['resultCode'] == 20400) {
        console.log("snoopy");
        
        this.consentService.setData({ language: language, popupCase: 'session_expire_20400' })
        this.router.navigate(['error'])
      } else {
        this.consentService.setData({ language: language, popupCase: 'empty_resultData_20000' })
        this.router.navigate(['error'])
      }

    })
  }

  getOperatingSystem() {
    const userAgent = navigator.userAgent || navigator.vendor || window['opera'];
    if (/window phone/i.test(userAgent)) {
      return "Window Phone";
    }
    if (/android/i.test(userAgent)) {
      return "Andriod";
    }
    if (/iPad | iPhone | iPod/.test(userAgent) && !window['MSStream']) {
      return "iOS";
    }
    return "unknown"
  }

  // closeWebViewAction(os) {
  //   const hasWebKit = window.hasOwnProperty('webkit');
  //   const hasMessageHandlers = hasWebKit ? window.webkit.hasOwnProperty('messageHandlers') : false;
  //   if (os === 'iOS' && hasMessageHandlers) {
  //     // ใช้สำหรับการปิด WK 
  //     return window.webkit.messageHandlers.closeWebView();
  //   } else if (os === 'iOS' && !hasMessageHandlers) {
  //     // ใช้สำหรับการปิด UI (แอพ ios ปัจจุบันใช้อยู่)
  //     return Native.closeWebView();
  //   } else if (os === 'Andriod') {
  //     // ใช้ปิด WebView Android
  //     return Android.closeWebView();
  //   } else {
  //     return window.close()
  //   }
  // }

  closeWebViewAction(os) {

    console.log(os);

    if (os === 'iOS') {

      if(window.webkit){

        window.webkit.messageHandlers.closeWebView.postMessage('');

      } else {

        Native.closeWebView();

      }

    } else if (os === 'Andriod') {

      Android.closeWebView();

    }

  }

  closeModalBackToApp() {
    const checkDevice = this.getOperatingSystem();
    this.closeWebViewAction(checkDevice)
  };

}
