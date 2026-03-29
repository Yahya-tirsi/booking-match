import * as React from "react";

interface SheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export function Sheet({ open, children }: SheetProps) {
  if (!open) return null;
  return <>{children}</>;
}

interface SheetContentProps {
  side?: "left" | "right";
  className?: string;
  children: React.ReactNode;
}

export function SheetContent({ children, className = "" }: SheetContentProps) {
  return <div className={`sheet ${className}`}>{children}</div>;
}
