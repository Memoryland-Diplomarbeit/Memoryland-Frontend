import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environment/environment';

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

  //region authentication and authorization


  public getProfile() {
    this.httpClient
      .get(environment.apiConfig.uri)
      .subscribe((profile) => {
      console.log(profile) //TODO: return this
    });
  }

  //endregion
}
