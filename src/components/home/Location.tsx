import * as React from "react";
import * as S from "./Common.styled";

import outside_2 from "../../images/outside_2.jpg";
import outside_3 from "../../images/outside_3.jpg";
import outside_5 from "../../images/outside_4.jpeg";

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
        <S.Image
          loading='lazy'
          src={outside_2}
          alt='A picture of the outside of the restaurant'
        />
        <S.Image
          loading='lazy'
          src={outside_5}
          alt='A picture of the outside of the restaurant and the sidewalk'
        />
        <S.Image
          loading='lazy'
          src={outside_3}
          alt='A picture of the view from inside the restaurant while sitting at a table'
        />
      </S.ImageWrapper>
    </S.Wrapper>
  );
};

export default Location;
