import {PhotoAlbum} from './PhotoAlbum';

export interface Transaction {
  id: number | undefined;
  destAlbum: PhotoAlbum;
}
