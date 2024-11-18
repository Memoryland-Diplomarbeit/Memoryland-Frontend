import {BehaviorSubject} from "rxjs";
import {Draft, produce} from "immer";

export interface Model {
}

const initialState: Model = {
};

export const store = new BehaviorSubject<Model>(initialState);

export function set(recipe: (model: Draft<Model>)=>void) {
  const nextState = produce(store.value, recipe);
  store.next(nextState);
}
