import {BehaviorSubject} from "rxjs";
import {Draft, produce} from "immer";
import {
  Memoryland,
  PhotoAlbum,
  ToastModel,
  UploadPhotoModel,
  SelectedPhoto,
  MemorylandType, MemorylandConfig, RenameModel, Photo, UploadAlbumModel, Transaction
} from './index';


export interface Model {
  toastModel: ToastModel;
  photoAlbums: PhotoAlbum[];
  memorylandTypes: MemorylandType[];
  memorylands: Memoryland[];
  selectedPhotoAlbum: PhotoAlbum | undefined;
  createAlbumName: string;
  createMemorylandName: string;
  uploadPhotoModel: UploadPhotoModel;
  photoViewerPhoto: SelectedPhoto | undefined;
  selectedMemoryland: Memoryland | undefined;
  selectedMemorylandType: number | undefined;
  originalMemorylandConfigs: MemorylandConfig[];
  memorylandConfigs: MemorylandConfig[];
  token: string;
  renameMemoryland: RenameModel<Memoryland>;
  renamePhoto: RenameModel<Photo>;
  renamePhotoAlbum: RenameModel<PhotoAlbum>;
  searchImgList: string;
  searchAlbumList: string;
  searchMemorylandList: string;
  searchConfigList: string;
  username: string;
  uploadAlbumModel: UploadAlbumModel;
  transaction: Transaction | undefined;
  totalPhotos: number;
  finishedPhotos: number;
  useTransaction: boolean;
  loadingMemorylands: boolean;
  loadingAlbums: boolean;
}

const initialState: Model = {
  useTransaction: false,
  finishedPhotos: 0,
  totalPhotos: 0,
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
  },
  createMemorylandName: "",
  memorylandConfigs: [],
  originalMemorylandConfigs: [],
  token: "",
  renameMemoryland: {
    renameObj: undefined,
    name: ""
  },
  renamePhoto: {
    renameObj: undefined,
    name: ""
  },
  renamePhotoAlbum: {
    renameObj: undefined,
    name: ""
  },
  searchImgList: "",
  searchAlbumList: "",
  searchMemorylandList: "",
  searchConfigList: "",
  username: "",
  uploadAlbumModel: {
    useTransaction: false,
    selectedAlbumId: undefined,
    files: []
  },
  transaction: undefined,
  loadingMemorylands: false,
  loadingAlbums: false
};

export const store = new BehaviorSubject<Model>(initialState);

export function set(recipe: (model: Draft<Model>) => void) {
  const nextState = produce(store.value, recipe);
  store.next(nextState);
}
