import { Injectable } from '@angular/core';
import {Surprise} from '../models/surprise';

let surprises : Surprise[] = [
  // TODO: Make these adjustable with the difficulty level...
  new Surprise(.15, 'drugService', 'SurpriseMakeRandomAvailableDrugCheaper', null),
  new Surprise(.15, 'drugService', 'SurpriseMakeRandomAvailableDrugMoreExpensive', null),
  new Surprise(.25, 'playerService', 'SurpriseFindDrugsOnSubway', null),
  new Surprise(.05, 'playerService', 'SurpriseGetMugged', null),
  new Surprise(.05, 'playerService', 'SurpriseFindMoney', null),
  new Surprise(.05, 'playerService', 'SurpriseBiggerBackpack', null)
];

@Injectable()
export class SurpriseService {
  GetSurprises() : Promise<Surprise[]> {
    return new Promise( // Faking out a promise in case down the road this becomes an actual server call
      (resolve, reject) => {
        resolve(surprises);
      });
  }
}
