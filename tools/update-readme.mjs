// Rewrites the block between <!-- releases:start --> and <!-- releases:end --> in README.md
// with the latest GitHub release of each repository below, newest first.
//
// Needs GITHUB_TOKEN. The workflow's default token is enough: the repositories are public.
// Exit 0: README unchanged or updated. Exit 1: any failure, README left untouched.
// It never writes an empty block.
//
//   GITHUB_TOKEN=$(gh auth token) npm run releases

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const OWNER = 'renzrollon';
const REPOS = ['interlock', 'shippable-skills', 'escapement', 'checkpoint'];
const START = '<!-- releases:start -->';
const END = '<!-- releases:end -->';
const README = join(dirname(fileURLToPath(import.meta.url)), '..', 'README.md');

function fail(message) {
  console.error(`update-readme: ${message}`);
  process.exit(1);
}

const token = process.env.GITHUB_TOKEN;
if (!token) fail('GITHUB_TOKEN is not set');

const query = `{ ${REPOS.map((name, i) =>
  `r${i}: repository(owner: "${OWNER}", name: "${name}") { name latestRelease { tagName publishedAt url } }`,
).join(' ')} }`;

const res = await fetch('https://api.github.com/graphql', {
  method: 'POST',
  headers: {
    authorization: `bearer ${token}`,
    'content-type': 'application/json',
    'user-agent': 'renzrollon-profile-readme',
  },
  body: JSON.stringify({ query }),
}).catch((err) => fail(`request failed: ${err.message}`));
if (!res.ok) fail(`GraphQL responded ${res.status}`);
const body = await res.json();
if (body.errors?.length) fail(`GraphQL errors: ${JSON.stringify(body.errors)}`);

const releases = Object.values(body.data ?? {})
  .filter((repo) => repo?.latestRelease)
  .map((repo) => ({ name: repo.name, ...repo.latestRelease }))
  .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
if (releases.length === 0) fail('no releases found; refusing to write an empty block');

const lines = releases.map((r) => `- [${r.name} ${r.tagName}](${r.url}) · ${r.publishedAt.slice(0, 10)}`);
const block = `${START}\n${lines.join('\n')}\n${END}`;

const readme = readFileSync(README, 'utf8');
const start = readme.indexOf(START);
const end = readme.indexOf(END);
if (start < 0 || end < 0 || end < start) fail('markers not found in README.md');

const next = readme.slice(0, start) + block + readme.slice(end + END.length);
if (next === readme) {
  console.log('update-readme: no change');
  process.exit(0);
}
writeFileSync(README, next);
console.log(`update-readme: wrote ${releases.length} release line(s)`);
