import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { AppComponent } from './app.component';
import { PageThComponent } from './page-th/page-th.component';
import { AppRoutingModule } from './app-routing.module';
import { PageQRComponent } from './qrcode/qrcode.component';
import { ConfigAppService} from './appConfig/config-app.service';
import { HttpClientModule } from '@angular/common/http';
import { PageEnComponent } from './page-en/page-en.component';
import { ConsentComponent } from './consent/consent.component';
import {DecryptService} from './services/decrypt.service';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { InfoComponent } from './info/info.component';
const appInitializerFn = (appConfig: ConfigAppService) => {
  return () => {
    return appConfig.loadAppConfig();
  };
 };

@NgModule({
  declarations: [
    AppComponent,
    PageThComponent,
    PageQRComponent,
    PageEnComponent,
    ConsentComponent,
    PageNotFoundComponent,
    InfoComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [ConfigAppService,
    DecryptService,
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializerFn,
      multi: true,
      deps: [ConfigAppService]
    },],
  bootstrap: [AppComponent]
})
export class AppModule { }
