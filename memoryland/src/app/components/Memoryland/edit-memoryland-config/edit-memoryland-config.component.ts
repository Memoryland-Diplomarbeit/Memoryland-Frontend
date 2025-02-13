import {Component, Input, OnInit} from '@angular/core';
import {Memoryland, MemorylandConfig, Photo, set, store} from '../../../model';
import {FormsModule} from '@angular/forms';
import {distinctUntilChanged, generate, map} from 'rxjs';

@Component({
  selector: 'app-edit-memoryland-config',
  imports: [
    FormsModule
  ],
  templateUrl: './edit-memoryland-config.component.html',
  styleUrl: './edit-memoryland-config.component.scss'
})
export class EditMemorylandConfigComponent implements OnInit {
  @Input() selectedMemoryland: Memoryland | undefined;
  @Input() memorylandConfigs: MemorylandConfig[] = [];

  selectedPhotoAlbumId: string = "";
  selectedPhotos: Photo[] = [];

  ngOnInit(): void {
    this.store.pipe(
      map(model => model.photoAlbums),
      distinctUntilChanged()
    ).subscribe((p) => {
      if (this.selectedPhotoAlbumId === "" && p.length > 0) {
        this.selectedPhotoAlbumId = p[0].id.toString();
      }

      this.loadPhotos();
    });
  }

  generateArray(num: number) {
    return [...Array(num)]
      .map((_, i) => i);
  }

  loadPhotos() {
    const selectedAlbum = store.value
      .photoAlbums
      .find(a => a.id === Number.parseInt(this.selectedPhotoAlbumId));
    this.selectedPhotos = selectedAlbum ? selectedAlbum.photos : [];
  }

  onDragStart(event: DragEvent, photo: Photo) {
    event.dataTransfer?.setData('photoId', photo.id.toString());
  }

  onDragStartConf(event: DragEvent, conf: MemorylandConfig | undefined) {
    if (conf !== undefined) {
      set(model => {
        model.memorylandConfigs = model.memorylandConfigs
          .filter(memorylandConfig =>
            memorylandConfig.position !== conf.position);
      });
      event.dataTransfer?.setData('photoId', conf.photo.id.toString());
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onDrop(event: DragEvent, slot: number) {
    event.preventDefault();
    const photoId = event
      .dataTransfer?.getData('photoId');
    const photo = this.selectedPhotos
      .find(p => p.id.toString() === photoId);

    if (photo && this.selectedMemoryland) {
      set(model => {
        model.memorylandConfigs = model.memorylandConfigs
          .filter(memorylandConfig =>
            memorylandConfig.position !== slot);

        model.memorylandConfigs.push({
          photo: photo,
          position: slot
        });
      });
    }
  }

  protected readonly store = store;

  getConfigForPos(slot: number) {
    return this.memorylandConfigs
      .find(c => c.position === slot);
  }
}
