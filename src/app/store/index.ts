import { combineReducers } from 'redux';
import { selectionsReducer } from './selections.reducer';
import { resultsReducer } from './results.reducer';
import { AppState } from './AppState.interface';
import { layoutReducer } from './layout.reducer';

export const rootReducer = combineReducers<AppState>({
  selectionsState: selectionsReducer,
  resultsState: resultsReducer,
  layoutState: layoutReducer,
});
