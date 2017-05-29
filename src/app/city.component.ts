import { Component, Input } from '@angular/core';

import {CityInfo} from '../models/cityInfo'
import {DrugInfo} from '../models/drugInfo'

@Component({
  selector: 'city',
  templateUrl: './city.component.html'
})
export class City {
  @Input() city_info : CityInfo = null;
  @Input() drug_list : DrugInfo[] = null;
  @Input() drugs_available : boolean = false;
}
