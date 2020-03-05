import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { ResultsActions } from '../../../../store/results.actions';

@Component({
  selector: 'app-list-filter-price',
  templateUrl: './price.component.html',
  styleUrls: ['./price.component.scss'],
})
export class ListFilterPriceComponent implements OnInit, OnChanges {
  @Input() min;
  @Input() max;
  @Input() current;

  @Output() change = new EventEmitter();
  @ViewChild('maxRentSlider', { static: true }) slider;

  constructor(private resultsActions: ResultsActions) {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if ('max' in changes) {
      this.slider.min = this.min;
      this.slider.value = this.current;
      if (this.max > this.slider.max) this.slider.max = this.max;
    }
  }

  apply(max: number) {
    this.resultsActions.filter({ maxPrice: max });
    this.change.emit(max);
  }
}
