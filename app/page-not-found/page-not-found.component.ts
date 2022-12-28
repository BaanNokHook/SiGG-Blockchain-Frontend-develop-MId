import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { ConsentService } from '../services/consent.service';
import { ConfigAppService } from '../appConfig/config-app.service'
import { Router, ActivatedRoute } from '@angular/router';
declare const window: any;
declare const Native: any;
declare const Android: any;

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.css']
})
export class PageNotFoundComponent implements OnInit {
  swalConfig
  constructor(
    private consentService: ConsentService,
    private appConfig: ConfigAppService,
    private router: Router,

  ) { }

  ngOnInit() {
    this.swalConfig = this.appConfig.getConfig().swalConfig
    this.consentService.getData().subscribe(obj => {
      if (obj.popupCase == '' || !this.swalConfig[obj.popupCase]) obj.popupCase = 'unknow_url_40400'
      if (obj.language == '' || !this.swalConfig[obj.popupCase][obj.language]) obj.language = 'en'
      // console.log(obj);
      let data = {
        type: this.swalConfig[obj.popupCase][obj.language]['type'],
        title: this.swalConfig[obj.popupCase][obj.language]['title'],
        text: this.swalConfig[obj.popupCase][obj.language]['text'],
        confirmButtonText: this.swalConfig[obj.popupCase][obj.language]['confirmButtonText'],
      }
      if (obj.popupCase == 'session_expire_20400') {
        if (obj.language == 'th') {
          Swal.fire({
            // type: data['type'],
            title: data['title'],
            text: data['text'],
            confirmButtonText: data['confirmButtonText'],
            customClass: {
              confirmButton: 'modal-confirmbtn'

            },
            width: 355,
            html:
              '<div style="height:auto;color: #39464e;font-family: DB Heavent;font-size: x-large;">กรุณาตรวจสอบและเริ่มใช้งานใหม่</div>',
          }).then((result) => {
            if (result.value) {
              console.log('page not found call fn back');
              this.closeModalBackToApp()
            }
          })
        } else {
          Swal.fire({
            // type: data['type'],
            title: data['title'],
            text: data['text'],
            confirmButtonText: data['confirmButtonText'],
            customClass: {
              confirmButton: 'modal-confirmbtn'
            },
            width: 300,
            html:
              `<div style="height:auto;color: #39464e;font-family: DB Heavent;font-size: x-large;">Please log in again</div>`,
          }).then((result) => {
            if (result.value) {
              console.log('page not found call fn back');
              this.closeModalBackToApp()
            }
          })
        }
      } else {
        if (obj.language == 'th') {
          Swal.fire({
            // type: data['type'],
            title: data['title'],
            text: data['text'],
            confirmButtonText: data['confirmButtonText'],
            customClass: {
              confirmButton: 'modal-confirmbtn'

            },
            width: 300,
            html:
              '<div style="height:auto;color: #39464e;font-family: DB Heavent;font-size: x-large;">ลองใหม่อีกครั้ง</div>',
          }).then((result) => {
            if (result.value) {
              console.log('page not found call fn back');
              this.closeModalBackToApp()
            }
          })
        } else {
          Swal.fire({
            // type: data['type'],
            title: data['title'],
            text: data['text'],
            confirmButtonText: data['confirmButtonText'],
            customClass: {
              confirmButton: 'modal-confirmbtn'
            },
            width: 300,
            html:
              `<div style="height:auto;color: #39464e;font-family: DB Heavent;font-size: x-large;">Please try again</div>`,
          }).then((result) => {
            if (result.value) {
              console.log('page not found call fn back');
              this.closeModalBackToApp()
            }
          })
        }
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

  closeWebViewAction(os) {
    console.log("os", os);
    const hasWebKit = window.hasOwnProperty('webkit');
    const hasMessageHandlers = hasWebKit ? window.webkit.hasOwnProperty('messageHandlers') : false;
    if (os === 'iOS' && hasMessageHandlers) {
      // ใช้สำหรับการปิด WK 
      return window.webkit.messageHandlers.closeWebView();
    } else if (os === 'iOS' && !hasMessageHandlers) {
      // ใช้สำหรับการปิด UI (แอพ ios ปัจจุบันใช้อยู่)
      return Native.closeWebView();
    } else if (os === 'Andriod') {
      // ใช้ปิด WebView Android
      return Android.closeWebView();
    } else {
      return window.close()
    }
  }

  closeModalBackToApp() {
    const checkDevice = this.getOperatingSystem();
    console.log("checkDevice", checkDevice);

    this.closeWebViewAction(checkDevice)
  };
}
