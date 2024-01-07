import * as React from "react";
import * as S from "./Button.styled";

interface ButtonProps {
  children: React.ReactNode;
  to?: string;
}

const Button = ({ children, to }: ButtonProps) => {
  if (to) {
    return <S.Link to={to}>{children}</S.Link>;
  }

  return <S.Button>{children}</S.Button>;
};

export default Button;
