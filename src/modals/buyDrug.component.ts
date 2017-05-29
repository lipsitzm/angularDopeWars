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
  selector: 'buy-drug-modal-content',
  templateUrl: './buyDrug.component.html'
})
export class BuyDrugContent implements IDrugTransaction, AfterViewChecked {
  @Input() drug : DrugInfo = null;
  @Input() maxAmount : number = null;
  curDrugCount: number;

  @Output() changeToBuyModal: Observable<boolean>;
  @Output() changeToSellModal: Observable<boolean>;

  private player : PlayerInfo = null;
  private buyAmount : number = null;

  private buyDrugForm: NgForm;
  @ViewChild('buyDrugForm') currentForm: NgForm;

  private formErrors = {
    'buyAmount': ''
  };

  validationMessages = {
    'buyAmount': {
      'required':      'An amount is required.',
      'minValue':      'You can\'t buy that few drugs.',
      'maxValue':      'You can\'t afford to buy that many drugs.'
    }
  };

  constructor(private pubsub: PubSubService,
              public activeModal: NgbActiveModal,
              private playerService: PlayerService) {
    this.playerService.GetPlayer().then(player => {
      this.player = player;
      this.prepareBuyAmount();
    });
  }

  private buyDrugs() {
    this.player.BuyDrug(this.drug, this.buyAmount, this.drug.Price);

    this.pubsub.$pub('drugInBackpackChanged', this.drug);

    this.activeModal.close();
  }

  private prepareBuyAmount() {
    this.buyAmount = this.maxAmount;
  }

  cancel() {
    this.activeModal.close();
  }

  ngAfterViewChecked() {
    this.formChanged();
  }

  formChanged() {
    if (this.currentForm === this.buyDrugForm) { return; }
    this.buyDrugForm = this.currentForm;
    if (this.buyDrugForm) {
      this.buyDrugForm.valueChanges
        .subscribe(data => this.onValueChanged(data));
    }
  }

  onValueChanged(data?: any) {
    if (!this.buyDrugForm) { return; }
    const form = this.buyDrugForm.form;

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
