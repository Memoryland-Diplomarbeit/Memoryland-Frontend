import { Routes } from '@angular/router';
import {HomeComponent} from './components/home/home.component';
import {FailedComponent} from './components/authentication-and-authorization/failed/failed.component';
import {ProfileComponent} from './components/authentication-and-authorization/profile/profile.component';
import {MsalGuard} from '@azure/msal-angular';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'login-failed',
    component: FailedComponent
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [MsalGuard]
  }
];
