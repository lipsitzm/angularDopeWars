import { Pipe, PipeTransform } from '@angular/core';
import numeral from 'numeral';

@Pipe({name: 'percentFormatPipe'})
export class PercentFormatPipe implements PipeTransform {
  transform(value: number): number {
        return numeral(value).format('(0,0.00%)');
  }
}
