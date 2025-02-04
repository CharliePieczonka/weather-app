class Weather {
  city;
  temp;
  humidity;
  datetime;
  conditions;
  wind;
  description;
  forecast = [];

  constructor(city, temp, humidity, datetime, conditions, wind, description) {
    this.city = city;
    this.temp = temp;
    this.humidity = humidity;
    this.datetime = datetime;
    this.conditions = conditions;
    this.wind = wind;
    this.description = description;
  }
}

export { Weather };
