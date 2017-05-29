import { Component, AfterViewChecked, ViewChild, Input, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { PubSubService } from 'angular2-pubsub';
import {Observable} from 'rxjs/Observable';

import {IDrugTransaction} from './drugTransaction.interface';

import {PlayerService} from '../services/playerService'
import {PlayerInfo} from '../models/playerInfo'
import {DrugInfo} from '../models/drugInfo'

@Component({
  selector: 'sell-drug-modal-content',
  templateUrl: './sellDrug.component.html'
})
export class SellDrugContent implements IDrugTransaction, AfterViewChecked {
  @Input() drug : DrugInfo = null;
  @Input() maxAmount : number = null;
  @Input() curDrugCount: number;

  @Output() changeToBuyModal: Observable<boolean>;
  @Output() changeToSellModal: Observable<boolean>;

  private player : PlayerInfo = null;
  private sellAmount : number = null;

  private sellDrugForm: NgForm;
  @ViewChild('sellDrugForm') currentForm: NgForm;

  private formErrors = {
    'sellAmount': ''
  };

  validationMessages = {
    'sellAmount': {
      'required':      'An amount is required.',
      'minValue':      'You can\'t sell that few drugs.',
      'maxValue':      'You don\'t have that many drugs to sell.'
    }
  };

  constructor(private pubsub: PubSubService,
              public activeModal: NgbActiveModal,
              private playerService: PlayerService) {
    this.playerService.GetPlayer().then(player => {
      this.player = player;
      this.sellAmount = this.curDrugCount;
    });
  }

  private sellDrugs() {
    this.player.SellDrug(this.drug, this.sellAmount, this.drug.Price);

    this.pubsub.$pub('drugInBackpackChanged', this.drug);

    this.activeModal.close();
  }

  cancel() {
    this.activeModal.close();
  }

  ngAfterViewChecked() {
    this.formChanged();
  }

  formChanged() {
    if (this.currentForm === this.sellDrugForm) { return; }
    this.sellDrugForm = this.currentForm;
    if (this.sellDrugForm) {
      this.sellDrugForm.valueChanges
        .subscribe(data => this.onValueChanged(data));
    }
  }

  onValueChanged(data?: any) {
    if (!this.sellDrugForm) { return; }
    const form = this.sellDrugForm.form;

    for (const field in this.formErrors) {
      // clear previous error message (if any)
      this.formErrors[field] = '';
      const control = form.get(field);

      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }
  }
}
