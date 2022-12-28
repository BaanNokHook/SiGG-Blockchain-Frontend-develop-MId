import { Component, OnInit} from '@angular/core';
import { Router, Event, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';
import { ConsentService } from './services/consent.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Mobileid';
  
  urlConfig = ['/','/consent','/qrcode','/error']
  history = ''
    constructor(private router: Router, private consentService: ConsentService) {}
  ngOnInit() {
        // this.router.events.subscribe((event: Event) => {
        //     if (event instanceof NavigationStart) {
        //         // Show loading indicator
               
        //         console.log('NavigationStart',event);
        //         let path = event.url.split('?')[0]
        //         console.log('this.url',path);

        //         if(!this.urlConfig.includes(path)) {
        //           console.log('!this.urlConfig.includes(path)',!this.urlConfig.includes(path));
                  
        //           this.consentService.setData({language:"en", popupCase:"unknow_url"})  
        //         }              
        //     }

        //     if (event instanceof NavigationEnd) {
        //         // Hide loading indicator
        //         // console.log('NavigationEnd',event);
                

        //     }

        //     if (event instanceof NavigationError) {
        //         // Hide loading indicator
        //         // this.consentService.setData('url err')

        //         // Present error to user
        //         // console.log('NavigationError',event);

        //     }
        // });
  }

  
}
