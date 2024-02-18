import React, { FunctionComponent } from "react";

interface InfoProps {
  text: string;
}
const Info: FunctionComponent<InfoProps> = ({ text }) => {
  return (
    <p
      style={{
        fontSize: "1.1rem",
        fontWeight: "400",
        color: "rgb(65, 131, 215)",
        lineHeight: "1.7",
          marginTop: "20px"
      }}
    >
      {text}
    </p>
  );
};

export default Info;
