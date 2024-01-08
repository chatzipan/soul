import * as React from "react";
import * as S from "./Common.styled";

import events from "../../images/events.jpg";
import events_2 from "../../images/events_2.jpg";

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
      <S.ImageWrapper>
        <S.FoodImage
          loading='lazy'
          src={events}
          alt='A picture of our chef preparing food in the kitchen'
        />
        <S.FoodImage
          loading='lazy'
          src={events_2}
          alt='A picture of our chef preparing food for an event'
        />
      </S.ImageWrapper>
    </S.EventWrapper>
  );
};

export default Events;
