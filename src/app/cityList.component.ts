import { Component } from '@angular/core';

import {GameEngine} from '../engines/gameEngine';

@Component({
  selector: 'city-list',
  templateUrl: './cityList.component.html'
})
export class CityList {
  constructor(private gameEngine : GameEngine) {}

  MoveCity(index) {
    this.gameEngine.MoveCity(index);
  }
}
