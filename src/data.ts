import {load} from 'cheerio'
import fetch from 'node-fetch'

const DATA_SOURCE = 'https://www.health.govt.nz/our-work/diseases-and-conditions/covid-19-novel-coronavirus/covid-19-current-situation/covid-19-current-cases'

export let statistics: Statistics = null;

export class Statistics {
    public cases: number; // confirmed and probable
    public confirmed_cases: number;
    public probable_cases: number;
    public cases_in_hospital: number;
    public recovered: number;
    public deaths: number;
    public timestamp: string;

    public constructor(timestamp: string) {
        this.timestamp = timestamp
    }

    public speak(): string {
        return `In New Zealand, as of ${this.timestamp}, there has been ${this.cases} cases`
            + `, ${this.recovered} have recovered, and ${this.deaths} have died.`
    }
}

export const fetch_data = async (): Promise<Statistics> => {
    let response = await fetch(DATA_SOURCE);
    let body = await response.text();
    let parser = load(body);
    let timestamp = parser("table caption").first().text().replace("As at ", "");
    let stats = new Statistics(timestamp);
    parser("tbody tr").each((_, e) => {
        let header = parser("th", e).text();
        if (header.startsWith("Number of confirmed cases")) {
            stats.confirmed_cases = parse_row(parser, e);
        } else if (header.startsWith("Number of probable")) {
            stats.probable_cases = parse_row(parser, e);
        } else if (header.startsWith("Number of confirmed and probable")) {
            stats.cases = parse_row(parser, e);
        } else if (header.startsWith("Number of cases in hospital")) {
            stats.cases_in_hospital = parse_row(parser, e);
        } else if (header.startsWith("Number of recovered")) {
            stats.recovered = parse_row(parser, e);
        } else if (header.startsWith("Number of deaths")) {
            stats.deaths = parse_row(parser, e)
        }
    })
    return stats;
}

export const schedule_data_fetch = async () => {
    statistics = await fetch_data();
    setInterval(async () => {
        statistics = await fetch_data();
    }, 12 * 60 * 60 * 1_000); // Updates every 12 hours (half a day)
}

const parse_row = (parser, element): number => {
    return parseInt(parser("td", element).first().text().replace(',', ''))
}
