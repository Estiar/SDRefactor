import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppState } from '../../../../store/AppState.interface';
import { NgRedux } from '@angular-redux/store';
import { SelectionActions } from '../../../../store/selection.actions';
import { Subscription } from 'rxjs/Subscription';
import { isNullOrUndefined } from 'util';
import { isNotNullOrUndefined } from 'app/shared/_shared';
import { LayoutActions } from 'app/store/layout.actions';
import { filter } from 'rxjs/operators';
import { PropertyService } from 'app/services/property.service';
import { ListService } from 'app/services/list.service';

@Component({
  selector: 'app-list-item-details-vendor-details',
  templateUrl: './vendor-details.component.html',
  styleUrls: ['./vendor-details.component.scss'],
})
export class VendorDetailsComponent implements OnInit, OnDestroy {
  static readonly MAX_NOTES_LENGTH = 130;

  subscriptions: Array<Subscription> = [];

  propertyID;
  propertyData;

  isMgmtExpanded;
  isNotesExpanded;
  isGalleryVisible;
  showAllAmenities;
  specialClassification: string;

  constructor(
    private route: ActivatedRoute,
    private renderer: Renderer2,
    private router: Router,
    private propertyService: PropertyService,
    private listService: ListService,
    private store: NgRedux<AppState>,
    private selectionService: SelectionActions,
    private layoutActions: LayoutActions
  ) {}

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

  private getSpecialClassification(): string {
    if (this.propertyData.section8) return 'Section 8';
    if (this.propertyData.studentHousing) return 'Student Housing';
    if (this.propertyData.seniroHousing) return 'Senior Housing';

    return '';
  }

  private loadProperty() {
    this.subscriptions.push(
      this.propertyService.subscription
        .pipe(isNotNullOrUndefined())
        .subscribe((data: any) => {
          if (data.error) {
            this.router.navigate(['/access-denied']).then();
            return;
          }

          this.propertyData = data;
          this.specialClassification = this.getSpecialClassification();
          this.propertyData.displayNotes = this.propertyData.notes;
          if (
            this.propertyData.displayNotes.length >
            VendorDetailsComponent.MAX_NOTES_LENGTH
          )
            this.propertyData.displayNotes =
              this.propertyData.notes.substring(
                0,
                VendorDetailsComponent.MAX_NOTES_LENGTH
              ) + '...';

          if (this.propertyData.highValueAmenities.length === 0)
            this.showAllAmenities = true;

          if (this.propertyData.propertyID === 0) {
            this.propertyData.management += ' Offices';
            this.expandMgmt();
          }
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

  expandMgmt() {
    this.isMgmtExpanded = true;
  }

  showGallery(visible, url) {
    if (!visible) {
      this.layoutActions.hideGallery();
      return;
    }

    if (url) url = url.replace('/micros/', '/standard/');
    else url = this.propertyData.photos[0];

    this.layoutActions.displayPhoto(url, this.propertyData.photos);

    this.initAlbum();
  }

  initAlbum() {
    const inputElement = this.renderer.selectRootElement(
      'i.fa.fa-times-circle'
    );
    this.renderer.listen(inputElement, 'click', () => {
      this.layoutActions.hideGallery();
    });
  }
}
