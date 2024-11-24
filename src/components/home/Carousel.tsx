// Carousel.tsx
import React, { CSSProperties, useEffect } from "react";
import { useSnapCarousel } from "react-snap-carousel";
import { useMedia } from "react-use";

const styles = {
  root: {
    height: "100%",
    position: "relative",
  },
  scroll: {
    position: "relative",
    display: "flex",
    overflow: "auto",
    scrollSnapType: "x mandatory",
    padding: "0",
    borderRadius: "0.5rem",
  },
  item: {
    width: "100%",
    height: "auto",
    flexShrink: 0,
    borderRadius: "0.5rem",
  },
  itemSnapPoint: {
    scrollSnapAlign: "start",
  },
  controls: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    right: "1rem",
    top: "50%",
    transform: "translateY(-50%)",
  },
  mobileControls: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: "3rem",
    left: "50%",
    transform: "translateX(-50%)",
  },
  pagination: {
    display: "flex",
  },
  paginationButton: {
    margin: "10px",
    width: "20px",
    height: "20px",
    borderRadius: "50%",
    backgroundColor: "#f5c469",
    border: "none",
    cursor: "pointer",
    opacity: 0.7,
  },
  paginationButtonActive: { width: "25px", height: "25px", opacity: 1 },
} satisfies Record<string, CSSProperties>;

interface CarouselProps<T> {
  readonly items: T[];
  readonly renderItem: (
    props: CarouselRenderItemProps<T>
  ) => React.ReactElement<CarouselItemProps>;
}

interface CarouselRenderItemProps<T> {
  readonly item: T;
  readonly isSnapPoint: boolean;
}

export const Carousel = <T extends any>({
  items,
  renderItem,
}: CarouselProps<T>) => {
  const {
    scrollRef,
    pages,
    activePageIndex,
    hasNextPage,
    next,
    goTo,
    snapPointIndexes,
  } = useSnapCarousel();
  const isMobile = useMedia("(max-width: 768px)");

  useEffect(() => {
    const interval = setInterval(() => {
      if (!hasNextPage) {
        goTo(0);
      } else {
        next();
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [goTo, next, hasNextPage]);

  return (
    <div style={styles.root}>
      <ul style={styles.scroll} ref={scrollRef}>
        {items.map((item, i) =>
          renderItem({
            item,
            isSnapPoint: snapPointIndexes.has(i),
          })
        )}
      </ul>
      <div style={isMobile ? styles.mobileControls : styles.controls}>
        {pages.map((_, i) => (
          <button
            key={i}
            style={{
              ...styles.paginationButton,
              ...(activePageIndex === i ? styles.paginationButtonActive : {}),
            }}
            onClick={() => goTo(i)}
          />
        ))}
      </div>
    </div>
  );
};

interface CarouselItemProps {
  readonly isSnapPoint: boolean;
  readonly children?: React.ReactNode;
}

export const CarouselItem = ({ isSnapPoint, children }: CarouselItemProps) => (
  <li
    style={{
      ...styles.item,
      ...(isSnapPoint ? styles.itemSnapPoint : {}),
    }}
  >
    {children}
  </li>
);
