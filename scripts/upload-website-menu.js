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
  const dinnerGroup = groups.find((group) =>
    group.name.toLowerCase().includes("evening")
  );

  const lunchGroup = groups.find((group) =>
    group.name.toLowerCase().includes("lunch")
  );

  const brunchGroup = groups.find((group) =>
    group.name.toLowerCase().includes("brunch")
  );

  // Consolidate wine groups
  const wineEntries = groups
    .filter(
      (group) =>
        group.name.toLowerCase().includes("beer") ||
        group.name.toLowerCase().includes("wine") ||
        group.name.toLowerCase().includes("rosé")
    )
    .flatMap((group) =>
      group.entries.map((entry) => ({
        ...entry,
        category: group.name,
      }))
    )
    .sort((a, b) => {
      const categoryOrder = {
        "Sparkling Wine": 1,
        "White wine": 2,
        Rosé: 3,
        "Red wine": 4,
        Beer: 5,
      };

      const aOrder = categoryOrder[a.category] || 999;
      const bOrder = categoryOrder[b.category] || 999;
      return aOrder - bOrder;
    });

  // Consolidate beverage and coffee groups
  const beverageEntries = groups
    .filter(
      (group) =>
        group.name.toLowerCase().includes("beverage") ||
        group.name.toLowerCase().includes("coffee")
    )
    .flatMap((group) =>
      group.entries.map((entry) => ({
        ...entry,
        category: group.name,
      }))
    );

  // Consolidate cocktails, mocktails and aperitivo groups
  const cocktailEntries = groups
    .filter(
      (group) =>
        group.name.toLowerCase().includes("cocktail") ||
        group.name.toLowerCase().includes("mocktail") ||
        group.name.toLowerCase().includes("aperitivo")
    )
    .flatMap((group) =>
      group.entries.map((entry) => ({
        ...entry,
        category: group.name,
      }))
    );

  // Filter out all consolidated groups and add new consolidated groups
  const consolidatedGroups = [
    {
      ...dinnerGroup,
      name: "Dinner",
      description: dinnerGroup.name.replace("Evening", "Dinner"),
    },
    {
      name: "Wine",
      description: "Wine and beer",
      entries: wineEntries,
    },
    {
      name: "Cocktails",
      description: "Cocktails, mocktails and aperitifs",
      entries: cocktailEntries,
    },
    {
      ...lunchGroup,
      name: "Lunch",
      description: lunchGroup.name,
    },
    {
      ...brunchGroup,
      name: "Brunch",
      description: brunchGroup.name,
    },
    {
      name: "Coffee & Co",
      description: "Hot and cold beverages",
      entries: beverageEntries,
    },
  ];

  // Sort groups in the specified order
  const sortOrder = {
    dinner: 1,
    wine: 2,
    cocktails: 3,
    lunch: 4,
    brunch: 5,
  };

  return consolidatedGroups
    .map((group) => ({
      ...group,
      name: group.name.replace("Menu", "").trim().replace("Evening", "Dinner"),
      entries: group.entries.map((entry) => {
        const text = entry.texts.find((t) => t.locale === "en");
        return {
          category: entry.category,
          name: entry.name,
          subTitle: text?.friendlyDisplayName,
          description: text?.description,
          price: entry.unitPriceCents / 100,
          imageThumbnail: entry.squareImageUrl,
          image: entry.rawImageUrl,
        };
      }),
    }))
    .sort((a, b) => {
      const aOrder =
        Object.entries(sortOrder).find(([key]) =>
          a.name.toLowerCase().includes(key)
        )?.[1] || 999;
      const bOrder =
        Object.entries(sortOrder).find(([key]) =>
          b.name.toLowerCase().includes(key)
        )?.[1] || 999;
      return aOrder - bOrder;
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
      // return;
    }

    console.log("Menu Diffs: ", menuDiffs.join("\n"));

    const formattedMenu = formatMenu(menu.groups);

    fs.writeFileSync(localFileName, JSON.stringify(formattedMenu, null, 2));

    // Upload menu.json to GCS
    // await uploadFile(menuExcludingEvening);
    await browser.close();
    return;
  } catch (error) {
    console.log(error);
  }
}

scrap();
