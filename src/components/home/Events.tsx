import * as React from "react";
import { format } from "date-fns";

import * as S from "./Common.styled";
import { useSoulEvents } from "../../hooks/useSoulEvents";

import { StaticImage } from "gatsby-plugin-image";
import { Reservation } from "../../types";
import Button from "../shared/Button";

const Events = () => {
  const response = useSoulEvents();
  const today = new Date().setHours(0, 0, 0, 0);

  const events = (response?.data as Reservation[])?.filter((event) => {
    const eventDate = new Date(event.date).setHours(0, 0, 0, 0);
    return eventDate >= today;
  });

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
          &nbsp;for reservations and inquiries.
        </S.Description>
      </S.Heading>
      <S.ImageOuterWrapper>
        <S.FoodImageWrapper style={{ margin: "0 auto" }}>
          <S.Description full>
            🍸 <u>Upcoming Events:</u>
          </S.Description>
          <S.EventList>
            {events?.length === 0 && (
              <S.Description full>
                Stay tuned for upcoming events!
              </S.Description>
            )}
            {events?.map((event) => {
              const formattedDate = format(new Date(event.date), "dd.MM.yyyy");
              const href = `mailto:hallo@soulcoffee.info?subject=Inquiry%20about%20${event.eventTitle}&body=Hello%20Soul%20Coffee,%20I%20would%20like%20to%20book%20a%20place%20for%20X persons on the ${event.eventTitle}%20on%20${formattedDate}.%20Thank%20you!`;

              return (
                <S.Event key={event.id}>
                  <S.Description full style={{ fontWeight: 300 }}>
                    {formattedDate}&nbsp;-&nbsp;{event.eventTitle}
                  </S.Description>
                  <S.Description
                    full
                    style={{ fontSize: "1.25rem", fontWeight: 300 }}
                  >
                    {event.eventInfo}&nbsp;-&nbsp;Starts at&nbsp;{event.time}
                    <br />
                    <br />
                    <Button small href={href}>
                      Book now
                    </Button>
                  </S.Description>
                </S.Event>
              );
            })}
          </S.EventList>
        </S.FoodImageWrapper>
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
