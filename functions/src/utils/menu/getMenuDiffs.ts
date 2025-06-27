import * as jsonDiff from "json-diff";

export interface MenuEntry {
  category: string;
  name: string;
  subTitle?: string;
  description?: string;
  price: number;
  imageThumbnail?: string;
  image?: string;
}

export interface MenuGroup {
  name: string;
  description: string;
  entries: MenuEntry[];
}

export interface MenuDiff {
  __old?: any;
  __new?: any;
}

export const getMenuDiffs = (
  oldMenu: MenuGroup[],
  newMenu: MenuGroup[],
): string[] => {
  const diff: string[] = [];
  Object.values(jsonDiff.diff(oldMenu, newMenu, { full: true })).forEach(
    (val) => {
      if (!Array.isArray(val)) {
        return;
      }

      if (!["+", "-", "~"].includes(val[0])) {
        return;
      }

      if (!val[1]) {
        return;
      }

      const entriesWithDiff = val[1].entries.filter((entry: [string, any]) =>
        ["+", "-", "~"].includes(entry[0]),
      );

      entriesWithDiff.forEach((entry: [string, any]) => {
        const diffType =
          typeof entry[1].name === "string"
            ? entry[1].name
            : entry[1].name?.__new
              ? entry[1].name?.__new
              : "a menu item";

        const diffs = Object.entries(entry[1]).filter(
          ([, val]) => (val as MenuDiff)?.__old !== undefined,
        );

        if (diffs.length === 0) {
          return;
        }

        let diffText = `<h3>Difference for: ${diffType}</h3>`;

        diffs.forEach(([key, val]) => {
          const menuDiff = val as MenuDiff;
          diffText += `<p>Old ${key}: ${menuDiff.__old}</p>`;
          diffText += `<p>New ${key}: ${menuDiff.__new}</p>`;
        });

        diff.push(diffText);
      });
    },
  );

  return diff;
};
