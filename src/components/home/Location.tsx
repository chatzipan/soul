import * as React from "react";
import * as S from "./Common.styled";

import outside_2 from "../../images/outside_2.jpg";
import outside_3 from "../../images/outside_3.jpg";
import outside_5 from "../../images/outside_5.jpg";

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
      <S.ImageWrapper>
        <S.Image loading='lazy' src={outside_2} />
        <S.Image loading='lazy' src={outside_5} />
        <S.Image loading='lazy' src={outside_3} />
      </S.ImageWrapper>
    </S.Wrapper>
  );
};

export default Location;
