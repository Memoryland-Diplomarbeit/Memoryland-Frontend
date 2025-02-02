import {BehaviorSubject} from "rxjs";
import {Draft, produce} from "immer";
import {PhotoAlbum} from './entity/MemoryStore/PhotoAlbum';

export interface Model {
  photoAlbums: PhotoAlbum[];
}

const initialState: Model = {
  photoAlbums: []
};

export const store = new BehaviorSubject<Model>(initialState);

export function set(recipe: (model: Draft<Model>)=>void) {
  const nextState = produce(store.value, recipe);
  store.next(nextState);
}
