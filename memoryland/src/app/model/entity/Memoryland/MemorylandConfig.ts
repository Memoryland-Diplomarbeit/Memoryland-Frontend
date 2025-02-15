import {Photo} from '../MemoryStore/Photo';

export interface MemorylandConfig {
  id: number | undefined;
  position: number;
  photo: Photo;
}
