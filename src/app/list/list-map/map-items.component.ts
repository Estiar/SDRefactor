import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  Output,
  EventEmitter,
} from '@angular/core';
import { AgmMap, GoogleMapsAPIWrapper } from '@agm/core';
import { SelectionItem } from '../selection-item.model';
import { NgRedux } from '@angular-redux/store';
import { SelectionActions } from '../../store/selection.actions';

import { Subscription } from 'rxjs/Subscription';
import { filter } from 'rxjs/operators';
import { AppState } from '../../store/AppState.interface';
import { isUndefined } from 'util';
import { LayoutActions } from 'app/store/layout.actions';

declare let google;

@Component({
  selector: 'app-map-items',
  templateUrl: './map-items.component.html',
  styleUrls: ['./map-items.component.scss'],
  providers: [GoogleMapsAPIWrapper],
})
export class MapItemsComponent implements OnInit, OnDestroy, AfterViewInit {
  static readonly unselectedMarkerIcon = '/assets/images/pin/pin-red.svg';
  static readonly unselectedFavMarkerIcon =
    '/assets/images/pin/pin-red-heart.svg';
  static readonly selectedMarkerIcon = '/assets/images/pin/pin-blue.svg';
  static readonly selectedFavMarkerIcon =
    '/assets/images/pin/pin-blue-heart.svg';

  static readonly unselectedCircleIcon = '/assets/images/map-circle-red.svg';
  static readonly unselectedFavCircleIcon =
    '/assets/images/map-circle-red-heart.svg';
  static readonly selectedCircleIcon = '/assets/images/map-circle-blue.svg';
  static readonly selectedFavCircleIcon =
    '/assets/images/map-circle-blue-heart.svg';

  @Output() markerClicked = new EventEmitter<null>();

  @ViewChild('map', { static: false }) map: AgmMap;

  subscriptions: Array<Subscription> = [];
  rawMap: any;
  displayItems: Array<object>;
  showContactInfo: boolean;

  boundsList: any;

  constructor(
    private selectionActions: SelectionActions,
    private store: NgRedux<AppState>,
    private layoutActions: LayoutActions
  ) {}

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  ngOnInit() {
    this.subscriptions.push(
      this.store
        .select(state => state.selectionsState)
        .pipe(filter(item => !isUndefined(item)))
        .subscribe(item => {
          if (item.previousSelection && !item.currentSelection)
            this.unselect(item.previousSelection);
          else if (item.currentSelection)
            this.processItemClick(
              item.currentSelection,
              item.previousSelection
            );
        })
    );

    this.subscriptions.push(
      this.store
        .select(state => state.layoutState)
        .subscribe(item => {
          if (!this.rawMap || !item || item.subsystem !== 'map') return;

          if (
            item.message === 'reset-zoom' &&
            this.displayItems &&
            this.displayItems.length > 0
          ) {
            this.configurePoi();
            this.selectionActions.unselect();
            const bounds = new google.maps.LatLngBounds();

            this.displayItems.forEach((dataItem: any) => {
              bounds.extend({
                lat: +dataItem.geocode.Latitude,
                lng: +dataItem.geocode.Longitude,
              });
              this.rawMap.setCenter({
                lat: +dataItem.geocode.Latitude,
                lng: +dataItem.geocode.Longitude,
              });
            });
            this.rawMap.fitBounds(bounds);
          }
        })
    );
  }

  onMapReady(map) {
    this.rawMap = map;
    this.setMap();
  }

  /**
   * Temporary solution for fit map bounds.
   */
  fitBounds() {
    setTimeout(() => {
      this.rawMap.fitBounds(this.boundsList);
    }, 200);
  }

  setMap() {
    let selections = Array<SelectionItem>();
    this.subscriptions.push(
      this.store
        .select(state => state.resultsState)
        .subscribe(item => {
          if (!item || !item.unfiltered) return;

          this.showContactInfo = item.showContactInfo;
          this.removeMarkers(selections);
          selections = Array<SelectionItem>();
          this.displayItems = item.DisplayResults();

          const bounds = new google.maps.LatLngBounds();

          this.displayItems.map((dataItem: any) => {
            bounds.extend({
              lat: +dataItem.geocode.Latitude,
              lng: +dataItem.geocode.Longitude,
            });

            selections.push(
              this.loadSelection(dataItem, {
                lat: +dataItem.geocode.Latitude,
                lng: +dataItem.geocode.Longitude,
              })
            );
          });
          this.selectionActions.saveSelections(selections);
          this.layoutActions.mapLoadComplete();
          this.rawMap.fitBounds(bounds);
          this.boundsList = bounds;
        })
    );
  }

  ngAfterViewInit() {}

  configurePoi() {
    if (this.showContactInfo) return;

    const styles = {
      hide: [
        {
          featureType: 'poi.business',
          stylers: [{ visibility: 'off' }],
        },
      ],
    };

    this.rawMap.setOptions({ styles: styles['hide'] });
  }

  removeMarkers(selections: Array<SelectionItem>): void {
    selections.map(s => {
      s.gMarker.setMap(null);
    });
  }

  getMarkerIcon(dataItem: SelectionItem, selected: boolean = false) {
    let icon = '';
    if (!this.showContactInfo) {
      if (selected) {
        icon = MapItemsComponent.selectedCircleIcon;
        if (dataItem.favorite) icon = MapItemsComponent.selectedFavCircleIcon;
      } else {
        icon = MapItemsComponent.unselectedCircleIcon;
        if (dataItem.favorite) icon = MapItemsComponent.unselectedFavCircleIcon;
      }
    } else {
      if (selected) {
        icon = MapItemsComponent.selectedMarkerIcon;
        if (dataItem.favorite) icon = MapItemsComponent.selectedFavMarkerIcon;
      } else {
        icon = MapItemsComponent.unselectedMarkerIcon;
        if (dataItem.order > 0)
          icon = icon.replace('.svg', '-' + dataItem.order + '.svg');
        if (dataItem.favorite) icon = MapItemsComponent.unselectedFavMarkerIcon;
      }
    }
    return icon;
  }

  loadSelection(dataItem: any, position: any) {
    const marker = new google.maps.Marker({
      position: { lat: position.lat, lng: position.lng },
      map: this.rawMap,
      icon: this.getMarkerIcon(dataItem),
    });

    marker.addListener('click', () => {
      this.selectionActions.select(dataItem.propertyID);
      this.markerClicked.emit();
    });

    return new SelectionItem(
      dataItem.propertyID,
      position.lat,
      position.lng,
      marker,
      dataItem.favorite,
      dataItem.order
    );
  }

  unselect(selectionItem: SelectionItem) {
    selectionItem.gMarker.setIcon(this.getMarkerIcon(selectionItem));
  }

  processItemClick(
    currentSelection: SelectionItem,
    previousSelection: SelectionItem
  ) {
    if (!this.rawMap) {
      return;
    }

    this.rawMap.panTo(
      new google.maps.LatLng(currentSelection.lat, currentSelection.lng)
    );
    this.rawMap.setZoom(16);

    if (previousSelection)
      previousSelection.gMarker.setIcon(this.getMarkerIcon(previousSelection));
    currentSelection.gMarker.setIcon(
      this.getMarkerIcon(currentSelection, true)
    );
  }
}
