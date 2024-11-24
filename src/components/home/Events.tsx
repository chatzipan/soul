import * as React from "react";
import * as S from "./Common.styled";

import { StaticImage } from "gatsby-plugin-image";

const Events = () => {
  return (
    <S.EventWrapper id='events'>
      <S.Heading>
        <S.Title style={{ float: "right", marginLeft: "2rem" }}>Events</S.Title>
        <S.Description full>
          We host a variety of events, from our own wine tastings or cocktail
          pairings to company apéros.&nbsp; You can also book our place for a
          special occasion like a birthday or a team event. We prepare a
          tailored menu for you.&nbsp;
          <S.TelLink
            href='mailto:hallo@soulcoffee.info?subject=Inquiry%20about%20an%20event'
            target='_blank'
          >
            Write us an email
          </S.TelLink>
          &nbsp; for reservations and inquiries.
        </S.Description>
      </S.Heading>
      <S.ImageOuterWrapper>
        <S.FoodImageWrapper style={{ margin: "0 auto" }}>
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
