export class Surprise {
  constructor(private threshold : number,
              private serviceName : string,
              private functionName : string,
              private functionArguments : any) { }

  get Threshold() {
    return this.threshold;
  }

  get ServiceName() {
    return this.serviceName;
  }

  get FunctionName() {
    return this.functionName;
  }

  get FunctionArguments() {
    return this.functionArguments;
  }
}
