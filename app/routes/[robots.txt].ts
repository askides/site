export const loader = () => {
  const rules = [
    {
      agent: '*',
      rules: [{ type: 'Allow', path: '/' }],
    },
  ];

  const content = rules
    .map(
      ({ agent, rules }) =>
        `User-agent: ${agent}\n${rules
          .map(({ type, path }) => `${type}: ${path}`)
          .join('\n')}`
    )
    .join('\n\n');

  return new Response(content, {
    headers: { 'Content-Type': 'text/plain' },
  });
};
