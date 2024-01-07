import * as React from "react";
import * as S from "./Hero.styled";

import inside from "../../images/inside_2.jpg";

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
        <S.Hours>
          <span>Tuesday - Wednesday:</span>
          <span> 8:00 - 19:00</span>
        </S.Hours>
        <S.Hours>
          <span>Thursday - Friday:</span>
          <span> 8:00 - 22:00</span>
        </S.Hours>
        <S.Hours>
          <span>Saturday:</span>
          <span> 9:00 - 22:00</span>
        </S.Hours>
        <S.Hours>
          <span>Sunday:</span>
          <span> 9:00 - 19:00</span>
        </S.Hours>
        <S.Hours>
          <span>Monday:</span>
          <span> Closed</span>
        </S.Hours>
      </S.InnerWrapper>
      <S.Image src={inside} />
    </S.Wrapper>
  );
};

export default Contact;
