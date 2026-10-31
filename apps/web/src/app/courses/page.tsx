'use client';

import * as React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/ui/navbar';
import { Footer } from '@/components/ui/footer';
import { CourseCard } from '@/components/ui/course-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MOCK_COURSES, type CourseData } from '@/lib/data/courses-data';
import { CourseCatalogService } from '@/lib/services/course-catalog-service';
import {
  Search,
  SlidersHorizontal,
  X,
  Sparkles,
  BookOpen,
  Filter,
  CheckCircle2,
  GraduationCap,
  ChevronDown,
} from 'lucide-react';

export default function CoursesCatalogPage() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState<string>('All');
  const [selectedLevel, setSelectedLevel] = React.useState<string>('All');
  const [selectedPrice, setSelectedPrice] = React.useState<'All' | 'Free' | 'Paid'>('All');
  const [selectedMinRating, setSelectedMinRating] = React.useState<number>(0);
  const [sortBy, setSortBy] = React.useState<'popular' | 'rating' | 'price-asc' | 'price-desc'>('popular');
  const [mobileFilterOpen, setMobileFilterOpen] = React.useState(false);

  const [courses, setCourses] = React.useState<CourseData[]>(MOCK_COURSES);

  React.useEffect(() => {
    CourseCatalogService.getAllPublishedCourses().then(setCourses);
  }, []);

  const categories = [
    'All',
    'MDCAT Prep',
    'FSc Part-I',
    'Engineering Prep',
    'Cambridge A-Level',
    'CSS / PMS',
    'Computer Science',
  ];

  const levels = ['All', 'Entry Test', 'Intermediate', 'Competitive Exam', 'Skill Development'];

  const filteredCourses = React.useMemo(() => {
    return courses.filter((course) => {
      // Search matching
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = course.title.toLowerCase().includes(q);
        const matchesCategory = course.category.toLowerCase().includes(q);
        const matchesInstructor = course.instructor.name.toLowerCase().includes(q);
        const matchesEligibility = course.eligibilitySnippet.toLowerCase().includes(q);
        if (!matchesTitle && !matchesCategory && !matchesInstructor && !matchesEligibility) {
          return false;
        }
      }

      // Category filter
      if (selectedCategory !== 'All' && course.category !== selectedCategory) {
        return false;
      }

      // Level filter
      if (selectedLevel !== 'All' && course.level !== selectedLevel) {
        return false;
      }

      // Price filter
      if (selectedPrice === 'Free' && course.pricePkr > 0) return false;
      if (selectedPrice === 'Paid' && course.pricePkr === 0) return false;

      // Rating filter
      if (selectedMinRating > 0 && course.rating < selectedMinRating) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'price-asc') return a.pricePkr - b.pricePkr;
      if (sortBy === 'price-desc') return b.pricePkr - a.pricePkr;
      return b.ratingCount - a.ratingCount; // 'popular'
    });
  }, [searchQuery, selectedCategory, selectedLevel, selectedPrice, selectedMinRating, sortBy]);

  const activeFiltersCount =
    (selectedCategory !== 'All' ? 1 : 0) +
    (selectedLevel !== 'All' ? 1 : 0) +
    (selectedPrice !== 'All' ? 1 : 0) +
    (selectedMinRating > 0 ? 1 : 0) +
    (searchQuery.trim() ? 1 : 0);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedLevel('All');
    setSelectedPrice('All');
    setSelectedMinRating(0);
    setSortBy('popular');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50">
      <Navbar />

      <main className="flex-1">
        {/* Catalog Hero Banner */}
        <div className="bg-slate-900 text-white border-b border-slate-800 py-10 px-4 sm:px-6">
          <div className="max-w-[1400px] mx-auto">
            <div className="max-w-3xl space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-400/30 text-indigo-300 text-xs font-semibold">
                <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                <span>Verified Academic Syllabus 2026</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
                Academic Course Catalog
              </h1>
              <p className="text-sm text-slate-300 leading-relaxed">
                Explore high-yield courses designed specifically for Pakistani board exams (FBISE, BISE),
                entrance tests (MDCAT, ECAT), and competitive exams. Each course outlines clear eligibility
                prerequisites so you enroll with confidence.
              </p>
            </div>
          </div>
        </div>

        {/* Content Layout */}
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8">
          {/* Top Bar: Search, Result Count, Mobile Filter Trigger, Sort */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search courses, exams, subjects, or eligibility..."
                className="w-full h-10 pl-10 pr-9 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl placeholder:text-slate-400 focus:outline-none focus:border-brand-indigo focus:ring-2 focus:ring-brand-indigo/10 transition-all shadow-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Right Controls: Sort & Mobile Toggle */}
            <div className="flex items-center justify-between md:justify-end gap-3">
              <button
                onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                className="lg:hidden inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold bg-white border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
                <span>Filters</span>
                {activeFiltersCount > 0 && (
                  <span className="h-4 w-4 rounded-full bg-brand-indigo text-white text-[10px] flex items-center justify-center font-bold">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 hidden sm:inline">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="h-10 text-xs font-semibold bg-white border border-slate-200 rounded-xl px-3 pr-8 focus:outline-none focus:border-brand-indigo focus:ring-2 focus:ring-brand-indigo/10 shadow-sm cursor-pointer"
                >
                  <option value="popular">Most Popular</option>
                  <option value="rating">Highest Rated</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>

          {/* Active Filter Pills Bar */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-4">
              <span className="text-xs text-slate-500 font-medium">Active filters:</span>
              {selectedCategory !== 'All' && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-200 text-xs text-indigo-700 font-medium">
                  Category: {selectedCategory}
                  <button onClick={() => setSelectedCategory('All')}>
                    <X className="h-3 w-3 hover:text-indigo-900" />
                  </button>
                </span>
              )}
              {selectedLevel !== 'All' && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-200 text-xs text-indigo-700 font-medium">
                  Level: {selectedLevel}
                  <button onClick={() => setSelectedLevel('All')}>
                    <X className="h-3 w-3 hover:text-indigo-900" />
                  </button>
                </span>
              )}
              {selectedPrice !== 'All' && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-200 text-xs text-indigo-700 font-medium">
                  Price: {selectedPrice}
                  <button onClick={() => setSelectedPrice('All')}>
                    <X className="h-3 w-3 hover:text-indigo-900" />
                  </button>
                </span>
              )}
              {selectedMinRating > 0 && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-200 text-xs text-indigo-700 font-medium">
                  ★ {selectedMinRating}+ Rating
                  <button onClick={() => setSelectedMinRating(0)}>
                    <X className="h-3 w-3 hover:text-indigo-900" />
                  </button>
                </span>
              )}
              {searchQuery.trim() && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-200 text-xs text-indigo-700 font-medium">
                  &quot;{searchQuery}&quot;
                  <button onClick={() => setSearchQuery('')}>
                    <X className="h-3 w-3 hover:text-indigo-900" />
                  </button>
                </span>
              )}
              <button
                onClick={resetFilters}
                className="text-xs font-semibold text-brand-indigo hover:text-brand-indigoHover underline ml-2"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Grid Layout: Sidebar + Course Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pt-6">
            {/* Desktop Filters Sidebar */}
            <aside className={`lg:block ${mobileFilterOpen ? 'block' : 'hidden'} lg:col-span-1 space-y-6`}>
              <div className="bg-white rounded-2xl border border-slate-200/90 p-5 space-y-6 shadow-sm">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    <Filter className="h-4 w-4 text-brand-indigo" />
                    <span>Filter Courses</span>
                  </h3>
                  {activeFiltersCount > 0 && (
                    <button
                      onClick={resetFilters}
                      className="text-xs text-brand-indigo hover:underline font-semibold"
                    >
                      Reset
                    </button>
                  )}
                </div>

                {/* Category Filter */}
                <div>
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5">
                    Category
                  </h4>
                  <div className="space-y-1.5">
                    {categories.map((cat) => (
                      <label
                        key={cat}
                        className="flex items-center gap-2 text-xs text-slate-700 hover:text-brand-indigo cursor-pointer select-none py-0.5"
                      >
                        <input
                          type="radio"
                          name="category"
                          checked={selectedCategory === cat}
                          onChange={() => setSelectedCategory(cat)}
                          className="h-3.5 w-3.5 text-brand-indigo focus:ring-brand-indigo/20 border-slate-300"
                        />
                        <span className={selectedCategory === cat ? 'font-semibold text-brand-indigo' : ''}>
                          {cat}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Academic Level */}
                <div className="pt-3 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5">
                    Academic Level
                  </h4>
                  <div className="space-y-1.5">
                    {levels.map((lvl) => (
                      <label
                        key={lvl}
                        className="flex items-center gap-2 text-xs text-slate-700 hover:text-brand-indigo cursor-pointer select-none py-0.5"
                      >
                        <input
                          type="radio"
                          name="level"
                          checked={selectedLevel === lvl}
                          onChange={() => setSelectedLevel(lvl)}
                          className="h-3.5 w-3.5 text-brand-indigo focus:ring-brand-indigo/20 border-slate-300"
                        />
                        <span className={selectedLevel === lvl ? 'font-semibold text-brand-indigo' : ''}>
                          {lvl}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Filter */}
                <div className="pt-3 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5">
                    Fee / Pricing
                  </h4>
                  <div className="space-y-1.5">
                    {(['All', 'Paid', 'Free'] as const).map((p) => (
                      <label
                        key={p}
                        className="flex items-center gap-2 text-xs text-slate-700 hover:text-brand-indigo cursor-pointer select-none py-0.5"
                      >
                        <input
                          type="radio"
                          name="price"
                          checked={selectedPrice === p}
                          onChange={() => setSelectedPrice(p)}
                          className="h-3.5 w-3.5 text-brand-indigo focus:ring-brand-indigo/20 border-slate-300"
                        />
                        <span className={selectedPrice === p ? 'font-semibold text-brand-indigo' : ''}>
                          {p === 'All' ? 'All Courses' : p === 'Free' ? 'Free (PKR 0)' : 'Paid Premium'}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Minimum Rating */}
                <div className="pt-3 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5">
                    Ratings
                  </h4>
                  <div className="space-y-1.5">
                    {[
                      { label: 'Any Rating', val: 0 },
                      { label: '★ 4.8 & Above', val: 4.8 },
                      { label: '★ 4.5 & Above', val: 4.5 },
                    ].map((r) => (
                      <label
                        key={r.val}
                        className="flex items-center gap-2 text-xs text-slate-700 hover:text-brand-indigo cursor-pointer select-none py-0.5"
                      >
                        <input
                          type="radio"
                          name="rating"
                          checked={selectedMinRating === r.val}
                          onChange={() => setSelectedMinRating(r.val)}
                          className="h-3.5 w-3.5 text-brand-indigo focus:ring-brand-indigo/20 border-slate-300"
                        />
                        <span className={selectedMinRating === r.val ? 'font-semibold text-brand-indigo' : ''}>
                          {r.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Eligibility Explainer Tip */}
                <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/60 text-[11px] text-amber-900 leading-relaxed">
                  <p className="font-semibold flex items-center gap-1.5 text-amber-800 mb-1">
                    <CheckCircle2 className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                    <span>Eligibility Guarantee</span>
                  </p>
                  Every course displays explicit minimum criteria. Review the requirements chip before enrolling to ensure optimal prep.
                </div>
              </div>
            </aside>

            {/* Main Course Grid */}
            <div className="lg:col-span-3 space-y-6">
              {/* Count Banner */}
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>
                  Showing <strong className="text-slate-900">{filteredCourses.length}</strong> of{' '}
                  {MOCK_COURSES.length} courses
                </span>
                <span className="text-slate-400">All prices in Pakistani Rupee (PKR)</span>
              </div>

              {/* Course Cards Grid */}
              {filteredCourses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredCourses.map((c) => (
                    <CourseCard
                      key={c.id}
                      id={c.id}
                      slug={c.slug}
                      title={c.title}
                      instructor={c.instructor.name}
                      thumbnailUrl={c.thumbnailUrl}
                      rating={c.rating}
                      ratingCount={c.ratingCount}
                      pricePkr={c.pricePkr}
                      originalPricePkr={c.originalPricePkr}
                      badgeText={c.badgeText}
                      badgeVariant={c.badgeVariant}
                      category={c.category}
                      eligibilitySnippet={c.eligibilitySnippet}
                    />
                  ))}
                </div>
              ) : (
                /* Empty Search / Filter State */
                <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4 shadow-sm">
                  <div className="h-12 w-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-slate-900 text-base">No courses found</h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      We couldn&apos;t find any course matching your current search or filter combination. Try clearing
                      some filters.
                    </p>
                  </div>
                  <Button variant="secondary" size="sm" onClick={resetFilters}>
                    Reset all filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
