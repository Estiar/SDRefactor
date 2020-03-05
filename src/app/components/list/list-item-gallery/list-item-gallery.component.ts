import { Component, OnDestroy, OnInit } from '@angular/core';
import { LayoutActions } from 'app/store/layout.actions';
import { PropertyService } from 'app/services/property.service';

@Component({
  selector: 'app-list-item-gallery',
  templateUrl: './list-item-gallery.component.html',
  styleUrls: ['./list-item-gallery.component.scss'],
})
export class ListItemGalleryComponent implements OnInit, OnDestroy {
  property$;
  propertyData;

  constructor(
    private propertyService: PropertyService,
    private layoutActions: LayoutActions
  ) {}

  ngOnDestroy() {
    this.property$.unsubscribe();
  }

  ngOnInit() {
    this.property$ = this.propertyService.subscription.subscribe(
      (data: any) => {
        if (!data) return;

        this.propertyData = data;
      }
    );
  }

  showGallery(url) {
    this.layoutActions.displayPhoto(
      url.replace('/previews/', '/standard/'),
      this.propertyData.photos
    );
  }
}
