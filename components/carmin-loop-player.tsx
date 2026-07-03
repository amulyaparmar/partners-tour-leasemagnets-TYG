import {
  PropertyLoopPlayer,
  type LoopClip,
} from "@/components/property-loop-player";

const videoBaseUrl =
  "https://partners-tour-leasemagnets-9grd6vz8w-lm-team-tygs-projects.vercel.app/storyboards/carmin-loop/videos";

const clips: LoopClip[] = [
  {
    id: "intro",
    title: "The Carmin",
    label: "Intro",
    src: `${videoBaseUrl}/carmin-intro-2023.mp4`,
    duration: "1:29",
  },
  {
    id: "two-bedroom-floor-plan",
    title: "2x2 Floor Plan",
    label: "Floor Plan",
    src: `${videoBaseUrl}/carmin-2x2-2023-new-version.mp4`,
    duration: "1:23",
  },
  {
    id: "sky-lounge",
    title: "Sky Lounge",
    label: "Amenity",
    src: `${videoBaseUrl}/carmin-sky-lounge-2023.mp4`,
    duration: "0:48",
  },
  {
    id: "outdoor-sports-deck",
    title: "Outdoor Sports Deck",
    label: "Amenity",
    src: `${videoBaseUrl}/carmin-outdoor-sports-deck-2023.mp4`,
    duration: "0:29",
  },
  {
    id: "pool",
    title: "Pool",
    label: "Amenity",
    src: `${videoBaseUrl}/carmin-pool-2023.mp4`,
    duration: "0:41",
  },
  {
    id: "fitness-center",
    title: "Fitness Center",
    label: "Amenity",
    src: `${videoBaseUrl}/carmin-fitness-center-2023.mp4`,
    duration: "0:36",
  },
];

const peakmadeLogo = {
  src: "/storyboards/shared/logos/peakmade-white.png",
  alt: "PeakMade Real Estate",
  width: 1200,
  height: 510,
  className: "h-auto w-20 max-w-[42%] opacity-60 sm:w-24",
};

export function CarminLoopPlayer() {
  return (
    <PropertyLoopPlayer
      clips={clips}
      cacheName="carmin-loop-videos-v2"
      location="Tempe, AZ"
      orientation="landscape"
      propertyLogo={{
        src: "/storyboards/carmin-loop/logos/the-carmin-white.png",
        alt: "The Carmin",
        width: 1320,
        height: 266,
        className: "h-auto w-64 max-w-full opacity-95 sm:w-72 lg:w-80",
        compactClassName: "h-auto w-48 max-w-[calc(100vw-120px)] opacity-95",
      }}
      managementLogo={peakmadeLogo}
    />
  );
}
