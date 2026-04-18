import { cn } from "@/lib/utils";

export function PageBackground({ image, children, overlay = "medium", className }: {
  image: string;
  children?: React.ReactNode;
  overlay?: "light" | "medium" | "dark";
  className?: string;
}) {
  const overlayClass = {
    light: "bg-background/40",
    medium: "bg-background/70",
    dark: "bg-foreground/60",
  }[overlay];

  return (
    <div className={cn("relative isolate", className)}>
      <div className="fixed inset-0 -z-10">
        <img
          src={image}
          alt=""
          className="w-full h-full object-cover animate-slow-zoom"
        />
        <div className={cn("absolute inset-0", overlayClass)} />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/30 to-background" />
      </div>
      {children}
    </div>
  );
}
