#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import { readFile, writeFile } from "node:fs/promises";

const README_PATH = "README.md";
const CONTRIBUTOR_START = "<!-- contributors:start -->";
const CONTRIBUTOR_END = "<!-- contributors:end -->";
const LEGACY_START = "<!-- readme: collaborators,contributors -start -->";
const LEGACY_END = "<!-- readme: collaborators,contributors -end -->";

const getRepository = () => {
  const envRepository = process.env.GITHUB_REPOSITORY;
  if (envRepository) return envRepository;

  const remoteUrl = execFileSync("git", ["remote", "get-url", "origin"], {
    encoding: "utf8",
  }).trim();

  const match = remoteUrl.match(/github\.com[:/](?<owner>[^/]+)\/(?<repo>[^/.]+)(?:\.git)?$/u);
  if (!match?.groups) {
    throw new Error(`Cannot parse GitHub repository from origin: ${remoteUrl}`);
  }

  return `${match.groups.owner}/${match.groups.repo}`;
};

const fetchContributors = async (repository) => {
  const headers = {
    "Accept": "application/vnd.github+json",
    "User-Agent": "ma6-debt-contributors-script",
  };

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const response = await fetch(
    `https://api.github.com/repos/${repository}/contributors?per_page=100`,
    { headers }
  );

  if (!response.ok) {
    throw new Error(`GitHub contributors request failed: ${response.status}`);
  }

  return response.json();
};

const escapeHtml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const renderContributor = (contributor) => {
  const login = escapeHtml(contributor.login);
  const profileUrl = escapeHtml(contributor.html_url);
  const avatarUrl = escapeHtml(`${contributor.avatar_url}&s=100`);

  return [
    "<td align=\"center\" width=\"120\">",
    `<a href=\"${profileUrl}\">`,
    `<img src=\"${avatarUrl}\" width=\"72\" height=\"72\" alt=\"${login}\" /><br />`,
    `<sub><b>${login}</b></sub>`,
    "</a>",
    "</td>",
  ].join("");
};

const renderTable = (contributors) => {
  if (contributors.length === 0) return "_No contributors found._";

  const rows = [];
  for (let index = 0; index < contributors.length; index += 6) {
    rows.push(`<tr>${contributors.slice(index, index + 6).map(renderContributor).join("")}</tr>`);
  }

  return `<table>\n${rows.join("\n")}\n</table>`;
};

const replaceContributorBlock = (readme, content) => {
  const hasCurrentMarkers = readme.includes(CONTRIBUTOR_START) && readme.includes(CONTRIBUTOR_END);
  const start = hasCurrentMarkers ? CONTRIBUTOR_START : LEGACY_START;
  const end = hasCurrentMarkers ? CONTRIBUTOR_END : LEGACY_END;

  if (!readme.includes(start) || !readme.includes(end)) {
    throw new Error("README contributor markers not found.");
  }

  const pattern = new RegExp(`${escapeRegExp(start)}[\\s\\S]*?${escapeRegExp(end)}`, "u");
  return readme.replace(pattern, `${CONTRIBUTOR_START}\n${content}\n${CONTRIBUTOR_END}`);
};

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");

const main = async () => {
  const repository = getRepository();
  const contributors = await fetchContributors(repository);
  const table = renderTable(contributors);
  const readme = await readFile(README_PATH, "utf8");
  await writeFile(README_PATH, replaceContributorBlock(readme, table));
  console.log(`Updated ${README_PATH} with ${contributors.length} contributors from ${repository}.`);
};

main().catch((error) => {
  if (error instanceof Error) {
    console.error(error.message);
  } else {
    console.error("Unknown contributor update failure.");
  }
  process.exitCode = 1;
});
