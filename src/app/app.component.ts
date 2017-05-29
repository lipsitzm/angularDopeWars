import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import {DayService} from '../services/dayService';
import {DayOption} from '../models/dayOption';

import {DifficultyLevelsService} from '../services/difficultyService';
import {DifficultyLevel} from '../models/difficultyLevel';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private route : ActivatedRoute, private router : Router, private dayService : DayService, private difficultyLevelsService : DifficultyLevelsService)
  {}

  ngOnInit() {
    this.route.params
      .switchMap((params: Params) =>  {
        let daysParam = +params['totalDays'];
        let diffParam = params['difficultyLevel'];

        return new Promise((resolve, reject) => {
          resolve({days: daysParam, diff: diffParam});
        });
      })
      .subscribe((processedParams: any) => {
        let promisesAry : Promise<any[]>[] = [this.dayService.GetDayOptions(), this.difficultyLevelsService.GetDifficultyLevels()];
        Promise.all(promisesAry).then(
            resultsAry => {
              if (resultsAry.length != 2) {
                throw 'Expected 2 arrays to be resolved from Service promises';
              }
              if (resultsAry[0].length < 1 && resultsAry[0][0] instanceof DayOption) {
                throw 'Expected at least one Day Option to load as a default';
              }
              if (resultsAry[1].length < 1 && resultsAry[1][0] instanceof DifficultyLevel) {
                throw 'Expected at least one Difficulty Level to load as a default';
              }

              this.router.navigate(["/game",  {
                totalDays: resultsAry[0][0].TotalDays,
                difficultyLevel: resultsAry[1][0].Name
              }]);
              // this.totalDays = resultsAry[0][0].TotalDays;
              // this.difficultyLevel = resultsAry[1][0].Name;
            }
        )
      });
  }
}
