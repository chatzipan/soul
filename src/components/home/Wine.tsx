import * as React from "react";
import * as S from "./Common.styled";

import { StaticImage } from "gatsby-plugin-image";

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
      <S.ImageOuterWrapper>
        <S.ImageWrapper>
          <StaticImage
            aspectRatio={1 / 1}
            src='../../images/wines.jpeg'
            alt='A picture of the wine collection in the restaurant'
            transformOptions={{ fit: "fill" }}
          />
        </S.ImageWrapper>
        <S.ImageWrapper>
          <StaticImage
            aspectRatio={1 / 1}
            src='../../images/wine_2.jpg'
            alt='A picture of a glass of wine'
          />
        </S.ImageWrapper>
        <S.ImageWrapper>
          <StaticImage
            aspectRatio={1 / 1}
            src='../../images/wine_list.jpg'
            alt='A picture of the wine list'
          />
        </S.ImageWrapper>
      </S.ImageOuterWrapper>
    </S.WineWrapper>
  );
};

export default Wine;
