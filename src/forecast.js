class Forecast {
    date;
    tempMin;
    tempMax;
    conditions;
    description;

    constructor(date, tempMin, tempMax, conditions, description) {
        this.date = date;
        this.tempMin = tempMin;
        this.tempMax = tempMax;
        this.conditions = conditions;
        this.description = description;
    }
}

export { Forecast }