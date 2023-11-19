import * as React from "react";
import * as S from "../styles/contact.styled";

import type { HeadFC, PageProps } from "gatsby";

import Address from "@mui/icons-material/Business";
import Email from "@mui/icons-material/Email";
import GoogleMapReact from "google-map-react";
import Instagram from "@mui/icons-material/Instagram";
import Phone from "@mui/icons-material/Phone";
import marker from "../images/map_pin.png";

const SHOP_COORDINATES = {
  lat: 47.37415,
  lng: 8.5431555,
};

const MAP_ID = "e9872451316829c9";

const IndexPage: React.FC<PageProps> = () => {
  const openMapLink = () => {
    window.open("https://maps.app.goo.gl/WRv18c9xyjtEPY6AA");
  };

  return (
    <>
      <S.Wrapper>
        <S.SubTitle>
          <Address fontSize='large' />
          Limmatquai 94, 8001, Zürich
        </S.SubTitle>
        <S.SubTitle>
          <Phone fontSize='large' />
          <S.TelLink href='tel:+41445991366'>+41 44 599 13 66</S.TelLink>
        </S.SubTitle>
        <S.SubTitle>
          <Email fontSize='large' />
          <S.TelLink href='mailto:hallo@soulcoffee.info'>
            hallo@soulcoffee.info
          </S.TelLink>
        </S.SubTitle>
        <S.SubTitle>
          <Instagram fontSize='large' />
          <S.TelLink href='https://www.instagram.com/zurich_soul/'>
            zurich_soul
          </S.TelLink>
        </S.SubTitle>
      </S.Wrapper>
      <S.MapWrapper>
        <GoogleMapReact
          bootstrapURLKeys={{
            key: process.env.GATSBY_GOOGLE_MAPS_API_KEY as string,
          }}
          options={{ mapId: MAP_ID, minZoom: 10, fullscreenControl: false }}
          defaultCenter={SHOP_COORDINATES}
          defaultZoom={15}
        >
          <S.Marker onClick={openMapLink} {...SHOP_COORDINATES} src={marker} />
        </GoogleMapReact>
      </S.MapWrapper>
    </>
  );
};

export default IndexPage;

export const Head: HeadFC = () => <title>Soul - Specialty Culture</title>;
