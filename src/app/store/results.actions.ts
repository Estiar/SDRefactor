import {Injectable} from '@angular/core';
import {NgRedux} from '@angular-redux/store';
import {AppState} from './AppState.interface';

@Injectable()
export class ResultsActions {
  static readonly SAVE_RESULTS = 'SAVE_RESULTS';
  static readonly FILTER = 'FILTER';
  static readonly UPDATE_PROPERTY_IN_ITEM = 'UPDATE_PROPERTY_IN_ITEM';

  constructor(private store: NgRedux<AppState>) {
  }

  save(results: Array<object>, showContactInfo: boolean, agentInfo: object) {
    this.store.dispatch({type: ResultsActions.SAVE_RESULTS, results: results, showContactInfo: showContactInfo, agentInfo: agentInfo});
  }

  filter(filters: IResultsFilter): void {
    this.store.dispatch({type: ResultsActions.FILTER, filters: filters});
  }

  updateField(propertyID: number, data: IDataField): void {
    this.store.dispatch({type: ResultsActions.UPDATE_PROPERTY_IN_ITEM, propertyID: propertyID, data: data});
  }
}

export interface IResultsFilter {
  bedrooms?: Array<number>;
  maxPrice?: number;
  favorite?: boolean;
}

export interface IDataField {
  name: string;
  value: any;
}

// this is what we return.
export interface IResultsState {
  showContactInfo: boolean;
  agentInfo: object;

  filters: IResultsFilter;
  unfiltered: Array<object>;
  filtered: Array<object>;

  DisplayResults(): Array<object>;
}

// this is what we pass with each action.
export interface IResultsActions {
  type: string;
  propertyID?: number;
  filters?: IResultsFilter;
  results?: Array<object>;
  showContactInfo?: boolean;
  agentInfo?: object;
  dataField?: IDataField;
}
