import * as React from "react";

import { StaticImage } from "gatsby-plugin-image";

import * as S from "./Common.styled";

const Dinner = () => {
  return (
    <S.DinnerWrapper>
      <S.Heading>
        <S.Title style={{ float: "left", marginRight: "2rem" }}>
          Evenings at Soul
        </S.Title>
        <S.Description full>
          We offer a variety of dinner options, from our signature dishes a lá
          carte to our Soul Tasting Menu:
          <br /> Let us surprise you with a 3-course shared menu, thoughtfully
          prepared with our current favorites. Your experience begins with a
          delightful snack, followed by a variety of starters, a flavorful main
          course, and a sweet treat to finish. Pair your meal with one of our
          homemade cocktails, or carefully selected wines. Thursdays to
          Saturdays from 18:00 to 22:00.
        </S.Description>
      </S.Heading>
      <S.ImageOuterWrapper>
        <S.ImageWrapper>
          <StaticImage
            src="../../images/filet.jpg"
            alt="A picture of the tuna tataki dish"
          />
        </S.ImageWrapper>
        <S.ImageWrapper>
          <StaticImage
            src="../../images/dinner_cocktail.jpeg"
            alt="A picture of a cocktail in a glass"
            aspectRatio={1 / 1}
          />
        </S.ImageWrapper>
      </S.ImageOuterWrapper>
    </S.DinnerWrapper>
  );
};

export default Dinner;
