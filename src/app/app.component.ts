import { Component } from '@angular/core';
import { DevToolsExtension, NgRedux } from '@angular-redux/store';
import { rootReducer } from './store/index';
import { AppState } from './store/AppState.interface';
import { InitialAppState } from './store/AppState.InitialState';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(
    private store: NgRedux<AppState>,
    private devTools: DevToolsExtension
  ) {
    this.store.configureStore(
      rootReducer,
      InitialAppState,
      [],
      [devTools.isEnabled() ? devTools.enhancer() : f => f]
    );
  }
}
