import { handleReportAccess } from "@/lib/tour-report-access";

export const runtime = "nodejs";

export async function POST(request: Request) {
  return handleReportAccess(request, "verify");
}
