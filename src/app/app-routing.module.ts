import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListMainComponent } from './list/list-main/list-main.component';
import { ListItemsComponent } from './list/list-items/list-items.component';
import { ListItemDetailsComponent } from './list/list-item-details/list-item-details.component';
import { AccessDeniedComponent } from './access-denied/access-denied.component';

const appRoutes: Routes = [
  {
    path: ':listID/:token',
    component: ListMainComponent,
    children: [
      { path: '', component: ListItemsComponent },
      { path: ':propertyID', component: ListItemDetailsComponent },
    ],
  },
  {
    path: 'access-denied',
    component: AccessDeniedComponent,
    data: { title: 'Access Denied' },
  },
  {
    path: '**',
    redirectTo: '/access-denied',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, { enableTracing: false })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
