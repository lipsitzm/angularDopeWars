import { Injectable } from '@angular/core';

import { PubSubService } from 'angular2-pubsub';

import {CityService} from '../services/cityService';
import {CityInfo} from '../models/cityInfo';
import {DrugService} from '../services/drugService';
import {DrugInfo} from '../models/drugInfo';
import {PlayerService} from '../services/playerService';
import {PlayerInfo} from '../models/playerInfo';
import {DayService} from '../services/dayService';
import {DayOption} from '../models/dayOption';
import {DifficultyLevelsService} from '../services/difficultyService';
import {DifficultyLevel} from '../models/difficultyLevel';
import {SurpriseService} from '../services/surpriseService';
import {Surprise} from '../models/surprise';

@Injectable()
export class GameEngine {
  public DayOptions : DayOption[] = null;
  public CurrentDayOption : DayOption = null;
  public DifficultyLevels : DifficultyLevel[] = null;
  public CurrentDifficultyLevel : DifficultyLevel = null;
  public Cities : CityInfo[] = null;
  public Drugs : DrugInfo[] = null;
  public DrugsAvailable : boolean = false;
  public Player : PlayerInfo = null;
  public Surprises : Surprise[] = null;

  public CurrentDay : number = 1;
  public IsLastDay : boolean = false;
  public GameOver : boolean = false;
  public TriggerRestart : boolean = false;

  private CurrentCityIndex : number = 0;

  constructor(private pubsub: PubSubService,
              public cityService : CityService,
              public drugService : DrugService,
              public playerService : PlayerService,
              public dayService : DayService,
              public difficultyLevelsService : DifficultyLevelsService,
              public surpriseService : SurpriseService) {

    this.dayService.GetDayOptions().then(dayOptions => {
      this.DayOptions = dayOptions;
    });

    this.difficultyLevelsService.GetDifficultyLevels().then(diffLevels => {
      this.DifficultyLevels = diffLevels;
    });

    this.cityService.GetCityList().then(cities => {
      this.Cities = cities;
    });

    this.drugService.GetDrugList().then(drugList => {
      this.Drugs = drugList;
    });

    this.playerService.GetPlayer().then(player => {
      this.Player = player;
    });

    this.surpriseService.GetSurprises().then(surprises => {
      this.Surprises = surprises;
    });
  }

  get CurrentCity() : CityInfo {
    return this.Cities[this.CurrentCityIndex];
  }

  ResetGame() {
    this.CurrentCityIndex = Math.floor(Math.random() * this.Cities.length); // Start at a random city (0 indexed)
    this.CurrentDay = 1;
    this.Player.ResetPlayer(this.CurrentDifficultyLevel);

    this.pubsub.$pub('resetDrugsInBackpack', this.Drugs);

    this.IsLastDay = false;
    this.GameOver = false;
    this.UpdateDrugs();
    //this.TriggerSurprises(); Can't trigger these on the opening day because the modal tries to open too early... How to get around that?
    this.TriggerRestart = false;
  }

  ChangeDifficultyLevel(chosenDifficultyLevel : DifficultyLevel) {
    this.CurrentDifficultyLevel = chosenDifficultyLevel;
    this.ResetGame();
  }

  UpdateDrugs() {
    let promisesAry = [];
    for (let drug of this.Drugs) {
      promisesAry.push(this.drugService.GetNewPrice(drug));
      promisesAry.push(this.drugService.GetNewAvailability(this.CurrentCity, drug));
    }

    return Promise.all(promisesAry).then(resultsAry => {
      // Nothing to do here on the actual Drug objects as the DrugService sets the value on the drug itself
      // This feels like a code smell?

      // I feel like this logic could / should get pushed further down the stack...
      this.DrugsAvailable = false;
      for(let drug of this.Drugs) {
        if(drug.Available) {
          this.DrugsAvailable = true;
          break;
        }
      }
    });
  }

  UpdateDay() {
    this.CurrentDay++;
  }

  CheckIfReachedMaxDay() {
    return this.CurrentDay >= this.CurrentDayOption.TotalDays;
  }

  TriggerSurprises() {
    // Going through the surprises randomly to make sure that all have an equal chance of being triggered
    let surprisePromises = [];
    for (let i = this.Surprises.length - 1; i >= 0; i--) {
      let idx = Math.floor(Math.random() * (i + 1));
      let surpriseToCheck = this.Surprises[idx];

      if(Math.random() <= surpriseToCheck.Threshold) {
        // Add checks here to ensure that these things are all in existence

        surprisePromises.push(this[surpriseToCheck.ServiceName][surpriseToCheck.FunctionName](surpriseToCheck.FunctionArguments));
        break;
      }
    }

    Promise.all(surprisePromises).then(
      resultsAry => {
        if(resultsAry.length > 0) {
          this.pubsub.$pub('surprisesTriggered', resultsAry);
        }
      }
    );
  }

  MoveCity(idx) {
    if(this.IsLastDay) { // If we were already on the last day, that means that the player is triggering the end game
      this.GameOver = true;
      return;
    }

    // Force the player to move cities every day
    if(this.CurrentCityIndex === idx) {
      return;
    }

    this.UpdateDay();
    this.IsLastDay = this.CheckIfReachedMaxDay();

    this.CurrentCityIndex = idx;

    this.UpdateDrugs();

    this.Player.IncreaseLoanAmount();

    this.TriggerSurprises();
  }
}
