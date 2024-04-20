import * as React from "react";
import * as S from "./Hero.styled";

import Button from "../shared/Button";
import { StaticImage } from "gatsby-plugin-image";

const Hero = () => {
  return (
    <S.Wrapper>
      <S.InnerWrapper>
        <S.Text>Welcome to</S.Text>
        <br />
        <S.Logo />
        <S.SubTitle>SPECIALTY | CULTURE | CREATIVE | FLAVOURS</S.SubTitle>
        <br />
        <Button to='/menu'>Menu</Button>
      </S.InnerWrapper>
      <S.ImageWrapper>
        <StaticImage
          src='../../images/outside.jpeg'
          alt='A picture of the outside of the restaurant'
          style={{ height: "100%" }}
          loading='eager'
        />
      </S.ImageWrapper>
    </S.Wrapper>
  );
};

export default Hero;
