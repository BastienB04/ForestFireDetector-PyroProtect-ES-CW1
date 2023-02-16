"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StationBuilder = void 0;
const FWIStation_1 = require("./FWIStation");
class StationBuilder {
    defaultIndex = 'FWI';
    uniqueId = 0;
    chosenIndex;
    stationList;
    constructor(_chosenIndex) {
        this.chosenIndex = _chosenIndex;
        this.stationList = [];
    }
    build(x, y) {
        switch (this.chosenIndex) {
            case this.defaultIndex: {
                const res = new FWIStation_1.FWIStation(`station-${this.uniqueId}`);
                const info = {
                    id: `station-${this.uniqueId}`,
                    station: res,
                    circle: {
                        x: x,
                        y: y,
                        r: -1
                    }
                };
                this.uniqueId += 1;
                this.stationList.push(info);
                return res;
            }
            default: {
                throw new Error("NO INDEX CHOSEN");
            }
        }
    }
}
exports.StationBuilder = StationBuilder;
