import * as S from "./menu.styled";

import type { HeadFC } from "gatsby";
import React from "react";
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

const MenuEntry: React.FC<RouteComponentProps> = ({}) => {
  return <MenuPageComponent menu={menu} />;
};

export const createLink = (category: string) =>
  encodeURI(category.replaceAll(" ", "_")).toLowerCase();

const MenuPageComponent: React.FC<{ menu: Menu[] }> = ({ menu }) => {
  const categories = menu.map((group) => group?.name.trim());

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

export const Head: HeadFC = () => (
  <title>Menu - Soul - All Day Kitchen Bar</title>
);
