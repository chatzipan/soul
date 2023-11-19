import * as React from "react";
import * as S from "../styles/index.styled";

import type { HeadFC, PageProps } from "gatsby";

import babka from "../images/choco_babka.png";
import coffee from "../images/coffee.png";
import salad from "../images/salad.png";
import spinach from "../images/spinach.png";
import wine from "../images/wine.png";

const IndexPage: React.FC<PageProps> = () => {
  return (
    <S.ImageWrapper>
      <S.Row>
        <S.Text>
          <S.Title>Soul – Where Every Flavor Tells a Story</S.Title>
          <S.SubTitle>
            Immerse yourself in the warmth of Soul, Zurich's new home for coffee
            connoisseurs and food lovers alike.
          </S.SubTitle>
        </S.Text>
        <S.Image src={spinach} />
      </S.Row>
      <S.Row reverse>
        <S.Text>
          <S.Title>Coffee</S.Title>
          <S.SubTitle>
            Our own artisanal roasting process uncovers the deep, rich tales
            that each bean has to tell. From the hills of Ethiopia to the
            mountains of Colombia, taste the world in every sip.
          </S.SubTitle>
        </S.Text>
        <S.Image src={coffee} />
      </S.Row>
      <S.Row>
        <S.Text>
          <S.Title>Bakery</S.Title>
          <S.SubTitle>
            From our oven to your table – Soul's bakery offerings are a modern
            twist on timeless traditions. Each bite of our pastries and bread is
            a loving homage to the art of baking.
          </S.SubTitle>
        </S.Text>
        <S.Image src={babka} />
      </S.Row>
      <S.Row reverse>
        <S.Text>
          <S.Title>Salads</S.Title>
          <S.SubTitle>
            Taste the fresh canvas of Zurich with Soul's salad selection, a
            harmonious blend of crisp, locally-sourced ingredients, dressed in
            nature's finest flavors.
          </S.SubTitle>
        </S.Text>
        <S.Image src={salad} />
      </S.Row>
      <S.Row>
        <S.Text>
          <S.Title>Wine Pairing</S.Title>
          <S.SubTitle>
            Join us for monthly wine events: taste, learn, and connect over
            expertly paired vintages and gourmet bites in a welcoming, communal
            setting.
          </S.SubTitle>
        </S.Text>
        <S.Image src={wine} />
      </S.Row>
    </S.ImageWrapper>
  );
};

export default IndexPage;

export const Head: HeadFC = () => <title>Soul - Specialty Culture</title>;
