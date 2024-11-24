import * as React from "react";
import * as S from "./Hero.styled";

import Button from "../shared/Button";

import outside from "../../images/outside.jpeg";
import dinnerOptions from "../../images/dinner_options.jpeg";
import chef_cooking from "../../images/chef_cooking.jpg";
import evening_outside from "../../images/evening_outside.jpg";
import buratta from "../../images/buratta.jpg";
import cocktail from "../../images/cocktail.jpeg";

import { Carousel, CarouselItem } from "./Carousel";

const images = [
  {
    src: outside,
    alt: "A picture of the outside of the restaurant",
    id: 1,
  },
  {
    src: dinnerOptions,
    alt: "A picture of the dinner options",
    id: 2,
  },
  {
    src: cocktail,
    alt: "A picture of a cocktail",
    id: 3,
  },
  {
    src: chef_cooking,
    alt: "A picture of the chef cooking",
    id: 4,
  },
  {
    src: buratta,
    alt: "A picture of the buratta",
    id: 5,
  },
  {
    src: evening_outside,
    alt: "A picture of the evening outside",
    id: 6,
  },
];

const Hero = () => {
  const scrollToEventsSection = () => {
    const eventsSection = document.getElementById("events");
    if (eventsSection) {
      eventsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <S.Wrapper>
      <S.InnerWrapper>
        <S.Text>Welcome to</S.Text>
        <br />
        <S.Logo />
        <S.SubTitle>ALL DAY KITCHEN BAR</S.SubTitle>
        <br />
        <S.MenuButtons>
          <Button to='/menu/dinner'>Dinner</Button>
          <Button to='/menu/lunch'>Lunch</Button>
          <Button to='/menu/brunch'>Brunch</Button>
          <Button to='/menu/wine'>Wine</Button>
          <Button to='/menu/cocktails'>Cocktails</Button>
          <Button to='/menu'>All menu</Button>
          <Button onClick={scrollToEventsSection}>Events</Button>
        </S.MenuButtons>
      </S.InnerWrapper>
      <S.ImageWrapper>
        <Carousel
          items={images}
          renderItem={({ item, isSnapPoint }) => (
            <CarouselItem key={item.id} isSnapPoint={isSnapPoint}>
              <img
                src={item.src}
                width='100%'
                height='auto'
                alt=''
                style={{
                  objectFit: "cover",
                }}
              />
            </CarouselItem>
          )}
        />
      </S.ImageWrapper>
    </S.Wrapper>
  );
};

export default Hero;
