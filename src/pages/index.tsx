import * as React from "react";
import * as S from "./index.styled";

import type { HeadFC, PageProps } from "gatsby";

import GoogleMapReact from "google-map-react";
import babka from "../images/babka.png"; // Tell webpack this JS file uses this image
import latteArt from "../images/latte_art.png"; // Tell webpack this JS file uses this image

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
      {/* <div style={{ height: "100vh", width: "100%" }}>
        <GoogleMapReact
          bootstrapURLKeys={{
            key: "AIzaSyAdMwifhhF0K1aYWP3xt6V5uD7ytt_TEDc",
          }}
          options={{
            mapId: "e9872451316829c9",
          }}
          defaultCenter={{ lat: 47.3741264, lng: 8.5431555 }}
          defaultZoom={15}
        >
          <Icon lat={47.3741264} lng={8.5431555} text='My Marker' />
        </GoogleMapReact>
      </div> */}
    </S.Main>
  );
};

export default IndexPage;

export const Head: HeadFC = () => <title>Soul - Specialty Culture</title>;
