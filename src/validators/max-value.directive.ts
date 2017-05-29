import { Directive, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator, ValidatorFn, Validators } from '@angular/forms';

export function maxValueValidator(maxNum: number): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} => {
    const val = +control.value;
    const no = val > maxNum;
    return no ? {'maxValue': {val}} : null;
  };
}

@Directive({
  selector: '[maxValue]',
  providers: [{provide: NG_VALIDATORS, useExisting: MaxValueValidatorDirective, multi: true}]
})
export class MaxValueValidatorDirective implements Validator, OnChanges {
  @Input() maxValue: number;
  private valFn = Validators.nullValidator;

  ngOnChanges(changes: SimpleChanges): void {
    const change = changes['maxValue'];
    if (change) {
      const val: number = change.currentValue;
      this.valFn = maxValueValidator(val);
    } else {
      this.valFn = Validators.nullValidator;
    }
  }

  validate(control: AbstractControl): {[key: string]: any} {
    return this.valFn(control);
  }
}
