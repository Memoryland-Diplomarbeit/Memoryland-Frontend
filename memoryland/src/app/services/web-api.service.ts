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

  public profile:any = undefined;

  public uploadPhoto(photoData: FormData) {
    return this.httpClient
      .post(
        `${environment.serverBaseUrl}/photos`,
        photoData
      );
  }

  //region authentication and authorization

  public getProfile(){

    let me = this;
    this.httpClient
      .get(environment.apiConfig.uri+"/hello")
      .subscribe({
        next(profile) {
          console.log(profile);
          me.profile = profile;
        },
        error(error) {
          console.error("hier");
          console.error(error);
        }
      });
  }

  //endregion
}
