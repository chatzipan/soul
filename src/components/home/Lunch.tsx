import * as React from "react";

import { StaticImage } from "gatsby-plugin-image";

import * as S from "./Common.styled";

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
            href="https://www.metzgerei-keller.ch/en"
            target="_blank"
            rel="noreferrer"
            style={{ color: "inherit" }}
          >
            Metzgerei-Keller
          </a>
          &nbsp;and&nbsp;
          <a
            href="https://www.doerigfisch.ch/home/"
            target="_blank"
            rel="noreferrer"
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
            src="../../images/tuna_bowl.jpg"
            alt="A picture of the tuna bowl"
            aspectRatio={2 / 3}
          />
        </S.ImageWrapper>
        <S.ImageWrapper>
          <StaticImage
            src="../../images/beef_bowl.jpg"
            alt="A picture of the beef bowl"
            aspectRatio={2 / 3}
          />
        </S.ImageWrapper>
      </S.ImageOuterWrapper>
    </S.FoodWrapper>
  );
};

export default Lunch;
