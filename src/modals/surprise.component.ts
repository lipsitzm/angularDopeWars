import { Component, Input } from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'surprise-modal-content',
  templateUrl: './surprise.component.html'
})
export class SurpriseContent {
  @Input() Results : string[] = [];

  constructor(public activeModal: NgbActiveModal) {
  }

  cancel() {
    this.activeModal.close();
  }
}
