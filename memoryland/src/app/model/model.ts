import {BehaviorSubject} from "rxjs";
import {Draft, produce} from "immer";
import {
  Memoryland,
  PhotoAlbum,
  ToastModel,
  UploadPhotoModel,
  SelectedPhoto,
  MemorylandType
} from './index';


export interface Model {
  toastModel: ToastModel;
  photoAlbums: PhotoAlbum[];
  memorylandTypes: MemorylandType[];
  memorylands: Memoryland[];
  selectedPhotoAlbum: PhotoAlbum | undefined;
  createAlbumName: string;
  uploadPhotoModel: UploadPhotoModel;
  photoViewerPhoto: SelectedPhoto | undefined;
  selectedMemoryland: Memoryland | undefined;
  selectedMemorylandType: MemorylandType | undefined;
}

const initialState: Model = {
  selectedMemoryland: undefined,
  selectedMemorylandType: undefined,
  memorylandTypes: [],
  memorylands: [],
  photoViewerPhoto: undefined,
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

export function set(recipe: (model: Draft<Model>) => void) {
  const nextState = produce(store.value, recipe);
  store.next(nextState);
}
