import { Component, Input, AfterViewInit, OnDestroy, ViewChild, ComponentFactoryResolver, Type, ChangeDetectorRef } from '@angular/core';

import {Subscription} from 'rxjs/Subscription';

import {BuyDrugContent} from './buyDrug.component'
import {SellDrugContent} from './sellDrug.component'
import {TransactionChooserContent} from './transactionChooser.component'
import {TransactionIssueContent} from './transactionIssue.component'

import {DrugTransactionDirective} from './drugTransaction.directive'
import {IDrugTransaction} from './drugTransaction.interface'

import {PlayerService} from '../services/playerService';
import {PlayerInfo} from '../models/playerInfo';
import {DrugInfo} from '../models/drugInfo'

@Component({
  selector: 'drug-transaction-modal',
  templateUrl: './drugTransaction.component.html'
})
export class DrugTransactionComponent implements AfterViewInit, OnDestroy {
  @Input() drugInfo : DrugInfo = null;

  @ViewChild(DrugTransactionDirective) drugTransaction: DrugTransactionDirective;

  private player : PlayerInfo = null
  private buyModalSubscription : Subscription;
  private sellModalSubscription : Subscription;

  constructor(private _componentFactoryResolver: ComponentFactoryResolver,
              private cdr: ChangeDetectorRef,
              private playerService : PlayerService) {
    this.playerService.GetPlayer().then(player => {
      this.player = player;
    });
  }

  ngAfterViewInit() {
    this.loadComponent();
  }

  ngOnDestroy() {
    if(this.buyModalSubscription !== undefined) {
      this.buyModalSubscription.unsubscribe();
    }
    if(this.buyModalSubscription !== undefined) {
      this.sellModalSubscription.unsubscribe();
    }
  }

  public loadComponent(forceBuy? : boolean, forceSell? : boolean) {
    let content : Type<any> = null;

    let curDrugCount : number = this.player.GetBackpackDrugCount(this.drugInfo);
    let maxToBuy : number = this.player.GetMaxPossibleToBuy(this.drugInfo.Price);

    if(forceBuy) {
      content = BuyDrugContent;
    }
    else if (forceSell) {
      content = SellDrugContent;
    } else {
      if(curDrugCount > 0) {
        if(maxToBuy > 0)
        {
          content = TransactionChooserContent;
        } else {
          content = SellDrugContent;
        }
      } else if(curDrugCount === 0) {
        if(maxToBuy > 0) {
          content = BuyDrugContent;
        } else {
          content = TransactionIssueContent;
        }
      }
    }

    if(content != null)
    {
      this.resolveComponent(content, curDrugCount, maxToBuy);
    }
  }

  private resolveComponent(component : Type<any>, curDrugCount : number, maxArmoun : number) {
    let componentFactory = this._componentFactoryResolver.resolveComponentFactory(component);

    let viewContainerRef = this.drugTransaction.viewContainerRef;
    viewContainerRef.clear();

    let componentRef = viewContainerRef.createComponent(componentFactory);
    (<IDrugTransaction>componentRef.instance).drug = this.drugInfo;
    (<IDrugTransaction>componentRef.instance).curDrugCount = curDrugCount;
    (<IDrugTransaction>componentRef.instance).maxAmount = maxArmoun;

    if((<IDrugTransaction>componentRef.instance).changeToBuyModal !== undefined) {
      this.buyModalSubscription = (<IDrugTransaction>componentRef.instance).changeToBuyModal.subscribe(changeIt => {
        this.loadComponent(changeIt);
      });
    }
    if((<IDrugTransaction>componentRef.instance).changeToSellModal !== undefined) {
      this.sellModalSubscription = (<IDrugTransaction>componentRef.instance).changeToSellModal.subscribe(changeIt => {
        this.loadComponent(null, changeIt);
      });
    }

    this.cdr.detectChanges();
  }
}
