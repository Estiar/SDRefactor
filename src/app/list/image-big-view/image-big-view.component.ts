import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgRedux } from '@angular-redux/store';
import { AppState } from 'app/store/AppState.interface';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-image-big-view',
  templateUrl: './image-big-view.component.html',
  styleUrls: ['./image-big-view.component.scss'],
})
export class ImageBigViewComponent implements OnInit, OnDestroy {
  private _unsubscribe$ = new Subject<void>();

  images: string[] = [];
  imageIndex = 0;

  constructor(private store: NgRedux<AppState>) {}

  ngOnInit() {
    return this.store
      .select(state => state.layoutState)
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe(state => {
        this.images = state.images;
        this.imageIndex = state.imageIndex;
      });
  }

  ngOnDestroy() {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
  }

  handleNext(direction: 'up' | 'down') {
    switch (direction) {
      case 'up':
        const up = this.imageIndex + 1;
        if (up < this.images.length) {
          this.imageIndex++;
        }
        break;

      case 'down':
        const down = this.imageIndex - 1;

        if (down >= 0) {
          this.imageIndex--;
        }
        break;

      default:
        break;
    }
  }

  get imageSrc() {
    if (this.images && this.images.length > 0) {
      return this.images[this.imageIndex];
    }

    return '';
  }
}
