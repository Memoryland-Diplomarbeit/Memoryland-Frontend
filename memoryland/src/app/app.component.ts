import { Component } from '@angular/core';
import {PhotoFormComponent} from './components/photo-form/photo-form.component';

@Component({
    selector: 'app-root',
    imports: [
        PhotoFormComponent
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent {
}
