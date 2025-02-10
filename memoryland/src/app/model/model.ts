import {BehaviorSubject} from "rxjs";
import {Draft, produce} from "immer";
import {PhotoAlbum} from './entity/MemoryStore/PhotoAlbum';
import {ToastModel} from './entity/toast/toast-model';

export interface Model {
  toastModel: ToastModel;
  photoAlbums: PhotoAlbum[];
}

const initialState: Model = {
  toastModel: {
    toasts: []
  },
  photoAlbums: []
};

export const store = new BehaviorSubject<Model>(initialState);

export function set(recipe: (model: Draft<Model>)=>void) {
  const nextState = produce(store.value, recipe);
  store.next(nextState);
}
