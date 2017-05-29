import {Observable} from 'rxjs/Observable';

import {DrugInfo} from '../models/drugInfo';

export interface IDrugTransaction {
  drug: DrugInfo;
  maxAmount: number;
  curDrugCount: number;

  changeToBuyModal: Observable<boolean>;
  changeToSellModal: Observable<boolean>;
}
