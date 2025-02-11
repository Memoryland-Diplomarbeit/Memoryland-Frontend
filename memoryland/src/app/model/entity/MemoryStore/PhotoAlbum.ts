import {Photo} from './Photo';

export interface PhotoAlbum {
  id: number;
  name: string;
  photos: Photo[];
}
