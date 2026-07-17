export type LoopPlayerIconName =
  | "chevronLeft"
  | "chevronRight"
  | "play"
  | "pause"
  | "music"
  | "fullscreen"
  | "exitFullscreen"
  | "mirror"
  | "controls";

type LoopPlayerIconProps = {
  name: LoopPlayerIconName;
  slashed?: boolean;
  className?: string;
};

function IconPath({ name }: { name: LoopPlayerIconName }) {
  switch (name) {
    case "chevronLeft":
      return <path d="m14.5 6-6 6 6 6" />;
    case "chevronRight":
      return <path d="m9.5 6 6 6-6 6" />;
    case "play":
      return <path d="M8 5.5v13l10-6.5z" fill="currentColor" stroke="none" />;
    case "pause":
      return (
        <>
          <rect x="7" y="5" width="3.8" height="14" rx="1" fill="currentColor" stroke="none" />
          <rect x="13.2" y="5" width="3.8" height="14" rx="1" fill="currentColor" stroke="none" />
        </>
      );
    case "music":
      return (
        <>
          <path d="M9 18V6l10-2v12" />
          <circle cx="7" cy="18" r="3" />
          <circle cx="17" cy="16" r="3" />
        </>
      );
    case "fullscreen":
      return (
        <>
          <path d="M8 4H4v4" />
          <path d="M16 4h4v4" />
          <path d="M20 16v4h-4" />
          <path d="M8 20H4v-4" />
        </>
      );
    case "exitFullscreen":
      return (
        <>
          <path d="M9 4v5H4" />
          <path d="M15 4v5h5" />
          <path d="M15 20v-5h5" />
          <path d="M9 20v-5H4" />
        </>
      );
    case "mirror":
      return <rect x="4" y="7" width="16" height="10" rx="1.4" />;
    case "controls":
      return (
        <>
          <rect x="5" y="5" width="5" height="5" rx="1" />
          <rect x="14" y="5" width="5" height="5" rx="1" />
          <rect x="5" y="14" width="5" height="5" rx="1" />
          <rect x="14" y="14" width="5" height="5" rx="1" />
        </>
      );
  }
}

export function LoopPlayerIcon({
  name,
  slashed = false,
  className = "h-6 w-6",
}: LoopPlayerIconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <IconPath name={name} />
      {slashed ? (
        <path
          d="M4.5 19.5 19.5 4.5"
          className="text-[#ff6b73]"
          stroke="currentColor"
          strokeWidth="2.9"
        />
      ) : null}
    </svg>
  );
}
