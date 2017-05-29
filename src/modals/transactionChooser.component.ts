import { Component, AfterViewChecked, ViewChild, Input, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { PubSubService } from 'angular2-pubsub';

import {Observable} from 'rxjs/Observable';
import {ReplaySubject} from 'rxjs/ReplaySubject';

import {IDrugTransaction} from './drugTransaction.interface';

import {PlayerService} from '../services/playerService'
import {PlayerInfo} from '../models/playerInfo'
import {DrugInfo} from '../models/drugInfo'

@Component({
  selector: 'transaction-chooser-modal-content',
  templateUrl: './transactionChooser.component.html'
})
export class TransactionChooserContent implements IDrugTransaction {
  @Input() drug : DrugInfo = null;
  @Input() maxAmount : number = null;
  curDrugCount: number;

  private changeToBuyModalSource = new ReplaySubject<boolean>();
  private changeToSellModalSource = new ReplaySubject<boolean>();

  @Output() changeToBuyModal: Observable<boolean> = this.changeToBuyModalSource.asObservable();
  @Output() changeToSellModal: Observable<boolean> = this.changeToSellModalSource.asObservable();

  constructor(public activeModal: NgbActiveModal) {}

  goToBuy() {
    this.changeToBuyModalSource.next(true);
  }

  goToSell(){
    this.changeToSellModalSource.next(true);
  }

  cancel() {
    this.activeModal.close();
  }
}
