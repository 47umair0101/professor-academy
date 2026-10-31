import * as React from 'react';
import Link from 'next/link';
import { Star, CheckCircle, Play, Info } from 'lucide-react';
import { Badge } from './badge';
import { formatPKR } from '@professor-academy/shared';

export interface CourseCardProps {
  id: string;
  slug: string;
  title: string;
  instructor: string;
  thumbnailUrl?: string;
  rating?: number;
  ratingCount?: number;
  pricePkr: number;
  originalPricePkr?: number;
  badgeText?: string;
  badgeVariant?: 'gold' | 'indigo' | 'neutral' | 'success';
  category?: string;
  eligibilitySnippet?: string;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  slug,
  title,
  instructor,
  thumbnailUrl,
  rating = 4.8,
  ratingCount = 3840,
  pricePkr,
  originalPricePkr,
  badgeText = 'Bestseller',
  badgeVariant = 'gold',
  category = 'Entrance Exam',
  eligibilitySnippet,
}) => {
  return (
    <Link
      href={`/courses/${slug}`}
      className="group flex flex-col w-full text-left bg-white border border-slate-200/90 rounded-xl overflow-hidden shadow-subtle hover:shadow-cardHover hover:border-slate-300 hover:-translate-y-1 transition-all duration-200"
    >
      {/* 16:9 Aspect Ratio Media Container */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-slate-900 flex items-center justify-center p-4 text-white text-center">
            <span className="font-semibold text-xs tracking-tight uppercase line-clamp-2">
              {title}
            </span>
          </div>
        )}

        {/* Floating Category Pill */}
        <div className="absolute top-2.5 left-2.5 z-10">
          <span className="text-[10px] font-semibold uppercase tracking-wider bg-white/90 backdrop-blur-sm text-slate-800 px-2 py-0.5 rounded-md shadow-sm">
            {category}
          </span>
        </div>

        {/* Hover Quick-Play Overlay Indicator */}
        <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
          <div className="h-10 w-10 rounded-full bg-white text-brand-indigo flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
            <Play className="h-4 w-4 fill-current ml-0.5" />
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1.5">
          {/* Title */}
          <h3 className="font-semibold text-sm text-slate-900 line-clamp-2 leading-snug group-hover:text-brand-indigo transition-colors">
            {title}
          </h3>

          {/* Instructor with Verified Badge */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span className="truncate">{instructor}</span>
            <CheckCircle className="h-3 w-3 text-brand-indigo shrink-0" />
          </div>

          {/* Rating Row */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="font-bold text-amber-800">{rating.toFixed(1)}</span>
            <div className="flex items-center text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-3 w-3 fill-current stroke-none" />
              ))}
            </div>
            <span className="text-slate-400">({ratingCount.toLocaleString()})</span>
          </div>
        </div>

        {/* Distinct Feature: Eligibility Criteria Box (Superior to Udemy) */}
        {eligibilitySnippet && (
          <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-2 text-[11px] text-slate-600 flex items-start gap-1.5">
            <Info className="h-3.5 w-3.5 text-brand-indigo shrink-0 mt-0.5" />
            <span className="line-clamp-1 font-medium">{eligibilitySnippet}</span>
          </div>
        )}

        {/* Pricing & Badge Row */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-bold text-base text-slate-900">
              {formatPKR(pricePkr)}
            </span>
            {originalPricePkr && (
              <span className="text-xs text-slate-400 line-through">
                {formatPKR(originalPricePkr)}
              </span>
            )}
          </div>
          {badgeText && (
            <Badge variant={badgeVariant} size="sm">
              {badgeText}
            </Badge>
          )}
        </div>
      </div>
    </Link>
  );
};
