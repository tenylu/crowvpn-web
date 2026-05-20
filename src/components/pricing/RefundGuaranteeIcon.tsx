import { useId } from "react";

type RefundGuaranteeIconProps = {
  className?: string;
};

/** 白底圆 + 绿色渐变盾牌 + 居中白色对勾 */
export function RefundGuaranteeIcon({ className = "h-6 w-6" }: RefundGuaranteeIconProps) {
  const gradientId = useId();

  return (
    <svg
      className={`inline-block shrink-0 ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <circle cx="12" cy="12" r="12" fill="#ffffff" />
      <path
        fill={`url(#${gradientId})`}
        d="M12 2.25 19.75 6.25V12.5c0 4.35-3.05 8.35-7.75 9.5-4.7-1.15-7.75-5.15-7.75-9.5V6.25L12 2.25z"
      />
      <path
        d="M-2.3 0.2-0.85 1.65 2.55-2.15"
        stroke="#ffffff"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        transform="translate(12 11.5)"
      />
      <defs>
        <linearGradient id={gradientId} x1="12" y1="2.25" x2="12" y2="21.75" gradientUnits="userSpaceOnUse">
          <stop stopColor="#37C871" />
          <stop offset="1" stopColor="#287D4A" />
        </linearGradient>
      </defs>
    </svg>
  );
}
