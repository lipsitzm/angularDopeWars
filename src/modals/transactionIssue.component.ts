import { Component, AfterViewChecked, ViewChild, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { PubSubService } from 'angular2-pubsub';

import {PlayerService} from '../services/playerService'
import {PlayerInfo} from '../models/playerInfo'
import {DrugInfo} from '../models/drugInfo'

@Component({
  selector: 'transaction-issue-modal-content',
  templateUrl: './transactionIssue.component.html'
})
export class TransactionIssueContent implements AfterViewChecked {
  @Input() drugInfo : DrugInfo = null;
  @Input() maxAmount : number = null;

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
    this.player.BuyDrug(this.drugInfo, this.buyAmount, this.drugInfo.Price);

    this.pubsub.$pub('drugInBackpackChanged', this.drugInfo);

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
