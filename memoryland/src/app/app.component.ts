import { Component } from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {HeaderComponent} from "./components/Basic/header/header.component";

@Component({
  selector: 'app-root',
  imports: [
    HeaderComponent,
    RouterOutlet,
    RouterOutlet
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
}
