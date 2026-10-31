'use client';

import * as React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/ui/navbar';
import { Footer } from '@/components/ui/footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { MOCK_PAST_PAPERS, type PastPaperItem } from '@/lib/data/past-papers-data';
import {
  FileText,
  Search,
  Download,
  Eye,
  CheckCircle2,
  Calendar,
  Layers,
  Sparkles,
  BookOpen,
  Filter,
  X,
  Printer,
  ZoomIn,
  ZoomOut,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

export default function PastPapersVaultPage() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedBoard, setSelectedBoard] = React.useState<string>('All');
  const [selectedSubject, setSelectedSubject] = React.useState<string>('All');
  const [selectedYear, setSelectedYear] = React.useState<string>('All');
  const [solvedOnly, setSolvedOnly] = React.useState<boolean>(false);

  // Modal viewer state
  const [activePaper, setActivePaper] = React.useState<PastPaperItem | null>(null);
  const [viewerModalOpen, setViewerModalOpen] = React.useState(false);
  const [downloadSuccessToast, setDownloadSuccessToast] = React.useState<string | null>(null);

  const boards = ['All', 'FBISE', 'UHS MDCAT', 'BISE Lahore', 'ECAT UET', 'Cambridge CAIE', 'FPSC CSS'];
  const subjects = ['All', 'Physics', 'Chemistry', 'Biology', 'Mathematics', 'English', 'Computer Science'];
  const years = ['All', '2024', '2023', '2022', '2021', '2020'];

  const filteredPapers = React.useMemo(() => {
    return MOCK_PAST_PAPERS.filter((paper) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = paper.title.toLowerCase().includes(q);
        const matchesBoard = paper.examBoard.toLowerCase().includes(q);
        const matchesSubject = paper.subject.toLowerCase().includes(q);
        const matchesCode = paper.paperCode.toLowerCase().includes(q);
        const matchesTopics = paper.topicsCovered.some((t) => t.toLowerCase().includes(q));
        if (!matchesTitle && !matchesBoard && !matchesSubject && !matchesCode && !matchesTopics) {
          return false;
        }
      }

      if (selectedBoard !== 'All' && paper.examBoard !== selectedBoard) return false;
      if (selectedSubject !== 'All' && paper.subject !== selectedSubject) return false;
      if (selectedYear !== 'All' && paper.year.toString() !== selectedYear) return false;
      if (solvedOnly && !paper.isSolved) return false;

      return true;
    });
  }, [searchQuery, selectedBoard, selectedSubject, selectedYear, solvedOnly]);

  const handleDownload = (paper: PastPaperItem) => {
    setDownloadSuccessToast(`Downloading "${paper.title}" (${paper.fileSizeMb} MB)...`);
    setTimeout(() => {
      setDownloadSuccessToast(null);
    }, 4000);
  };

  const handlePreview = (paper: PastPaperItem) => {
    setActivePaper(paper);
    setViewerModalOpen(true);
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedBoard('All');
    setSelectedSubject('All');
    setSelectedYear('All');
    setSolvedOnly(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <div className="bg-slate-900 text-white border-b border-slate-800 py-10 px-4 sm:px-6">
          <div className="max-w-[1400px] mx-auto">
            <div className="max-w-3xl space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-400/30 text-indigo-300 text-xs font-semibold">
                <FileText className="h-3.5 w-3.5 text-indigo-400" />
                <span>100% Free Public Academic Archive</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
                Past Papers & Solutions Vault
              </h1>
              <p className="text-sm text-slate-300 leading-relaxed">
                Download verified past examination papers with marking schemes and step-by-step solutions
                for Federal Board (FBISE), Punjab Boards (BISE), UHS MDCAT, ECAT, Cambridge CAIE, and CSS.
              </p>

              {/* Stats Bar */}
              <div className="flex flex-wrap items-center gap-6 pt-2 text-xs text-slate-300">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <strong>850+</strong> Solved Papers
                </span>
                <span className="flex items-center gap-1.5">
                  <Download className="h-4 w-4 text-indigo-400" />
                  <strong>100,000+</strong> Student Downloads
                </span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-amber-400" />
                  <strong>100% Free</strong> Direct PDF Access
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Download Success Banner */}
        {downloadSuccessToast && (
          <div className="sticky top-16 z-30 bg-emerald-600 text-white text-xs font-medium py-2 px-4 shadow-md flex items-center justify-center gap-2 transition-all">
            <CheckCircle2 className="h-4 w-4" />
            <span>{downloadSuccessToast}</span>
          </div>
        )}

        {/* Content Area */}
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8 space-y-6">
          {/* Filter & Search Bar Controls */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 space-y-4 shadow-sm">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by exam (e.g. 'MDCAT 2023', 'FBISE Physics', 'Calculus', or paper code)..."
                className="w-full h-10 pl-10 pr-9 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-brand-indigo focus:ring-2 focus:ring-brand-indigo/10 transition-all"
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

            {/* Board Filter Chips */}
            <div>
              <span className="text-xs font-bold text-slate-700 block mb-2">Examination Board / Authority:</span>
              <div className="flex flex-wrap items-center gap-2">
                {boards.map((b) => (
                  <button
                    key={b}
                    onClick={() => setSelectedBoard(b)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      selectedBoard === b
                        ? 'bg-brand-indigo text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            {/* Dropdowns Row: Subject, Year, Solved Toggle */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-100">
              <div className="flex flex-wrap items-center gap-3">
                {/* Subject Selector */}
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-slate-500 font-medium">Subject:</span>
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="h-9 text-xs font-semibold bg-white border border-slate-200 rounded-lg px-2.5 focus:outline-none focus:border-brand-indigo cursor-pointer"
                  >
                    {subjects.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Year Selector */}
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-slate-500 font-medium">Year:</span>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="h-9 text-xs font-semibold bg-white border border-slate-200 rounded-lg px-2.5 focus:outline-none focus:border-brand-indigo cursor-pointer"
                  >
                    {years.map((y) => (
                      <option key={y} value={y}>
                        {y === 'All' ? 'All Years' : y}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Solved Only Checkbox */}
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={solvedOnly}
                    onChange={(e) => setSolvedOnly(e.target.checked)}
                    className="h-4 w-4 rounded text-brand-indigo focus:ring-brand-indigo border-slate-300"
                  />
                  <span>Solved Papers with Answer Keys Only</span>
                </label>
              </div>

              {(selectedBoard !== 'All' ||
                selectedSubject !== 'All' ||
                selectedYear !== 'All' ||
                solvedOnly ||
                searchQuery) && (
                <button
                  onClick={resetFilters}
                  className="text-xs font-bold text-brand-indigo hover:underline"
                >
                  Reset all filters
                </button>
              )}
            </div>
          </div>

          {/* Papers Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span>
                Found <strong className="text-slate-900">{filteredPapers.length}</strong> official past papers
              </span>
              <span className="text-slate-400">PDFs watermarked & verified by Professor Academy</span>
            </div>

            {filteredPapers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPapers.map((paper) => (
                  <div
                    key={paper.id}
                    className="bg-white rounded-2xl border border-slate-200/90 p-5 flex flex-col justify-between hover:shadow-md hover:border-slate-300 transition-all space-y-4"
                  >
                    <div className="space-y-3">
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-brand-indigo bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-100">
                          {paper.examBoard}
                        </span>

                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                            paper.isSolved
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {paper.isSolved ? '✓ Solved + Keys' : 'Original Unsolved'}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="font-bold text-sm text-slate-900 leading-snug line-clamp-2">
                        {paper.title}
                      </h3>

                      {/* Paper Code & Year */}
                      <div className="flex items-center gap-3 text-xs text-slate-500 font-mono">
                        <span className="bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                          {paper.paperCode}
                        </span>
                        <span>•</span>
                        <span>{paper.year}</span>
                        <span>•</span>
                        <span>{paper.pagesCount} Pages</span>
                      </div>

                      {/* Topics Chips */}
                      <div className="space-y-1.5 pt-1">
                        <p className="text-[11px] font-semibold text-slate-600">Topics covered in paper:</p>
                        <div className="flex flex-wrap gap-1.5">
                          {paper.topicsCovered.slice(0, 3).map((topic, i) => (
                            <span
                              key={i}
                              className="text-[10px] font-medium bg-slate-50 text-slate-600 border border-slate-200 px-2 py-0.5 rounded"
                            >
                              {topic}
                            </span>
                          ))}
                          {paper.topicsCovered.length > 3 && (
                            <span className="text-[10px] text-slate-400 py-0.5">
                              +{paper.topicsCovered.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Bottom Metadata & Actions */}
                    <div className="pt-3 border-t border-slate-100 space-y-3">
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span>{paper.fileSizeMb} MB PDF</span>
                        <span>{paper.downloadsCount.toLocaleString()} downloads</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handlePreview(paper)}
                          className="w-full text-xs"
                        >
                          <Eye className="h-3.5 w-3.5 mr-1" />
                          <span>Preview</span>
                        </Button>

                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleDownload(paper)}
                          className="w-full text-xs font-semibold"
                        >
                          <Download className="h-3.5 w-3.5 mr-1" />
                          <span>Download</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4 shadow-sm">
                <div className="h-12 w-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <FileText className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-slate-900 text-base">No past papers found</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Try adjusting your search criteria, selecting another examination board, or clearing filters.
                  </p>
                </div>
                <Button variant="secondary" size="sm" onClick={resetFilters}>
                  Reset Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* PDF Reader Simulator Modal */}
      {activePaper && (
        <Modal
          isOpen={viewerModalOpen}
          onClose={() => setViewerModalOpen(false)}
          title={`${activePaper.title} (${activePaper.paperCode})`}
          maxWidth="lg"
        >
          <div className="space-y-4">
            {/* Viewer Header Bar */}
            <div className="bg-slate-800 text-white px-4 py-2.5 rounded-xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <span className="font-mono bg-slate-700 px-2 py-0.5 rounded text-[11px]">
                  Page 1 of {activePaper.pagesCount}
                </span>
                <span className="text-slate-300 hidden sm:inline">{activePaper.examBoard} Official</span>
              </div>

              <div className="flex items-center gap-2">
                <button className="p-1 hover:bg-slate-700 rounded text-slate-300">
                  <ZoomIn className="h-4 w-4" />
                </button>
                <button className="p-1 hover:bg-slate-700 rounded text-slate-300">
                  <ZoomOut className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDownload(activePaper)}
                  className="flex items-center gap-1.5 bg-brand-indigo hover:bg-brand-indigoHover px-3 py-1 rounded text-white font-semibold transition-colors"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Save PDF</span>
                </button>
              </div>
            </div>

            {/* Simulated Document Preview Canvas */}
            <div className="bg-slate-100 border border-slate-300 rounded-xl p-8 min-h-[360px] flex flex-col justify-between shadow-inner">
              <div className="space-y-4 max-w-xl mx-auto text-center">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-mono text-slate-700 shadow-xs">
                  <FileText className="h-3.5 w-3.5 text-brand-indigo" />
                  <span>{activePaper.paperCode} • ANNUAL {activePaper.year}</span>
                </div>

                <h3 className="font-serif font-bold text-xl text-slate-900 tracking-tight">
                  {activePaper.examBoard} — {activePaper.subject.toUpperCase()}
                </h3>

                <p className="text-xs text-slate-600">
                  Time Allowed: 3 Hours • Maximum Marks: 100 • Section A (Compulsory MCQs) + Section B & C
                </p>

                <div className="border-t border-b border-slate-200 py-3 text-left space-y-2 text-xs text-slate-700">
                  <p className="font-semibold text-slate-900">Syllabus Breakdown in this Paper:</p>
                  <ul className="list-disc list-inside space-y-1 text-slate-600 pl-1">
                    {activePaper.topicsCovered.map((topic, i) => (
                      <li key={i}>{topic}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="text-center pt-6 text-[11px] text-slate-500">
                Official verified paper copy archived by Professor Online Academy.
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-500">File size: {activePaper.fileSizeMb} MB (Vector PDF)</span>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  handleDownload(activePaper);
                  setViewerModalOpen(false);
                }}
              >
                <Download className="h-4 w-4 mr-1.5" />
                <span>Download Complete Paper</span>
              </Button>
            </div>
          </div>
        </Modal>
      )}

      <Footer />
    </div>
  );
}
