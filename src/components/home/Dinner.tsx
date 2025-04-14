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
          We offer a variety of dinner options, from our signature dishes to our
          daily specials. Pair your meal with one of our homemade cocktails, or
          carefully selected wines from GaultMillau Switzerland Sommelier of the
          Year 2021&nbsp;
          <a
            href="https://www.cultivatingtaste.com/"
            target="_blank"
            rel="noreferrer"
            style={{ color: "inherit" }}
          >
            Lisa Bader
          </a>
          . Thursdays to Saturdays from 18:00.
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
