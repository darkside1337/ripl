import * as React from "react";
import { SVGProps } from "react";
const RedErrorSVG = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    viewBox="0 0 50 50"
    {...props}
  >
    <circle
      cx={25}
      cy={25}
      r={25}
      style={{
        fill: "#d75a4a",
      }}
    />
    <path
      d="m16 34 9-9 9-9M16 16l9 9 9 9"
      style={{
        fill: "none",
        stroke: "#fff",
        strokeWidth: 2,
        strokeLinecap: "round",
        strokeMiterlimit: 10,
      }}
    />
  </svg>
);
export default RedErrorSVG;
