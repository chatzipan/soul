import * as React from "react";

import * as S from "./Button.styled";

interface ButtonProps {
  children: React.ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
  small?: boolean;
  style?: React.CSSProperties;
  reverse?: boolean;
  to?: string;
}

const Button = ({
  children,
  className,
  href,
  onClick,
  to,
  small,
  reverse,
  style,
}: ButtonProps) => {
  if (to) {
    return (
      <S.Link className={className} to={to} style={style}>
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
        target="_blank"
        style={style}
      >
        {children}
      </S.NativeLink>
    );
  }

  return (
    <S.Button
      className={className}
      onClick={onClick}
      small={small}
      reverse={reverse}
      style={style}
    >
      {children}
    </S.Button>
  );
};

export default Button;
