import * as S from "./menu.styled";

import type { HeadFC } from "gatsby";
import React, { useEffect, useState } from "react";
import { Redirect, RouteComponentProps, useParams } from "@reach/router";
import { capitalize } from "./entry";

type MenuEntry = {
  image: null | string;
  imageThumbnail: null | string;
  name: string;
  price: number;
};

type Menu = {
  name: string;
  entries: MenuEntry[];
};

export const createLink = (category: string) =>
  encodeURI(category.replaceAll(" ", "_")).toLowerCase();

const MenuCategory: React.FC<RouteComponentProps> = ({}) => {
  const [menu, setMenu] = useState<Menu[]>([]);
  const params = useParams();
  const category = params.categoryId;

  useEffect(() => {
    (async () => {
      const res = await fetch(
        "https://storage.googleapis.com/soulzuerich.ch/menu.json",
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      setMenu(await res.json());
    })();
  }, []);

  if (!menu.length) return null;

  const allCategories = menu
    .map((group) => group?.name.trim())
    .map(capitalize)
    .map((category) => category.replace(/\s*\([^)]*\)/, ""))
    .map((category) => category.replace("/", " &"))
    .map((category) => createLink(category));

  if (!allCategories.includes(category)) {
    // Redirect to menu page
    return <Redirect to='/menu' noThrow />;
  }

  const menuIndex = allCategories.indexOf(category);
  const categoryMenu = menu[menuIndex];

  return <MenuCategoryComponent menu={categoryMenu} />;
};

const MenuCategoryComponent: React.FC<{ menu: Menu }> = ({ menu }) => {
  return (
    <S.Wrapper>
      <S.Main>
        <S.Section>
          <S.SectionTitle>{menu.name.replace("/", " /")}</S.SectionTitle>
          {menu.entries
            .sort((a, b) => (a.price > b.price ? 1 : -1))
            .map((entry) => (
              <S.Item key={entry.name}>
                <S.ItemName>{entry.name}</S.ItemName>
                <S.Price>{entry.price.toString()}</S.Price>
              </S.Item>
            ))}
          <S.HomeLink to='/menu'>Back To Categories</S.HomeLink>
        </S.Section>
      </S.Main>
    </S.Wrapper>
  );
};

export default MenuCategory;

export const Head: HeadFC = () => (
  <title>Menu - Soul - Specialty Culture</title>
);
