import {Component, inject} from '@angular/core';
import {ToastService} from '../../services/toast.service';
import {store, ToastDto} from '../../model';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-toast',
  imports: [
    NgClass
  ],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss'
})
export class ToastComponent {
  protected readonly toastSvc = inject(ToastService);

  closeToast(toastDto: ToastDto) {
    this.toastSvc.removeToast(toastDto);
  }

  protected readonly store = store;
}
