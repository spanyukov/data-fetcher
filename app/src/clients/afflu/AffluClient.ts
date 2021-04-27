import puppeteer from 'puppeteer';
import {injectable} from 'inversify';
import {Tabletojson} from 'tabletojson';
import parse from 'multi-number-parse';
import { DateTime } from 'luxon';
import {IAffluClient, IDatesRow} from './contracts/IAffluClient';

@injectable()
export class AffluClient implements IAffluClient {
    public loginUrl: string;
    public user: string;
    public password: string;

    constructor(loginUrl: string, user: string, password: string) {
        this.loginUrl = loginUrl;
        this.user = user;
        this.password = password;
    }

    async fetchDatesRows(startDate: Date, endDate: Date): Promise<Array<IDatesRow>> {
        // init
        const browser = await puppeteer.launch(
            {headless: true});
        const page = await browser.newPage();
        await page.goto(this.loginUrl, {
            waitUntil: 'networkidle0',
        });

        // login
        await page.type('input[name="username"]', this.user);
        await page.type('input[name="password"]', this.password);
        await page.tap('button[class="btn green uppercase"]');
        await page.waitForNavigation({waitUntil: 'networkidle0'});

        // select date range
        const button = await page.$('#datepicker');
        await button?.click();
        await page.$eval('input[name="daterangepicker_start"]', (el:any) => el.value = '');
        await page.$eval('input[name="daterangepicker_end"]', (el:any) => el.value = '');
        const startDateStr = DateTime.fromISO(startDate.toISOString()).toFormat('LL/dd/yyyy');
        const endDateStr = DateTime.fromISO(endDate.toISOString()).toFormat('LL/dd/yyyy');
        await page.type('input[name="daterangepicker_start"]', startDateStr);
        await page.type('input[name="daterangepicker_end"]', endDateStr);
        const whiteSpace = await page.$('.range_inputs');
        await whiteSpace?.click();

        // parse data
        const applyBtn = await page.$('.applyBtn');
        await applyBtn?.click();
        const result = [];
        while (true) {
            await page.waitForSelector('.affLoadSpinner', {hidden: true, timeout: 30000});
            const portlet = await page.$('div[data-name="dates"]');
            const inner_html = await portlet
                ?.$eval('table[data-url="dates"]', (el: any) => el.innerHTML);
            const tab = Tabletojson.convert('<table>' + inner_html + '</table>');
            const row: Array<IDatesRow> = tab[0].map((i: any) => {
                return {
                    date: DateTime.fromFormat(i['Total Change:'], 'LLL dd, yyyy'),
                    commission: parse(i['1'].replace('$', ''), ','),
                    sales: parse(i['2'], '.'),
                    leads: Number(i['3']),
                    clicks: parse(i['4'], '.'),
                    epc: parse(i['5'].replace('$', ''), '.'),
                    impressions: Number(i['6']),
                    cr: parse(i['7'], '.'),
                };
            });
            result.push(...row);
            const next_btn = await portlet?.$('li[class="next"]');
            const next_value = await next_btn?.getProperty('disabled');
            if(!next_value) {
                break;
            } else {
                await next_btn?.click();
                await page.waitForTimeout(1500);
            }
        }
        await browser.close();

        return result;
    }
}