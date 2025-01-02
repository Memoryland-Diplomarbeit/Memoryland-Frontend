import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WebapiService {
  private httpClient = inject(HttpClient);
  private headers: HttpHeaders = new HttpHeaders()
    .set('Accept', 'application/json');
}
