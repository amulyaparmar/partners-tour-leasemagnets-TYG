import {
  PropertyLoopPlayer,
  type LoopClip,
} from "@/components/property-loop-player";

const clips: LoopClip[] = [
  {
    id: "intro",
    title: "Brooks at Stillwater",
    label: "Intro",
    src: "https://partners-tour-leasemagnets-tyg-iota.vercel.app/storyboards/brooks-at-stillwater-loop/videos/brooks-at-stillwater-intro-2026-1080p.mp4",
    duration: "1:06",
  },
  {
    id: "four-bedroom-floor-plan",
    title: "4x4 Floor Plan",
    label: "Floor Plan",
    src: "https://partners-tour-leasemagnets-tyg-iota.vercel.app/storyboards/brooks-at-stillwater-loop/videos/brooks-at-stillwater-4x4-floor-plan-2026-1080p.mp4",
    duration: "1:32",
  },
  {
    id: "fitness-center",
    title: "Fitness Center",
    label: "Amenity",
    src: "https://partners-tour-leasemagnets-tyg-iota.vercel.app/storyboards/brooks-at-stillwater-loop/videos/brooks-at-stillwater-fitness-center-2026-1080p.mp4",
    duration: "0:29",
  },
  {
    id: "volleyball-court",
    title: "Volleyball Court",
    label: "Amenity",
    src: "https://partners-tour-leasemagnets-tyg-iota.vercel.app/storyboards/brooks-at-stillwater-loop/videos/brooks-at-stillwater-volleyball-court-2026-1080p.mp4",
    duration: "0:13",
  },
  {
    id: "study-room-clubhouse",
    title: "Study Room + Clubhouse",
    label: "Amenity",
    src: "https://partners-tour-leasemagnets-tyg-iota.vercel.app/storyboards/brooks-at-stillwater-loop/videos/brooks-at-stillwater-study-room-clubhouse-2026-1080p.mp4",
    duration: "0:34",
  },
  {
    id: "pool",
    title: "Pool",
    label: "Amenity",
    src: "https://partners-tour-leasemagnets-tyg-iota.vercel.app/storyboards/brooks-at-stillwater-loop/videos/brooks-at-stillwater-pool-2026-1080p.mp4",
    duration: "0:31",
  },
  {
    id: "tanning-room",
    title: "Tanning Room",
    label: "Amenity",
    src: "https://partners-tour-leasemagnets-tyg-iota.vercel.app/storyboards/brooks-at-stillwater-loop/videos/brooks-at-stillwater-tanning-room-2026-1080p.mp4",
    duration: "0:18",
  },
  {
    id: "dog-park",
    title: "Dog Park",
    label: "Amenity",
    src: "https://partners-tour-leasemagnets-tyg-iota.vercel.app/storyboards/brooks-at-stillwater-loop/videos/brooks-at-stillwater-dog-park-2026-1080p.mp4",
    duration: "0:16",
  },
];

const peakmadeLogo = {
  src: "/storyboards/shared/logos/peakmade-white.png",
  alt: "PeakMade Real Estate",
  width: 1200,
  height: 510,
  className: "h-auto w-20 max-w-[42%] opacity-60 sm:w-24",
};

export function BrooksAtStillwaterLoopPlayer() {
  return (
    <PropertyLoopPlayer
      clips={clips}
      cacheName="brooks-at-stillwater-loop-videos-v1"
      location="Stillwater, OK"
      orientation="landscape"
      propertyLogo={{
        src: "/storyboards/brooks-at-stillwater-loop/logos/brooks-at-stillwater-white.png",
        alt: "Brooks at Stillwater",
        width: 736,
        height: 360,
        className: "h-auto w-64 max-w-full opacity-95 sm:w-72 lg:w-80",
        compactClassName: "h-auto w-44 max-w-[calc(100vw-120px)] opacity-95",
      }}
      managementLogo={peakmadeLogo}
    />
  );
}
