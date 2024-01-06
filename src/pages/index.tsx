import * as React from "react";
import * as S from "../styles/index.styled";

import type { HeadFC, PageProps } from "gatsby";

import Contact from "../components/home/Contact";
import Events from "../components/home/Events";
import Food from "../components/home/Food";
import FoodSection from "../components/home/Location";
import Hero from "../components/home/Hero";
import Wine from "../components/home/Wine";

const IndexPage: React.FC<PageProps> = () => {
  return (
    <S.Wrapper>
      <Hero />
      <FoodSection />
      <Wine />
      <Food />
      <Events />
      <Contact />
    </S.Wrapper>
  );
};

export default IndexPage;

export const Head: HeadFC = () => <title>Soul - Specialty Culture</title>;
