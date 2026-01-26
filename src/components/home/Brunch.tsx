import * as React from "react";

import { StaticImage } from "gatsby-plugin-image";

import * as S from "./Common.styled";

const Brunch = () => {
  return (
    <S.FoodWrapper style={{ paddingTop: "0" }}>
      <S.Heading>
        <S.Title style={{ float: "left", marginRight: "2rem" }}>Brunch</S.Title>
        <S.Description full>
          Weather you like pastries such as daily made buns or something more
          special, like our egg benedict or pastrami sando, we have you covered.
          Accompany your meal with a freshly brewed coffee carefully selected by
          our partner&nbsp;
          <a
            href="https://beanbank.coffee/en"
            target="_blank"
            rel="noreferrer"
            style={{ color: "inherit" }}
          >
            Bean Bank Roasters
          </a>
          . Mondays to Fridays from 08:00 to 14:00. Weekends until 16:00.
        </S.Description>
      </S.Heading>
      <S.ImageOuterWrapper>
        <S.ImageWrapper>
          <StaticImage
            src="../../images/eggs.jpg"
            alt="A picture of the shakshouka"
            aspectRatio={1 / 1}
            transformOptions={{ fit: "contain" }}
          />
        </S.ImageWrapper>
        <S.ImageWrapper>
          <StaticImage
            src="../../images/sando2.jpg"
            alt="A picture of the pastrami sando"
            aspectRatio={1 / 1}
          />
        </S.ImageWrapper>
      </S.ImageOuterWrapper>
    </S.FoodWrapper>
  );
};

export default Brunch;
