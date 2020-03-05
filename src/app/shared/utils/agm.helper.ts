import { AgmCoreModule, LAZY_MAPS_API_CONFIG } from '@agm/core';
import { Injectable, NgModule } from '@angular/core';

function getLoadBalanceKey() {
  let loadBalanceKey = '';
  const day = new Date().getDate();
  if (day < 7) loadBalanceKey = 'AIzaSyA4hkIsfdAF_1_arxJrjhp8_sh8yZpThfk';
  else if (day >= 7 && day < 14)
    loadBalanceKey = 'AIzaSyBNGjUOCPx3Xj-HaTo8xmfC8V5mIoie738';
  else if (day >= 14 && day < 22)
    loadBalanceKey = 'AIzaSyDJ5222kFjHGLaYeDqdQBeWbdgXStgUEv4';
  else loadBalanceKey = 'AIzaSyBq96V6cGGC4vEu8vxdMXLDukqsM6BnElk';
  return loadBalanceKey;
}

@Injectable()
export class GoogleMapsConfig {
  apiKey: string;
  constructor() {
    this.apiKey = getLoadBalanceKey() || '';
  }
}

@NgModule({
  imports: [AgmCoreModule.forRoot()],
  providers: [{ provide: LAZY_MAPS_API_CONFIG, useClass: GoogleMapsConfig }],
  exports: [AgmCoreModule],
})
export class AgmConfiguredModule {}
