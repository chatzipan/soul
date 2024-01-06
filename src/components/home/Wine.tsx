import * as React from "react";
import * as S from "./Common.styled";

import wine_2 from "../../images/wine_2.jpg";
import wine_list from "../../images/wine_list.jpg";
import wines from "../../images/wines.jpeg";

const Wine = () => {
  return (
    <S.WineWrapper>
      <S.Heading>
        <S.Description>
          Soul’s wine cellar is a carefully curated collection of wines,
          selected from around the world
        </S.Description>
        <S.WineTitle>Wine</S.WineTitle>
      </S.Heading>
      <S.ImageWrapper>
        <S.Image loading='lazy' src={wines} />
        <S.Image loading='lazy' src={wine_2} />
        <S.Image loading='lazy' src={wine_list} />
      </S.ImageWrapper>
    </S.WineWrapper>
  );
};

export default Wine;
