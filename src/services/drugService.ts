import { Injectable } from '@angular/core';
import {DrugInfo} from '../models/drugInfo';
import {CityInfo} from '../models/cityInfo';

let drugs = [
  new DrugInfo("Acid", 1000, 3000),
  new DrugInfo("Cocaine", 10000, 30000),
  new DrugInfo("Hashish", 800, 1500),
  new DrugInfo("Heroin", 6000, 20000),
  new DrugInfo("Ludes", 25, 100),
  new DrugInfo("Meth", 25, 100),
  new DrugInfo("MDMA", 1000, 4000),
  new DrugInfo("Opium", 500, 1250),
  new DrugInfo("PCP", 750, 2000),
  new DrugInfo("Peyote", 100, 750),
  new DrugInfo("Shrooms", 100, 1250),
  new DrugInfo("Speed", 50, 200),
  new DrugInfo("Weed", 50, 200)
];

let doPriceMath = (minPrice : number, maxPrice : number) => {
  return Math.floor(Math.random() * (maxPrice - minPrice) + minPrice);
};

let surpriseUpdateDrugPrice = (minFunc : (d:DrugInfo) => number, maxFunc : (d:DrugInfo) => number) => {
  // Going through the drugs randomly but need the loop to make sure I'm working on one that's available
  let drugToCheck;
  for (let i = drugs.length - 1; i > 0; i--) {
    let idx = Math.floor(Math.random() * (i + 1));
    drugToCheck = drugs[idx];

    if(drugToCheck.Available) {
      drugToCheck.Price = doPriceMath(minFunc(drugToCheck), maxFunc(drugToCheck));
      break;
    }
  }
  return drugToCheck
};

@Injectable()
export class DrugService {

  GetDrugList() : Promise<DrugInfo[]> {
    return new Promise( // Faking out a promise in case down the road this becomes an actual server call
      (resolve, reject) => {
        resolve(drugs);
      });
  }

  GetNewPrice(drug : DrugInfo) : Promise<number> {
    return new Promise( // Faking out a promise in case down the road this becomes an actual server call
      (resolve, reject) => {
        drug.Price = doPriceMath(drug.MinPrice, drug.MaxPrice);
        resolve(drug.Price);
      });
  }

  GetNewAvailability(city : CityInfo, drug : DrugInfo) : Promise<boolean> {
    return new Promise( // Faking out a promise in case down the road this becomes an actual server call
      (resolve, reject) => {
        drug.Available = Math.random() >= city.AvailabilityThreshold;
        resolve(drug.Available);
      });
  }

  SurpriseMakeRandomAvailableDrugMoreExpensive() : Promise<string> {
    return new Promise( // Faking out a promise in case down the road this becomes an actual server call
      (resolve, reject) => {
        let drugToCheck = surpriseUpdateDrugPrice((drug) => { return drug.MaxPrice }, (drug) => { return drug.MaxPrice * 2 });
        resolve('The cops seized tons of ' + drugToCheck.Name + ' making it unreal expensive!');
      });
  }

  SurpriseMakeRandomAvailableDrugCheaper() : Promise<string> {
    return new Promise( // Faking out a promise in case down the road this becomes an actual server call
      (resolve, reject) => {
        let drugToCheck = surpriseUpdateDrugPrice((drug) => { return drug.MinPrice / 2 }, (drug) => { return drug.MinPrice });
        resolve('Someone broke into the evidence locker at the police station and stole a ton of ' + drugToCheck.Name + ' making it beyond cheap!');
      });
  }
}
