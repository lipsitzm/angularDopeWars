import { Pipe, PipeTransform } from '@angular/core';
import numeral from 'numeral';

@Pipe({name: 'customCurrencyPipe'})
export class CustomCurrencyPipe implements PipeTransform {
  transform(value: number): number {
    return numeral(value).format('$-0,0');
  }
}
