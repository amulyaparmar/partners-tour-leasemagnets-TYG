import {
  PropertyLoopPlayer,
  type LoopClip,
} from "@/components/property-loop-player";

const clips: LoopClip[] = [
  {
    id: "intro",
    title: "SoCam 290",
    label: "Intro",
    src: "/storyboards/socam-290-loop/videos/socam-290-intro-2026.m4v",
    duration: "2:16",
  },
  {
    id: "two-bedroom-floor-plan",
    title: "2x2 Floor Plan",
    label: "Floor Plan",
    src: "/storyboards/socam-290-loop/videos/socam-290-2x2-floor-plan-2026.m4v",
    duration: "2:05",
  },
  {
    id: "studio-floor-plan",
    title: "Studio Floor Plan",
    label: "Floor Plan",
    src: "/storyboards/socam-290-loop/videos/socam-290-studio-floor-plan-2026.m4v",
    duration: "1:11",
  },
  {
    id: "cafe-bar",
    title: "Cafe Bar",
    label: "Amenity",
    src: "/storyboards/socam-290-loop/videos/socam-290-cafe-bar-2026.m4v",
    duration: "0:29",
  },
  {
    id: "clubhouse",
    title: "Clubhouse",
    label: "Amenity",
    src: "/storyboards/socam-290-loop/videos/socam-290-clubhouse-2026.m4v",
    duration: "0:43",
  },
  {
    id: "fitness-center",
    title: "Fitness Center",
    label: "Amenity",
    src: "/storyboards/socam-290-loop/videos/socam-290-fitness-center-2026.m4v",
    duration: "0:43",
  },
  {
    id: "package-area",
    title: "Package Area",
    label: "Amenity",
    src: "/storyboards/socam-290-loop/videos/socam-290-package-area-2026.m4v",
    duration: "0:24",
  },
  {
    id: "laundry-area",
    title: "Laundry Area",
    label: "Amenity",
    src: "/storyboards/socam-290-loop/videos/socam-290-laundry-area-2026.m4v",
    duration: "0:33",
  },
  {
    id: "study-areas",
    title: "Study Areas",
    label: "Amenity",
    src: "/storyboards/socam-290-loop/videos/socam-290-study-areas-2026.m4v",
    duration: "0:42",
  },
  {
    id: "movie-areas",
    title: "Movie Areas",
    label: "Amenity",
    src: "/storyboards/socam-290-loop/videos/socam-290-movie-areas-2026.m4v",
    duration: "0:36",
  },
  {
    id: "bus-stop",
    title: "Bus Stop",
    label: "Amenity",
    src: "/storyboards/socam-290-loop/videos/socam-290-bus-stop-2026.m4v",
    duration: "0:33",
  },
  {
    id: "onsite-retailers",
    title: "Onsite Retailers",
    label: "Amenity",
    src: "/storyboards/socam-290-loop/videos/socam-290-onsite-retailers-2026.m4v",
    duration: "0:24",
  },
];

const peakmadeLogo = {
  src: "/storyboards/shared/logos/peakmade-white.png",
  alt: "PeakMade Real Estate",
  width: 1200,
  height: 510,
  className: "h-auto w-20 max-w-[42%] opacity-60 sm:w-24",
};

export function Socam290LoopPlayer() {
  return (
    <PropertyLoopPlayer
      clips={clips}
      cacheName="socam-290-loop-videos-v1"
      location="New Brunswick, NJ"
      orientation="landscape"
      propertyLogo={{
        src: "/storyboards/socam-290-loop/logos/socam-290-white.svg",
        alt: "SoCam 290",
        width: 442,
        height: 138,
        className: "h-auto w-56 max-w-full opacity-95 sm:w-64 lg:w-72",
        compactClassName: "h-auto w-40 max-w-[calc(100vw-120px)] opacity-95",
      }}
      managementLogo={peakmadeLogo}
    />
  );
}
