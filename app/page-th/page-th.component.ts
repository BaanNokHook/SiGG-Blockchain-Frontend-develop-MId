import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ConfigAppService } from '../appConfig/config-app.service';
import { ConsentService } from '../services/consent.service';
import { DecryptService } from '../services/decrypt.service';
import { Title } from '@angular/platform-browser'
declare const window: any;
declare const Native: any;
declare const Android: any;
@Component({
  selector: 'app-page-th',
  templateUrl: './page-th.component.html',
  styleUrls: ['./page-th.component.css']
})

export class PageThComponent implements OnInit {
  data
  decryptedObj
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private appConfig: ConfigAppService,
    private decrService: DecryptService,
    private consentService: ConsentService,
    private titleService: Title
  ) {
    this.data = this.activatedRoute.snapshot.queryParamMap.get('data');
  }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.titleService.setTitle("แทนบัตร")
    if (this.data) this.decryptedObj = this.decrService.onDecrypt(this.data)

    //set page to bealways  on top
    // window.onbeforeunload = function () {
    //   window.scrollTo(0, 0);
    // }
  }

  changePage() {
    let tmpLang = this.decryptedObj.language.toLowerCase()
    this.router.navigate([`/qrcode`], { queryParams: { data: this.data } })
    // this.router.navigate([`/qrcode`])
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
