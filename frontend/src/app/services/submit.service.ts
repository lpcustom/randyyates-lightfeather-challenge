import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Utilities} from '../utilities/utilities';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SubmitService {
  url = environment.api_base + 'api/submit/';
  headers: HttpHeaders;
  httpOptions: object;

  constructor(protected _http: HttpClient) {
    this.headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });
    this.httpOptions = {headers: this.headers};
  }

  add(data: any): Observable<object> {
    const url = this.url;
    data = Utilities.removeNulls(data);
    const body = new HttpParams({fromObject: data});
    return this._http.post(url, body, this.httpOptions);
  }

}
