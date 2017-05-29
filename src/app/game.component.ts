import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { PubSubService } from 'angular2-pubsub';
import { Subscription } from 'rxjs/Subscription';

import {GameEngine} from '../engines/gameEngine';
import {SurpriseContent} from '../modals/surprise.component';

@Component({
  selector: 'game',
  templateUrl: './game.component.html'
})
export class Game implements OnInit, OnDestroy {
  private surpriseTriggered : boolean = false;
  private surpriseTitle : string;
  private surpriseModalView : string;
  private surpriseModalModel : {};
  private surprisesTriggeredSub : Subscription = null;

  constructor(private pubsub: PubSubService,
              private route : ActivatedRoute,
              private modalService: NgbModal,
              private gameEngine : GameEngine) { }

  ngOnInit() {
    this.surprisesTriggeredSub = this.pubsub.$sub('surprisesTriggered').subscribe((surpriseResults) => {
      const modalRef = this.modalService.open(SurpriseContent);
      modalRef.componentInstance.Results = surpriseResults;
    });

    this.route.params
      .switchMap((params: Params) =>  {
        let daysParam = +params['totalDays'];
        let diffParam = params['difficultyLevel'];

        return new Promise((resolve, reject) => {
          resolve({totalDays: daysParam, diffLevel: diffParam});
        });
      })
      .subscribe((processedParams: any) => {
        if(processedParams.totalDays === NaN || processedParams.diffLevel === undefined) {
          return;
        }
        let matchingDayOpts = this.gameEngine.DayOptions.filter(dOpt => {
            return dOpt.TotalDays === processedParams.totalDays;
          });
        if (matchingDayOpts.length === 1) {
          this.gameEngine.CurrentDayOption = matchingDayOpts[0];
        } else {
          throw 'Found multiple matching Day Options for the given Total Days.';
        }

        let matchingDiffLevels = this.gameEngine.DifficultyLevels.filter(dLevel => {
          return dLevel.Name === processedParams.diffLevel;
        });

        if (matchingDiffLevels.length === 1) {
          this.gameEngine.CurrentDifficultyLevel = matchingDiffLevels[0];
        } else {
          throw 'Found multiple matching Difficulty Levels for the given Name.';
        }

        this.gameEngine.ResetGame();
      });
  }

  ngOnDestroy() {
		this.surprisesTriggeredSub.unsubscribe();
	}

  cancel() {
    this.surpriseTriggered = false;
  }
}
