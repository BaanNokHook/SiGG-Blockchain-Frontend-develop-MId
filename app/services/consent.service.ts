import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';  
import { BehaviorSubject} from 'rxjs/BehaviorSubject'; 

@Injectable({
  providedIn: 'root'
})
export class ConsentService {
urlPageName = ''
private dataSource = new BehaviorSubject<Object>({language:"", popupCase:""});
  
constructor( ) { } 
 
setData(dataSource: Object) { 
    this.dataSource.next(dataSource); 
    //  console.log("set data consent service", this.dataSource);
} 
getData(): Observable<any> { 
  // console.log("get data consent service", this.dataSource.asObservable());
  
    return this.dataSource.asObservable(); 
}
}
