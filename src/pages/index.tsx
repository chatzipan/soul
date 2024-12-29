import * as React from "react";
import * as S from "../styles/index.styled";

import type { HeadFC, PageProps } from "gatsby";
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import Contact from "../components/home/Contact";
import Events from "../components/home/Events";
import Lunch from "../components/home/Lunch";
import Brunch from "../components/home/Brunch";
import Hero from "../components/home/Hero";
import Dinner from "../components/home/Dinner";
import { useMemo } from "react";

const IndexPage: React.FC<PageProps> = () => {
  const queryClient = useMemo(
    () =>
      new QueryClient({
        queryCache: new QueryCache({}),
      }),
    []
  );

  return (
    <QueryClientProvider client={queryClient}>
      <S.Wrapper>
        <Hero />
        <Dinner />
        <Lunch />
        <Brunch />
        <Events />
        <Contact />
      </S.Wrapper>
    </QueryClientProvider>
  );
};

export default IndexPage;

export const Head: HeadFC = () => <title>Soul - All</title>;
