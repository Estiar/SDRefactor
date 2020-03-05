import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { ErrorHandler, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatSidenavModule,
  MatSliderModule,
  MatTabsModule,
  MatSlideToggleModule,
} from '@angular/material';

import { ListItemsComponent } from './components/list/list-items/list-items.component';
import { ListItemDetailsComponent } from './components/list/list-item-details/list-item-details.component';
import { MapItemsComponent } from './components/list/list-map/map-items.component';
import { DevToolsExtension, NgReduxModule } from '@angular-redux/store';
import { SelectionActions } from './store/selection.actions';
import { ListMainComponent } from './components/list/list-main/list-main.component';
import { ResultsActions } from './store/results.actions';
import { ListItemGalleryComponent } from './components/list/list-item-gallery/list-item-gallery.component';
import { ListFilterBedroomComponent } from './components/list/filters/bedroom/bedroom.component';
import { ListFilterPriceComponent } from './components/list/filters/price/price.component';
import { TipFreeServiceComponent } from './components/list/list-splash/list-splash';
import { GlobalErrorHandler } from './GlobalErrorHandler';
import { LoggingService } from './LoggingService';
import { AccessDeniedComponent } from './components/access-denied/access-denied.component';
import { FavoriteComponent } from './components/list/filters/favorite/favorite.component';
import { HttpClientModule } from '@angular/common/http';
import { FooterComponent } from './components/footer/footer.component';
import { CardComponent } from './components/list/list-items/locator-item/locator-item.component';
import { VendorItemComponent } from './components/list/list-items/vendor-item/vendor-item.component';
import { LocatorDetailsComponent } from './components/list/list-item-details/locator-details/locator-details.component';
import { VendorDetailsComponent } from './components/list/list-item-details/vendor-details/vendor-details.component';
// tslint:disable-next-line: max-line-length
import { LocatorDetailsLinksComponent } from './components/list/list-item-details/locator-details/locator-details-links/locator-details-links.component';
// tslint:disable-next-line: max-line-length
import { LocatorDetailsSubheadingComponent } from './components/list/list-item-details/locator-details/locator-details-subheading/locator-details-subheading.component';
// tslint:disable-next-line: max-line-length
import { LocatorDetailsPhotosComponent } from './components/list/list-item-details/locator-details/locator-details-photos/locator-details-photos.component';
// tslint:disable-next-line: max-line-length
import { LocatorDetailsFaviconComponent } from './components/list/list-item-details/locator-details/locator-details-favicon/locator-details-favicon.component';
// tslint:disable-next-line: max-line-length
import { LocatorDetailsNotesComponent } from './components/list/list-item-details/locator-details/locator-details-notes/locator-details-notes.component';
import { AgmConfiguredModule } from './shared/_shared';
import { AppRoutingModule } from './app-routing.module';
import { ListMainMapSwitchComponent } from './components/list/list-main/list-main-map-switch/list-main-map-switch.component';
import { LayoutActions } from './store/layout.actions';
// tslint:disable-next-line: max-line-length
import { LocatorDetailsSpecialsComponent } from './components/list/list-item-details/locator-details/locator-details-specials/locator-details-specials.component';
// tslint:disable-next-line: max-line-length
import { LocatorDetailsFloorplansComponent } from './components/list/list-item-details/locator-details/locator-details-floorplans/locator-details-floorplans.component';
// tslint:disable-next-line: max-line-length
import { LocatorDetailsExtraInfoComponent } from './components/list/list-item-details/locator-details/locator-details-extra-info/locator-details-extra-info.component';
// tslint:disable-next-line: max-line-length
import { LocatorDetailsAmenitiesComponent } from './components/list/list-item-details/locator-details/locator-details-amenities/locator-details-amenities.component';
// tslint:disable-next-line: max-line-length
import { VendorDetailsManagerComponent } from './components/list/list-item-details/vendor-details/vendor-details-manager/vendor-details-manager.component';
// tslint:disable-next-line: max-line-length
import { VendorDetailsRegionalComponent } from './components/list/list-item-details/vendor-details/vendor-details-regional/vendor-details-regional.component';
// tslint:disable-next-line:max-line-length
import { ListMainExpandMapSwitchComponent } from './components/list/list-main/list-main-expand-map-switch/list-main-expand-map-switch.component';
import { ImageBigViewComponent } from './components/list/image-big-view/image-big-view.component';
import { ImageArrowComponent } from './components/list/image-big-view/image-arrow/image-arrow.component';
import { ListService } from './services/list.service';
import { PropertyService } from './services/property.service';

@NgModule({
  declarations: [
    AppComponent,
    ListItemsComponent,
    ListItemDetailsComponent,
    MapItemsComponent,
    ListMainComponent,
    ListItemGalleryComponent,
    ListFilterBedroomComponent,
    ListFilterPriceComponent,
    TipFreeServiceComponent,
    AccessDeniedComponent,
    FavoriteComponent,
    FooterComponent,
    CardComponent,
    VendorItemComponent,
    LocatorDetailsComponent,
    VendorDetailsComponent,
    LocatorDetailsLinksComponent,
    LocatorDetailsSubheadingComponent,
    LocatorDetailsPhotosComponent,
    LocatorDetailsFaviconComponent,
    LocatorDetailsNotesComponent,
    ListMainMapSwitchComponent,
    LocatorDetailsSpecialsComponent,
    LocatorDetailsFloorplansComponent,
    LocatorDetailsExtraInfoComponent,
    LocatorDetailsAmenitiesComponent,
    VendorDetailsManagerComponent,
    VendorDetailsRegionalComponent,
    ListMainExpandMapSwitchComponent,
    ImageBigViewComponent,
    ImageArrowComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatTabsModule,
    AgmConfiguredModule,
    NgReduxModule,
  ],
  providers: [
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    LoggingService,
    DevToolsExtension,
    ListService,
    PropertyService,
    SelectionActions,
    ResultsActions,
    LayoutActions,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
