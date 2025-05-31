import * as React from "react";

import CircularProgress from "@mui/material/CircularProgress";
import { StaticImage } from "gatsby-plugin-image";

import {
  DayOfWeek,
  RestaurantSettings,
} from "../../../functions/src/types/settings";
import { useOpeningHours } from "../../hooks/useOpeningHours";
import { BookingForm } from "../booking-form/BookingForm";
import * as S from "./Hero.styled";

export const SORTED_DAYS = [
  DayOfWeek.Monday,
  DayOfWeek.Tuesday,
  DayOfWeek.Wednesday,
  DayOfWeek.Thursday,
  DayOfWeek.Friday,
  DayOfWeek.Saturday,
  DayOfWeek.Sunday,
];

const Contact = () => {
  const response = useOpeningHours();
  const [openBookingForm, setOpenBookingForm] = React.useState(false);

  const openingDays = (response?.data as unknown as RestaurantSettings)
    ?.openingDays;

  return (
    <>
      <S.Wrapper>
        <S.InnerWrapper>
          <S.Text>Contact Us</S.Text>
          <S.TelLink
            href="https://maps.app.goo.gl/WRv18c9xyjtEPY6AA"
            target="_blank"
          >
            Limmatquai 94, 8001, Zürich
          </S.TelLink>
          <S.TelLink href="tel:+41445991366">+41 44 599 13 66</S.TelLink>
          <S.TelLink href="mailto:hallo@soulzuerich.ch" target="_blank">
            hallo@soulzuerich.ch
          </S.TelLink>
          <S.TelLink
            href="https://www.instagram.com/soul_zurich/"
            target="_blank"
          >
            soul_zurich
          </S.TelLink>
          <br />
          <br />
          <S.Text>Reservations:</S.Text>
          <br />
          <S.TextSmall>
            - BRUNCH on WEEKENDS: no reservation needed, just come on in and we
            will find you a table as soon as possible.
            <br />
            <br />- ALL other days and hours:&nbsp;
            <S.TelLinkUnderlined onClick={() => setOpenBookingForm(true)}>
              <u>book here</u>
            </S.TelLinkUnderlined>
            <br />
            <br />- Special Occasions: Birthdays or a Team Event?&nbsp;
            <S.TelLinkUnderlined
              href="mailto:hallo@soulzuerich.ch"
              target="_blank"
            >
              email us.
            </S.TelLinkUnderlined>
            , and we'll tailor an offer that fits perfectly with your needs.
          </S.TextSmall>
          <br />
          <br />
          <S.Text>Opening Hours</S.Text>
          {response?.isLoading ? (
            <CircularProgress />
          ) : (
            SORTED_DAYS.map((day) => {
              const openingHours =
                openingDays?.[day as keyof typeof openingDays]?.openingHours;

              const isDinnerDay = [
                DayOfWeek.Thursday,
                DayOfWeek.Friday,
                DayOfWeek.Saturday,
              ].includes(day);

              return (
                <S.Hours key={day}>
                  <span>
                    {day}
                    {isDinnerDay && <>&nbsp;*</>}
                  </span>
                  <span>
                    {openingHours?.start} - {openingHours?.end}
                  </span>
                </S.Hours>
              );
            })
          )}
          <br />
          <S.Hours>* Kitchen closes at 21:00</S.Hours>
        </S.InnerWrapper>
        <S.ImageWrapper>
          <StaticImage
            src="../../images/outside_rain.jpeg"
            alt="A picture of the outside of the restaurant in the rain"
            style={{ height: "100%" }}
          />
        </S.ImageWrapper>
      </S.Wrapper>
      <BookingForm
        isOpen={openBookingForm}
        onClose={() => setOpenBookingForm(false)}
        selectedDate={null}
      />
    </>
  );
};

export default Contact;
