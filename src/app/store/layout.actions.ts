import { Injectable } from '@angular/core';
import { NgRedux } from '@angular-redux/store';
import { AppState } from './AppState.interface';

@Injectable()
export class LayoutActions {
  static readonly DISPLAY_PHOTO = 'DISPLAY_PHOTO';
  static readonly HIDE_GALLERY = 'HIDE_GALLERY';
  static readonly MAP_RESET_ZOOM = 'MAP_RESET_ZOOM';
  static readonly MAP_LOAD_COMPLETE = 'MAP_LOAD_COMPLETE';
  static readonly FILTER_FAV = 'FILTER_FAV';

  constructor(private store: NgRedux<AppState>) {}

  displayPhoto(selectedImageUrl: string, images: Array<string>) {
    this.store.dispatch({
      type: LayoutActions.DISPLAY_PHOTO,
      selectedImageUrl: selectedImageUrl,
      images: images,
    });
  }

  hideGallery() {
    this.store.dispatch({ type: LayoutActions.HIDE_GALLERY });
  }

  mapResetZoom() {
    this.store.dispatch({ type: LayoutActions.MAP_RESET_ZOOM });
  }

  mapLoadComplete() {
    this.store.dispatch({ type: LayoutActions.MAP_LOAD_COMPLETE });
  }

  toggleFavFilter(newState: boolean) {
    this.store.dispatch({
      type: LayoutActions.FILTER_FAV,
      isFavSelected: newState,
    });
  }
}
