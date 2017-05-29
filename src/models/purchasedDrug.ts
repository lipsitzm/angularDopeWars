import numeral from 'numeral';

export class PurchasedDrug {
  private backpackCount : numeral = 0;
  HighestBuyPrice = 0;

  constructor(count : number, price : number) {
    this.backpackCount = numeral(count);
    this.HighestBuyPrice = price;
  }

  Update(count : number, price : number) {
    this.backpackCount = this.backpackCount.add(count);
    this.HighestBuyPrice = (price > this.HighestBuyPrice ? price : this.HighestBuyPrice);
  }

  get BackpackCount() : number {
    return this.backpackCount.format();
  }
}
