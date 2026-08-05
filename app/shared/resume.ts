// Single source of truth for the homepage and the generated PDF, so the two
// can never drift.

export const profile = {
  name: 'Renato Pozzi',
  role: 'Senior Frontend Engineer',
  site: 'askides.com',
  intro:
    "Ten years building web products, mostly on the front end. Currently at Toggl, working remote, and building Zilfu on the side. I'm curious about most things.",
};

type Role = {
  period: string;
  role: string;
  meta: string[];
  summary?: string;
};

export const work: Role[] = [
  {
    period: '2024 – Present',
    role: 'Senior Frontend Engineer',
    meta: ['Toggl', 'Remote'],
    summary:
      "Rewrote the data layer of Toggl Track's browser extension for 398k weekly users, and shipped it ~15k lines lighter across 969 files. A service architecture with incremental sync replaced ad-hoc API calls and full-list refetches; Chrome and Firefox now build from one Manifest V3 codebase.",
  },
  {
    period: '2022 – 2024',
    role: 'Frontend Engineer',
    meta: ['Kaaja', 'Milan', 'Hybrid'],
  },
  {
    period: '2019 – 2021',
    role: 'Technical Lead',
    meta: ['Bluecube', 'Milan', 'On-site'],
  },
  {
    period: '2015 – 2019',
    role: 'Fullstack Engineer',
    meta: ['Bluecube', 'Milan', 'On-site'],
  },
];

type Project = {
  label: string;
  name: string;
  url: string;
  // Rides the name's line, so notes about a project don't cost a row.
  meta?: string[];
  summary: string;
};

// Keyed by what it is, not by a date: these are side projects, not positions.
export const building: Project[] = [
  {
    label: 'SaaS',
    name: 'Zilfu',
    url: 'https://zilfu.app',
    summary:
      "The social media scheduler for everyone tired of paying more to grow. I'm building it on my own, from design to deploy.",
  },
  {
    label: 'Open Source',
    name: 'Aurora',
    url: 'https://github.com/askides/aurora',
    // Rounded down, so it only ever understates what the repo shows.
    meta: ['550+ stars'],
    summary:
      'Cookie-free website analytics you host yourself. No cookies, no localStorage, no fingerprinting, so there is no consent banner to show.',
  },
];

export const elsewhere = [
  { label: 'GitHub', handle: 'askides', url: 'https://github.com/askides' },
  {
    label: 'LinkedIn',
    handle: 'in/askides',
    url: 'https://www.linkedin.com/in/askides/',
  },
];
