import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WebApiService {
  private httpClient = inject(HttpClient);
  private headers: HttpHeaders = new HttpHeaders()
    .set('Accept', 'application/json');

  public uploadPhoto(photoData: FormData) {
    return this.httpClient
      .post(
        `${environment.serverBaseUrl}/photos`,
        photoData
      );
  }
}
