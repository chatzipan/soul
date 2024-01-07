import * as React from "react";
import * as S from "./Button.styled";

interface ButtonProps {
  children: React.ReactNode;
  className?: string;
  to?: string;
}

const Button = ({ children, className, to }: ButtonProps) => {
  if (to) {
    return (
      <S.Link className={className} to={to}>
        {children}
      </S.Link>
    );
  }

  return <S.Button className={className}>{children}</S.Button>;
};

export default Button;
