import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Utilities} from '../utilities/utilities';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupervisorsService {
  url = environment.api_base + 'api/supervisors/';
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

}
