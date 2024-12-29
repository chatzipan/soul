import * as React from "react";
import * as S from "./Button.styled";

interface ButtonProps {
  children: React.ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
  small?: boolean;
  to?: string;
}

const Button = ({
  children,
  className,
  href,
  onClick,
  to,
  small,
}: ButtonProps) => {
  if (to) {
    return (
      <S.Link className={className} to={to}>
        {children}
      </S.Link>
    );
  }

  if (href) {
    return (
      <S.NativeLink
        className={className}
        href={href}
        small={small}
        target='_blank'
      >
        {children}
      </S.NativeLink>
    );
  }

  return (
    <S.Button className={className} onClick={onClick} small={small}>
      {children}
    </S.Button>
  );
};

export default Button;
