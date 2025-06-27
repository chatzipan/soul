import { chromium } from "playwright";

import { Storage } from "@google-cloud/storage";

import { formatMenu } from "./formatMenu";
import { getMenuDiffs } from "./getMenuDiffs";

const bundledChromium = require("chrome-aws-lambda");

export const MENU_URL = "https://mylightspeed.app/UYRRDNWF/C-ordering/menu";
export const MENU_API_ENDPOINT = "https://mylightspeed.app/api/oa/pos/v1/menu";

// Upload menu to Google Cloud Storage
const uploadToGCS = async (menuData: any) => {
  const storage = new Storage();
  const bucketName = process.env.GCS_MENU_BUCKET_NAME || "soulzuerich.ch";

  const fileName = "menu.json";

  const bucket = storage.bucket(bucketName);
  const file = bucket.file(fileName);

  const contents = JSON.stringify(menuData, null, 2);

  await file.save(contents, {
    metadata: {
      contentType: "application/json",
      cacheControl: "no-cache",
    },
  });

  await file.makePublic();

  console.log(`Menu uploaded to gs://${bucketName}/${fileName}`);
};

// Trigger Gatsby rebuild via webhook
const triggerGatsbyRebuild = async () => {
  const webhookUrl = process.env.GATSBY_REBUILD_WEBHOOK;

  if (!webhookUrl) {
    console.log(
      "No Gatsby rebuild webhook configured, skipping rebuild trigger",
    );
    return;
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: "Menu updated, triggering rebuild",
        timestamp: new Date().toISOString(),
      }),
    });

    if (response.ok) {
      console.log("Gatsby rebuild triggered successfully");
    } else {
      console.error("Failed to trigger Gatsby rebuild:", response.statusText);
    }
  } catch (error) {
    console.error("Error triggering Gatsby rebuild:", error);
  }
};

export const updateMenu = async () => {
  const executablePath = await bundledChromium.executablePath;
  const browser = executablePath
    ? await chromium.launch({ executablePath })
    : await chromium.launch({});

  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await page.goto(MENU_URL);
    const promise = page.waitForResponse(MENU_API_ENDPOINT);

    const response = await promise;
    const menu = await response.json();
    const formattedMenu = formatMenu(menu.groups);

    // Get current menu from GCS for comparison
    let currentMenu = [];
    try {
      const storage = new Storage();
      const bucket = storage.bucket(
        process.env.GCS_MENU_BUCKET_NAME || "soulzuerich.ch",
      );
      const file = bucket.file("menu.json");
      const [content] = await file.download();
      currentMenu = JSON.parse(content.toString());
    } catch (error) {
      console.log("No existing menu found in GCS, treating as new menu");
    }

    const menuDiffs = getMenuDiffs(currentMenu, formattedMenu);

    if (currentMenu.length && menuDiffs.length === 0) {
      await browser.close();
      return { message: "No menu changes detected", changes: [] };
    }

    // Upload to Google Cloud Storage
    await uploadToGCS(formattedMenu);

    // Trigger Gatsby rebuild
    await triggerGatsbyRebuild();

    await browser.close();

    return {
      message:
        "Menu updated successfully. Changes will be visible on the website shortly.",
      changes: menuDiffs,
    };
  } catch (error) {
    await browser.close();
    throw error;
  }
};
