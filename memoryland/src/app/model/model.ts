import {BehaviorSubject} from "rxjs";
import {Draft, produce} from "immer";
import {PhotoAlbum} from './entity/MemoryStore/PhotoAlbum';
import {ToastModel} from './entity/toast/toast-model';
import {UploadPhotoModel} from './entity/MemoryStore/UploadPhotoModel';

export interface Model {
  toastModel: ToastModel;
  photoAlbums: PhotoAlbum[];
  selectedPhotoAlbum: PhotoAlbum | undefined;
  createAlbumName: string;
  uploadPhotoModel: UploadPhotoModel;
}

const initialState: Model = {
  uploadPhotoModel: {
    fileName: "",
    selectedAlbumId: undefined,
    file: undefined
  },
  createAlbumName: '',
  photoAlbums: [],
  selectedPhotoAlbum: undefined,
  toastModel: {
    toasts: []
  }
};

export const store = new BehaviorSubject<Model>(initialState);

export function set(recipe: (model: Draft<Model>)=>void) {
  const nextState = produce(store.value, recipe);
  store.next(nextState);
}
