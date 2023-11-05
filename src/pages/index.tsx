import * as React from "react";
import * as S from "../styles/index.styled";

import type { HeadFC, PageProps } from "gatsby";

import GoogleMapReact from "google-map-react";
import babka from "../images/babka.png"; // Tell webpack this JS file uses this image
import latteArt from "../images/latte_art.png"; // Tell webpack this JS file uses this image
import marker from "../images/map_pin.png";

const SHOP_COORDINATES = {
  lat: 47.37415,
  lng: 8.5431555,
};

const IndexPage: React.FC<PageProps> = () => {
  return (
    <S.Main>
      <S.LatteArtWrapper>
        <S.LatteArt src={latteArt} />
      </S.LatteArtWrapper>
      <S.BabkaWrapper>
        <S.Babka src={babka} />
      </S.BabkaWrapper>
      <S.Logo />
      <S.ComingSoon>coming soon...</S.ComingSoon>
      <S.MapWrapper>
        <GoogleMapReact
          bootstrapURLKeys={{
            key: process.env.GATSBY_GOOGLE_MAPS_API_KEY as string,
          }}
          options={{
            mapId: "e9872451316829c9",
          }}
          defaultCenter={SHOP_COORDINATES}
          defaultZoom={15}
        >
          <S.Marker {...SHOP_COORDINATES} src={marker} />
        </GoogleMapReact>
      </S.MapWrapper>
    </S.Main>
  );
};

export default IndexPage;

export const Head: HeadFC = () => <title>Soul - Specialty Culture</title>;
