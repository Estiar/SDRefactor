import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PropertyService } from '../../property.service';
import { ListService } from '../../list.service';
import { AppState } from '../../../store/AppState.interface';
import { NgRedux } from '@angular-redux/store';
import { SelectionActions } from '../../../store/selection.actions';
import { Subscription } from 'rxjs/Subscription';
import { isNullOrUndefined } from 'util';
import { LoggingService } from '../../../LoggingService';
import { isNotNullOrUndefined, PropertyModel } from 'app/shared/_shared';
import { GalleryEvent } from './models/interfaces';
import { LayoutActions } from 'app/store/layout.actions';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-list-item-details-locator-details',
  templateUrl: './locator-details.component.html',
  styleUrls: ['./locator-details.component.scss'],
})
export class LocatorDetailsComponent implements OnInit, OnDestroy {
  static readonly MAX_NOTES_LENGTH = 130;

  subscriptions: Array<Subscription> = [];

  propertyID;
  propertyData: PropertyModel = null;
  agentInfo;

  isNotesExpanded;
  isSchoolsVisible;
  isGalleryVisible;
  displayFloorplans = [];
  showAllAmenities;

  constructor(
    private route: ActivatedRoute,
    private renderer: Renderer2,
    private router: Router,
    private propertyService: PropertyService,
    private listService: ListService,
    private store: NgRedux<AppState>,
    private selectionService: SelectionActions,
    private loggingService: LoggingService,
    private layoutActions: LayoutActions
  ) {}

  get phone() {
    return this.propertyData && this.propertyData.phone
      ? `tel:${this.propertyData.phone
          .replace('(', '')
          .replace('-', '')
          .replace(')', '')
          .trim()}`
      : '';
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  ngOnInit() {
    this.subscriptions.push(
      this.route.params
        .switchMap(params => this.route.params)
        .subscribe(params => {
          this.propertyID = +params.propertyID;
          this.propertyService.load(
            this.listService.ListID,
            this.propertyID,
            this.listService.Token
          );
        })
    );

    // todo: move this to a route resolver
    if (!this.listService || !this.listService.IsReady) {
      this.loadList();
    } else {
      this.agentInfo = this.listService.AgentInfo;
    }

    // todo: move to route resolver.
    this.loadProperty();
    this.loadGallery();
  }

  public goBack() {
    this.router
      .navigate(['../'], {
        relativeTo: this.route,
        fragment: 'p-' + this.propertyID.toString(),
      })
      .then(() => {
        this.layoutActions.mapResetZoom();
      });
  }

  private loadProperty() {
    this.subscriptions.push(
      this.propertyService.subscription
        .pipe(isNotNullOrUndefined())
        .subscribe((data: any) => {
          if (data.error) {
            this.router.navigate(['/access-denied']);
            return;
          }

          this.propertyData = data;
          this.displayFloorplans = this.propertyData.floorplans; // todo: apply filter here.
          this.propertyData.displayNotes = this.propertyData.notes;
          if (
            this.propertyData.displayNotes.length >
            LocatorDetailsComponent.MAX_NOTES_LENGTH
          )
            this.propertyData.displayNotes =
              this.propertyData.notes.substring(
                0,
                LocatorDetailsComponent.MAX_NOTES_LENGTH
              ) + '...';

          if (this.propertyData.highValueAmenities.length === 0)
            this.showAllAmenities = true;
        })
    );
  }

  private loadGallery() {
    this.subscriptions.push(
      this.store
        .select(state => state.layoutState)
        .pipe(
          filter(
            item => !isNullOrUndefined(item) && !isNullOrUndefined(item.index)
          )
        )

        .subscribe(item => (this.isGalleryVisible = item.index >= 0))
    );
  }

  private loadList() {
    this.subscriptions.push(
      this.listService.subscription
        .pipe(isNotNullOrUndefined())
        .subscribe(() => {
          this.selectionService.select(this.propertyID);
          this.agentInfo = this.listService.AgentInfo;
        })
    );
  }

  showRemainingAmenities() {
    this.showAllAmenities = true;
  }

  expandNotes() {
    this.propertyData.displayNotes = this.propertyData.notes;
    this.isNotesExpanded = true;
  }

  showGallery(data: GalleryEvent) {
    if (!data.visible) {
      this.layoutActions.hideGallery();
      return;
    }

    if (data.url) data.url = data.url.replace('/micros/', '/standard/');
    else data.url = this.propertyData.photos[0];

    this.layoutActions.displayPhoto(data.url, this.propertyData.photos);
  }

  toggleFloorplanPhoto(floorplan) {
    if (this.displayFloorplans.length === 1) {
      this.displayFloorplans = [].concat(this.propertyData.floorplans);
    } else if (floorplan.photoUrl !== '') {
      this.displayFloorplans = [].concat(floorplan);
    }
  }

  toggleFav(state: boolean) {
    this.propertyData.favorite = state;
    this.subscriptions.push(
      this.listService
        .toggleFavorite(this.propertyID, this.propertyData.favorite)
        .subscribe(
          () => {},
          error => {
            this.loggingService.logException(
              'ListItemDetailsComponent.toggleFav()',
              '',
              error
            );
          }
        )
    );
  }
}
