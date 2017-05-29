import {DifficultyLevel} from '../models/difficultyLevel';
import {PurchasedDrug} from '../models/purchasedDrug'
import {DrugInfo} from '../models/drugInfo'

export class PlayerInfo {
  private startingMoney : number;
  public BackpackSpace : number = 0;
  public BackpackSize : number = 0;
  public Money : number = 0;
  public Drugs : Map<string, PurchasedDrug> = new Map();
  public LoanOutstanding : number = 0;
  public InterestRate : number = 0;

  ResetPlayer(difficultyLevel : DifficultyLevel) : void {
    this.BackpackSpace = difficultyLevel.StartingBackpackSize;
    this.BackpackSize = difficultyLevel.StartingBackpackSize; // Is this really needed? Basically just used to make the displaying of the size easier...
    this.Money = this.startingMoney = difficultyLevel.StartingMoney;
    this.Drugs = new Map();
    this.LoanOutstanding = difficultyLevel.LoanOutstanding;
    this.InterestRate = difficultyLevel.InterestRate;
  }

  GetMaxPossibleToBuy(pricePerDrug : number) : number {
    let max = Math.floor(this.Money / pricePerDrug);
    return max > this.BackpackSpace ? this.BackpackSpace : max;
  }

  get Profit() : number {
    return this.Money - this.LoanOutstanding;
    // Still on the fence of whether or not I should subtract the starting money from this or not...
  }

  GetBackpackDrugCount(drug : DrugInfo) : number {
    if(this.Drugs.has(drug.Name)) {
      let purchasedDrug : PurchasedDrug = this.Drugs.get(drug.Name);
      return purchasedDrug.BackpackCount;
    } else {
      return 0;
    }
  }

  GetPurchasedDrug(drug : DrugInfo) : PurchasedDrug {
    if(this.Drugs.has(drug.Name)) {
      return this.Drugs.get(drug.Name);
    } else {
      return new PurchasedDrug(0,0);
    }
  }

  BuyDrug(drug : DrugInfo, count : number, price : number) : string {
    if (this.BackpackSpace - count < 0) {
      return 'You can\'t fit that much ' + drug.Name + ' in your backpack! The cops would see it if it\'s hanging out like that.';
    }

    let drugCost = price * count;
    if(this.Money < drugCost) {
      return 'You don\'t have enough cash for that much ' + drug.Name + '. If you rip off your supplier, you\'ll never be able to buy from them again.';
      // Idea: Let people rip off their supplier then never have drugs available in this town again...
    }

    let purchasedDrug : PurchasedDrug;
    if(this.Drugs.has(drug.Name)) {
      purchasedDrug = this.Drugs.get(drug.Name);
      purchasedDrug.Update(count, drug.Price);
    } else {
      purchasedDrug = new PurchasedDrug(count, drug.Price);
    }
    this.Drugs.set(drug.Name, purchasedDrug);

    this.BackpackSpace -= count;
    this.Money -= drugCost;
    return null; // Don't like that null is the success retVal, but it's an error msg being return otherwise so it does work... Go back to throwing?
  }

  SellDrug(drug : DrugInfo, count : number, price : number) : string {
    if(!this.Drugs.has(drug.Name)) {
      return 'You don\'t have any ' + drug.Name + ' to sell... Try finding a college kid to mug first.';
    } else {
      let purchasedDrug : PurchasedDrug = this.Drugs.get(drug.Name);
      if(purchasedDrug.BackpackCount - count < 0) {
        return 'You don\'t have that much ' + drug.Name + ' to sell. You tryin\' to your supplier off?';
        // Idea: Allow people to rip off their supplier... Or maybe cut the drug down? Get 2/3's the price? Something like that?
      } else if(purchasedDrug.BackpackCount - count === 0) {
        this.Drugs.delete(drug.Name);
      } else {
        purchasedDrug.Update(count * -1, 0); // We don't want to change the high purchase price if not all the drugs were sold
        this.Drugs.set(drug.Name, purchasedDrug);
      }
    }

    this.BackpackSpace += (+count);

    if(price === undefined) { // If price wasn't passed in, fail-over to the drug's
      price = drug.Price;
    }

    this.Money += (count * price);

    return null; // Don't like this for the same reason as above, but again, it works for now.
  }

  IncreaseLoanAmount() : void {
    this.LoanOutstanding = Math.floor(this.LoanOutstanding * (1 + this.InterestRate));
  }

  PayOffLoan(payDownAmount : number) : string {
    if(this.Money < payDownAmount) {
      return 'You don\'t have that much money, watch out for your knees if you\'re trying to rip off your bookie!';
    }

    this.Money -= payDownAmount;
    this.LoanOutstanding -= payDownAmount;
  }
}
