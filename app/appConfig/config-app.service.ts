import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConfigAppService {
  private appConfig: any = {
    "timePerSecond" :300
  };
  constructor(private http: HttpClient) { }
  
  loadAppConfig() {
    // console.log(environment.appConfigPath)
   return this.http.get(environment.appConfigPath)
     .toPromise()
     .then(data => {
       this.appConfig = data;
     })
     .catch(err => {
       console.error(err.message);
     });
 }

 getConfig() {
   return this.appConfig;
 }
}
