const dotenv = require("dotenv");
dotenv.config({ path: __dirname + "/./../.env" });

const fs = require("fs");
const { chromium } = require("playwright");
const jsonDiff = require("json-diff");
const { uploadFile } = require("./upload-file");

const MENU_URL = "https://mylightspeed.app/UYRRDNWF/C-ordering/menu";
const MENU_API_ENDPOINT = "https://mylightspeed.app/api/oa/pos/v1/menu";
const localFileName = "static/menu.json";

const getMenuDiffs = (oldMenu, newMenu) => {
  const diff = [];

  Object.entries(jsonDiff.diff(oldMenu, newMenu, { full: true })).forEach(
    ([, val]) => {
      if (!Array.isArray(val)) {
        return;
      }

      val
        .filter((item) => ["+", "-", "~"].includes(item[0]))
        .forEach((item) => {
          if (!item[1]) {
            return;
          }

          diff.push("Difference for Category: " + item[1].name);

          item[1].entries
            .filter((entry) => ["+", "-", "~"].includes(entry[0]))
            .forEach((entry) => {
              const diffType =
                typeof entry[1].name === "string"
                  ? entry[1].name
                  : "a menu item";
              diff.push("Difference for: " + diffType);

              const diffs = Object.entries(entry[1]).filter(
                ([key, val]) => val?.__old !== undefined
              );

              diffs.forEach(([key, val]) => {
                diff.push(`Old ${key}: ` + val.__old);
                diff.push(`New ${key}: ` + val.__new);
                diff.push("\n");
              });
            });
        });
    }
  );

  return diff;
};

const formatMenu = (groups) => {
  return groups.map((group) => {
    return {
      name: group.name,
      description: group.description,
      entries: group.entries.map((entry) => {
        return {
          name: entry.name,
          description: entry.description,
          price: entry.unitPriceCents / 100,
          imageThumbnail: entry.squareImageUrl,
          image: entry.rawImageUrl,
        };
      }),
    };
  });
};

async function scrap() {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await page.goto(MENU_URL);
    const promise = page.waitForResponse(MENU_API_ENDPOINT);

    var response = await promise; // here we wait for the promise to be fulfilled.
    const menu = await response.json();

    const menuDiffs = getMenuDiffs(
      menu.groups,
      JSON.parse(fs.readFileSync(localFileName, "utf8"))
    );

    if (menuDiffs.length === 0) {
      console.log("No menu changes. Exiting...");
      await browser.close();
      return;
    }

    console.log("Menu Diffs: ", menuDiffs.join("\n"));

    const formattedMenu = formatMenu(menu.groups);

    // Upload menu.json to GCS
    await uploadFile(formattedMenu);
    await browser.close();
    return;
  } catch (error) {
    console.log(error);
  }
}

scrap();
