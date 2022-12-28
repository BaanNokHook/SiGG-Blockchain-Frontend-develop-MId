import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageQRComponent } from './qrcode/qrcode.component';
import { ConsentComponent } from './consent/consent.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import * as CryptoJS from 'crypto-js';
import { ConfigAppService } from './appConfig/config-app.service';
import { UrlGuard } from './url.guard';
import { UrlChildGuard } from './url-child.guard';
import { InfoComponent } from './info/info.component';

const routes: Routes = [
  // {
  //   path: 'consent',
  //   component : ConsentComponent
  // },
  // {
  //   path: 'qrcode',
  //   component: PageQRComponent
  // },
  // { path: '',  component : ConsentComponent, canActivate: [UrlGuard]},
  { path: 'info', component: InfoComponent },
  { path: 'consent', component: ConsentComponent },
  { path: 'qrcode', component: PageQRComponent },
  { path: 'error', component: PageNotFoundComponent },
  {
    path: '**',
    // component: PageNotFoundComponent,
    redirectTo: '/error',

  }



]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
