import {Component, inject, Input, OnInit} from '@angular/core';
import {Memoryland, MemorylandConfig, Photo, set, store} from '../../../model';
import {FormsModule} from '@angular/forms';
import {debounceTime, distinctUntilChanged, generate, map} from 'rxjs';
import {WebapiService} from '../../../services/webapi.service';

@Component({
  selector: 'app-edit-memoryland-config',
  imports: [
    FormsModule
  ],
  templateUrl: './edit-memoryland-config.component.html',
  styleUrl: './edit-memoryland-config.component.scss'
})
export class EditMemorylandConfigComponent implements OnInit {
  private webApi = inject(WebapiService);
  @Input() selectedMemoryland: Memoryland | undefined;
  @Input() memorylandConfigs: MemorylandConfig[] = [];

  selectedPhotoAlbumId: string = "";
  selectedPhotos: Photo[] = [];

  getPhotos(): Photo[] {
    return this.selectedPhotos
      .filter(photo =>
        photo.name.includes(store.value.searchConfigList));
  }

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

    if (selectedAlbum !== undefined) {
      let images = selectedAlbum.photos;

      let filteredImages = images
        .filter(image => image.image === undefined);

      if (filteredImages.length > 0) {
        this.webApi.generatePreviewsByAlbum(
          selectedAlbum.id
        );
      }
    }
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
          id: undefined,
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

  setConfigSearch(val: string) {
    set(model => {
      model.searchConfigList = val;
    });
  }
}
