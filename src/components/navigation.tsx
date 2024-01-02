import * as React from "react";
import * as S from "./navigation.styled";

import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";

const btnStyle = { width: "50px", height: "50px" };

const Navigation = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      <S.MenuButton onClick={() => setIsOpen(true)}>
        <MenuIcon style={btnStyle} />
      </S.MenuButton>
      <S.Nav isOpen={isOpen}>
        <S.CloseButton onClick={() => setIsOpen(false)}>
          <CloseIcon style={btnStyle} />
        </S.CloseButton>
        <S.Circles>
          {Array.from({ length: 8 }).map((_, index) => (
            <S.Circle key={index} />
          ))}
        </S.Circles>
        <S.Logo />
        <S.NavList>
          <S.NavItem>ABOUT</S.NavItem>
          <S.NavItem>TEAM</S.NavItem>
          <S.NavItem>MENU</S.NavItem>
          <S.NavItem>
            <S.Link to='/contact'>CONTACT</S.Link>
          </S.NavItem>
        </S.NavList>
      </S.Nav>
    </>
  );
};

export default Navigation;
