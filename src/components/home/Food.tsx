import * as React from "react";
import * as S from "./Common.styled";

import dinner from "../../images/dinner_options.jpg";
import egg from "../../images/egg.jpeg";
import granola from "../../images/granola.jpeg";
import paris_brest from "../../images/paris_brest.jpg";
import sando_salad from "../../images/sando_salad.jpg";
import spinach_roll from "../../images/spinat_roll.jpg";
import tapas from "../../images/tapas_2.jpg";
import tapas2 from "../../images/tapas_3.jpg";
import tataki from "../../images/tataki.jpg";

const Food = () => {
  return (
    <S.FoodWrapper>
      <S.Heading>
        <S.Title>Food</S.Title>
        <S.Description>From fresh backed pastries and sweets...</S.Description>
      </S.Heading>
      <S.ImageWrapper>
        <S.FoodImage
          loading='lazy'
          src={spinach_roll}
          alt='Spinach roll with a feta cheese cream'
        />
        <S.FoodImage loading='lazy' src={paris_brest} alt='Paris Brest' />
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
        <S.Image
          loading='lazy'
          src={egg}
          alt='A picture of a plate with a fried egg, a slice of bread, and a salad'
        />
        <S.Image
          loading='lazy'
          src={granola}
          alt='A picture of a bowl of granola with a spoon'
        />
        <S.Image
          loading='lazy'
          src={sando_salad}
          alt='A picture of a pastrami sandwich with a salad'
        />
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
        <S.FoodImage
          loading='lazy'
          src={dinner}
          alt='A picture of a plate with a variety of tapas'
        />
        <S.FoodImage
          loading='lazy'
          src={tataki}
          alt='A picture of a tataki plate'
        />
      </S.ImageWrapper>
    </S.FoodWrapper>
  );
};

export default Food;
