export class DifficultyLevel {

  constructor(private name : string,
              private startingMoney : number,
              private startingBackpackSize : number,
              private interestRate : number,
              private loanOutstanding : number) {
  }

  get Name() {
    return this.name;
  }

  get StartingMoney() {
    return this.startingMoney;
  }

  get StartingBackpackSize() {
    return this.startingBackpackSize;
  }

  get InterestRate() {
    return this.interestRate;
  }

  get LoanOutstanding() {
    return this.loanOutstanding;
  }
}
