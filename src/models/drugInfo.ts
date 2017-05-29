export class DrugInfo {
  private updateThreshold = (newPrice) => {
    let curThreshold = this.ThresholdLevel;
    // With the drugService Surprises allowing outlier prices, we need to colorize those as well
    if(newPrice >= this.MaxPrice) {
      this.ThresholdLevel = 4;
    } else if (newPrice <= this.MinPrice) {
      this.ThresholdLevel = 0;
    } else {
      // Otherwise we can just figure out the band that this price would fall in and color it that way
      this.ThresholdLevel = Math.floor((this.Price - this.MinPrice) / (this.MaxPrice - this.MinPrice) * 100 / 20);
    }

    this.thresholdLevelBandsChanged = this.ThresholdLevel - curThreshold;
  };

  public price : number = null;
  public Available : boolean = true;
  public ThresholdLevel : number = 2;
  public directionChange : string = 'even';
  public thresholdLevelBandsChanged : number = 0;

  constructor(public Name : string, public MinPrice : number, public MaxPrice : number){
  }

  get PriceChangeDirectionAndThresholdChangeClasses() {
    return {
      'fa fa-arrow-down': this.directionChange === 'down',
      'fa fa-arrow-up': this.directionChange === 'up',
      'noBands' : this.thresholdLevelBandsChanged == 0,
      'oneBand' : this.thresholdLevelBandsChanged == 1,
      'twoBands' : this.thresholdLevelBandsChanged == 2,
      'threeBands' : this.thresholdLevelBandsChanged == 3,
      'fourBands' : this.thresholdLevelBandsChanged == 4
    }
  }

  get ThresholdColorClass() {
    return {
      'cheapest-drug-cost' : this.ThresholdLevel == 0,
      'middle-cheapest-drug-cost' : this.ThresholdLevel == 1,
      'middle-drug-cost' : this.ThresholdLevel == 2,
      'middle-expensive-drug-cost' : this.ThresholdLevel == 3,
      'most-expensive-drug-cost' : this.ThresholdLevel == 4
    };
  }

  get Price() {
    return this.price;
  }

  set Price(newVal) {
    if(this.price !== null) { // Don't change the directionChange from even if we're setting the price for the first time
      this.directionChange = newVal > this.price ? 'up' : (newVal < this.price ? 'down' : 'even');
    }

    this.price = newVal;
    this.updateThreshold(newVal);
  }
}
