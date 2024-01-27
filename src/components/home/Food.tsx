import * as React from "react";
import * as S from "./Common.styled";

import { StaticImage } from "gatsby-plugin-image";

const Food = () => {
  return (
    <S.FoodWrapper>
      <S.Heading>
        <S.Title>Food</S.Title>
        <S.Description>From fresh backed pastries and sweets...</S.Description>
      </S.Heading>
      <S.ImageOuterWrapper>
        <S.FoodImageWrapper>
          <StaticImage
            src='../../images/spinat_roll.jpg'
            alt='Spinach roll with a feta cheese cream'
            transformOptions={{ fit: "fill" }}
          />
        </S.FoodImageWrapper>
        <S.FoodImageWrapper>
          <StaticImage
            aspectRatio={1 / 1}
            src='../../images/paris_brest.jpg'
            alt='Paris Brest'
          />
        </S.FoodImageWrapper>
      </S.ImageOuterWrapper>
      <br />
      <br />
      <br />
      <br />
      <S.Heading>
        <S.Description full>
          ... to savory sandwiches, and brunch options ...
        </S.Description>
      </S.Heading>
      <S.ImageOuterWrapper>
        <S.ImageWrapper>
          <StaticImage
            aspectRatio={1 / 1}
            src='../../images/egg.jpeg'
            alt='A picture of a plate with a fried egg, a slice of bread, and a salad'
          />
        </S.ImageWrapper>
        <S.ImageWrapper>
          <StaticImage
            aspectRatio={1 / 1}
            src='../../images/granola.jpeg'
            alt='A picture of a bowl of granola with a spoon'
          />
        </S.ImageWrapper>
        <S.ImageWrapper>
          <StaticImage
            aspectRatio={1 / 1}
            src='../../images/sando_salad.jpg'
            alt='A picture of a pastrami sandwich with a salad'
          />
        </S.ImageWrapper>
      </S.ImageOuterWrapper>
      <br />
      <br />
      <br />
      <br />
      <S.Heading>
        <S.Title></S.Title>
        <S.Description>
          ... to small plates to accompany your wine
        </S.Description>
      </S.Heading>
      <S.ImageOuterWrapper>
        <S.FoodImageWrapper>
          <StaticImage
            aspectRatio={1 / 1}
            src='../../images/dinner_options.jpeg'
            alt='A picture of a plate with a variety of tapas'
          />
        </S.FoodImageWrapper>
        <S.FoodImageWrapper>
          <StaticImage
            aspectRatio={1 / 1}
            src='../../images/tataki.jpeg'
            alt='A picture of a plate with a variety of tapas'
          />
        </S.FoodImageWrapper>
      </S.ImageOuterWrapper>
    </S.FoodWrapper>
  );
};

export default Food;
