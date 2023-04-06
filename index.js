import ora from 'ora';
import axios from 'axios';
import * as cheerio from 'cheerio';
// const axios = require('axios');
// const cheerio = require('cheerio');
// const ora = require('ora');

const baseUrl = 'https://www.otomoto.pl/ciezarowe/uzytkowe/mercedes-benz';
const totalPages = 21;
const spinner = ora({
    text: 'Loading data...',
    spinner: 'dots',
    color: 'blue'
}).start();
const allItems = [];
const scrapePage = async (url) => {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    const items = [];
    $('.ooa-1hab6wx article').each(function (i, el) {
        let title = $(this).find('.ooa-1nihvj5 .eayvfn66 a').text()
        let price = $(this).find('div.eayvfn610 .ooa-1bmnxg7').text()
        const regDateStr = $(el).find('.ooa-1nihvj5 div ul li').eq(0).text();
        const mileage = $(el).find('.ooa-1nihvj5 div ul li').eq(1).text();
        const power = $(el).find('.ooa-1nihvj5 div ul li').eq(2).text();
        const production = $(el).find('.ooa-1nihvj5 .ooa-q46dc5 li').eq(1).text();
        let date = $(this).find('.ooa-1nihvj5 div p').text()
        let itemId = $(el).attr('data-id')
        items.push({ title: title, price: price, regDateStr: regDateStr, production: production, mileage: mileage, itemId: itemId, power: power });
    });

    return items;
};

const scrapeAllPages = async () => {
    for (let i = 1; i <= totalPages; i++) {
        const url = `${baseUrl}/?page=${i}`;
        const items = await scrapePage(url);
        allItems.push(...items);
        
    }
    allItems.forEach((item) => {
        console.log(`Item id: ${item.itemId}`);
        console.log(`Title: ${item.title}`);
        console.log(`Price: ${item.price}`);
        console.log(`Registration Date : ${item.regDateStr}`);
        console.log(`Production Date : ${item.production}`);
        console.log(`Mileage: ${item.mileage}`);
        console.log(`Power: ${item.power}`);
        console.log('----------------------------------------');
        spinner.stop();
    });
    console.log(allItems.length);
};

scrapeAllPages().catch((error) => {
    console.error(error);
});

