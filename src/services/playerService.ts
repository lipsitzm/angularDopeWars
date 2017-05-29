import { Injectable } from '@angular/core';
import { PubSubService } from 'angular2-pubsub';

import {PlayerInfo} from '../models/playerInfo';
import {DrugService} from '../services/drugService';
import {DrugInfo} from '../models/drugInfo';
import numeral from 'numeral';

@Injectable()
export class PlayerService {
  private drugList : DrugInfo[] = [];
  private player : PlayerInfo = new PlayerInfo();

  constructor(private pubsub: PubSubService, private drugService : DrugService) {
    this.drugService.GetDrugList().then(drugListIn => {
      this.drugList = drugListIn;
    });
  }

  GetPlayer() : Promise<PlayerInfo> {
    return new Promise( // Faking out a promise in case down the road this becomes an actual server call
     (resolve, reject) => {
        resolve(this.player);
      });
  }

  SurpriseFindDrugsOnSubway() : Promise<string> {
    return new Promise( // Faking out a promise in case down the road this becomes an actual server call
     (resolve, reject) => {
        let idx = Math.floor(Math.random() * (this.drugList.length + 1));
        let drug = this.drugList[idx];
        let drugsToFind = Math.floor(this.player.BackpackSpace / 10 * 1.5);
        if(drugsToFind > 0) {
          this.player.BuyDrug(drug, drugsToFind, 0);

          this.pubsub.$pub('drugInBackpackChanged', drug);

          resolve('You saw a dead guy on the subway so you checked his pockets and found ' + drugsToFind + ' ' + drug.Name + '!');
        } else {
          resolve('You saw a dead guy on the subway with a ton of drugs on him, but your backpack was already full so you had to gave em all to the homeless guy next to you.');
        }
      }
    );
  }

  SurpriseGetMugged() : Promise<string> {
    return new Promise( // Faking out a promise in case down the road this becomes an actual server call
     (resolve, reject) => {
        for (let drug of this.drugList) {
          let drugsOnPlayer = this.player.GetBackpackDrugCount(drug);
          if(drugsOnPlayer > 0) {
            this.player.SellDrug(drug, Math.ceil(drugsOnPlayer / 2), 0);

            this.pubsub.$pub('drugInBackpackChanged', drug);
          }
        }

        this.player.Money = Math.floor(this.player.Money / 2);
        resolve('You got jumped in the middle the middle of the night! They stole half of all your drugs and money!');
      }
    );
  }

  SurpriseFindMoney() : Promise<string> {
    return new Promise( // Faking out a promise in case down the road this becomes an actual server call
      (resolve, reject) => {
        let moneyToAdd = Math.floor(Math.random() * ((this.player.Money / 2) - 1) + 1);
        this.player.Money = this.player.Money + moneyToAdd;
        resolve('You found a briefcase on the subway with ' + numeral(moneyToAdd).format('($0,0)') + ' in it!');
      }
    );
  }

  SurpriseBiggerBackpack() : Promise<string> {
    return new Promise( // Faking out a promise in case down the road this becomes an actual server call
      (resolve, reject) => {
        let spaceToAdd = Math.floor(Math.random() * ((this.player.BackpackSize / 5) - 1) + 1);
        if(spaceToAdd <= 1) {
          spaceToAdd = 2; // Don't want to deal with singular vs plural messages
        }
        this.player.BackpackSize = this.player.BackpackSize + spaceToAdd;
        this.player.BackpackSpace = this.player.BackpackSpace + spaceToAdd;
        resolve('You were on your way to your next customer and found a new backpack with space for ' + spaceToAdd + ' more drugs in it!');
      }
    );
  }
}
