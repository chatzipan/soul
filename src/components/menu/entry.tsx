import * as S from "./menu.styled";

import type { HeadFC } from "gatsby";
import React, { useEffect, useState } from "react";
import { RouteComponentProps } from "@reach/router";
import menu from "../../../static/menu.json";

type TMenuEntry = {
  image: null | string;
  imageThumbnail: null | string;
  name: string;
  price: number;
};

type Menu = {
  name: string;
  entries: TMenuEntry[];
};

export const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const MenuEntry: React.FC<RouteComponentProps> = ({}) => {
  // const [menu, setMenu] = useState<Menu[]>([]);

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

  return <MenuPageComponent menu={menu} />;
};

export const createLink = (category: string) =>
  encodeURI(category.replaceAll(" ", "_")).toLowerCase();

const MenuPageComponent: React.FC<{ menu: Menu[] }> = ({ menu }) => {
  const categories = menu
    .map((group) => group?.name.trim())
    .map(capitalize)
    .map((category) => category.replace(/\s*\([^)]*\)/, ""))
    .map((category) => category.replace(/\s*\[[^)]*\]/, ""))
    .map((category) =>
      category.replace(/\s*-\s*\d{1,2}:\d{2}\s*-\s*\d{1,2}:\d{2}/, "")
    )
    .map((category) => category.replace("é", "e"))
    .map((category) => category.replace("/", " &"));

  return (
    <S.Wrapper>
      {categories.map((category) => (
        <S.Category to={createLink(category)} key={category}>
          {category}
        </S.Category>
      ))}
      <S.HomeLink to='/'>Home</S.HomeLink>
    </S.Wrapper>
  );
};

export default MenuEntry;

export const Head: HeadFC = () => <title>Menu - Soul - Kitchen Bar</title>;
