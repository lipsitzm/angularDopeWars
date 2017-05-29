import { Directive, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator, ValidatorFn, Validators } from '@angular/forms';

export function minValueValidator(minNum: number): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} => {
    const val = +control.value;
    const no = val < minNum;
    return no ? {'minValue': {val}} : null;
  };
}

@Directive({
  selector: '[minValue]',
  providers: [{provide: NG_VALIDATORS, useExisting: MinValueValidatorDirective, multi: true}]
})
export class MinValueValidatorDirective implements Validator, OnChanges {
  @Input() minValue: number;
  private valFn = Validators.nullValidator;

  ngOnChanges(changes: SimpleChanges): void {
    const change = changes['minValue'];
    if (change) {
      const val: number = change.currentValue;
      this.valFn = minValueValidator(val);
    } else {
      this.valFn = Validators.nullValidator;
    }
  }

  validate(control: AbstractControl): {[key: string]: any} {
    return this.valFn(control);
  }
}
