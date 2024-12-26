import {Component, inject} from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {Location} from '@angular/common';

@Component({
    selector: 'app-root',
  imports: [
    RouterLink,
    RouterLinkActive,
    RouterOutlet
  ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent {
  protected title: string = 'Memoryland';
  protected location = inject(Location);
}
