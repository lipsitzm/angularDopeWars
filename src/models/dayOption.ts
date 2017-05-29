export class DayOption {
  private totalDays: Number;
  private name: string;

  constructor(totalDaysIn: Number) {
    this.totalDays = totalDaysIn;
    this.name = totalDaysIn + " Days";
  }

  get TotalDays() {
    return this.totalDays;
  }

  get Name() {
    return this.name;
  }
}
