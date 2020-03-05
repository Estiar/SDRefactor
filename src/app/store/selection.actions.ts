import {Injectable} from '@angular/core';
import {NgRedux} from '@angular-redux/store';
import {AppState} from './AppState.interface';
import {ResultsActions} from './results.actions';
import { SelectionItem } from 'app/models/selection-item.model';

@Injectable()
export class SelectionActions {

  static readonly SAVE_SELECTIONS = 'SAVE_SELECTIONS';
  static readonly SELECT = 'SELECT';
  static readonly UNSELECT = 'UNSELECT';
  static readonly FAVORITE = 'FAVORITE';
  static readonly UNFAVORITE = 'UNFAVORITE';

  constructor(private store: NgRedux<AppState>) {
  }

  saveSelections(selections: Array<SelectionItem>) {
    this.store.dispatch({type: SelectionActions.SAVE_SELECTIONS, selections: selections});
  }

  select(propertyID: number) {
    this.store.dispatch({type: SelectionActions.SELECT, propertyID: propertyID});
  }

  unselect() {
    this.store.dispatch({type: SelectionActions.UNSELECT});
  }

  favorite(propertyID: number): void {
    this.store.dispatch({type: SelectionActions.FAVORITE, propertyID: propertyID});
    this.store.dispatch({type: ResultsActions.UPDATE_PROPERTY_IN_ITEM, propertyID: propertyID, dataField: {name: 'favorite', value: true}});
  }

  unfavorite(propertyID: number): void {
    this.store.dispatch({type: SelectionActions.UNFAVORITE, propertyID: propertyID});
    this.store.dispatch({
      type: ResultsActions.UPDATE_PROPERTY_IN_ITEM,
      propertyID: propertyID,
      dataField: {name: 'favorite', value: false}
    });
  }
}

// this is what we return.
export interface ISelectionsState {
  previousSelection: SelectionItem;
  currentSelection: SelectionItem;
  selections: Array<SelectionItem>;
}

// this is what we pass with each action.
export interface ISelectionsAction {
  type: string;
  propertyID?: number;
  selections?: Array<any>;
}
