import * as S from "./menu.styled";

import type { HeadFC } from "gatsby";
import React, { useEffect, useState } from "react";
import { Redirect, RouteComponentProps, useParams } from "@reach/router";
import { capitalize } from "./entry";
import menu from "../../../static/menu.json";

type MenuEntry = {
  category?: string;
  description: string;
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

const MenuCategory: React.FC<RouteComponentProps> = ({}) => {
  // const [menu, setMenu] = useState<Menu[]>([]);
  const params = useParams();
  const category = params.categoryId;

  // useEffect(() => {
  //   (async () => {
  //     const res = await fetch(
  //       "https://storage.googleapis.com/soulzuerich.ch/menu.json",
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Accept: "application/json",
  //         },
  //       }
  //     );

  //     setMenu(await res.json());
  //   })();
  // }, []);

  // if (!menu.length) return null;

  const allCategories = menu
    .map((group) => group?.name.trim())
    .map(capitalize)
    .map((category) => category.replace(/\s*\([^)]*\)/, ""))
    .map((category) => category.replace("/", " &"))
    .map((category) => category.replace("é", "e"))
    .map((category) => createLink(category));

  if (!allCategories.includes(category)) {
    return <Redirect to='/menu' noThrow />;
  }

  const menuIndex = allCategories.indexOf(category);
  const categoryMenu = menu[menuIndex];

  console.log("categoryMenu", categoryMenu);
  const splitedByCategories = {
    description: categoryMenu.description,
    name: categoryMenu.name,
    categories: Object.entries(
      categoryMenu.entries.reduce((acc, entry) => {
        const category =
          "category" in entry ? entry.category : categoryMenu.name;
        if (!acc[category]) {
          acc[category] = {
            name: category,
            entries: [],
          };
        }
        acc[category].entries.push(entry);
        return acc;
      }, {} as Record<string, { name: string; entries: MenuEntry[] }>)
    ).map(([_, value]) => value),
  };

  return <MenuCategoryComponent menu={splitedByCategories} />;
};

const MenuCategoryComponent: React.FC<{ menu: Menu }> = ({ menu }) => {
  return (
    <S.Wrapper>
      <S.Main>
        {menu.categories.length > 1 && (
          <S.SectionTitle>
            {menu.description
              .replace("/", " /")
              .replace("[", " (")
              .replace("]", ")")
              .replace("{", " (")
              .replace("}", ")")}
          </S.SectionTitle>
        )}
        {menu.categories.length === 1 && (
          <S.SectionTitle>
            {menu.description
              .replace("/", " /")
              .replace("[", " (")
              .replace("]", ")")
              .replace("{", " (")
              .replace("}", ")")}
          </S.SectionTitle>
        )}
        {menu.categories.map((category) => (
          <S.Section key={category.name}>
            {menu.categories.length > 1 && (
              <S.SectionSubTitle>{category.name}</S.SectionSubTitle>
            )}
            {category.entries
              .sort((a, b) => (a.price > b.price ? 1 : -1))
              .map((entry) => (
                <S.Item key={entry.name}>
                  <S.ItemName>{entry.name}</S.ItemName>
                  <S.Price>{entry.price.toString()}</S.Price>
                  <S.ItemDescription
                    dangerouslySetInnerHTML={{ __html: entry.description }}
                  />
                </S.Item>
              ))}
          </S.Section>
        ))}
        <S.HomeLink to='/menu'>Back To Menu</S.HomeLink>
      </S.Main>
    </S.Wrapper>
  );
};

export default MenuCategory;

export const Head: HeadFC = () => (
  <title>Menu - Soul - Specialty Culture</title>
);
