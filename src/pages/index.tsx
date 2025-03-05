import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import * as React from "react";
import { useMemo } from "react";

import type { HeadFC, PageProps } from "gatsby";

import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import de from "date-fns/locale/de";

import Brunch from "../components/home/Brunch";
import Contact from "../components/home/Contact";
import Dinner from "../components/home/Dinner";
import Events from "../components/home/Events";
import Hero from "../components/home/Hero";
import Lunch from "../components/home/Lunch";
import SEO from "../components/shared/SEO";
import * as S from "../styles/index.styled";

const IndexPage: React.FC<PageProps> = () => {
  const queryClient = useMemo(
    () =>
      new QueryClient({
        queryCache: new QueryCache({}),
      }),
    [],
  );

  return (
    <QueryClientProvider client={queryClient}>
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={de}>
        <S.Wrapper>
          <Hero />
          <Dinner />
          <Lunch />
          <Brunch />
          <Events />
          <Contact />
        </S.Wrapper>
      </LocalizationProvider>
    </QueryClientProvider>
  );
};

export default IndexPage;

export const Head: HeadFC = () => <SEO />;
