import {ISelectionsState, ISelectionsAction, SelectionActions} from './selection.actions';
import {InitialAppState} from './AppState.InitialState';
import { SelectionItem } from 'app/models/selection-item.model';

export function selectionsReducer(lastState: ISelectionsState = InitialAppState.selectionsState,
                                  action: ISelectionsAction): ISelectionsState {

  function toggleFavorite(propertyID: number, isFav: boolean, selections: Array<SelectionItem>): Array<SelectionItem> {
    const clone = selections.slice();
    const item = clone.find(f => f.propertyID === propertyID);
    if (item) item.favorite = isFav;

    return clone;
  }

  switch (action.type) {
    case SelectionActions.SAVE_SELECTIONS:
      return {
        ...lastState,
        previousSelection: null,
        currentSelection: null,
        selections: [].concat(action.selections)
      };

    case SelectionActions.UNSELECT:
      return {
        ...lastState,
        previousSelection: lastState.currentSelection,
        currentSelection: null,
        selections: lastState.selections.slice(),
      };


    case SelectionActions.SELECT:
      if (lastState.currentSelection &&
        action.propertyID === lastState.currentSelection.propertyID) return lastState;

      return {
        ...lastState,
        previousSelection: lastState.currentSelection,
        currentSelection: lastState.selections.find((r) => r.propertyID === action.propertyID),
        selections: lastState.selections.slice(),
      };


    case SelectionActions.FAVORITE:
      // update the DisplayItems

      return {
        ...lastState,
        selections: toggleFavorite(action.propertyID, true, lastState.selections),
      };

    case SelectionActions.UNFAVORITE:
      return {
        ...lastState,
        selections: toggleFavorite(action.propertyID, false, lastState.selections),
      };

    default:
      return lastState;
  }
}
