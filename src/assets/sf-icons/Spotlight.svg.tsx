type Props = {
  size?: number;
  fill?: string;
};

export const SpotlightSVG = ({ size = 15, fill = 'currentColor' }: Props) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="6.5" cy="6.5" r="5.5" stroke={fill} strokeWidth="1.5" />
    <line x1="10.5" y1="10.5" x2="15" y2="15" stroke={fill} strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);
