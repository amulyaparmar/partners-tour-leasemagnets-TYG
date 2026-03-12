import { NextRequest, NextResponse } from "next/server";

const OWNER = process.env.GITHUB_REPO_OWNER ?? "amulyaparmar";
const REPO = process.env.GITHUB_REPO_NAME ?? "partners-tour-leasemagnets-TYG";
const FILE_PATH = process.env.GITHUB_UPDATE_FILE_PATH ?? "README.md";
const BRANCH = process.env.GITHUB_UPDATE_BRANCH ?? "main";
const TIMESTAMP_MARKER = "<!-- vercel-deploy-timestamp -->";
const DEFAULT_COMMIT_PREFIX = "chore: trigger Vercel deploy via GitHub";

function upsertTimestamp(content: string, timestamp: string) {
  const nextTimestampLine = `${TIMESTAMP_MARKER} Last updated: ${timestamp}`;
  const markerPattern = new RegExp(
    `^${TIMESTAMP_MARKER.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")} Last updated: .*$`,
    "m",
  );

  if (markerPattern.test(content)) {
    return content.replace(markerPattern, nextTimestampLine);
  }

  const trimmed = content.trimEnd();
  const prefix = trimmed.length > 0 ? `${trimmed}\n\n` : "";
  return `${prefix}## Deploy Trigger\n\n${nextTimestampLine}\n`;
}

async function updateDeployTimestamp() {
  return updateDeployTimestampWithMessage();
}

async function updateDeployTimestampWithMessage(commitMessage?: string) {
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    return NextResponse.json({ error: "Missing GITHUB_TOKEN" }, { status: 500 });
  }

  try {
    const githubUrl = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${encodeURIComponent(FILE_PATH)}`;
    const getResp = await fetch(`${githubUrl}?ref=${BRANCH}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
      },
      cache: "no-store",
    });

    if (!getResp.ok) {
      const text = await getResp.text();
      return NextResponse.json(
        { error: "Failed to fetch file", details: text },
        { status: getResp.status },
      );
    }

    const fileJson = (await getResp.json()) as {
      content?: string;
      sha: string;
    };

    const sha = fileJson.sha;
    const contentB64 = (fileJson.content ?? "").replace(/\n/g, "");
    const originalContent = Buffer.from(contentB64, "base64").toString("utf8");
    const timestamp = new Date().toISOString();
    const newContent = upsertTimestamp(originalContent, timestamp);
    const newContentB64 = Buffer.from(newContent, "utf8").toString("base64");
    const message = commitMessage || `${DEFAULT_COMMIT_PREFIX} at ${timestamp}`;

    const putResp = await fetch(githubUrl, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
        content: newContentB64,
        sha,
        branch: BRANCH,
      }),
    });

    if (!putResp.ok) {
      const text = await putResp.text();
      return NextResponse.json(
        { error: "Failed to update file", details: text },
        { status: putResp.status },
      );
    }

    const putJson = (await putResp.json()) as {
      commit?: { html_url?: string; sha?: string };
      content?: { html_url?: string };
    };

    return NextResponse.json({
      branch: BRANCH,
      commitMessage: message,
      commitSha: putJson.commit?.sha,
      commitUrl: putJson.commit?.html_url,
      filePath: FILE_PATH,
      fileUrl: putJson.content?.html_url,
      message: "Deploy trigger committed",
      repository: `${OWNER}/${REPO}`,
      updatedAt: timestamp,
    });
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      {
        error: "Unexpected error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  void request;
  return updateDeployTimestamp();
}

export async function POST(request: NextRequest) {
  let commitMessage: string | undefined;

  try {
    const rawBody = await request.text();

    if (rawBody) {
      const body = JSON.parse(rawBody) as { commitMessage?: string };
      if (typeof body.commitMessage === "string" && body.commitMessage.trim()) {
        commitMessage = body.commitMessage.trim().slice(0, 200);
      }
    }
  } catch (error) {
    return NextResponse.json(
      {
        error: "Invalid request body",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 400 },
    );
  }

  return updateDeployTimestampWithMessage(commitMessage);
}
