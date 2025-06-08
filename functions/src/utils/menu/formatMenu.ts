import { MenuGroup } from "./getMenuDiffs";

export const formatMenu = (groups: any[]): MenuGroup[] => {
  const dinnerGroup = groups.find((group) =>
    group.name.toLowerCase().includes("evening"),
  );

  const lunchGroup = groups.find((group) =>
    group.name.toLowerCase().includes("lunch"),
  );

  const brunchGroup = groups.find((group) =>
    group.name.toLowerCase().includes("brunch"),
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

  // Consolidate beverage and coffee groups
  const beverageEntries = groups
    .filter(
      (group) =>
        group.name.toLowerCase().includes("beverage") ||
        group.name.toLowerCase().includes("coffee"),
    )
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
        group.name.toLowerCase().includes("mocktail") ||
        group.name.toLowerCase().includes("aperitivo"),
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
  const sortOrder: Record<string, number> = {
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
