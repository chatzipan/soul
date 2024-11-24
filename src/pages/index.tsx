import * as React from "react";
import * as S from "../styles/index.styled";

import type { HeadFC, PageProps } from "gatsby";

import Contact from "../components/home/Contact";
import Events from "../components/home/Events";
import Lunch from "../components/home/Lunch";
import Brunch from "../components/home/Brunch";
import Hero from "../components/home/Hero";
import Dinner from "../components/home/Dinner";

const IndexPage: React.FC<PageProps> = () => {
  return (
    <S.Wrapper>
      <Hero />
      <Dinner />
      <Lunch />
      <Brunch />
      <Events />
      <Contact />
    </S.Wrapper>
  );
};

export default IndexPage;

export const Head: HeadFC = () => <title>Soul - All</title>;
