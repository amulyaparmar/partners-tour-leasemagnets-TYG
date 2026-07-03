import {
  PropertyLoopPlayer,
  type LoopClip,
} from "@/components/property-loop-player";

const videoBaseUrl =
  "https://partners-tour-leasemagnets-dfcxash7o-lm-team-tygs-projects.vercel.app/storyboards/abbot-loop/videos";

const clips: LoopClip[] = [
  {
    id: "intro",
    title: "The Abbot",
    label: "Intro",
    src: `${videoBaseUrl}/abbot-intro-v2-2025.m4v`,
    duration: "1:45",
  },
  {
    id: "three-bedroom-floor-plan",
    title: "3x2 Floor Plan",
    label: "Floor Plan",
    src: `${videoBaseUrl}/abbot-3x2-2025.m4v`,
    duration: "2:08",
  },
  {
    id: "landmarks",
    title: "Landmarks",
    label: "Amenity",
    src: `${videoBaseUrl}/abbot-landmarks-2025.m4v`,
    duration: "0:38",
  },
  {
    id: "gym",
    title: "Gym",
    label: "Amenity",
    src: `${videoBaseUrl}/abbot-gym-2025.m4v`,
    duration: "0:37",
  },
  {
    id: "study-rooms",
    title: "Study Rooms",
    label: "Amenity",
    src: `${videoBaseUrl}/abbot-study-rooms-2025.m4v`,
    duration: "0:31",
  },
  {
    id: "rooftop-lounge-firepit",
    title: "Rooftop Lounge + Firepit",
    label: "Amenity",
    src: `${videoBaseUrl}/abbot-rooftop-lounge-firepit-2025.m4v`,
    duration: "0:28",
  },
  {
    id: "indoor-entertainment",
    title: "Indoor Entertainment",
    label: "Amenity",
    src: `${videoBaseUrl}/abbot-indoor-entertainment-2025.m4v`,
    duration: "0:33",
  },
  {
    id: "hot-tub",
    title: "Hot Tub",
    label: "Amenity",
    src: `${videoBaseUrl}/abbot-hottub-2025.m4v`,
    duration: "0:31",
  },
  {
    id: "rooftop-bbq",
    title: "Rooftop BBQ",
    label: "Amenity",
    src: `${videoBaseUrl}/abbot-rooftop-bbq-2025.m4v`,
    duration: "0:22",
  },
];

const peakmadeLogo = {
  src: "/storyboards/shared/logos/peakmade-white.png",
  alt: "PeakMade Real Estate",
  width: 1200,
  height: 510,
  className: "h-auto w-20 max-w-[42%] opacity-60 sm:w-24",
};

export function AbbotLoopPlayer() {
  return (
    <PropertyLoopPlayer
      clips={clips}
      cacheName="abbot-loop-videos-v3"
      location="East Lansing, MI"
      orientation="landscape"
      propertyLogo={{
        src: "/storyboards/abbot-loop/logos/the-abbot-white.png",
        alt: "The Abbot",
        width: 1500,
        height: 258,
        className: "h-auto w-64 max-w-full opacity-95 sm:w-72 lg:w-80",
        compactClassName: "h-auto w-44 max-w-[calc(100vw-120px)] opacity-95",
      }}
      managementLogo={peakmadeLogo}
    />
  );
}
