import * as React from "react";
import * as S from "./Common.styled";

import egg from "../../images/egg.jpeg";
import granola from "../../images/granola.jpeg";
import paris_brest from "../../images/paris_brest.jpg";
import sando_salad from "../../images/sando_salad.jpg";
import spinach_roll from "../../images/spinat_roll.jpg";
import tapas from "../../images/tapas_2.jpg";

const Food = () => {
  return (
    <S.FoodWrapper>
      <S.Heading>
        <S.Title>Food</S.Title>
        <S.Description>From fresh backed pastries and sweets...</S.Description>
      </S.Heading>
      <S.ImageWrapper>
        <S.FoodImage loading='lazy' src={spinach_roll} />
        <S.FoodImage loading='lazy' src={paris_brest} />
      </S.ImageWrapper>
      <br />
      <br />
      <br />
      <br />
      <S.Heading>
        <S.Description full>
          ... to savory sandwiches, and brunch options ...
        </S.Description>
      </S.Heading>
      <S.ImageWrapper>
        <S.Image loading='lazy' src={egg} />
        <S.Image loading='lazy' src={granola} />
        <S.Image loading='lazy' src={sando_salad} />
      </S.ImageWrapper>
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
      <S.ImageWrapper>
        <S.FoodImage loading='lazy' src={tapas} />
      </S.ImageWrapper>
    </S.FoodWrapper>
  );
};

export default Food;
