import { ActionReducerMap } from "@ngrx/store";

export interface RootState {
    random: RandomState
  }
  
  export const reducers: ActionReducerMap<RootState, any> = {
    random: stateReducer
  };

export interface RandomState {
    hello: boolean
}
  
const initialState: RandomState = {
    hello: false
};


export function stateReducer(_initialState = initialState, _action: any): RandomState {
    return initialState
}
