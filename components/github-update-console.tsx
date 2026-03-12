"use client";

import { useEffect, useState, useTransition } from "react";

const LAST_COMMIT_MESSAGE_KEY = "github-update-last-commit-message";
const UPDATE_HISTORY_KEY = "github-update-history";
const MAX_HISTORY_ENTRIES = 12;

type UpdateResponse = {
  branch?: string;
  commitMessage?: string;
  commitSha?: string;
  commitUrl?: string;
  error?: string;
  filePath?: string;
  fileUrl?: string;
  message?: string;
  repository?: string;
  updatedAt?: string;
};

type HistoryEntry = {
  commitMessage: string;
  commitSha?: string;
  commitUrl?: string;
  updatedAt: string;
};

export function GitHubUpdateConsole() {
  const [commitMessage, setCommitMessage] = useState("");
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [result, setResult] = useState<UpdateResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const savedCommitMessage = window.localStorage.getItem(LAST_COMMIT_MESSAGE_KEY);
    const savedHistory = window.localStorage.getItem(UPDATE_HISTORY_KEY);

    if (savedCommitMessage) {
      setCommitMessage(savedCommitMessage);
    }

    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory) as HistoryEntry[];
        if (Array.isArray(parsed)) {
          setHistory(parsed);
        }
      } catch {
        window.localStorage.removeItem(UPDATE_HISTORY_KEY);
      }
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(LAST_COMMIT_MESSAGE_KEY, commitMessage);
  }, [commitMessage]);

  function handleSubmit() {
    startTransition(async () => {
      setError(null);
      setResult(null);

      try {
        const response = await fetch("/api/github", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            commitMessage: commitMessage.trim() || undefined,
          }),
        });

        const payload = (await response.json()) as UpdateResponse;

        if (!response.ok) {
          throw new Error(payload.error ?? "Failed to trigger update");
        }

        const nextCommitMessage = payload.commitMessage ?? commitMessage.trim();
        const nextHistoryEntry: HistoryEntry = {
          commitMessage: nextCommitMessage || "Deploy trigger update",
          commitSha: payload.commitSha,
          commitUrl: payload.commitUrl,
          updatedAt: payload.updatedAt ?? new Date().toISOString(),
        };
        setCommitMessage(nextCommitMessage);
        setResult(payload);
        setHistory((currentHistory) => {
          const nextHistory = [nextHistoryEntry, ...currentHistory].slice(
            0,
            MAX_HISTORY_ENTRIES,
          );
          window.localStorage.setItem(UPDATE_HISTORY_KEY, JSON.stringify(nextHistory));
          return nextHistory;
        });
      } catch (submitError: unknown) {
        setError(
          submitError instanceof Error
            ? submitError.message
            : "Failed to trigger update",
        );
      }
    });
  }

  return (
    <section className="mx-auto flex w-full max-w-4xl flex-col gap-6 rounded-[2rem] border border-black/10 bg-white/70 p-6 shadow-[0_24px_80px_rgba(21,32,51,0.12)] backdrop-blur md:p-10">
      <div className="grid gap-6 md:grid-cols-[1.35fr_0.95fr]">
        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--color-muted)]">
            GitHub Deploy Trigger
          </p>
          <h1 className="max-w-2xl text-4xl leading-tight font-semibold text-[var(--color-deep)] md:text-5xl">
            Trigger a Vercel rebuild by committing a timestamp update.
          </h1>
          <p className="max-w-xl text-base leading-7 text-[var(--color-muted)] md:text-lg">
            This page calls the repo&apos;s GitHub API route, updates the deploy
            marker in `README.md`, and lets Vercel redeploy from the resulting
            commit.
          </p>
        </div>

        <div className="rounded-[1.5rem] border border-[var(--color-accent)]/20 bg-[var(--color-accent-soft)]/45 p-5">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--color-deep)]">
            Expected setup
          </p>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-[var(--color-deep)]">
            <li>`GITHUB_TOKEN` with contents write access</li>
            <li>Vercel connected to this GitHub repository</li>
            <li>Anyone who can access this page can trigger a commit</li>
          </ul>
        </div>
      </div>

      <div className="grid gap-6 rounded-[1.5rem] border border-black/10 bg-[var(--color-background)]/70 p-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
        <label className="flex flex-col gap-3 text-sm font-medium text-[var(--color-deep)]">
          Optional commit message
          <input
            type="text"
            value={commitMessage}
            onChange={(event) => setCommitMessage(event.target.value)}
            placeholder="chore: manual deploy trigger"
            className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-base text-[var(--color-deep)] outline-none transition focus:border-[var(--color-accent)]"
          />
        </label>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isPending}
          className="inline-flex min-h-12 items-center justify-center rounded-full bg-[var(--color-deep)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--color-ink)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Triggering update..." : "Trigger GitHub update"}
        </button>
      </div>

      {error ? (
        <div className="rounded-[1.5rem] border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {result ? (
        <div className="grid gap-4 rounded-[1.5rem] border border-emerald-200 bg-emerald-50 px-5 py-5 text-sm text-emerald-950 md:grid-cols-2">
          <div>
            <p className="font-semibold uppercase tracking-[0.18em] text-emerald-700">
              Status
            </p>
            <p className="mt-2 text-base font-medium">{result.message}</p>
            <p className="mt-1 text-sm text-emerald-800">
              {result.repository} on {result.branch}
            </p>
            {result.commitMessage ? (
              <p className="mt-2 text-sm text-emerald-900">
                <span className="font-semibold">Commit message:</span>{" "}
                {result.commitMessage}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <p>
              <span className="font-semibold">Updated:</span>{" "}
              {result.updatedAt ?? "Unknown"}
            </p>
            {result.commitUrl ? (
              <p>
                <a
                  href={result.commitUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-emerald-800 underline underline-offset-4"
                >
                  View commit
                </a>
              </p>
            ) : null}
            {result.fileUrl ? (
              <p>
                <a
                  href={result.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-emerald-800 underline underline-offset-4"
                >
                  View updated file
                </a>
              </p>
            ) : null}
            {result.commitSha ? (
              <p className="break-all text-emerald-900">
                <span className="font-semibold">Commit SHA:</span>{" "}
                {result.commitSha}
              </p>
            ) : null}
          </div>
        </div>
      ) : null}

      <div className="rounded-[1.5rem] border border-black/10 bg-white/65 p-5 md:p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">
              Local History
            </p>
            <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
              Saved in this browser only. Tracks the last successful update
              times and commit messages.
            </p>
          </div>
        </div>

        {history.length > 0 ? (
          <div className="mt-5 space-y-3">
            {history.map((entry) => (
              <div
                key={`${entry.updatedAt}-${entry.commitSha ?? entry.commitMessage}`}
                className="rounded-2xl border border-black/8 bg-[var(--color-background)]/75 px-4 py-4"
              >
                <p className="text-sm font-semibold text-[var(--color-deep)]">
                  {entry.commitMessage}
                </p>
                <p className="mt-1 text-sm text-[var(--color-muted)]">
                  {entry.updatedAt}
                </p>
                {entry.commitUrl ? (
                  <p className="mt-2">
                    <a
                      href={entry.commitUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm font-semibold text-[var(--color-accent)] underline underline-offset-4"
                    >
                      Open commit
                    </a>
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-5 text-sm text-[var(--color-muted)]">
            No local update history yet.
          </p>
        )}
      </div>
    </section>
  );
}
