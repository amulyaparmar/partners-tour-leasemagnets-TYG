import {
  PropertyLoopPlayer,
  type LoopClip,
} from "@/components/property-loop-player";

const videoBase =
  "https://partners-tour-leasemagnets-tyg-iota.vercel.app/storyboards/hannah-lofts-loop/videos";

const clips: LoopClip[] = [
  {
    id: "intro",
    title: "Hannah Townhomes & Lofts",
    label: "Intro",
    src: `${videoBase}/hannah-lofts-main-intro-2025-1080p.mp4`,
    duration: "1:41",
  },
  {
    id: "four-bedroom-townhome",
    title: "4x4 Townhome",
    label: "Floor Plan",
    src: `${videoBase}/hannah-lofts-4x4-townhome-2025-1080p.mp4`,
    duration: "2:05",
  },
  {
    id: "clubhouse",
    title: "Clubhouse",
    label: "Amenity",
    src: `${videoBase}/hannah-lofts-clubhouse-2025-1080p.mp4`,
    duration: "0:34",
  },
  {
    id: "fitness-center",
    title: "Fitness Center",
    label: "Amenity",
    src: `${videoBase}/hannah-lofts-fitness-center-2025-1080p.mp4`,
    duration: "0:40",
  },
  {
    id: "pool",
    title: "Pool",
    label: "Amenity",
    src: `${videoBase}/hannah-lofts-pool-2025-1080p.mp4`,
    duration: "0:36",
  },
  {
    id: "hammock-garden",
    title: "Hammock Garden",
    label: "Amenity",
    src: `${videoBase}/hannah-lofts-hammock-garden-2025-1080p.mp4`,
    duration: "0:26",
  },
  {
    id: "fire-pit",
    title: "Fire Pit",
    label: "Amenity",
    src: `${videoBase}/hannah-lofts-fire-pit-2025-1080p.mp4`,
    duration: "0:24",
  },
  {
    id: "courtyard-grilling-stations",
    title: "Courtyard Grilling Stations",
    label: "Amenity",
    src: `${videoBase}/hannah-lofts-courtyard-grilling-stations-2025-1080p.mp4`,
    duration: "0:22",
  },
  {
    id: "study-rooms",
    title: "Study Rooms",
    label: "Amenity",
    src: `${videoBase}/hannah-lofts-study-rooms-2025-1080p.mp4`,
    duration: "0:29",
  },
  {
    id: "yoga-room",
    title: "Yoga Room",
    label: "Amenity",
    src: `${videoBase}/hannah-lofts-yoga-room-2025-1080p.mp4`,
    duration: "0:23",
  },
  {
    id: "shuttle-bus",
    title: "Shuttle Bus",
    label: "Amenity",
    src: `${videoBase}/hannah-lofts-shuttle-bus-2025-1080p.mp4`,
    duration: "0:21",
  },
  {
    id: "car-parking",
    title: "Car Parking",
    label: "Amenity",
    src: `${videoBase}/hannah-lofts-car-parking-2025-1080p.mp4`,
    duration: "0:20",
  },
  {
    id: "pet-friendly",
    title: "Pet Friendly",
    label: "Amenity",
    src: `${videoBase}/hannah-lofts-pet-friendly-2025-1080p.mp4`,
    duration: "0:19",
  },
  {
    id: "closing",
    title: "Hannah Townhomes & Lofts",
    label: "Closing",
    src: `${videoBase}/hannah-lofts-closing-2025-1080p.mp4`,
    duration: "0:33",
  },
];

const peakmadeLogo = {
  src: "/storyboards/shared/logos/peakmade-white.png",
  alt: "PeakMade Real Estate",
  width: 1200,
  height: 510,
  className: "h-auto w-20 max-w-[42%] opacity-60 sm:w-24",
};

export function HannahLoftsLoopPlayer() {
  return (
    <PropertyLoopPlayer
      clips={clips}
      cacheName="hannah-lofts-loop-videos-v1"
      location="East Lansing, MI"
      orientation="landscape"
      propertyLogo={{
        src: "/storyboards/hannah-lofts-loop/logos/hannah-lofts-white.png",
        alt: "Hannah Townhomes & Lofts",
        width: 1140,
        height: 435,
        className: "h-auto w-64 max-w-full opacity-95 sm:w-72 lg:w-80",
        compactClassName: "h-auto w-48 max-w-[calc(100vw-120px)] opacity-95",
      }}
      managementLogo={peakmadeLogo}
    />
  );
}
