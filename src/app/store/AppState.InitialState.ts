import { AppState } from './AppState.interface';

export const InitialAppState: AppState = {
  selectionsState: {
    previousSelection: null,
    currentSelection: null,
    selections: [],
  },

  resultsState: {
    filters: null,
    unfiltered: [],
    filtered: [],
    showContactInfo: false,
    agentInfo: null,

    DisplayResults(): Array<object> {
      return !this.filters ? this.unfiltered : this.filtered;
    },
  },

  layoutState: {
    index: null,
    imageIndex: 0,
    images: [],
    isFavSelected: false,
  },
};
