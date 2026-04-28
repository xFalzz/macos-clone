type Props = {
  size?: number;
  fill?: string;
};

export const BatterySVG = ({ size = 18, fill = 'currentColor' }: Props) => (
  <svg
    width={size}
    height={size * 0.55}
    viewBox="0 0 25 13"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="0.5"
      y="0.5"
      width="21"
      height="12"
      rx="2.5"
      stroke={fill}
      strokeOpacity="0.5"
    />
    <rect
      x="2"
      y="2"
      width="18"
      height="9"
      rx="1.5"
      fill={fill}
    />
    <path
      d="M23 4.5V8.5C23.8 8.5 24.5 7.9 24.5 6.5C24.5 5.1 23.8 4.5 23 4.5Z"
      fill={fill}
      fillOpacity="0.5"
    />
  </svg>
);
