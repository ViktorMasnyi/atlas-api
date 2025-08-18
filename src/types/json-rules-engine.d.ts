declare module 'json-rules-engine' {
  export class Engine {
    constructor(rules?: any);
    addRule(rule: any): void;
    run(facts: any): Promise<{ events: any[]; almanac?: any }>; // minimal typing
  }
}
