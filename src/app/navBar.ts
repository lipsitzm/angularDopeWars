import { Component } from '@angular/core';
import { Router } from '@angular/router';

import {GameEngine} from '../engines/gameEngine';
import {DayOption} from '../models/dayOption'
import {DifficultyLevel} from '../models/difficultyLevel'

@Component({
  selector: 'nav-bar',
  templateUrl: './navBar.html'
})
export class NavBar {
  private DayOptions : DayOption[] = null;
  private CurrentDayOption : DayOption = null;
  private DifficultyLevels : DifficultyLevel[];
  private CurrentDifficultyLevel : DifficultyLevel;

  constructor(private router : Router, private gameEngine : GameEngine) { }

  setDayOptionActiveClass(totalDays) {
    if(this.gameEngine.CurrentDayOption !== null) {
      return this.gameEngine.CurrentDayOption.TotalDays === totalDays ? 'active' : '';
    }
    return '';
  }

  setDifficultyLevelActiveClass(diffLevelName) {
    if(this.gameEngine.CurrentDifficultyLevel !== null) {
      return this.gameEngine.CurrentDifficultyLevel.Name === diffLevelName ? 'active' : '';
    }
    return '';
  }

  dayOptionChange(newDayOption) {
    console.log('new day option', newDayOption);
    this.router.navigate(["/game",  {
      totalDays: newDayOption.TotalDays,
      difficultyLevel: this.gameEngine.CurrentDifficultyLevel.Name
    }]);
  }

  difficultyLevelChange(newDiffLevel) {
    console.log('new diff level', newDiffLevel);
    this.router.navigate(["/game", {
      totalDays: this.gameEngine.CurrentDayOption.TotalDays,
      difficultyLevel: newDiffLevel.Name
    }]);
  }

  restartGame() {
    this.gameEngine.ResetGame();
  }
}
