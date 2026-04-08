"use client";   
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import album1 from '@/public/album1.jpg';
import album2 from '@/public/album2.jpg';
import album3 from '@/public/album3.jpg';

interface Track {
  num: string;
  title: string;
  feat: string;
  album: string;
  duration: string;
  hot: boolean;
  youtube: string;
}

const initialTracks: Track[] = [
  { num: "01", title: "Kachal Kasi", feat: "", album: "Streets Never Lie", duration: "3:47", hot: true, youtube: "https://youtu.be/QKY9jEIXfVQ?si=v43De7iim_NY5imN" },
  { num: "02", title: "AHE KATU ENUNA (LILROME)", feat: "Ft PRABA", album: "LIL ROME", duration: "2:58", hot: false, youtube: "https://youtu.be/GOXDQ94ECJQ?si=x1OZZ6xVJBskYpQX" },
  { num: "03", title: "Midnight Run", feat: "", album: "Dark Hours", duration: "4:12", hot: false, youtube: "" },
  { num: "04", title: "Real Ones Only", feat: "feat. Young Dice", album: "Streets Never Lie", duration: "3:33", hot: true, youtube: "" },
  { num: "05", title: "Crown Me", feat: "", album: "Dark Hours", duration: "3:21", hot: false, youtube: "" },
  { num: "06", title: "Last Man Standing", feat: "feat. MC Crypt", album: "Debut", duration: "4:55", hot: false, youtube: "" },
];

function getYouTubeID(url: string): string | null {
  if (!url) return null;
  const match = url.match(
    /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/
  );
  return match ? match[1] : null;
}

// FIXED: Using interface instead of namespace for better TypeScript practices
interface YTPlayer {
  destroy(): void;
  playVideo(): void;
  pauseVideo(): void;
  seekTo(seconds: number, allowSeekAhead: boolean): void;
  getDuration(): number;
  getCurrentTime(): number;
}

interface YTOnStateChangeEvent {
  data: number;
}

interface YTPlayerConstructor {
  new (
    element: HTMLElement | string,
    options: {
      height: string;
      width: string;
      videoId: string;
      playerVars: Record<string, number>;
      events: Record<string, (event: YTOnStateChangeEvent) => void>;
    }
  ): YTPlayer;
}

// FIXED: Proper interface extension without unsafe declaration merging
interface YTAPI {
  Player: YTPlayerConstructor;
  PlayerState: {
    PLAYING: number;
    ENDED: number;
  };
}

// FIXED: Proper window interface extension
interface CustomWindow extends Window {
  YT?: YTAPI;
  onYouTubeIframeAPIReady?: () => void;
}

declare const window: CustomWindow;

export default function Music() {
  const [trackList, setTrackList] = useState<Track[]>(initialTracks);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [urlInput, setUrlInput] = useState("");
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState("0:00");

  const playerRef = useRef<YTPlayer | null>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const progressInterval = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);
    }
  }, []);

  const destroyPlayer = () => {
    if (playerRef.current) {
      try { playerRef.current.destroy(); } catch {}
      playerRef.current = null;
    }
    clearInterval(progressInterval.current);
    progressInterval.current = undefined;
    setProgress(0);
    setCurrentTime("0:00");
  };

  const loadAndPlay = (index: number) => {
    const videoId = getYouTubeID(trackList[index].youtube);
    if (!videoId) return;
    destroyPlayer();
    setCurrentIndex(index);
    setIsPlaying(true);

    const init = () => {
      if (!playerContainerRef.current || !window.YT) return;
      playerRef.current = new window.YT.Player(playerContainerRef.current, {
        height: "0",
        width: "0",
        videoId,
        playerVars: { autoplay: 1, controls: 0 },
        events: {
          onStateChange: (e: YTOnStateChangeEvent) => {
            if (window.YT && e.data === window.YT.PlayerState.PLAYING) {
              clearInterval(progressInterval.current);
              progressInterval.current = setInterval(() => {
                const dur = playerRef.current?.getDuration() ?? 0;
                const cur = playerRef.current?.getCurrentTime() ?? 0;
                if (dur > 0) setProgress((cur / dur) * 100);
                const m = Math.floor(cur / 60);
                const s = Math.floor(cur % 60).toString().padStart(2, "0");
                setCurrentTime(`${m}:${s}`);
              }, 500);
            }
            if (window.YT && e.data === window.YT.PlayerState.ENDED) {
              clearInterval(progressInterval.current);
              progressInterval.current = undefined;
              const next = index + 1;
              if (next < trackList.length) loadAndPlay(next);
              else {
                setIsPlaying(false);
                setProgress(0);
                setCurrentTime("0:00");
              }
            }
          },
        },
      });
    };

    if (window.YT?.Player) init();
    else window.onYouTubeIframeAPIReady = init;
  };

  const togglePlay = () => {
    if (!playerRef.current) return;
    if (isPlaying) {
      playerRef.current.pauseVideo();
      clearInterval(progressInterval.current);
      progressInterval.current = undefined;
    } else {
      playerRef.current.playVideo();
    }
    setIsPlaying(!isPlaying);
  };

  const skipTrack = (dir: number) => {
    const base = currentIndex ?? 0;
    const next = base + dir;
    if (next >= 0 && next < trackList.length) loadAndPlay(next);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!playerRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    const dur = playerRef.current.getDuration() ?? 0;
    playerRef.current.seekTo(pct * dur, true);
  };

  const saveUrl = (index: number) => {
    const updated = [...trackList];
    updated[index] = { ...updated[index], youtube: urlInput };
    setTrackList(updated);
    setEditingIndex(null);
    setUrlInput("");
  };

  const currentTrack = currentIndex !== null ? trackList[currentIndex] : null;

  // Album data with images
  const albums = [
    { title: "Streets Never Lie", year: "2025", tracks: 12, image: album1 },
    { title: "Dark Hours", year: "2023", tracks: 10, image: album2 },
    { title: "Raw Debut", year: "2021", tracks: 8, image: album3 },
  ];

  return (
    <section id="music" className="bg-dark-1 py-24 lg:py-32 relative overflow-hidden">
      <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-blood/5 to-transparent pointer-events-none" />

      {/* Hidden YouTube mount point */}
      <div ref={playerContainerRef} style={{ position: "absolute", opacity: 0, pointerEvents: "none" }} />

      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-px bg-crimson" />
              <span className="font-oswald text-xs tracking-[0.3em] uppercase text-crimson">Discography</span>
            </div>
            <h2 className="font-display text-5xl lg:text-7xl text-white">LATEST TRACKS</h2>
          </div>
          <a href="#" className="btn-outline px-6 py-2 text-xs hidden md:block">All Music</a>
        </div>

        {/* Now Playing Bar */}
        {currentTrack && (
          <div className="mb-8 flex flex-col md:flex-row items-center gap-4 bg-white/5 border border-white/10 rounded px-6 py-4">
            <div className="flex-1 min-w-0">
              <p className="font-oswald text-xs text-crimson uppercase tracking-widest mb-1">Now Playing</p>
              <p className="font-oswald text-lg text-white uppercase truncate">{currentTrack.title}</p>
              {currentTrack.feat && (
                <p className="font-barlow text-xs text-gray-500 uppercase">{currentTrack.feat}</p>
              )}
            </div>

            {/* Progress */}
            <div className="flex items-center gap-3 w-full md:w-64">
              <span className="font-oswald text-xs text-gray-500">{currentTime}</span>
              <div
                className="flex-1 h-1 bg-white/10 rounded-full cursor-pointer"
                onClick={handleProgressClick}
              >
                <div
                  className="h-full bg-crimson rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="font-oswald text-xs text-gray-500">{currentTrack.duration}</span>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => skipTrack(-1)}
                className="text-gray-400 hover:text-white transition-colors text-lg"
              >⏮</button>
              <button
                onClick={togglePlay}
                className="w-10 h-10 rounded-full bg-crimson flex items-center justify-center text-white hover:bg-red-600 transition-colors"
              >
                {isPlaying ? "⏸" : "▶"}
              </button>
              <button
                onClick={() => skipTrack(1)}
                className="text-gray-400 hover:text-white transition-colors text-lg"
              >⏭</button>
            </div>
          </div>
        )}

        {/* Track List */}
        <div className="border-t border-white/5">
          {trackList.map((track, i) => (
            <div key={track.num}>
              <div
                className={`track-row group flex items-center gap-4 lg:gap-8 py-4 px-4 border-b border-white/5 rounded-sm ${
                  currentIndex === i ? "bg-white/5" : ""
                }`}
              >
                {/* Number / play */}
                <div
                  className="w-8 text-center relative cursor-pointer"
                  onClick={() => loadAndPlay(i)}
                >
                  <span
                    className={`track-num font-oswald text-sm transition-opacity ${
                      currentIndex === i ? "opacity-0" : "text-gray-600 group-hover:opacity-0"
                    }`}
                  >
                    {track.num}
                  </span>
                  <span
                    className={`track-play absolute inset-0 flex items-center justify-center text-crimson text-sm ${
                      currentIndex === i ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                    }`}
                  >
                    {currentIndex === i && isPlaying ? "⏸" : "▶"}
                  </span>
                </div>

                {/* Waveform */}
                <div className="hidden md:flex items-center gap-0.5 h-6">
                  {Array.from({ length: 16 }).map((_, j) => (
                    <div
                      key={j}
                      className={`w-0.5 rounded-full transition-colors ${
                        currentIndex === i && isPlaying
                          ? "bg-crimson/60"
                          : "bg-white/10 group-hover:bg-crimson/30"
                      }`}
                      style={{ height: `${Math.random() * 70 + 30}%` }}
                    />
                  ))}
                </div>

                {/* Title */}
                <div className="flex-1 min-w-0 cursor-pointer" onClick={() => loadAndPlay(i)}>
                  <div className="flex items-center gap-3">
                    <span
                      className={`font-oswald text-base lg:text-lg uppercase tracking-wide truncate ${
                        currentIndex === i ? "text-crimson" : "text-white"
                      }`}
                    >
                      {track.title}
                    </span>
                    {track.hot && (
                      <span className="flex-shrink-0 font-oswald text-xs tracking-widest uppercase bg-crimson text-white px-2 py-0.5 rounded-sm">
                        Hot
                      </span>
                    )}
                  </div>
                  {track.feat && (
                    <span className="font-barlow text-xs text-gray-500 uppercase tracking-wider">
                      {track.feat}
                    </span>
                  )}
                </div>

                {/* Album */}
                <div className="hidden lg:block flex-shrink-0 w-44">
                  <span className="font-oswald text-xs tracking-wide text-gray-500 uppercase">
                    {track.album}
                  </span>
                </div>

                {/* Duration */}
                <div className="flex-shrink-0 font-oswald text-sm text-gray-500">
                  {track.duration}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => {
                      setEditingIndex(i);
                      setUrlInput(track.youtube ?? "");
                    }}
                    className="text-gray-500 hover:text-crimson transition-colors text-xs font-oswald uppercase tracking-wider"
                    title="Set YouTube link"
                  >
                    {track.youtube ? "🔗" : "+ URL"}
                  </button>
                  <button className="text-gray-500 hover:text-white transition-colors text-sm">♡</button>
                  <button className="text-gray-500 hover:text-white transition-colors text-sm">⋯</button>
                </div>
              </div>

              {/* URL Input Row */}
              {editingIndex === i && (
                <div className="flex items-center gap-3 px-4 py-3 bg-white/[0.03] border-b border-white/5">
                  <span className="font-oswald text-xs text-crimson uppercase tracking-widest flex-shrink-0">
                    YouTube URL
                  </span>
                  <input
                    type="text"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && saveUrl(i)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="flex-1 bg-white/5 border border-white/10 rounded px-3 py-1.5 text-sm text-white placeholder-gray-600 font-barlow focus:outline-none focus:border-crimson"
                    autoFocus
                  />
                  <button
                    onClick={() => saveUrl(i)}
                    className="font-oswald text-xs uppercase tracking-widest bg-crimson text-white px-4 py-1.5 rounded hover:bg-red-600 transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingIndex(null)}
                    className="font-oswald text-xs uppercase tracking-widest text-gray-500 hover:text-white transition-colors px-2"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Albums Grid with Images */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6">
          {albums.map((album) => (
            <div key={album.title} className="group relative aspect-square overflow-hidden cursor-pointer">
              {/* Album Image */}
              <Image
                src={album.image}
                alt={album.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              
              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/70 group-hover:from-black/50 group-hover:to-black/60 transition-all duration-400" />
              
              {/* Content */}
              <div className="absolute inset-0 flex items-end p-5">
                <div>
                  <div className="font-oswald text-xs tracking-[0.2em] text-gray-300 uppercase mb-1">
                    {album.year} · {album.tracks} Tracks
                  </div>
                  <div className="font-display text-xl lg:text-3xl text-white uppercase leading-tight">
                    {album.title}
                  </div>
                </div>
              </div>
              
              {/* Grid Pattern Overlay */}
              <div
                className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
                  backgroundSize: "30px 30px",
                }}
              />
              
              {/* Play Button Overlay */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-10 h-10 bg-crimson rounded-full flex items-center justify-center text-white text-sm transform transition-transform group-hover:scale-110">
                  ▶
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}