import { ISelectionsState } from './selection.actions';
import { IResultsState } from './results.actions';
import { ILayoutState } from './interfaces/ILayoutState';

export class AppState {
  selectionsState: ISelectionsState;
  resultsState: IResultsState;
  layoutState: ILayoutState;
}
