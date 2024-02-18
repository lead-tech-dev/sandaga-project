import React, {FunctionComponent, ReactElement} from "react";
import "./section-title.style.scss";

interface SectionTitleProps {
  borderClass?: string;
  positionClass: string;
  spaceClass?: string;
  subtitleText?: string;
  subtitleColorClass?: string;
  titleText: string;
  icon?: ReactElement
}
const SectionTitle: FunctionComponent<SectionTitleProps> = ({
  titleText,
  subtitleText,
  subtitleColorClass,
  positionClass,
  spaceClass,
  borderClass,
    icon
}) => {
  return (
    <div
      className={`section-title ${positionClass ? positionClass : ""} ${
        spaceClass ? spaceClass : ""
      } ${borderClass ? borderClass : ""} ${icon ? "d-row" : ""}`}
    >
        {icon && icon} <h2>{titleText}</h2>
      {subtitleText && (
        <p className={subtitleColorClass ? subtitleColorClass : ""}>
          {subtitleText}
        </p>
      )}
    </div>
  );
};

export default SectionTitle;
