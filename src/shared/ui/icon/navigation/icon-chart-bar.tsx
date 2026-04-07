import { cn } from "@/shared/lib/css";
import { iconBaseProps, type IconProps } from "../types";

export function IconChartBar({ className, size = 24 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      {...iconBaseProps}
      className={cn("shrink-0", className)}
      aria-hidden
    >
      <path
        d="M2 12C2 10.8954 2.89543 10 4 10H5C5.55228 10 6 10.4477 6 11V20C6 20.5523 5.55228 21 5 21H4C2.89543 21 2 20.1046 2 19V12Z"
        fill="currentColor"
      />
      <path
        d="M22.3113 12.5247C22.6582 11.2527 21.701 9.999 20.3826 9.99846L15.1401 9.99635C14.8149 9.99622 14.5764 9.69058 14.6553 9.37508L15.3707 6.51332C15.7384 5.04254 15.0352 3.51371 13.6792 2.83571C12.8687 2.43043 11.9034 2.96248 11.8132 3.86421L11.5954 6.04196C11.5334 6.66258 11.2794 7.24843 10.8689 7.718L8.49429 10.4341C8.17562 10.7986 8 11.2664 8 11.7505V18.9995C8 20.1041 8.89543 20.9995 10 20.9995H17.7086C19.0615 20.9995 20.2469 20.0941 20.6029 18.7889L22.3113 12.5247Z"
        fill="currentColor"
      />
    </svg>
  );
}
