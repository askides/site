// Single source of truth for the homepage and the generated PDF, so the two
// can never drift.

export const profile = {
  name: 'Renato Pozzi',
  role: 'Senior Frontend Engineer',
  site: 'askides.com',
  intro:
    "Ten years building web products, mostly on the front end. Currently at Toggl, working remote, and building Zilfu on the side. I'm curious about most things.",
};

export const work = [
  {
    period: '2024 – Present',
    role: 'Senior Frontend Engineer',
    meta: ['Toggl', 'Remote'],
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

// Keyed by what it is, not by a date: these are side projects, not positions.
export const building = [
  {
    label: 'SaaS',
    name: 'Zilfu',
    url: 'https://zilfu.app',
    summary:
      "The social media scheduler for everyone tired of paying more to grow. I'm building it on my own, from design to deploy.",
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
