import type { Metadata } from "next";

import FilmingGuide from "./filming-guide";
import { getSupportBookingUrl } from "./support-booking-config";

export const metadata: Metadata = {
  title: "Filming equipment setup",
  description:
    "Get ready to film with your iPhone, DJI Osmo Mobile 6 or SE, and DJI Mic Mini. Three simple steps with video walkthroughs.",
};

export default function FilmingSetupPage() {
  return <FilmingGuide supportBookingUrl={getSupportBookingUrl(process.env.FILMING_SUPPORT_BOOKING_URL)} />;
}
