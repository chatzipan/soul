import * as React from "react";
import * as S from "./Common.styled";

import { StaticImage } from "gatsby-plugin-image";

const Events = () => {
  return (
    <S.EventWrapper>
      <S.Heading>
        <S.Description>
          We host a variety of events, from wine tastings to company
          apéros.&nbsp;
          <S.TelLink href='mailto:hallo@soulcoffee.info?subject=Inquiry%20about%20an%20event'>
            Contact
          </S.TelLink>
          &nbsp;us for event reservations.
        </S.Description>
        <S.Title>Events</S.Title>
      </S.Heading>
      <S.ImageOuterWrapper>
        <S.FoodImageWrapper>
          <StaticImage
            aspectRatio={1 / 1}
            src='../../images/events.jpg'
            alt='A picture of our chef preparing food in the kitchen'
            transformOptions={{ fit: "fill" }}
          />
        </S.FoodImageWrapper>
        <S.FoodImageWrapper>
          <StaticImage
            aspectRatio={1 / 1}
            src='../../images/events_2.jpg'
            alt='A picture of our chef preparing food for an event'
          />
        </S.FoodImageWrapper>
      </S.ImageOuterWrapper>
    </S.EventWrapper>
  );
};

export default Events;
