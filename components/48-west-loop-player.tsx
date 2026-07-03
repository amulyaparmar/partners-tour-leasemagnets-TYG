import {
  PropertyLoopPlayer,
  type LoopClip,
} from "@/components/property-loop-player";

const videoBaseUrl =
  "https://partners-tour-leasemagnets-fgtzon1n0-lm-team-tygs-projects.vercel.app/storyboards/48-west-loop/videos";

const clips: LoopClip[] = [
  {
    id: "intro",
    title: "48 West",
    label: "Intro",
    src: `${videoBaseUrl}/48-west-intro-2024.mp4`,
    duration: "1:49",
  },
  {
    id: "four-bedroom-floor-plan",
    title: "4x4 Floor Plan",
    label: "Floor Plan",
    src: `${videoBaseUrl}/48-west-4x4-2024.mp4`,
    duration: "1:48",
  },
  {
    id: "commons-building",
    title: "Commons Building",
    label: "Amenity",
    src: `${videoBaseUrl}/48-west-commons-building-2024.mp4`,
    duration: "0:40",
  },
  {
    id: "study-center",
    title: "Study Center",
    label: "Amenity",
    src: `${videoBaseUrl}/48-west-study-center-2024.mp4`,
    duration: "0:25",
  },
  {
    id: "pool",
    title: "Pool",
    label: "Amenity",
    src: `${videoBaseUrl}/48-west-pool-2024.mp4`,
    duration: "0:24",
  },
  {
    id: "sun-roof",
    title: "Sun Roof",
    label: "Amenity",
    src: `${videoBaseUrl}/48-west-sun-roof-2024.mp4`,
    duration: "0:28",
  },
  {
    id: "yoga-studio",
    title: "Yoga Studio",
    label: "Amenity",
    src: `${videoBaseUrl}/48-west-yoga-studio-2024.mp4`,
    duration: "0:26",
  },
  {
    id: "gym",
    title: "Gym",
    label: "Amenity",
    src: `${videoBaseUrl}/48-west-gym-2024.mp4`,
    duration: "0:33",
  },
  {
    id: "movie-theater-game-room",
    title: "Movie Theater & Game Room",
    label: "Amenity",
    src: `${videoBaseUrl}/48-west-movie-theater-game-room-2024.mp4`,
    duration: "0:42",
  },
];

const peakmadeLogo = {
  src: "/storyboards/shared/logos/peakmade-white.png",
  alt: "PeakMade Real Estate",
  width: 1200,
  height: 510,
  className: "h-auto w-20 max-w-[42%] opacity-60 sm:w-24",
};

export function FortyEightWestLoopPlayer() {
  return (
    <>
      <style>{`
        main.h-screen video[aria-hidden="true"] {
          display: none !important;
        }

        main.h-screen video:not([aria-hidden="true"]) {
          width: 100% !important;
          max-width: 100% !important;
          height: 100% !important;
          object-fit: contain !important;
        }
      `}</style>
      <PropertyLoopPlayer
        clips={clips}
        cacheName="48-west-loop-videos-v1"
        location="Allendale, MI"
        orientation="landscape"
        propertyLogo={{
          src: "/storyboards/48-west-loop/logos/48-west-white.svg",
          alt: "48 West",
          width: 420,
          height: 180,
          className: "h-auto w-64 max-w-full opacity-95",
          compactClassName: "h-auto w-36 max-w-[calc(100vw-120px)] opacity-95",
        }}
        managementLogo={peakmadeLogo}
      />
    </>
  );
}
