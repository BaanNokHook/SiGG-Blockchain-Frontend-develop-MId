import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { ConsentService } from './services/consent.service';

@Injectable({
  providedIn: 'root'
})
export class UrlGuard implements CanActivate {
  constructor(
    private consentService : ConsentService,
    private router: Router){}
  urlConfig = ['/consent','/qrcode']
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean{ 
      return false;
      // return true
  }
  
}
