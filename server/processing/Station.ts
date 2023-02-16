
type SensorReadings = {
    temperature: number;
    relativeHumidity: number;
    windSpeed: number;
    precipitation: number;
}


// a station represents a pi
abstract class Station {
    private _stationId: string; // unique id for each station
    private _temperature: number; // Celsius
    private _relativeHumidity: number; // percentage
    private _windSpeed:number; // km/h
    private _precipitation: number; // mm

    constructor(name: string){
        this._stationId = name;
    }

    public abstract get fireIndex(): number;

    public set temperature(temp: number){
        this._temperature = temp;
    }

    public get temperature(): number{
        return this._temperature;
    }

    public set relativeHumidity(val: number){
        this._relativeHumidity = val;
    }

    public get relativeHumidity(): number{
        return this._relativeHumidity;
    }

    public set windSpeed(val: number){
        this._windSpeed = val;
    }
    
    public get windSpeed(): number{
        return this._windSpeed;
    }

    public set precipitation(val: number){
        this._precipitation = val;
    }

    public get precipitation(): number{
        return this._precipitation;
    }

    public set readings(params: SensorReadings){
        this._temperature = params.temperature;
        this._relativeHumidity = params.relativeHumidity;
        this._windSpeed = params.windSpeed;
        this._precipitation = params.precipitation;
    }


    public abstract update(): any;
}

export { Station, SensorReadings }