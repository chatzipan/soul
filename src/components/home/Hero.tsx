import * as React from "react";
import * as S from "./Hero.styled";

import Button from "../Button";
import outside from "../../images/outside.jpeg";

const Hero = () => {
  return (
    <S.Wrapper>
      <S.InnerWrapper>
        <S.Text>Welcome to</S.Text>
        <S.Logo />
        <S.SubTitle>SPECIALTY | CULTURE | CREATIVE | FLAVOURS</S.SubTitle>
        <br />
        <Button to='/menu'>Menu</Button>
      </S.InnerWrapper>
      <S.Image src={outside} alt='A picture of the outside of the restaurant' />
    </S.Wrapper>
  );
};

export default Hero;
