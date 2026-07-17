import {
  PropertyLoopPlayer,
  type LoopClip,
} from "@/components/property-loop-player";

const clips: LoopClip[] = [
  {
    id: "intro",
    title: "The Ranch at San Marcos",
    label: "Intro",
    src: "/storyboards/ranch-loop/videos/ranch-intro-2026-1080p.mp4",
    fallbackSrc: "/storyboards/ranch-loop/videos/ranch-intro-2026.m4v",
    duration: "1:14",
  },
  {
    id: "three-bedroom-floor-plan",
    title: "3x3 Floor Plan",
    label: "Floor Plan",
    src: "/storyboards/ranch-loop/videos/ranch-3x3-2024-1080p.mp4",
    fallbackSrc: "/storyboards/ranch-loop/videos/ranch-3x3-2024.m4v",
    duration: "1:55",
  },
  {
    id: "study-lounge",
    title: "Study Lounge",
    label: "Amenity",
    src: "/storyboards/ranch-loop/videos/ranch-study-lounge-2024-1080p.mp4",
    fallbackSrc: "/storyboards/ranch-loop/videos/ranch-study-lounge-2024.m4v",
    duration: "0:18",
  },
  {
    id: "pool",
    title: "Pool",
    label: "Amenity",
    src: "/storyboards/ranch-loop/videos/ranch-pool-2024-1080p.mp4",
    fallbackSrc: "/storyboards/ranch-loop/videos/ranch-pool-2024.m4v",
    duration: "0:24",
  },
  {
    id: "clubhouse",
    title: "Clubhouse",
    label: "Amenity",
    src: "/storyboards/ranch-loop/videos/ranch-clubhouse-2024-1080p.mp4",
    fallbackSrc: "/storyboards/ranch-loop/videos/ranch-clubhouse-2024.m4v",
    duration: "0:29",
  },
  {
    id: "fitness-center",
    title: "Fitness Center",
    label: "Amenity",
    src: "/storyboards/ranch-loop/videos/ranch-fitness-center-2024-1080p.mp4",
    fallbackSrc: "/storyboards/ranch-loop/videos/ranch-fitness-center-2024.m4v",
    duration: "0:27",
  },
  {
    id: "basketball-court",
    title: "Basketball Court",
    label: "Amenity",
    src: "/storyboards/ranch-loop/videos/ranch-basketball-court-2024-1080p.mp4",
    fallbackSrc: "/storyboards/ranch-loop/videos/ranch-basketball-court-2024.m4v",
    duration: "0:26",
  },
];

const peakmadeLogo = {
  src: "/storyboards/shared/logos/peakmade-white.png",
  alt: "PeakMade Real Estate",
  width: 1200,
  height: 510,
  className: "h-auto w-20 max-w-[42%] opacity-60 sm:w-24",
};

type RanchLoopPlayerProps = {
  initialImmersiveMode?: boolean;
};

export function RanchLoopPlayer({
  initialImmersiveMode = false,
}: RanchLoopPlayerProps) {
  return (
    <PropertyLoopPlayer
      clips={clips}
      cacheName="ranch-loop-videos-v4"
      location="San Marcos, TX"
      orientation="landscape"
      initialImmersiveMode={initialImmersiveMode}
      propertyLogo={{
        src: "/storyboards/ranch-loop/logos/the-ranch-white.png",
        alt: "The Ranch at San Marcos",
        width: 2109,
        height: 1979,
        className: "h-auto w-40 max-w-full opacity-95 sm:w-44 lg:w-48",
        compactClassName: "h-auto w-24 max-w-[calc(100vw-120px)] opacity-95",
      }}
      managementLogo={peakmadeLogo}
    />
  );
}
