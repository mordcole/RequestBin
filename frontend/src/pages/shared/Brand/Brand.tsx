import "./Brand.css";

type BrandProps = {
  subtitle: string;
  title?: string;
  size?: "md" | "lg";
  className?: string;
};

export const Brand = ({
  subtitle,
  title = "RequestBin",
  size = "md",
  className,
}: BrandProps) => {
  const classes = ["brand", `brand--${size}`, className]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes}>
      <div className="brand__icon">
        <svg
          className="brand__icon-svg"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            d="M13 10V3L4 14h7v7l9-11h-7z"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.5"
          ></path>
        </svg>
      </div>
      <div>
        <div className="brand__title">{title}</div>
        <div className="brand__subtitle">{subtitle}</div>
      </div>
    </div>
  );
};
