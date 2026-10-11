// src/shared/ui/icon/icon.tsx

import type { SVGProps } from 'react';

export type IconProps = SVGProps<SVGSVGElement>;

export const Icon = ({ children, className, ...props }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    {children}
  </svg>
);

export type SvgIconProps = IconProps;

export const ArrowUp = (props: SvgIconProps) => (
  <Icon {...props}>
    <path d="m5 12 7-7 7 7" />
    <path d="M12 19V5" />
  </Icon>
);

export const ArrowDown = (props: SvgIconProps) => (
  <Icon {...props}>
    <path d="m19 12-7 7-7-7" />
    <path d="M12 5v14" />
  </Icon>
);

export const ArrowLeft = (props: SvgIconProps) => (
  <Icon {...props}>
    <path d="m12 19-7-7 7-7" />
    <path d="M19 12H5" />
  </Icon>
);

export const ArrowRight = (props: SvgIconProps) => (
  <Icon {...props}>
    <path d="m12 5 7 7-7 7" />
    <path d="M5 12h14" />
  </Icon>
);

export const ChevronLeft = (props: SvgIconProps) => (
  <Icon {...props}>
    <path d="m15 18-6-6 6-6" />
  </Icon>
);

export const ChevronRight = (props: SvgIconProps) => (
  <Icon {...props}>
    <path d="m9 18 6-6-6-6" />
  </Icon>
);

export const ChevronsLeft = (props: SvgIconProps) => (
  <Icon {...props}>
    <path d="m11 17-5-5 5-5" />
    <path d="m18 17-5-5 5-5" />
  </Icon>
);

export const ChevronsRight = (props: SvgIconProps) => (
  <Icon {...props}>
    <path d="m6 17 5-5-5-5" />
    <path d="m13 17 5-5-5-5" />
  </Icon>
);

export const MoreHorizontal = (props: SvgIconProps) => (
  <Icon {...props}>
    <circle cx="12" cy="12" r="1" />
    <circle cx="19" cy="12" r="1" />
    <circle cx="5" cy="12" r="1" />
  </Icon>
);
