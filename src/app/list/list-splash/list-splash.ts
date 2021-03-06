import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {ListService} from '../list.service';

@Component({
  selector: 'app-tip-free-service',
  templateUrl: './list-splash.html',
  styleUrls: ['./list-splash.scss']
})
export class TipFreeServiceComponent implements OnInit, OnDestroy {
  list$;
  agentName;
  agentCompany;
  splash;

  @Output() close = new EventEmitter();

  constructor(private listService: ListService) {
  }

  ngOnDestroy() {
    this.list$.unsubscribe();
  }

  ngOnInit() {
    this.list$ = this.listService.subscription.subscribe((data: any) => {
      if (!data) return;

      this.agentCompany = data.agentInfo.company;
      this.agentName = data.agentInfo.firstname + ' ' + data.agentInfo.lastname;
      this.splash = data.agentInfo.splashMessage;
    });
  }

  onClose() {
    this.close.emit();
  }
}
