import satori, { type SatoriOptions } from 'satori';
import { Resvg } from '@resvg/resvg-js';
import type { LoaderFunctionArgs } from '@remix-run/node';

declare module 'react' {
  interface HTMLAttributes<T> {
    tw?: string;
  }
}

async function getFont(
  font: string,
  weights = [400, 500, 600, 700],
  text = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/\\!@#$%^&*()_+-=<>?[]{}|;:,.`\'’"–—'
) {
  const css = await fetch(
    `https://fonts.googleapis.com/css2?family=${font}:wght@${weights.join(
      ';'
    )}&text=${encodeURIComponent(text)}`,
    {
      headers: {
        // Make sure it returns TTF.
        'User-Agent':
          'Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; de-at) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1',
      },
    }
  ).then((response) => response.text());

  const resource = css.matchAll(
    /src: url\((.+)\) format\('(opentype|truetype)'\)/g
  );

  return Promise.all(
    [...resource]
      .map((match) => match[1])
      .map((url) => fetch(url).then((response) => response.arrayBuffer()))
      .map(async (buffer, i) => ({
        name: font,
        style: 'normal',
        weight: weights[i],
        data: await buffer,
      }))
  ) as Promise<SatoriOptions['fonts']>;
}

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const title = url.searchParams.get('title');

  const jsx = (
    <div
      tw="flex w-full h-full items-center justify-center"
      style={{
        background: 'linear-gradient(135deg, #1a2980 0%, #2196f3 100%)',
      }}
    >
      <div tw="flex flex-col w-full items-center justify-center px-32">
        <h2 tw="text-7xl leading-tight font-bold tracking-tighter text-white text-center">
          {title || 'Askides'}
        </h2>
      </div>
    </div>
  );

  const svg = await satori(jsx, {
    width: 1280,
    height: 630,
    fonts: await getFont('Inter'),
  });

  const resvg = new Resvg(svg);
  const pngData = resvg.render();
  const data = pngData.asPng();

  return new Response(data, {
    headers: {
      'Content-Type': 'image/png',
    },
  });
}
