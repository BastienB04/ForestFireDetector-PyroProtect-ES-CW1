import { FWIStation } from "./FWIStation";
import { SensorReadings } from "./Station";

class StationBuilder {
    readonly defaultIndex: string = 'FWI';
    private uniqueId: number = 0; 
    private chosenIndex: string;

    constructor(_chosenIndex: string){
        this.chosenIndex = _chosenIndex;
        // init circle saver
    }

    public build(){
        switch(this.chosenIndex){
            case this.defaultIndex: {
                const res = new FWIStation(`station-${this.uniqueId}`);
                this.uniqueId += 1;
                // res.readings = params;
                // res.temperature = params.temperature;
                // res.relativeHumidity = params.relativeHumidity;
                // res.windSpeed = params.windSpeed;
                // res.precipitation = params.precipitation;
                return res;
            }
            default: {
                throw new Error("NO INDEX CHOSEN");
            }
        }
    }
}

export { StationBuilder }