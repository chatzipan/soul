import React from "react";

import { Redirect, RouteComponentProps, useParams } from "@reach/router";

import menu from "../../../static/menu.json";
import * as S from "./menu.styled";

type MenuEntry = {
  category?: string;
  description?: string;
  subTitle?: string;
  image: null | string;
  imageThumbnail: null | string;
  name: string;
  price: number;
};

type Menu = {
  description: string;
  name: string;
  categories: {
    name: string;
    entries: MenuEntry[];
  }[];
};

export const createLink = (category: string) =>
  encodeURI(category.replaceAll(" ", "_")).toLowerCase();

const formatDescription = (description: string) =>
  description
    .replace("/", " /")
    .replace("[", " (")
    .replace("]", ")")
    .replace("{", " (")
    .replace("}", ")");

const MenuCategory: React.FC<RouteComponentProps> = () => {
  const params = useParams();
  const category = params.categoryId;

  const allCategories = menu
    .map((group) => group?.name.trim())
    .map((category) => createLink(category));

  if (!allCategories.includes(category)) {
    return <Redirect to="/menu" noThrow />;
  }

  const menuIndex = allCategories.indexOf(category);
  const categoryMenu = menu[menuIndex];

  const splitedByCategories = {
    description: categoryMenu.description,
    name: categoryMenu.name,
    categories: Object.entries(
      // @ts-ignore
      categoryMenu.entries.reduce<
        Record<string, { name: string; entries: MenuEntry[] }>
      >(
        (
          acc: Record<string, { name: string; entries: MenuEntry[] }>,
          entry: MenuEntry,
        ) => {
          const category =
            (entry as { category?: string }).category ?? categoryMenu.name;
          if (!acc[category]) {
            acc[category] = {
              name: category,
              entries: [],
            };
          }
          acc[category].entries.push(entry);
          return acc;
        },
        {},
      ),
    ).map(([_, value]) => value),
  };

  return <MenuCategoryComponent menu={splitedByCategories as Menu} />;
};

const MenuCategoryComponent: React.FC<{ menu: Menu }> = ({ menu }) => {
  return (
    <S.Wrapper>
      <S.Main>
        <S.SectionTitle>{formatDescription(menu.description)}</S.SectionTitle>
        {menu.categories.map((category) => (
          <S.Section key={category.name}>
            {menu.categories.length > 1 && (
              <S.SectionSubTitle>{category.name}</S.SectionSubTitle>
            )}
            {category.entries
              .sort((a, b) => {
                if (category.name === "Lunch") {
                  const aHasBowl = a.name.toLowerCase().includes("bowl");
                  const bHasBowl = b.name.toLowerCase().includes("bowl");

                  if (aHasBowl && !bHasBowl) return -1; // a has bowl, b doesn't -> a comes first
                  if (!aHasBowl && bHasBowl) return 1; // b has bowl, a doesn't -> b comes first

                  // If both have or don't have "bowl", sort by price (increasing)
                  return a.price - b.price;
                } else {
                  // For other categories, sort by price (increasing)
                  return a.price - b.price;
                }
              })
              .map((entry) => (
                <S.Item key={entry.name}>
                  <S.ItemName>{entry.name}</S.ItemName>
                  <S.Price>{entry.price.toString()}</S.Price>
                  {entry.description && (
                    <S.ItemDescription
                      dangerouslySetInnerHTML={{ __html: entry.description }}
                    />
                  )}
                </S.Item>
              ))}
          </S.Section>
        ))}
        <S.HomeLink to="/menu">Back To Menu</S.HomeLink>
      </S.Main>
    </S.Wrapper>
  );
};

export default MenuCategory;
