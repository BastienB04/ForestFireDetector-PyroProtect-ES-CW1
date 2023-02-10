"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StationBuilder = void 0;
const FWIStation_1 = require("./FWIStation");
class StationBuilder {
    defaultIndex = 'FWI';
    uniqueId = 0;
    chosenIndex;
    constructor(_chosenIndex) {
        this.chosenIndex = _chosenIndex;
    }
    build() {
        switch (this.chosenIndex) {
            case this.defaultIndex: {
                const res = new FWIStation_1.FWIStation(`station-${this.uniqueId}`);
                this.uniqueId += 1;
                return res;
            }
            default: {
                throw new Error("NO INDEX CHOSEN");
            }
        }
    }
}
exports.StationBuilder = StationBuilder;
