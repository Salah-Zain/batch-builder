import logo from "@/assets/perpex-logo.png";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  showWordmark?: boolean;
  onClick?: () => void;
};

export function PerpexLogo({ className, showWordmark = true, onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-2.5 select-none",
        onClick ? "cursor-pointer" : "cursor-default",
        className
      )}
      aria-label="PerpeX"
    >
      <img src={logo} alt="PerpeX logo" className="h-9 w-9 object-contain" draggable={false} />
      {showWordmark && (
        <span className="text-xl font-bold tracking-tight text-primary">
          PerpeX<span className="text-primary-glow">.</span>
        </span>
      )}
    </button>
  );
}
