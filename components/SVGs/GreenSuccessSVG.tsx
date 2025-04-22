import * as React from "react";
import { SVGProps } from "react";
const GreenSuccessSVG = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={100}
    height={100}
    viewBox="0 0 80 80"
    {...props}
  >
    <path
      fill="#bae0bd"
      d="M40 77.5C19.3 77.5 2.5 60.7 2.5 40S19.3 2.5 40 2.5 77.5 19.3 77.5 40 60.7 77.5 40 77.5z"
    />
    <path
      fill="#5e9c76"
      d="M40 3c20.4 0 37 16.6 37 37S60.4 77 40 77 3 60.4 3 40 19.6 3 40 3m0-1C19 2 2 19 2 40s17 38 38 38 38-17 38-38S61 2 40 2z"
    />
  </svg>
);
export default GreenSuccessSVG;
