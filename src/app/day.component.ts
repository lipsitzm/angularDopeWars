import { Component, Input } from '@angular/core';

@Component({
  selector: 'day',
  templateUrl: './day.component.html'
})
export class Day {
  @Input() current_day : number = 0;
  @Input() max_days : number = 0;
  @Input() is_last_day : boolean = false;
}
