import {Component, inject, OnInit} from '@angular/core';
import {WebApiService} from '../../../services/web-api.service';

@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})


export class ProfileComponent implements OnInit {
  protected webApi = inject(WebApiService);

  ngOnInit() {
    this.webApi.getProfile();
  }

}
