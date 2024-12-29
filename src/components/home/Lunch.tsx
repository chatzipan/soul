import * as React from "react";
import * as S from "./Common.styled";

import { StaticImage } from "gatsby-plugin-image";

const Lunch = () => {
  return (
    <S.FoodWrapper>
      <S.Heading>
        <S.Title style={{ float: "right", marginLeft: "2rem", width: "250px" }}>
          Business Lunch
        </S.Title>
        <S.Description full>
          Enjoy our freshly made Poke Bowls (Veggie / Tuna / Beef) with an
          accompanying daily soup or salad. We use high quality local
          ingredients from partners such as&nbsp;
          <a
            href='https://www.metzgerei-keller.ch/en'
            target='_blank'
            rel='noreferrer'
            style={{ color: "inherit" }}
          >
            Metzgerei-Keller
          </a>
          &nbsp;and&nbsp;
          <a
            href='https://www.doerigfisch.ch/home/'
            target='_blank'
            rel='noreferrer'
            style={{ color: "inherit" }}
          >
            doerigfisch
          </a>
          . Mondays to Fridays from 12:00 to 16:00.
        </S.Description>
      </S.Heading>
      <S.ImageOuterWrapper>
        <S.ImageWrapper>
          <StaticImage
            src='../../images/poke_bowl.jpeg'
            alt='A picture of the poke bowl'
            aspectRatio={2 / 3}
          />
        </S.ImageWrapper>
        <S.ImageWrapper>
          <StaticImage
            src='../../images/salad.jpeg'
            alt='A picture of the salad'
            aspectRatio={2 / 3}
          />
        </S.ImageWrapper>
      </S.ImageOuterWrapper>
    </S.FoodWrapper>
  );
};

export default Lunch;
