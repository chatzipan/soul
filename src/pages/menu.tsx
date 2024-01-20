import * as S from "../styles/menu.styled";

import type { HeadFC, PageProps } from "gatsby";
import React, { createRef, useEffect, useRef, useState } from "react";

import menu from "../../static/menu.json";
import { useTheme } from "styled-components";
import { useWindowSize } from "react-use";

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const categories = menu
  .map((group) =>
    group.name.replace("Homemade", "").replace("Soulfood", "food").trim()
  )
  .map(capitalize);

const MenuPage: React.FC<PageProps> = () => {
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const sectionRefs = useRef(categories.map(() => createRef()));
  const navItemRefs = useRef(categories.map(() => createRef()));
  const { width } = useWindowSize();
  const theme = useTheme();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = sectionRefs.current.findIndex(
              (ref) => ref.current === entry.target
            );
            const category = categories[index];
            setActiveCategory(() => {
              if (width <= Number(theme.sizes.tablet.replace("px", ""))) {
                (
                  navItemRefs.current[index].current as Element
                )?.scrollIntoView();
              }

              return category;
            });
          }
        });
      },
      { threshold: 0.5 }
    );

    sectionRefs.current.forEach((ref) => {
      observer.observe(ref.current as Element);
    });

    return () => {
      sectionRefs.current.forEach((ref) => {
        if (!ref.current) return;
        observer.unobserve(ref.current as Element);
      });
    };
  }, []);

  const handleCategoryClick = (category: string) => {
    const index = categories.findIndex((c) => c === category);
    (sectionRefs.current[index].current as Element)?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <S.Wrapper>
      <S.Sidebar>
        {categories.map((category, i) => (
          <S.Category
            active={category === activeCategory}
            onClick={() => handleCategoryClick(category)}
            // @ts-ignore
            ref={navItemRefs.current[i]}
            key={category}
          >
            {category}
          </S.Category>
        ))}
        <S.HomeLink to='/'>Home</S.HomeLink>
      </S.Sidebar>
      <S.Main>
        {menu.map((group, i) => (
          // @ts-ignore
          <S.Section ref={sectionRefs.current[i]} key={group.name}>
            {group.entries.map((entry) => (
              <S.Item key={entry.name}>
                <S.ItemName>{entry.name}</S.ItemName>
                <S.Price>{entry.price.toString()}</S.Price>
              </S.Item>
            ))}
          </S.Section>
        ))}
        <S.ScrollToTop
          onClick={() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          &#8593;
        </S.ScrollToTop>
      </S.Main>
    </S.Wrapper>
  );
};

export default MenuPage;

export const Head: HeadFC = () => (
  <title>Menu - Soul - Specialty Culture</title>
);
