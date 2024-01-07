import * as React from "react";
import * as S from "./Hero.styled";

import outside from "../../images/outside.jpeg";

const Hero = () => {
  return (
    <S.Wrapper>
      <S.InnerWrapper>
        <S.Text>Welcome to</S.Text>
        <S.Logo />
        <S.SubTitle>SPECIALTY | CULTURE | CREATIVE | FLAVOURS</S.SubTitle>
      </S.InnerWrapper>
      <S.Image src={outside} />
    </S.Wrapper>
  );
};

export default Hero;
