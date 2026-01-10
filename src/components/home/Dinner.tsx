import * as React from "react";

import { StaticImage } from "gatsby-plugin-image";

import * as S from "./Common.styled";

const Dinner = () => {
  return (
    <S.DinnerWrapper id="events">
      <S.Heading>
        <S.Title style={{ float: "left", marginRight: "2rem" }}>
          Evenings & Events
        </S.Title>
        <S.Description full>
          We host a variety of events, from our own wine tastings or cocktail
          pairings to company apéros.&nbsp; You can also book our whole place
          for a special occasion like a birthday or a team event. We prepare a
          tailored menu for you.&nbsp;
          <S.TelLinkUnderlined
            href="mailto:hallo@soulzuerich.ch"
            target="_blank"
            style={{ fontWeight: 700, fontSize: "1.5rem" }}
          >
            Email us for enquiries.
          </S.TelLinkUnderlined>
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
      <br />
      <br />
      <S.FoodImageWrapper style={{ margin: "0 auto" }}>
        <StaticImage
          aspectRatio={1 / 1}
          src="../../images/events.jpeg"
          alt="A picture of our chef preparing food for an event"
        />
      </S.FoodImageWrapper>
    </S.DinnerWrapper>
  );
};

export default Dinner;
