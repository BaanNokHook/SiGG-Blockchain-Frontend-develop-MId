import { Component, OnInit, OnDestroy, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { map } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { QrapiService } from '../services/qrapi.service';
import { ConfigAppService } from '../appConfig/config-app.service';
import { DecryptService } from '../services/decrypt.service';
import { ConsentService } from '../services/consent.service';
import { Title } from '@angular/platform-browser'
import * as moment from 'moment';
import { Logs } from 'selenium-webdriver';
declare const window: any;
declare const Native: any;
declare const Android: any;
@Component({
  selector: 'app-qrcode',
  templateUrl: './qrcode.component.html',
  styleUrls: ['./qrcode.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class PageQRComponent implements OnInit {
  getQrApi
  lang;
  decryptedObj
  queryParam
  swalConfig
  data
  startAt;
  currentTime;
  currentSubscription: Subscription;
  pageState = new EventEmitter<string>();

  qrcode = "../../assets/loading.gif";
  qrcodeexpire = false;

  updateDate = new Date();
  updateDateTH = this.thaiDate();

  constructor(
    private changeDetector: ChangeDetectorRef,
    private appConfig: ConfigAppService,
    private urlApi: QrapiService,
    private router: Router,
    private route: ActivatedRoute,
    private decrService: DecryptService,
    private consentService: ConsentService,
    private titleService: Title

  ) {

    this.swalConfig = this.appConfig.getConfig().swalConfig
    this.startAt = this.appConfig.getConfig().timePerSecond;
    this.queryParam = route.snapshot.queryParams
  }

  async ngOnInit() {
    await this.checkQueryParam()
    this.getQRCode()
    if (this.lang == 'th') this.titleService.setTitle("แทนบัตร")
    else this.titleService.setTitle("Mobile ID")
    this.data = this.queryParam['data']
  }

  ngOnDestroy(): void {
    //handle error from detectChange when getting out of this component
    if (this.currentSubscription) this.currentSubscription.unsubscribe();
  }

  checkQueryParam() {
    if (!this.queryParam || !this.queryParam['data']) {
      console.log("should be error");

      this.consentService.setData({ language: 'en', popupCase: 'invalid_param_40301' })
      this.router.navigate(['error'])
    }
    else {
      console.log("data correctly");
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
        this.consentService.setData({ language: 'en', popupCase: 'invalid_param_40301' })
        this.router.navigate(['error'])
      }
    }
    else {
      this.consentService.setData({ language: 'en', popupCase: 'invalid_param_40301' })
      this.router.navigate(['error'])
    }

  }

  thaiDate() {
    let thMonth = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
    let tmpDay = moment().format('DD')
    let tmpMonth = thMonth[parseInt(moment().format('M')) - 1]
    let tmpYear = parseInt(moment().format('YYYY')) + 543
    let tmpTime = moment().format('HH:mm:ss')
    let tmpDate = tmpDay + " " + tmpMonth.toString() + " " + tmpYear.toString() + " " + tmpTime
    return [tmpDate + " น."];
  }

  async getQRCode() {
    // console.log("getQRCode this.lang",this.lang);
    let language = this.lang || 'en'
    this.getQrApi = this.urlApi.geturl().subscribe(res => {
      console.log("res", res);

      // console.log("Object.keys(res['resultData'].length",Object.keys(res['resultData']).length);
      if (res['resultCode'] == 20000 && Object.keys(res['resultData']).length == 1) {
        this.countdown()
        this.qrcode = (res as any).resultData.qr_code_base64;
        if (this.qrcode != null) {
          this.qrcodeexpire = false;
        } else {
          this.consentService.setData({ language: language, popupCase: 'system_error_50000' })
          this.router.navigate(['error'])
        }
      } else if (res['resultCode'] == 20400) {
        console.log("20400");
        
        this.consentService.setData({ language: language, popupCase: 'session_expire_20400' })
        this.router.navigate(['error'])
      } else {
        console.log("empty result data");

        this.consentService.setData({ language: language, popupCase: 'empty_resultData_20000' })
        this.router.navigate(['error'])
      }

    }, error => {
      console.log("error>>>>>", error);
      if (error.name == "TimeoutError") {
        if (this.qrcode == "../../assets/loading.gif") {
          this.getQrApi.unsubscribe()
          if (this.lang == 'th') {
            Swal.fire({
              // title: 'QR Code หมดอายุ กดปุ่ม "ตกลง" เพื่อสร้าง QR Code ใหม่',
              confirmButtonColor: '#b2d234',
              showCancelButton: true,
              cancelButtonText: 'ยกเลิก',
              confirmButtonText: 'ลองใหม่อีกครั้ง',
              reverseButtons: true,
              customClass: {
                confirmButton: 'modal-confirm-timeoutbtn',
                cancelButton: 'modal-back-timeoutbtn'
              },
              width: 350,
              allowOutsideClick: false,
              html: '<h3 style="font-family: DB Heavent;font-size: 22pt; margin-top:-5px">Connection Timeout</h3>'
            }).then((result) => {
              if (result.value) {
                this.onBacktoConsent()
              } else if (
                result.dismiss === Swal.DismissReason.cancel
              ) {
                this.closeModalBackToApp()
              }
            })
          } else {
            Swal.fire({
              // title: 'Your QR Code has expired.' ,
              // text: 'Please click "OK" to create new QR Code' ,
              confirmButtonColor: '#b2d234',
              showCancelButton: true,
              cancelButtonText: 'Cancel',
              confirmButtonText: 'Try again',
              reverseButtons: true,
              customClass: {
                confirmButton: 'modal-confirm-timeoutbtn',
                cancelButton: 'modal-back-timeoutbtn'
              },
              width: 370,
              allowOutsideClick: false,
              html: '<h3 style="font-family: DB Heavent;font-size: 24pt; margin-top:-10px">Connection Timeout.</h3>'
            }).then((result) => {
              if (result.value) {
                this.onBacktoConsent()
              } else if (
                result.dismiss === Swal.DismissReason.cancel
              ) {
                this.closeModalBackToApp()
              }
            })
          }
        }
        // }, 30000)
      } else if (error.error['resultCode'] == 50000) {
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
      }else {
        this.consentService.setData({ language: language, popupCase: 'empty_resultData_20000' })
        this.router.navigate(['error'])
      }

    })


  }

  countdown() {
    this.startAt = this.appConfig.getConfig().timePerSecond;
    this.currentTime = this.timeFormat(this.startAt);
    this.changeDetector.detectChanges();
    const t = interval(1000);
    this.currentSubscription = t.pipe(take(this.startAt), map(time => this.startAt - (time + 1))).subscribe(time => {
      this.currentTime = this.timeFormat(time);
      this.changeDetector.detectChanges();
      if (time == 0) {
        if (this.lang == 'th') {
          Swal.fire({
            // title: 'QR Code หมดอายุ กดปุ่ม "ตกลง" เพื่อสร้าง QR Code ใหม่',
            confirmButtonColor: '#b2d234',
            showCancelButton: true,
            cancelButtonText: 'ยกเลิก',
            confirmButtonText: 'ตกลง',
            reverseButtons: true,
            customClass: {
              confirmButton: 'modal-confirmbtn',
              cancelButton: 'modal-backbtn'
            },
            width: 340,
            allowOutsideClick: false,
            html: '<h3 style="font-family: DB Heavent;font-size: 22pt; margin-top:-10px">QR Code ของคุณหมดอายุ</h3> <p style="font-family: DB Heavent;font-size: 19pt;">กรุณากดปุ่ม "ตกลง" เพื่อสร้าง QR Code ใหม่</p>'
          }).then((result) => {
            if (result.value) {
              this.onBacktoConsent()

            } else if (
              result.dismiss === Swal.DismissReason.cancel
            ) {
              this.closeModalBackToApp()
            }
          })
        } else {
          Swal.fire({
            // title: 'Your QR Code has expired.' ,
            // text: 'Please click "OK" to create new QR Code' ,
            confirmButtonColor: '#b2d234',
            showCancelButton: true,
            cancelButtonText: 'Cancel',
            confirmButtonText: 'OK',
            reverseButtons: true,
            customClass: {
              confirmButton: 'modal-confirmbtn',
              cancelButton: 'modal-backbtn'
            },
            width: 340,
            allowOutsideClick: false,
            html: '<h3 style="font-family: DB Heavent;font-size: 24pt;margin-top: -10px;">Your QR Code has expired.</h3> <p style="font-family: DB Heavent;font-size: 20pt;">Please click "OK" to create new QR Code</p>'
          }).then((result) => {
            if (result.value) {
              this.onBacktoConsent()

            } else if (
              result.dismiss === Swal.DismissReason.cancel
            ) {
              this.closeModalBackToApp()
            }
          })
        }
      }

    },
      err => {
        this.pageState.error(err);
      }, () => {
        this.currentTime = '00:00';
        // this.qrcodeexpire = true;
        this.changeDetector.detectChanges();
      });

  }

  timeFormat(time) {
    const minutes = Math.floor(time / 60);
    const formattedMinutes = (minutes > 9 ? minutes : '0' + minutes);
    const seconds = time % 60;
    const formattedSeconds = (seconds > 9 ? seconds : '0' + seconds);

    return `${formattedMinutes}:${formattedSeconds}`;
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

      if (window.webkit) {

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


  async onBacktoConsent() {
    this.router.navigate([`/consent`], { queryParams: { data: this.data } })
  }

}

