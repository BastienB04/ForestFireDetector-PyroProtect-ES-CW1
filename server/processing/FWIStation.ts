import { Station } from "./Station";

enum EffeciveDayLength {
    January = 6.5,
    February = 7.5,
    March = 9.0,
    April = 12.8,
    May = 13.9,
    June = 13.9,
    July = 12.4,
    August = 10.9,
    September = 9.4,
    October = 8.0,
    November = 7.0,
    December = 6.0,
}
enum EffeciveDayLengthFactor {
    January = -1.6,
    February = -1.6,
    March = -1.6,
    April = 0.9,
    May = 3.8,
    June = 5.8,
    July = 6.4,
    August = 5.0,
    September = 2.4,
    October = 0.4,
    November = -1.6,
    December = -1.6,
}

class FWIStation extends Station{
    private currentFWI: number;
    private currentFFMC: number;
    private currentDMC: number;
    private currentDC: number;
    private currentISI: number;

    private effectiveDayLength: number;
    private effectiveDayLengthFactor: number;

    constructor(name: string){
        super(name);
        this.effectiveDayLength = EffeciveDayLength.February;

        // previous day's FWI
        this.currentFFMC = 85;
        this.currentDMC = 6;
        this.currentDC = 15;
    }

    get index(){
        return this.currentFWI;
    }

    // Fine Fuel Moisture Code
    private calculateFFMC(): FWIStation {
        let prevMT = 147.2 * (101 - this.currentFFMC) / (59.5 + this.currentFFMC);
        
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
        
        let mt: number;
        if (ed < prevMT) {
            let ko = 0.424 * (1 - Math.pow(this.relativeHumidity / 100, 1.7)) + 0.0694 * this.windSpeed * (1 - Math.pow(this.relativeHumidity / 100, 8));
            let kd = ko * 0.581 * Math.exp(0.0365 * this.temperature);
            mt = ed + (prevMT - ed) * Math.pow(10, -kd);
        } 
        else{
            let ew = 0.618 * Math.pow(this.relativeHumidity, 0.753) + 10 * Math.exp((this.relativeHumidity - 100) / 10) + 0.18 * (21.1 - this.temperature) * (1 - Math.exp(-0.115 * this.relativeHumidity));
            if (ew > prevMT) {
                let k1 = 0.424 * (1 - Math.pow((100 - this.relativeHumidity) / 100, 1.7)) + 0.0694 * (1 - Math.pow((100 - this.relativeHumidity) / 100, 8));
                let kw = k1 * 0.581 * Math.exp(0.0365 * this.temperature);
                mt = ew - (ew - prevMT) * Math.pow(10, -kw);
            } else {
                mt = prevMT;
            }
        }
        
        this.currentFFMC = 59.5 * ((250 - mt) / (147.2 + mt));
        return this;
    }

    // Duff Moisture Code
    private calculateDMC(): FWIStation{
        let L_e: number = this.effectiveDayLength;

        const tmp:number = Math.max(this.temperature, -1.1);

        let K = 1.894 * (tmp + 1.1) * (100- this.relativeHumidity) * L_e * 0.000001;
        
        if(this.precipitation < 1.5){
            this.currentDMC = this.currentDMC + 100*K;
            return this
        }

        let P_e: number = 0.92 * this.precipitation - 1.27;
        let prev_M : number= 20 + Math.exp(5.6348 - (this.currentDMC)/43.43);

        let b: number;
        if(this.currentDMC <= 33){
            b = 100 / (0.5 + 0.3 * this.currentDMC);
        }
        else if(this.currentDMC <= 65){
            b = 14 - 1.3 * Math.log(this.currentDMC);
        }
        else{
            b = 6.2 * Math.log(this.currentDMC) - 17.2;
        }

        let M_r_t: number = prev_M + ((1000*P_e)/(48.77 + b*P_e));
        let DMC_r_t: number = Math.max(244.72 - 43.43 * Math.log(M_r_t - 20), 0);

        this.currentDMC = DMC_r_t + 100*K;


        return this;
    }

    // Drought Code
    private calculateDC(): FWIStation{
        const L_f = this.effectiveDayLengthFactor;

        const tmp = Math.max(this.temperature, -2.8); // if temperature < -2.8 then tmp = -2.8

        // potential evapotranspiration: V
        const V = Math.max( 0.36 * (this.temperature + 2.8) + L_f, 0); // if V < 0 then V = 0

        if(this.precipitation <= 2.8){
            this.currentDC = this.currentDC + 0.5 * V;
            return this;
        }

        // effective rainfall (mm): P_d
        const P_d = 0.83 * this.precipitation - 1.27;

        // moisture equivalent of previous day's DC: prevQ
        const prevQ = 800 * Math.exp(-this.currentDC/400);

        // moisture equivalent after rain: Q_r_t
        const Q_r_t = prevQ + 3.937 * P_d

        // DC after rain: DC_r_t
        const DC_r_t = Math.max(400 * Math.log(800/Q_r_t), 0) // if DC_r_t < 0 then DC_r_t = 0

        this.currentDC = DC_r_t + 0.5 * V;
        return this;
    }
    

}

export { FWIStation };