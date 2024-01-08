import * as React from "react";
import * as S from "./Button.styled";

interface ButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  to?: string;
}

const Button = ({ children, className, onClick, to }: ButtonProps) => {
  if (to) {
    return (
      <S.Link className={className} to={to}>
        {children}
      </S.Link>
    );
  }

  return (
    <S.Button className={className} onClick={onClick}>
      {children}
    </S.Button>
  );
};

export default Button;
