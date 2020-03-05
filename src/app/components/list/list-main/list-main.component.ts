import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  HostListener,
} from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { ResultsActions } from '../../../store/results.actions';
import { NgRedux } from '@angular-redux/store';
import { AppState } from '../../../store/AppState.interface';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';

import { Title } from '@angular/platform-browser';

import { filter } from 'rxjs/operators';
import { isNotNullOrUndefined, XS_SCREEN } from 'app/shared/_shared';
import { isNullOrUndefined } from 'util';
import { LayoutActions } from 'app/store/layout.actions';
import { MatDrawer } from '@angular/material';
import { MapItemsComponent } from '../list-map/map-items.component';
import { animationShow } from './configs/animations';

import { SafeResourceUrl } from '@angular/platform-browser';
import { PropertyService } from 'app/services/property.service';
import { ListService } from 'app/services/list.service';
export interface INgxGalleryImage {
  small?: string | SafeResourceUrl;
  medium?: string | SafeResourceUrl;
  big?: string | SafeResourceUrl;
  description?: string;
  url?: string;
  label?: string;
}
export declare class NgxGalleryImage implements INgxGalleryImage {
  small?: string | SafeResourceUrl;
  medium?: string | SafeResourceUrl;
  big?: string | SafeResourceUrl;
  description?: string;
  url?: string;
  label?: string;
  constructor(obj: INgxGalleryImage);
}

@Component({
  selector: 'app-list-main',
  templateUrl: './list-main.component.html',
  styleUrls: ['./list-main.component.scss'],
  animations: [animationShow],
})
export class ListMainComponent implements OnInit, OnDestroy {
  galleryImages: NgxGalleryImage[];
  subscriptions: Array<Subscription> = [];

  @ViewChild('drawer', { static: false })
  drawer: MatDrawer;

  @ViewChild('mapRef', { static: false })
  mapRef: MapItemsComponent;

  showWelcome: 'never' | 'show' | 'shown' = 'never';
  showAlbum = false;
  showMap = true;
  showSideNav = true;
  mobileVersion = false;
  showExpandButton = false;
  screenWidth = 0;
  mapOpened = false;

  constructor(
    private route: ActivatedRoute,
    private listService: ListService,
    private propertyService: PropertyService,
    private resultsActions: ResultsActions,
    private store: NgRedux<AppState>,
    private layoutActions: LayoutActions,
    private router: Router,
    private title: Title
  ) {}

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (this.showWelcome === 'show') {
      return;
    }

    this.manageSlider(window.innerWidth);
  }

  private manageSlider(width: number) {
    this.screenWidth = width;
    if (this.screenWidth < XS_SCREEN) {
      if (!this.mobileVersion) {
        this.mobileVersion = true;
      }
    } else if (this.screenWidth >= XS_SCREEN) {
      this.mapOpened = false;
      this.mobileVersion = false;
      this.showExpandButton = false;

      if (this.drawer && !this.drawer.opened) {
        this.drawer.toggle();
      }
      if (this.mapRef) {
        this.mapRef.fitBounds();
      }
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  scrollToTop() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        const contentContainer =
          <any>(
            document.querySelector(
              '.mat-sidenav.mat-sidenav-opened.mat-sidenav-side'
            )
          ) || window;
        contentContainer.scrollTop = 0;
      });
  }

  ngOnInit() {
    this.manageSlider(window.innerWidth);
    this.scrollToTop();
    this.loadList();

    this.subscriptions.push(
      this.store
        .select(state => state.layoutState)
        .subscribe(item => {
          if (
            item &&
            item.subsystem === 'map' &&
            item.message === 'load-complete'
          ) {
            this.onMapLoaded();
          }

          if (
            item &&
            item.subsystem === 'photo-gallery' &&
            item.message === 'close'
          ) {
            this.hideGallery();
          }

          if (!item || item.index == null) return;

          if (item.index < 0) {
            this.showAlbum = false;
            this.showMap = true;
            return;
          }

          this.showWelcome = 'shown';
          this.showAlbum = true;
          this.showMap = false;
        })
    );

    this.galleryImages = [];
    this.subscriptions.push(
      this.propertyService.subscription
        .pipe(filter(data => data && data.photos && data.photos.length))
        .subscribe((data: any) => {
          this.configureGallery(data.photos);
        })
    );

    this.subscriptions.push(
      this.store
        .select(state => state.selectionsState)
        .pipe(
          filter(
            item =>
              !isNullOrUndefined(item) &&
              !isNullOrUndefined(item.currentSelection)
          )
        )
        .subscribe(item => {
          this.router.navigate([item.currentSelection.propertyID], {
            relativeTo: this.route,
          });
        })
    );
  }

  onToggle(opened: boolean) {
    if (!this.showMap) {
      this.showMap = true;
    }
    this.mapOpened = opened;
    if (opened && this.mapRef) {
      this.mapRef.fitBounds();
    }
    this.showExpandButton = false;
  }

  onMapZoomedIn() {
    if (this.showSideNav) {
      this.showExpandButton = true;
    }

    if (this.mobileVersion && this.drawer && !this.drawer.opened) {
      this.mapOpened = false;
      this.showExpandButton = false;
      this.drawer.toggle();
    }
  }

  onExpandMap() {
    if (this.mapRef) {
      this.mapRef.fitBounds();
      this.showExpandButton = false;
    }
  }

  private configureGallery(photos) {
    this.galleryImages = [];
    photos.forEach(url => {
      this.galleryImages = this.galleryImages.concat({
        small: url.replace('/standard/', '/micros/'),
        medium: url.replace('/standard/', '/previews/'),
        big: url,
      });
    });
  }

  private loadList() {
    if (
      !this.route.snapshot.paramMap.has('listID') ||
      !this.route.snapshot.paramMap.has('token')
    )
      return;

    this.listService.load(
      +this.route.snapshot.paramMap.get('listID'),
      this.route.snapshot.paramMap.get('token'),
      this.route.snapshot.queryParams['receipt']
    );

    this.subscriptions.push(
      this.listService.subscription
        .pipe(isNotNullOrUndefined())
        .subscribe((data: any) => {
          if (data.error) this.router.navigate(['/access-denied']);

          this.title.setTitle(data.agentInfo.company);
          this.resultsActions.save(
            data.records,
            data.showContactInfo,
            data.agentInfo
          );
          this.layoutActions.mapResetZoom();
        })
    );
  }

  onMapLoaded() {
    this.layoutActions.mapResetZoom();
    if ('receipt' in this.route.parent.snapshot.queryParams) {
      this.showSideNav = false;
      if (this.showWelcome === 'never') {
        this.showSplashScreen();
      } else {
        this.showWelcome = 'shown';
      }
    }
  }

  hideGallery() {
    this.showWelcome = 'shown';
    this.showAlbum = false;
    this.showMap = true;
  }

  private showSplashScreen() {
    this.showMap = false;
    this.showWelcome = 'show';
  }

  closeSplashScreen() {
    this.showWelcome = 'shown';
    this.showSideNav = true;
    this.showMap = true;

    setTimeout(() => {
      this.drawer.toggle();
    }, 200);

    this.manageSlider(window.innerWidth);

    if (this.showMap && this.mapRef) {
      this.mapRef.fitBounds();
    }
  }

  get needToShowGallery() {
    return !this.showMap && this.showWelcome !== 'show';
  }

  get needToShowMenuIcon() {
    return (
      this.mobileVersion &&
      !this.showAlbum &&
      this.mapOpened &&
      this.showWelcome !== 'show'
    );
  }

  get needToShowMapIcon() {
    return (
      this.mobileVersion &&
      !this.showAlbum &&
      !this.mapOpened &&
      this.showWelcome !== 'show'
    );
  }

  get needToShowExpandMapIcon() {
    return this.mobileVersion && this.showExpandButton && !this.showAlbum;
  }
}
