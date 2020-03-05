import { InitialAppState } from './AppState.InitialState';
import { ILayoutState, ILayoutAction } from './interfaces/ILayoutState';
import { LayoutActions } from './layout.actions';

export function layoutReducer(
  lastState: ILayoutState = InitialAppState.layoutState,
  action: ILayoutAction
): ILayoutState {
  switch (action.type) {
    case LayoutActions.DISPLAY_PHOTO:
      return {
        ...lastState,
        index: action.images.findIndex(
          item => action.selectedImageUrl.toLowerCase() === item.toLowerCase()
        ),
        subsystem: '',
        message: '',
        images: action.images,
        imageIndex: action.images.findIndex(
          item => action.selectedImageUrl.toLowerCase() === item.toLowerCase()
        ),
      };

    case LayoutActions.HIDE_GALLERY:
      return {
        ...lastState,
        index: -1,
        subsystem: 'photo-gallery',
        message: 'close',
      };

    case LayoutActions.MAP_RESET_ZOOM:
      return {
        ...lastState,
        subsystem: 'map',
        message: 'reset-zoom',
      };

    case LayoutActions.MAP_LOAD_COMPLETE:
      return {
        ...lastState,
        subsystem: 'map',
        message: 'load-complete',
      };

    case LayoutActions.FILTER_FAV:
      return {
        ...lastState,
        isFavSelected: action.isFavSelected,
      };

    default:
      return lastState;
  }
}
