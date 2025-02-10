import { Injectable } from '@angular/core';
import {set, store, ToastDto} from '../model';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private id = 0;

  addToast(title: string, message: string, type: string = 'info') {
    let toastDto: ToastDto = {
      id: this.id,
      title: title,
      message: message,
      type: type,
    }
    this.id++;

    set(model => {
      model.toastModel.toasts.push(toastDto);
    });

    setTimeout(() => this.removeToast(toastDto), 10000);
    // Auto-remove after 10 seconds
  }

  removeToast(toastDto: ToastDto) {
    let index = store.value.toastModel.toasts.findIndex(t =>
      t.id === toastDto.id
    );

    if (index !== -1) {
      set(model => {
        model.toastModel.toasts.splice(index, 1);
      });
    }
  }
}
