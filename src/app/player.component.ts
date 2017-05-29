import { Component, Input } from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

import {LoanDebtContent} from '../modals/debt.component';
import {PlayerInfo} from '../models/playerInfo';

@Component({
  selector: 'player',
  templateUrl: './player.component.html'
})
export class Player {
  @Input() player_info : PlayerInfo = null;

  constructor(private modalService: NgbModal) {}

  showDebtDialog() {
    const modalRef = this.modalService.open(LoanDebtContent);
  }
}
