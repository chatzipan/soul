import * as React from "react";
import * as S from "./Common.styled";

import { StaticImage } from "gatsby-plugin-image";

const Location = () => {
  return (
    <S.Wrapper>
      <S.Heading>
        <S.Title>Location</S.Title>
        <S.Description>
          Nestled in the heart of Zurich, Soul is a haven for food and beverage
          enthusiasts
        </S.Description>
      </S.Heading>
      <S.ImageOuterWrapper>
        <S.ImageWrapper>
          <StaticImage
            src='../../images/outside_2.jpg'
            alt='A picture of the outside of the restaurant'
            aspectRatio={1 / 1}
          />
        </S.ImageWrapper>
        <S.ImageWrapper>
          <StaticImage
            src='../../images/outside_4.jpeg'
            alt='A picture of the outside of the restaurant and the sidewalk'
            aspectRatio={1 / 1}
          />
        </S.ImageWrapper>
        <S.ImageWrapper>
          <StaticImage
            src='../../images/outside_3.jpg'
            alt='A picture of the view from inside the restaurant while sitting at a table'
            aspectRatio={1 / 1}
          />
        </S.ImageWrapper>
      </S.ImageOuterWrapper>
    </S.Wrapper>
  );
};

export default Location;
