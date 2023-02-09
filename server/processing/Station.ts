type SensorReadings = {
    temperature: number;
    relativeHumidity: number;
    windSpeed: number;
    precipitation: number;
}

// a station represents a pi
abstract class Station {
    private _stationId: string; // unique id for each station
    protected _temperature: number; // Celsius
    protected _relativeHumidity: number; // percentage
    protected _windSpeed:number; // km/h
    protected _precipitation: number; // mm

    constructor(name: string){
        this._stationId = name;
    }

    abstract get index(): number;

    public set temperature(temp: number){
        this._temperature = temp;
    }

    public set relativeHumidity(val: number){
        this._relativeHumidity = val;
    }

    public set windSpeed(val: number){
        this._windSpeed = val;
    }
    
    public set precipitation(val: number){
        this._precipitation = val;
    }

    public set readings(params: SensorReadings){
        this._temperature = params.temperature;
        this._relativeHumidity = params.relativeHumidity;
        this._windSpeed = params.windSpeed;
        this._precipitation = params.precipitation;
    }
}

export { Station, SensorReadings }