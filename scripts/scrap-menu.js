const fs = require("fs");
const { chromium } = require("playwright");
const jsonDiff = require("json-diff");

const MENU_URL = "https://mylightspeed.app/HLMBBCCK/C-ordering/menu";
const localFileName = "static/menu.json";

const getMenuDiffs = (oldMenu, newMenu) => {
  const diff = [];

  Object.entries(jsonDiff.diff(oldMenu, newMenu, { full: true })).forEach(
    ([, val]) => {
      if (typeof val !== "object") {
        return;
      }

      val
        .filter((item) => ["+", "-", "~"].includes(item[0]))
        .forEach((item) => {
          console.log(item);
          diff.push("Difference for Category: " + item[1].name);

          item[1].entries
            .filter((entry) => entry[0] !== " ")
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
    const menu = await response.json();

    const menuDiffs = getMenuDiffs(
      menu,
      JSON.parse(fs.readFileSync(localFileName, "utf8"))
    );

    if (menuDiffs.length === 0) {
      console.log("No menu changes. Exiting...");
      await browser.close();
      return;
    }

    console.log("Menu Diffs: ", menuDiffs.join("\n"));

    // Write countries array in countries.json file
    fs.writeFile("static/menu.json", JSON.stringify(menu, null, 2), (err) => {
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
