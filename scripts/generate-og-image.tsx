import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Resvg } from '@resvg/resvg-js';
import satori, { type SatoriOptions } from 'satori';

type Segment = {
  text: string;
  underline?: boolean;
  spaceBefore?: boolean;
  spaceAfter?: boolean;
};

/**
 * Edit this block, then run `npm run generate:og`.
 * Each nested array is one deliberately controlled line of body copy.
 */
const CONTENT: {
  title: string;
  lines: Segment[][];
  photo: string;
} = {
  title: 'Renato Pozzi',
  lines: [
    [
      { text: 'Ten years building web products. Currently at ' },
      { text: 'Toggl ↗', underline: true, spaceBefore: true },
      { text: ',' },
    ],
    [
      { text: 'working remote, and building ' },
      { text: 'Zilfu ↗', underline: true, spaceBefore: true, spaceAfter: true },
      { text: " on the side. I'm" },
    ],
    [{ text: 'curious about most things.' }],
  ],
  photo: 'public/assets/renato-pozzi-profile.jpg',
};

const WIDTH = 1200;
const HEIGHT = 630;
const FONT_FAMILY = 'Instrument Sans';
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUTPUT = resolve(ROOT, 'public/og.png');

const GOOGLE_FONTS_USER_AGENT =
  'Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; de-at) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1';

async function loadFonts(text: string): Promise<SatoriOptions['fonts']> {
  const weights = [400, 600] as const;
  const family = FONT_FAMILY.replaceAll(' ', '+');
  const cssUrl = `https://fonts.googleapis.com/css2?family=${family}:wght@${weights.join(';')}&text=${encodeURIComponent(text)}`;
  const cssResponse = await fetch(cssUrl, {
    headers: { 'User-Agent': GOOGLE_FONTS_USER_AGENT },
  });

  if (!cssResponse.ok) {
    throw new Error(`Could not load font CSS (${cssResponse.status})`);
  }

  const css = await cssResponse.text();
  const urls = [
    ...css.matchAll(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/g),
  ].map((match) => match[1]);

  if (urls.length !== weights.length) {
    throw new Error(
      `Expected ${weights.length} font files, found ${urls.length}`,
    );
  }

  return Promise.all(
    urls.map(async (url, index) => {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Could not load font file (${response.status})`);
      }

      return {
        name: FONT_FAMILY,
        data: await response.arrayBuffer(),
        weight: weights[index],
        style: 'normal' as const,
      };
    }),
  );
}

async function generate() {
  const photoPath = resolve(ROOT, CONTENT.photo);
  const photo = await readFile(photoPath);
  const photoUrl = `data:image/jpeg;base64,${photo.toString('base64')}`;
  const fontText = [
    CONTENT.title,
    ...CONTENT.lines.flat().map(({ text }) => text),
  ].join('');

  const svg = await satori(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        padding: '72px',
        background: '#121317',
        color: '#f2f2f0',
        fontFamily: FONT_FAMILY,
      }}
    >
      <div
        style={{
          width: '760px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            fontSize: '78px',
            fontWeight: 600,
            letterSpacing: '-3.2px',
            lineHeight: 1,
          }}
        >
          {CONTENT.title}
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            marginTop: '58px',
            fontSize: '31px',
            fontWeight: 400,
            lineHeight: 1.48,
            letterSpacing: '-0.45px',
          }}
        >
          {CONTENT.lines.map((line, lineIndex) => (
            <div
              // The copy is static and ordered; its position is the stable key.
              // biome-ignore lint/suspicious/noArrayIndexKey: intentional line layout
              key={lineIndex}
              style={{ display: 'flex' }}
            >
              {line.map((segment, segmentIndex) => (
                <span
                  // biome-ignore lint/suspicious/noArrayIndexKey: intentional segment layout
                  key={segmentIndex}
                  style={{
                    textDecoration: segment.underline ? 'underline' : 'none',
                    textDecorationColor: '#777a80',
                    textUnderlineOffset: '7px',
                    marginLeft: segment.spaceBefore ? '7px' : 0,
                    marginRight: segment.spaceAfter ? '7px' : 0,
                  }}
                >
                  {segment.text}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          width: '214px',
          height: '310px',
          display: 'flex',
          marginLeft: '82px',
          overflow: 'hidden',
          border: '2px solid #34363b',
          borderRadius: '5px',
        }}
      >
        <img
          src={photoUrl}
          width={214}
          height={310}
          alt=""
          style={{ objectFit: 'cover', objectPosition: '50% 38%' }}
        />
      </div>
    </div>,
    {
      width: WIDTH,
      height: HEIGHT,
      fonts: await loadFonts(fontText),
    },
  );

  const png = new Resvg(svg).render().asPng();
  await writeFile(OUTPUT, png);
  console.log(`Generated ${OUTPUT}`);
}

await generate();
