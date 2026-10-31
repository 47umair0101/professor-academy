import * as React from 'react';
import Link from 'next/link';
import { GraduationCap } from 'lucide-react';

export interface AuthHeaderProps {
  className?: string;
}

export const AuthBrandHeader: React.FC<AuthHeaderProps> = ({ className }) => (
  <Link href="/" className={`inline-flex items-center gap-2.5 group mb-8 ${className || ''}`}>
    <div className="h-9 w-9 rounded-xl bg-brand-indigo text-white flex items-center justify-center shadow-subtle group-hover:bg-brand-indigoHover transition-colors">
      <GraduationCap className="h-5 w-5 stroke-[2.2]" />
    </div>
    <div className="flex flex-col">
      <span className="font-bold text-base leading-tight text-slate-900 tracking-tight">
        Professor<span className="text-brand-indigo font-normal">Academy</span>
      </span>
      <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">
        ONLINE ACADEMY
      </span>
    </div>
  </Link>
);

export const AuthIllustrationCard: React.FC = () => {
  return (
    <div className="relative w-full aspect-square max-w-[420px] mx-auto rounded-3xl bg-indigo-50/40 border border-indigo-100/70 flex items-center justify-center p-8 overflow-hidden select-none">
      {/* Decorative Floating Circle Top Left */}
      <div className="absolute top-10 left-12 h-6 w-6 rounded-full bg-amber-400/80 shadow-sm animate-pulse" />

      {/* Decorative Floating Circle Bottom Right */}
      <div className="absolute bottom-10 right-12 h-7 w-7 rounded-full bg-indigo-300 shadow-sm" />

      {/* Central Illustration Composition */}
      <div className="relative flex flex-col items-center">
        {/* Soft Circular Avatar Backdrop */}
        <div className="h-36 w-36 rounded-full bg-indigo-100/70 flex items-center justify-center relative overflow-hidden">
          {/* Avatar Silhouette */}
          <div className="flex flex-col items-center mt-6">
            <div className="h-14 w-14 rounded-full bg-[#F3BA93]" />
            <div className="h-14 w-20 rounded-t-full bg-brand-indigo -mt-2" />
          </div>
        </div>

        {/* Foreground Floating White Card with Progress Preview */}
        <div className="relative -mt-8 bg-white rounded-xl border border-slate-200/90 p-4 w-52 shadow-card space-y-2.5 z-10">
          <div className="h-2 w-20 bg-brand-indigo rounded-full" />
          <div className="h-1.5 w-36 bg-slate-200 rounded-full" />
          <div className="h-1.5 w-28 bg-slate-200 rounded-full" />
          <div className="pt-1">
            <div className="h-5 w-14 bg-brand-indigo rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
};
