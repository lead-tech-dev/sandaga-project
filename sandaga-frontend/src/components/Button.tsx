import React, { FunctionComponent, ReactElement } from "react";
import {Link} from "react-router-dom";

interface ButtonProps {
  type: "button" | "link" | "submit";
  className: string;
  label?: string;
  iconLeft?: ReactElement;
  iconRight?: ReactElement;
  onClick: (e: any) => void;
  link?: string;
  disabled?: boolean;
  spanClassName?: string | null;
  number?: number | null;
  loading?: ReactElement;
  favoriteCount?: any;
  messageCount?: number;
}

const Button: FunctionComponent<ButtonProps> = ({
  className,
  label,
  iconLeft,
  iconRight,
  type,
  link,
  onClick,
  disabled,
  spanClassName,
  number, loading,
  favoriteCount,
  messageCount
}) => {
  return type === "button" || type === "submit" ? (
    <button
      type={type}
      className={`btn ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {number && <span className="number">{number}</span>}
      {iconLeft && <span className="icon-left">{iconLeft}</span>}
      <span className={spanClassName ? spanClassName : ""}>{label}</span>
      <span className="icon-right">{iconRight && iconRight}</span>
    </button>
  ) : (
    <Link
      className={`${className}`}
      data-toggle="collapse"
      to={link ? link : ""}
      role="button"
      aria-expanded="false"
      onClick={(e) => onClick(e)}
    >
      {iconLeft && iconLeft}
      {loading ? <span>{loading}</span> : <span>{label}</span>}
      {iconRight && iconRight}
      {favoriteCount && favoriteCount.length > 0 && <span className="favorite">{favoriteCount.length}</span>}
      {messageCount && messageCount > 0 ? <span className="message">{messageCount}</span> : ""}
    </Link>
  );
};

export default Button;
