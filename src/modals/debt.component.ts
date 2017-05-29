import { Component, AfterViewChecked, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {PlayerService} from '../services/playerService'
import {PlayerInfo} from '../models/playerInfo'

@Component({
  selector: 'debt-modal-content',
  templateUrl: './debt.component.html'
})
export class LoanDebtContent implements AfterViewChecked {
  private player : PlayerInfo = null;
  private paymentAmount : number = null;
  private maxAmount : number = null;

  private loanForm: NgForm;
  @ViewChild('loanForm') currentForm: NgForm;

  private formErrors = {
    'paymentAmount': ''
  };

  validationMessages = {
    'paymentAmount': {
      'required':      'An amount is required.',
      'minValue':      'You can\'t get more money from the loan shark.',
      'maxValue':      'You can\'t pay the loan shark more money than you have or owe.'
    }
  };

  constructor(public activeModal: NgbActiveModal, private playerService: PlayerService) {
    this.playerService.GetPlayer().then(player => {
      this.player = player;
      this.preparePaymentAmount();
      this.maxPaymentAmount();
    });
  }

  private maxPaymentAmount() {
    this.maxAmount = this.player.Money > this.player.LoanOutstanding ? this.player.LoanOutstanding : this.player.Money;
  }

  private preparePaymentAmount() {
    this.paymentAmount = this.player.Money > this.player.LoanOutstanding ? this.player.LoanOutstanding : this.player.Money;
  }

  private payDebt() {
    this.player.PayOffLoan(this.paymentAmount);
    this.preparePaymentAmount(); // Reset the payment amount in case the user opens the dialog again
    this.maxPaymentAmount();
    this.activeModal.close();
  }

  cancel() {
    this.activeModal.close();
  }

  ngAfterViewChecked() {
    this.formChanged();
  }

  formChanged() {
    if (this.currentForm === this.loanForm) { return; }
    this.loanForm = this.currentForm;
    if (this.loanForm) {
      this.loanForm.valueChanges
        .subscribe(data => this.onValueChanged(data));
    }
  }

  onValueChanged(data?: any) {
    if (!this.loanForm) { return; }
    const form = this.loanForm.form;

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
