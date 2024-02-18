import React, { FunctionComponent, MouseEvent } from "react";

interface CloseProps {
  onClick: (e: MouseEvent<SVGSVGElement>) => void;
  className?: string;
}
const Close: FunctionComponent<CloseProps> = ({ onClick, className }) => {
  return (
    <svg
        data-testid="button"
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      width="512"
      height="512"
      x="0"
      y="0"
      viewBox="0 0 24 24"
      className={`svg ${className}`}
      onClick={(e) => onClick(e)}
    >
      <g>
        <path
          fill="#000000"
          d="M7.307 17.776a.766.766 0 1 1-1.083-1.083L10.917 12 6.224 7.307a.766.766 0 1 1 1.083-1.083L12 10.917l4.693-4.693a.766.766 0 1 1 1.083 1.083L13.083 12l4.693 4.693a.766.766 0 1 1-1.083 1.083L12 13.083l-4.693 4.693Z"
          data-original="#000000"
          className=""
        ></path>
      </g>
    </svg>
  );
};

export default Close;
