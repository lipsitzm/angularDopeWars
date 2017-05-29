export class CityInfo {
  constructor(private name : string, private availabilityThreshold : Number) {}

  get Name() {
    return this.name;
  }

  get AvailabilityThreshold() {
    return this.availabilityThreshold;
  }
}
