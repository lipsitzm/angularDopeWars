import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[drug-transaction]',
})
export class DrugTransactionDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}
