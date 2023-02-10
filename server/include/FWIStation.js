"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FWIStation = void 0;
const Station_1 = require("./Station");
var EffeciveDayLength;
(function (EffeciveDayLength) {
    EffeciveDayLength[EffeciveDayLength["January"] = 6.5] = "January";
    EffeciveDayLength[EffeciveDayLength["February"] = 7.5] = "February";
    EffeciveDayLength[EffeciveDayLength["March"] = 9] = "March";
    EffeciveDayLength[EffeciveDayLength["April"] = 12.8] = "April";
    EffeciveDayLength[EffeciveDayLength["May"] = 13.9] = "May";
    EffeciveDayLength[EffeciveDayLength["June"] = 13.9] = "June";
    EffeciveDayLength[EffeciveDayLength["July"] = 12.4] = "July";
    EffeciveDayLength[EffeciveDayLength["August"] = 10.9] = "August";
    EffeciveDayLength[EffeciveDayLength["September"] = 9.4] = "September";
    EffeciveDayLength[EffeciveDayLength["October"] = 8] = "October";
    EffeciveDayLength[EffeciveDayLength["November"] = 7] = "November";
    EffeciveDayLength[EffeciveDayLength["December"] = 6] = "December";
})(EffeciveDayLength || (EffeciveDayLength = {}));
class FWIStation extends Station_1.Station {
    currentFWI;
    currentFFMC;
    currentDMC;
    currentDC;
    currentISI;
    previousFFMC;
    effectiveDayLength;
    constructor(name) {
        super(name);
        this.effectiveDayLength = EffeciveDayLength.February;
    }
    get index() {
        return this.currentFWI;
    }
    calculateFFMC() {
        let prevMT = 147.2 * (101 - this.previousFFMC) / (59.5 + this.previousFFMC);
        if (this.precipitation > 0.5) {
            let pf = this.precipitation - 0.5;
            let mrt = prevMT + (42.5 * pf * Math.exp((-100) / (251 - prevMT)) * (1 - Math.exp(-6.93 / pf)));
            if (prevMT > 150) {
                mrt += 0.0015 * Math.pow(prevMT - 150, 2) * Math.pow(pf, 0.5);
            }
            if (mrt > 250) {
                mrt = 250;
            }
            prevMT = mrt;
        }
        const ed = 0.942 * Math.pow(this.relativeHumidity, 0.679) + 11 * Math.exp((this.relativeHumidity - 100) / 10) + 0.18 * (21.1 - this.temperature) * (1 - Math.exp(-0.115 * this.relativeHumidity));
        let mt;
        if (ed < prevMT) {
            let ko = 0.424 * (1 - Math.pow(this.relativeHumidity / 100, 1.7)) + 0.0694 * this.windSpeed * (1 - Math.pow(this.relativeHumidity / 100, 8));
            let kd = ko * 0.581 * Math.exp(0.0365 * this.temperature);
            mt = ed + (prevMT - ed) * Math.pow(10, -kd);
        }
        else {
            let ew = 0.618 * Math.pow(this.relativeHumidity, 0.753) + 10 * Math.exp((this.relativeHumidity - 100) / 10) + 0.18 * (21.1 - this.temperature) * (1 - Math.exp(-0.115 * this.relativeHumidity));
            if (ew > prevMT) {
                let k1 = 0.424 * (1 - Math.pow((100 - this.relativeHumidity) / 100, 1.7)) + 0.0694 * (1 - Math.pow((100 - this.relativeHumidity) / 100, 8));
                let kw = k1 * 0.581 * Math.exp(0.0365 * this.temperature);
                mt = ew - (ew - prevMT) * Math.pow(10, -kw);
            }
            else {
                mt = prevMT;
            }
        }
        this.currentFFMC = 59.5 * ((250 - mt) / (147.2 + mt));
        return this;
    }
    calculateDMC() {
        let L_e = this.effectiveDayLength;
        var tmp;
        if (this.temperature < -1.1) {
            tmp = -1.1;
        }
        else {
            tmp = this.temperature;
        }
        let K = 1.894 * (tmp + 1.1) * (100 - this.relativeHumidity) * L_e * 0.000001;
        if (this.precipitation < 1.5) {
            this.currentDMC = this.currentDMC + 100 * K;
        }
        else {
            let P_e = 0.92 * this.precipitation - 1.27;
            let prev_M = 20 + Math.exp(5.6348 - (this.currentDMC) / 43.43);
            let b;
            if (this.currentDMC <= 33) {
                b = 100 / (0.5 + 0.3 * this.currentDMC);
            }
            else if (this.currentDMC <= 65) {
                b = 14 - 1.3 * Math.log(this.currentDMC);
            }
            else {
                b = 6.2 * Math.log(this.currentDMC) - 17.2;
            }
            let M_r_t = prev_M + ((1000 * P_e) / (48.77 + b * P_e));
            let DMC_r_t = Math.max(244.72 - 43.43 * Math.log(M_r_t - 20), 0);
            this.currentDMC = DMC_r_t + 100 * K;
        }
        return this;
    }
}
exports.FWIStation = FWIStation;
