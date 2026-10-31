'use client';

import * as React from 'react';
import { Play, Video, ExternalLink, AlertCircle, Clock } from 'lucide-react';

export interface VideoPreviewPlayerProps {
  url?: string;
  title?: string;
  durationSeconds?: number;
}

export function extractYouTubeVideoId(url: string): string | null {
  if (!url) return null;
  const regExp =
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

export const VideoPreviewPlayer: React.FC<VideoPreviewPlayerProps> = ({
  url,
  title = 'Lecture Video Preview',
  durationSeconds = 0,
}) => {
  const youtubeId = url ? extractYouTubeVideoId(url) : null;
  const isDirectVideo = url ? /\.(mp4|webm|ogg)($|\?)/i.test(url) : false;

  const formatDuration = (secs: number) => {
    if (!secs) return '00:00';
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s} mins`;
  };

  if (!url || url.trim() === '') {
    return (
      <div className="aspect-video w-full rounded-xl bg-slate-900 text-slate-400 flex flex-col items-center justify-center p-6 text-center border border-slate-800 shadow-inner">
        <div className="h-12 w-12 rounded-full bg-slate-800 flex items-center justify-center mb-3">
          <Video className="h-6 w-6 text-slate-500" />
        </div>
        <p className="text-xs sm:text-sm font-semibold text-slate-300">No Video URL Provided Yet</p>
        <p className="text-[11px] text-slate-500 mt-1 max-w-xs">
          Paste a YouTube Unlisted link (100% free hosting) or direct video URL above to preview your lecture stream.
        </p>
      </div>
    );
  }

  if (youtubeId) {
    return (
      <div className="space-y-2">
        <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black border border-slate-800 shadow-md">
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${youtubeId}?rel=0&modestbranding=1&showinfo=0`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
          <div className="flex items-center gap-1.5 text-emerald-600 font-semibold">
            <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
            <span>YouTube Unlisted Embed Verified</span>
          </div>
          {durationSeconds > 0 && (
            <div className="flex items-center gap-1 font-mono text-slate-600">
              <Clock className="h-3 w-3 text-slate-400" />
              <span>{formatDuration(durationSeconds)}</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (isDirectVideo) {
    return (
      <div className="space-y-2">
        <div className="aspect-video w-full rounded-xl overflow-hidden bg-black border border-slate-800 shadow-md">
          <video
            controls
            className="w-full h-full object-contain"
            src={url}
          >
            Your browser does not support the video tag.
          </video>
        </div>
        <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
          <span className="text-slate-600 font-medium">Direct Video Stream</span>
          {durationSeconds > 0 && (
            <span className="font-mono text-slate-600">{formatDuration(durationSeconds)}</span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="aspect-video w-full rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex flex-col items-center justify-center p-6 text-center">
      <AlertCircle className="h-8 w-8 text-amber-600 mb-2" />
      <p className="text-xs font-bold text-amber-950">External Video Link Detected</p>
      <p className="text-[11px] text-amber-700 mt-1 max-w-sm">
        Link: <code className="font-mono text-[10px] break-all">{url}</code>
      </p>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-200/80 hover:bg-amber-200 text-amber-900 text-xs font-bold transition-colors cursor-pointer"
      >
        <span>Test Video URL in New Tab</span>
        <ExternalLink className="h-3.5 w-3.5" />
      </a>
    </div>
  );
};
