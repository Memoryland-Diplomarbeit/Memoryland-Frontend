import {Component, inject} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {PhotoService} from '../../services/photo.service';

@Component({
    selector: 'app-photo-form',
    imports: [
        ReactiveFormsModule
    ],
    templateUrl: './photo-form.component.html',
    styleUrl: './photo-form.component.css'
})
export class PhotoFormComponent {
  protected uploadForm: FormGroup;
  private photoSvc = inject(PhotoService);
  private fb = inject(FormBuilder);

  constructor() {
    this.uploadForm = this.fb.group({
      fileName: ['', Validators.required],
      photoAlbumId: ['', Validators.required],
      photo: [null, Validators.required],
    });
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];

    if (file) {
      this.uploadForm.patchValue({ photo: file });
    }
  }

  onSubmit() {
    if (this.uploadForm.valid) {
      const fileName = this.uploadForm
        .get('fileName')?.value;
      const photoAlbumId = this.uploadForm
        .get('photoAlbumId')?.value;
      const photo = this.uploadForm
        .get('photo')?.value;

      this.photoSvc.submitPhoto(fileName, photoAlbumId, photo);
    }
  }
}
