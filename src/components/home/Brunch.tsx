import * as React from "react";
import * as S from "./Common.styled";

import { StaticImage } from "gatsby-plugin-image";

const Brunch = () => {
  return (
    <S.FoodWrapper>
      <S.Heading>
        <S.Title style={{ float: "left", marginRight: "2rem" }}>Brunch</S.Title>
        <S.Description full>
          Weather you like pastries such as daily made buns or traditional greek
          spinach pie, or something more special, like our egg royal or pastrami
          sando, we have you covered. Accompany your meal with a freshly brewed
          coffee carefully selected by our partner&nbsp;
          <a
            href='https://beanbank.coffee/en'
            target='_blank'
            rel='noreferrer'
            style={{ color: "inherit" }}
          >
            Bean Bank Roasters
          </a>
          . Mondays to Fridays from 08:00 to 12:00. Weekends until 16:00.
        </S.Description>
      </S.Heading>
      <S.ImageOuterWrapper>
        <S.ImageWrapper>
          <StaticImage
            src='../../images/brunch.jpg'
            alt='A picture of the pastrami sando'
            aspectRatio={1 / 1}
            transformOptions={{ fit: "contain" }}
          />
        </S.ImageWrapper>
        <S.ImageWrapper>
          <StaticImage
            src='../../images/sando.jpg'
            alt='A picture of the brunch'
            aspectRatio={2 / 3}
          />
        </S.ImageWrapper>
      </S.ImageOuterWrapper>
    </S.FoodWrapper>
  );
};

export default Brunch;
