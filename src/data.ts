import {load} from 'cheerio'
import fetch from 'node-fetch'

const DATA_SOURCE = 'https://www.health.govt.nz/our-work/diseases-and-conditions/covid-19-novel-coronavirus/covid-19-current-situation/covid-19-current-cases'

export let statistics: Statistics = null;

export type Statistics = {
    cases: number; // confirmed and probable
    confirmed_cases: number;
    probable_cases: number;
    cases_in_hospital: number;
    recovered: number;
    deaths: number;
    timestamp: string;
}

const speak_statistics = (stats: Statistics): string => {
    return `In New Zealand, as of ${stats.timestamp}, there has been ${stats.cases} cases`
        + `, ${stats.recovered} have recovered, and ${stats.deaths} have died.`
}

export const fetch_data = async (): Promise<Statistics> => {
    let response = await fetch(DATA_SOURCE);
    let body = await response.text();
    let parser = load(body);
    let timestamp = parser("table caption").first().text().replace("As at ", "");
    let stats: Statistics = {
        cases: null,
        confirmed_cases: null,
        probable_cases: null,
        cases_in_hospital: null,
        recovered: null,
        deaths: null,
        timestamp: timestamp,
    };
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
