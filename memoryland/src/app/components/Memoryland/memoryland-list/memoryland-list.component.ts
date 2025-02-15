import {Component, inject} from '@angular/core';
import {AsyncPipe} from "@angular/common";
import {HoverClassDirective} from "../../../directives/hover-class.directive";
import {distinctUntilChanged, map} from 'rxjs';
import {Memoryland, PhotoAlbum, set, store} from '../../../model';
import {EditMemorylandConfigComponent} from '../edit-memoryland-config/edit-memoryland-config.component';
import {WebapiService} from '../../../services/webapi.service';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-memoryland-list',
  imports: [
    AsyncPipe,
    HoverClassDirective,
    EditMemorylandConfigComponent,
    RouterLink
  ],
  templateUrl: './memoryland-list.component.html',
  styleUrl: './memoryland-list.component.scss'
})
export class MemorylandListComponent {
  private webApi = inject(WebapiService);

  protected memorylands = store.pipe(
    map(model => model.memorylands),
    distinctUntilChanged()
  );

  selectMemoryland(m: Memoryland) {
    set(model => {
      model.selectedMemoryland = m;
    });
  }

  selectMemorylandAndGetConfig(m: Memoryland) {
    this.selectMemoryland(m);
    this.webApi.getMemorylandConfigFromServer(m.id);
  }

  deleteMemoryland(m: Memoryland) {
    this.webApi.deleteMemoryland(m.id);
  }

  protected readonly store = store;

  updateMemorylandConfig() {
    if (store.value.selectedMemoryland !== undefined) {
      store.value.memorylandConfigs.forEach((conf) => {
        let origConf = store.value.originalMemorylandConfigs
          .find(c => c.position === conf.position);

        if (origConf === undefined || origConf.photo.id !== conf.photo.id) {
          this.webApi.postMemorylandConfig(
            store.value.selectedMemoryland!.id,
            conf.position,
            conf.photo.id);
        }
      })
    }
  }

  renameMemorylandNotValid() {
    return store.value.renameMemoryland.name === "" ||
      store.value.renameMemoryland.renameObj === undefined
  }

  setRenameMemoryland(m: Memoryland) {
    set(model => {
      model.renameMemoryland.renameObj = m;
      model.renameMemoryland.name = m.name;
    });
  }

  setMemorylandName(val: string) {
    set(model => {
      model.renameMemoryland.name = val;
    });
  }

  renameMemoryland() {
    let renameMemoryland = store.value.renameMemoryland;

    if (!this.renameMemorylandNotValid()) {
      this.webApi.renameMemoryland(
        renameMemoryland.renameObj!.id,
        renameMemoryland.name
      );
    }
  }
}
