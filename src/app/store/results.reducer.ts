import {IResultsState, IResultsActions, IResultsFilter, ResultsActions, IDataField} from './results.actions';
import {InitialAppState} from './AppState.InitialState';

export function resultsReducer(lastState: IResultsState = InitialAppState.resultsState,
                               action: IResultsActions): IResultsState {

  function getFilteredSelections(filters: IResultsFilter, results: Array<any>): Array<object> {
    if (!results) return;

    let bedrooms = [0, 1, 2, 3];
    let maxPrice = Number.MAX_SAFE_INTEGER;
    if (filters.bedrooms) bedrooms = filters.bedrooms;
    if (filters.maxPrice) maxPrice = filters.maxPrice;

    const filtered = [];
    results.forEach(record => {
      const clone = {...record};

      clone.floorplans = [];
      bedrooms.forEach(bedroom => {
        const matches = record.floorplans.filter(f => f.bedrooms === bedroom && f.price <= maxPrice);
        if (matches.length) clone.floorplans = clone.floorplans.concat(matches);
      });

      if (filters.favorite && !clone.favorite) {
          // skip
      } else if (clone.floorplans.length)
        filtered.push(clone);
    });

    return filtered;
  }

  function updateDataField(dataset: Array<object>, data: IDataField, propertyID: number) {
    const h = [].concat(dataset);
    const index = h.findIndex(r => r.propertyID === propertyID);
    if (index < 0) return dataset;

    const item = h[index];
    item[data.name] = data.value;
    h[index] = item;

    return h;
  }

  switch (action.type) {
    case ResultsActions.FILTER:
      return {
        ...lastState,
        filters: {...lastState.filters, ...action.filters}, // merge the two together
        filtered: getFilteredSelections(action.filters, lastState.unfiltered)
      };

    case ResultsActions.SAVE_RESULTS:
      return {
        ...lastState,
        filters: null,
        filtered: [],
        unfiltered: action.results,
        showContactInfo: action.showContactInfo,
        agentInfo: action.agentInfo
      };

    case ResultsActions.UPDATE_PROPERTY_IN_ITEM:
      if (!action.dataField || action.propertyID <= 0) return {...lastState};

      const filtered = updateDataField(lastState.filtered, action.dataField, action.propertyID);
      const unfiltered = updateDataField(lastState.unfiltered, action.dataField, action.propertyID);

      return {
        ...lastState,
        filtered: filtered,
        unfiltered: unfiltered
      };

    default:
      return lastState;
  }
}
