import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function GlassCard({ children, className, ...props }: GlassCardProps) {
  return (
    <div className={cn("bg-white border border-zinc-200 rounded-xl p-5", className)} {...props}>
      {children}
    </div>
  );
}

export function GlassPanel({ children, className, ...props }: GlassCardProps) {
  return (
    <div className={cn("bg-white border border-zinc-200 rounded-xl p-5", className)} {...props}>
      {children}
    </div>
  );
}
