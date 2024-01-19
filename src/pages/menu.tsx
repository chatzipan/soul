import * as S from "../styles/menu.styled";

import type { HeadFC, PageProps } from "gatsby";
import React, { createRef, useEffect, useRef, useState } from "react";

import { useTheme } from "styled-components";
import { useWindowSize } from "react-use";

type MenuEntry = {
  image: null | string;
  imageThumbnail: null | string;
  name: string;
  price: number;
};

type Menu = {
  name: string;
  entries: MenuEntry[];
};

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export async function getServerData() {
  const res = await fetch(
    "https://storage.googleapis.com/soulzuerich.ch/menu.json",
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }
  );

  const menu = (await res.json()) as Menu[];

  return {
    props: {
      menu: [
        {
          name: "Brunch Menu (09:00 - 15:00)",
          entries: [
            {
              name: "French Toast Crème Brûlée",
              price: 14,
              imageThumbnail: null,
              image: null,
            },
            {
              name: "Greek yogurt with homemade granola, honey & fruits",
              price: 18,
              imageThumbnail: null,
              image: null,
            },
            {
              name: "Sweet potato with pico de gallo & romesco",
              price: 22,
              imageThumbnail: null,
              image: null,
            },
            {
              name: "Saksuka",
              price: 22,
              imageThumbnail: null,
              image: null,
            },
            {
              name: "Egg Benedict",
              price: 25,
              imageThumbnail: null,
              image: null,
            },
            {
              name: "Egg Royale",
              price: 26,
              imageThumbnail: null,
              image: null,
            },
            {
              name: "Pastrami-Sando with a green salad",
              price: 26,
              imageThumbnail: null,
              image: null,
            },
            {
              name: "Potato salad with a poached egg and local sausage",
              price: 21,
              imageThumbnail: null,
              image: null,
            },
            {
              name: "Tabbouleh-Salad with falafel & humus",
              price: 24,
              imageThumbnail: null,
              image: null,
            },
            {
              name: "Tabbouleh-Salad with chicken & fetacrème",
              price: 26,
              imageThumbnail: null,
              image: null,
            },
          ],
        },
        {
          name: "Evening Menu (18:00 - 21:00)",
          entries: [
            {
              name: "Potato salad with a poached egg and local sausage",
              price: 21,
              imageThumbnail: null,
              image: null,
            },
            {
              name: "Bread with diverse dips",
              price: 18,
              imageThumbnail: null,
              image: null,
            },
            {
              name: "Beef Tataki with celery scallops and a potato, lime, leek mousse",
              price: 23,
              imageThumbnail: null,
              image: null,
            },
            {
              name: "Beef Carpaccio with rucola and truffle oil",
              price: 24,
              imageThumbnail: null,
              image: null,
            },
            {
              name: "Tabbouleh-Salad with falafel & humus",
              price: 24,
              imageThumbnail: null,
              image: null,
            },
            {
              name: "Tabbouleh-Salad with chicken & fetacrème",
              price: 26,
              imageThumbnail: null,
              image: null,
            },
            {
              name: "Pastrami-Sando with a green salad",
              price: 26,
              imageThumbnail: null,
              image: null,
            },
            {
              name: "Pulled beef burger with a small potato salad",
              price: 26,
              imageThumbnail: null,
              image: null,
            },
            {
              name: "Bruschetta - Chef's choice",
              price: 15,
              imageThumbnail: null,
              image: null,
            },
          ],
        },
        {
          name: "Coffee",
          entries: [
            {
              name: "Espresso",
              price: 5.5,
              imageThumbnail: null,
              image: null,
            },
            {
              name: "Espresso Machiato",
              price: 6.5,
              imageThumbnail: null,
              image: null,
            },
            {
              name: "Double Espresso",
              price: 7,
              imageThumbnail: null,
              image: null,
            },
            {
              name: "Double Espresso Machiato",
              price: 7.5,
              imageThumbnail: null,
              image: null,
            },
            {
              name: "Americano",
              price: 7,
              imageThumbnail: null,
              image: null,
            },
            {
              name: "Cappuccino",
              price: 7,
              imageThumbnail: null,
              image: null,
            },
            {
              name: "Flat White",
              price: 7.5,
              imageThumbnail: null,
              image: null,
            },
            {
              name: "Latte",
              price: 8,
              imageThumbnail: null,
              image: null,
            },
            {
              name: "Filter Coffee",
              price: 8,
              imageThumbnail: null,
              image: null,
            },
            {
              name: "Special filter coffee",
              price: 15,
              imageThumbnail: null,
              image: null,
            },
          ],
        },
        {
          name: "Matcha Latte",
          entries: [
            {
              name: "Matcha Latte",
              price: 9,
              imageThumbnail: null,
              image: null,
            },
          ],
        },
        {
          name: "Hot Chocolate",
          entries: [
            {
              name: "Hot Chocolate",
              price: 8,
              imageThumbnail: null,
              image: null,
            },
          ],
        },
        {
          name: "Tea",
          entries: [
            {
              name: "Bio Long Cui Lu",
              price: 8.5,
              imageThumbnail: null,
              image: null,
            },
            {
              name: "Honey Oolong",
              price: 8.5,
              imageThumbnail: null,
              image: null,
            },
            {
              name: "Milky Oolong",
              price: 8.5,
              imageThumbnail: null,
              image: null,
            },
          ],
        },
        {
          name: "Cold beverage",
          entries: [
            {
              name: "Still water 5dl",
              price: 5.5,
              imageThumbnail: null,
              image: null,
            },
            {
              name: "Still water 1l",
              price: 7,
              imageThumbnail: null,
              image: null,
            },
            {
              name: "Sparkling water 5dl",
              price: 5.5,
              imageThumbnail: null,
              image: null,
            },
            {
              name: "Sparkling water 1l",
              price: 7,
              imageThumbnail: null,
              image: null,
            },
            {
              name: "Hibiscus/Fruit limo",
              price: 7.5,
              imageThumbnail: null,
              image: null,
            },
            {
              name: "Ginger/Lemon limo",
              price: 7.5,
              imageThumbnail: null,
              image: null,
            },
          ],
        },
        {
          name: "Beer",
          entries: [
            {
              name: "Una más 5% - 44cl",
              price: 9,
              imageThumbnail: null,
              image: null,
            },
            {
              name: "Rainbow IPA 6% - 44cl",
              price: 10,
              imageThumbnail: null,
              image: null,
            },
            {
              name: "Zeer nonalcoholic IPA 0.3% - 33cl",
              price: 10,
              imageThumbnail: null,
              image: null,
            },
          ],
        },
        {
          name: "Sparkling Wine",
          entries: [
            {
              name: "Anne Claire Schott, Pét-Nat Rosé 2021 - Glass (1dl)",
              price: 18,
              imageThumbnail: null,
              image: null,
            },
            {
              name: "Anne Claire Schott, Pét-Nat Rosé 2021 - Bottle (7,5dl)",
              price: 120,
              imageThumbnail: null,
              image: null,
            },
            {
              name: "Alexis Totem - Glass (1dl)",
              price: 20,
              imageThumbnail: null,
              image: null,
            },
            {
              name: "Alexis, Totem - Bottle (7,5dl)",
              price: 130,
              imageThumbnail: null,
              image: null,
            },
          ],
        },
        {
          name: "White wine",
          entries: [
            {
              name: "Wittmann, Riesling vom Kalkstein 2021 - Glass (1dl)",
              price: 11,
              imageThumbnail: null,
              image: null,
            },
            {
              name: "Wittmann, Riesling vom Kalkstein 2021 - Bottle (7,5dl)",
              price: 70,
              imageThumbnail: null,
              image: null,
            },
            {
              name: "Riffault, Sancerre Auksinis Maceration Longue 2018 - Glass (1dl)",
              price: 15,
              imageThumbnail: null,
              image: null,
            },
            {
              name: "Riffault, Sancerre Auksinis Maceration Longue 2018 - Bottle (7,5dl)",
              price: 100,
              imageThumbnail: null,
              image: null,
            },
            {
              name: "Hirtzberger, Gründer Veltiner Federspiel Rotes Tor 2021 - Glass (1dl)",
              price: 18,
              imageThumbnail: null,
              image: null,
            },
            {
              name: "Hirtzberger, Gründer Veltiner Federspiel Rotes Tor 2021 - Bottle (7,5dl)",
              price: 120,
              imageThumbnail: null,
              image: null,
            },
          ],
        },
        {
          name: "Red wine",
          entries: [
            {
              name: "Moric, Blaufränkisch Reserve 2018 - Glass (1dl)",
              price: 12,
              imageThumbnail: null,
              image: null,
            },
            {
              name: "Moric, Blaufränkisch Reserve 2018 - Bottle (7,5dl)",
              price: 80,
              imageThumbnail: null,
              image: null,
            },
            {
              name: "Ridge, East Bench Zinfandel 2019 - Glass (1dl)",
              price: 15,
              imageThumbnail: null,
              image: null,
            },
            {
              name: "Ridge, East Bench Zinfandel 2019 - Bottle (7,5dl)",
              price: 100,
              imageThumbnail: null,
              image: null,
            },
            {
              name: "Paitin, Barbaresco Serraboella 2020 - Glass (1dl)",
              price: 20,
              imageThumbnail: null,
              image: null,
            },
            {
              name: "Paitin, Barbaresco Serraboella 2020 - Bottle (7,5dl)",
              price: 130,
              imageThumbnail: null,
              image: null,
            },
          ],
        },
        {
          name: "Homemade Pastries",
          entries: [
            {
              name: "Choco Babka",
              price: 7,
              imageThumbnail: null,
              image: null,
            },
            {
              name: "Cardamom Bun",
              price: 7,
              imageThumbnail: null,
              image: null,
            },
            {
              name: "Cinnamon Roll",
              price: 7,
              imageThumbnail: null,
              image: null,
            },
            {
              name: "Carrotcake",
              price: 8,
              imageThumbnail: null,
              image: null,
            },
            {
              name: "Cheesecake",
              price: 7,
              imageThumbnail: null,
              image: null,
            },
            {
              name: "Paris Brest",
              price: 10,
              imageThumbnail: null,
              image: null,
            },
            {
              name: "Tiramisu",
              price: 10,
              imageThumbnail: null,
              image: null,
            },
          ],
        },
      ],
    },
  };
}

const MenuPage: React.FC<PageProps> = ({ serverData = {} }) => {
  console.log("serverData", serverData);
  const { menu = [] } = serverData as { menu: Menu[] };
  const [activeCategory, setActiveCategory] = useState(menu[0]?.name);
  const sectionRefs = useRef(menu.map(() => createRef()));
  const navItemRefs = useRef(menu.map(() => createRef()));
  const { width } = useWindowSize();
  const theme = useTheme();
  const categories = menu.map((group) => group?.name.trim()).map(capitalize);
  console.log("menu", menu);

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
