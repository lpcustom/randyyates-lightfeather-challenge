import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Utilities} from '../utilities/utilities';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  url = environment.api_base;
  headers: HttpHeaders;
  httpOptions: object;

  constructor(protected _http: HttpClient) {
    this.headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });
    this.httpOptions = {headers: this.headers};
  }

  getMany(p: any): Observable<object> {
    const params = Utilities.paramsFromInput(p);
    let url = this.url;
    if (params.length > 0) {
      url += '?' + params;
    }
    return this._http.get(url, this.httpOptions);
  }

  getOne(id: string): Observable<object> {
    const url = this.url + '/' + id + '/edit';
    const httpOptions = {headers: this.headers};
    return this._http.get(url, httpOptions);
  }

  add(data: any): Observable<object> {
    const url = this.url;
    data = Utilities.removeNulls(data);
    const body = new HttpParams({fromObject: data});
    return this._http.post(url, body, this.httpOptions);
  }

  update(id: string, data: any): Observable<object> {
    const url = this.url + '/' + id;
    data = Utilities.removeNulls(data);
    const body = new HttpParams({fromObject: data});
    return this._http.put(url, body, this.httpOptions);
  }

  delete(id: string): Observable<object> {
    const url = this.url + '/' + id;
    return this._http.delete(url, this.httpOptions);
  }
}
