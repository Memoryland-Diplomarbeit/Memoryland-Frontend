import {PhotoAlbum} from './PhotoAlbum';

export interface UploadPhotoModel {
  fileName: string;
  selectedAlbumId: number | undefined;
  file: File | undefined;
}
