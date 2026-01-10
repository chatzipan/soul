import { MenuGroup } from "./getMenuDiffs";

export const formatMenu = (groups: any[]): MenuGroup[] => {
  const sandwichesGroup = groups.find((group) =>
    group.name.toLowerCase().includes("sandwiches"),
  );

  const brunchGroup = groups.find((group) =>
    group.name.toLowerCase().includes("brunch"),
  );

  const pastriesGroup = groups.find((group) =>
    group.name.toLowerCase().includes("pastries"),
  );

  // Consolidate wine groups
  const wineEntries = groups
    .filter(
      (group) =>
        group.name.toLowerCase().includes("beer") ||
        group.name.toLowerCase().includes("wine") ||
        group.name.toLowerCase().includes("rosé"),
    )
    .flatMap((group) =>
      group.entries.map((entry: any) => ({
        ...entry,
        category: group.name,
      })),
    )
    .sort((a, b) => {
      const categoryOrder: Record<string, number> = {
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

  // Consolidate coffee
  const coffeeEntries = groups
    .filter((group) => group.name.toLowerCase().includes("kaffee"))
    .flatMap((group) =>
      group.entries.map((entry: any) => ({
        ...entry,
        category: group.name,
      })),
    );

  // Consolidate soft drinks
  const softDrinksEntries = groups
    .filter((group) => group.name.toLowerCase().includes("soft drinks"))
    .flatMap((group) =>
      group.entries.map((entry: any) => ({
        ...entry,
        category: group.name,
      })),
    );

  // Consolidate cocktails, mocktails and aperitivo groups
  const cocktailEntries = groups
    .filter(
      (group) =>
        group.name.toLowerCase().includes("cocktail") ||
        group.name.toLowerCase().includes("mocktail"),
    )
    .flatMap((group) =>
      group.entries.map((entry: any) => ({
        ...entry,
        category: group.name,
      })),
    );

  // Filter out all consolidated groups and add new consolidated groups
  const consolidatedGroups = [
    {
      name: "Wine & Beer",
      description: "Wine and beer",
      entries: wineEntries,
    },
    {
      name: "Cocktails",
      description: "Cocktails, mocktails and aperitifs",
      entries: cocktailEntries,
    },
    {
      ...sandwichesGroup,
      name: "Sandwiches",
      description: sandwichesGroup.name,
    },
    {
      ...brunchGroup,
      name: "Brunch",
      description: brunchGroup.name,
    },
    {
      ...pastriesGroup,
      name: "Pastries",
      description: pastriesGroup.name,
    },
    {
      name: "Coffee & Tea",
      description: "Hot and cold beverages",
      entries: coffeeEntries,
    },
    {
      name: "Soft Drinks",
      description: "Soft drinks",
      entries: softDrinksEntries,
    },
  ];

  // Sort groups in the specified order
  const sortOrder: Record<string, number> = {
    brunch: 1,
    sandwiches: 2,
    pastries: 3,
    wine: 4,
    cocktails: 5,
    coffee: 6,
    "soft drinks": 7,
  };

  return consolidatedGroups
    .map((group) => ({
      ...group,
      name: group.name.replace("Menu", "").trim(),
      entries: group.entries.map((entry: any) => {
        const text = entry.texts.find((t: any) => t.locale === "en");
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
          a.name.toLowerCase().includes(key),
        )?.[1] || 999;
      const bOrder =
        Object.entries(sortOrder).find(([key]) =>
          b.name.toLowerCase().includes(key),
        )?.[1] || 999;
      return aOrder - bOrder;
    });
};
