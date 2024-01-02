const cheerio = require("cheerio");
const axios = require("axios");
const puppeteer = require("puppeteer");
const fs = require("fs");
const { chromium } = require("playwright");

const MENU_URL = "https://mylightspeed.app/HLMBBCCK/C-ordering/menu";
const menu = {};

async function scrap() {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await page.goto(MENU_URL);
    const promise = page.waitForResponse(
      "https://mylightspeed.app/api/oa/pos/v1/menu"
    ); // This is a regex to match the url

    var response = await promise; // here we wait for the promise to be fullfiled.
    let resp = await response.json();

    // Write countries array in countries.json file
    fs.writeFile("static/menu.json", JSON.stringify(resp, null, 2), (err) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log("Successfully written Menu to file");
    });
    await browser.close();
    return;
  } catch (error) {
    console.log(error);
  }
}

scrap();
