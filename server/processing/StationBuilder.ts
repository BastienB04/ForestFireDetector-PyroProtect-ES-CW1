import { FWIStation } from "./FWIStation";
import { Station, SensorReadings } from "./Station";
import { Circle, Point } from "./CircleFunctions";

type StationInfo = {
    id: string;
    station: Station | FWIStation;
    circle: Circle;
};

class StationBuilder {
    readonly defaultIndex: string = 'FWI';
    private uniqueId: number = 0; 
    private chosenIndex: string;
    private stationList: StationInfo[];

    constructor(_chosenIndex: string){
        this.chosenIndex = _chosenIndex;
    }

    public build(x: number, y: number){
        switch(this.chosenIndex){
            case this.defaultIndex: {
                const res = new FWIStation(`station-${this.uniqueId}`);
                const info: StationInfo = {
                    id: `station-${this.uniqueId}`,
                    station: res,
                    circle: {
                        x: x,
                        y: y,
                        r: -1
                    }
                }
                this.uniqueId += 1;
                this.stationList.push(info);
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

    public
}

export { StationBuilder }