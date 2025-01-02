import { Routes } from '@angular/router';
import {MainPageComponent} from './components/Basic/main-page/main-page.component';
import {AboutPageComponent} from './components/Basic/about-page/about-page.component';
import {AllWorldsPageComponent} from './components/Memoryland/all-worlds-page/all-worlds-page.component';
import {ExploreWorldsPageComponent} from './components/Memoryland/explore-worlds-page/explore-worlds-page.component';
import {HelpPageComponent} from './components/Basic/help-page/help-page.component';
import {PageNotFoundComponent} from './components/Basic/page-not-found/page-not-found.component';
import {LoginFailedComponent} from "./components/Authentication-Authorization/login-failed/login-failed.component";
import {MsalGuard} from "@azure/msal-angular";

export const routes: Routes = [
  {
    path: '',
    component: MainPageComponent,
    title: 'Overview'
  },
  {
    path: 'about',
    component: AboutPageComponent,
    title: 'About Everything Page'
  },
  {
    path: 'allWorlds',
    component: AllWorldsPageComponent,
    title: 'All worlds of user',
    canActivate: [MsalGuard]
  },
  {
    path: 'exploreWorlds',
    component: ExploreWorldsPageComponent,
    title: 'Use copied links'
  },
  {
    path: 'helpPage',
    component: HelpPageComponent,
    title: 'Help Page'
  },
  {
    path: 'login-failed',
    component: LoginFailedComponent,
    title: 'Login Failed'
  },
  {
    path: '**',
    component: PageNotFoundComponent,
    title: 'Page not found'
  },
];
