import { Injectable } from '@angular/core';
import {DayOption} from '../models/dayOption';

@Injectable()
export class DayService {
  private dayOptions: DayOption[] = [
    //new DayOption(4),
    new DayOption(30),
    new DayOption(60),
    new DayOption(90),
    new DayOption(120)
  ];

  GetDayOptions() : Promise<DayOption[]> {
    return new Promise( // Faking out a promise in case down the road this becomes an actual server call
      (resolve, reject) => {
        resolve(this.dayOptions);
      });
  }
}
