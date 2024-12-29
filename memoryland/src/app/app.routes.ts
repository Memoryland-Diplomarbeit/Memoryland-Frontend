import { Routes } from '@angular/router';
import {HomeComponent} from './components/home/home.component';
import {ProfileComponent} from './components/authentication-and-authorization/profile/profile.component';
import {MsalGuard} from '@azure/msal-angular';
import {LoginFailedComponent} from './components/authentication-and-authorization/login-failed/login-failed.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'login-failed',
    component: LoginFailedComponent
  },
  {
    path: 'profile',
    component: ProfileComponent,
    /*canActivate: [MsalGuard]*/
  }
];
