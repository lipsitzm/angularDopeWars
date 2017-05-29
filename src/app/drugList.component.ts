import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { PubSubService } from 'angular2-pubsub';
import { Subscription } from 'rxjs/Subscription';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

import {DrugTransactionComponent} from '../modals/drugTransaction.component';

import {PlayerService} from '../services/playerService';
import {DrugService} from '../services/drugService';
import {CityInfo} from '../models/cityInfo';
import {PlayerInfo} from '../models/playerInfo';
import {DrugInfo} from '../models/drugInfo';

@Component({
  selector: 'drug-list',
  templateUrl: './drugList.component.html'
})
export class DrugList implements OnInit, OnDestroy {
  private modalTitle : string = "";
  private modalView : string = "";
  @Input() modalModel = null;
  private showing : boolean = false;
  private DrugsAvailable : boolean = false;

  private player : PlayerInfo = null
  private drugViewModels : any[] = [];
  private drugInBackpackChangedSub : Subscription = null;

  constructor(private pubsub: PubSubService, private modalService: NgbModal, private playerService : PlayerService, private drugService : DrugService) {
    this.playerService.GetPlayer().then(player => {
      this.player = player;
    });

    this.drugService.GetDrugList().then(drugList => {
      this.ResetDrugViewModels(drugList);
    });
  }

  ngOnInit() {
    this.drugInBackpackChangedSub = this.pubsub.$sub('drugInBackpackChanged').subscribe((drug) => {
      for(let drugVM of this.drugViewModels) {
        if(drugVM.Drug.Name === drug.Name) {
          let purchasedDrug = this.player.GetPurchasedDrug(drug);
          drugVM.BackpackCount = purchasedDrug.BackpackCount;
          drugVM.HighestBuyPrice = purchasedDrug.HighestBuyPrice;
          break;
        }
      }
    });

    this.drugInBackpackChangedSub = this.pubsub.$sub('resetDrugsInBackpack').subscribe((drugList) => {
      this.ResetDrugViewModels(drugList);
    });
  }

	ngOnDestroy() {
		this.drugInBackpackChangedSub.unsubscribe();
		this.drugInBackpackChangedSub.unsubscribe();
	}

  ResetDrugViewModels(drugList) {
    let vms = [];
    for(let drug of drugList) {
      vms.push({
        Drug: drug,
        BackpackCount: 0,
        HighestBuyPrice: 0
      });
    }
    this.drugViewModels = vms;
  }

  ShowBuySellIssueDialog(drug) {
    this.modalModel = {
      Drug: drug,
      DrugList: this
    };
    if(this.player.BackpackSpace === 0) {
      this.modalTitle = 'No More Space';
      this.modalModel.Reason = 1;
    } else {
      this.modalTitle = 'Not Enough Money and Nothing To Sell';
      this.modalModel.Reason = 2;
    }
    this.modalView = 'drugViews/buySellIssue';
    this.showing = true;
  }

  ShowDrugDialog(drug) {
    const modalRef = this.modalService.open(DrugTransactionComponent);
    let purchasedDrug = this.player.GetPurchasedDrug(drug);
    modalRef.componentInstance.drugInfo = drug;
    modalRef.componentInstance.curDrugCount = purchasedDrug.BackpackCount;
  }

  cancel() {
    this.showing = false;
  }
}
