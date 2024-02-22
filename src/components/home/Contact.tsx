import * as React from "react";
import * as S from "./Hero.styled";

import { StaticImage } from "gatsby-plugin-image";

const entries = [
  ["Tuesday - Wednesday:", "8:00 - 19:00"],
  ["Thursday - Friday:", "8:00 - 22:00"],
  ["Saturday:", "9:00 - 22:00"],
  ["Sunday:", "9:00 - 19:00"],
  ["Monday:", "Closed"],
];

const Contact = () => {
  return (
    <S.Wrapper>
      <S.InnerWrapper>
        <S.Text>Contact Us</S.Text>
        <S.TelLink
          href='https://maps.app.goo.gl/WRv18c9xyjtEPY6AA'
          target='_blank'
        >
          Limmatquai 94, 8001, Zürich
        </S.TelLink>
        <S.TelLink href='tel:+41445991366'>+41 44 599 13 66</S.TelLink>
        <S.TelLink href='mailto:hallo@soulcoffee.info' target='_blank'>
          hallo@soulcoffee.info
        </S.TelLink>
        <S.TelLink
          href='https://www.instagram.com/zurich_soul/'
          target='_blank'
        >
          zurich_soul
        </S.TelLink>
        <br />
        <S.Text>Opening Hours</S.Text>
        {entries.map((entry, index) => (
          <S.Hours key={index}>
            <span>{entry[0]}</span>
            <span>{entry[1]}</span>
          </S.Hours>
        ))}
      </S.InnerWrapper>
      <S.ImageWrapper>
        <StaticImage
          src='../../images/inside_2.jpg'
          alt='A picture of the inside of the restaurant'
          style={{ height: "100%" }}
        />
      </S.ImageWrapper>
    </S.Wrapper>
  );
};

export default Contact;
