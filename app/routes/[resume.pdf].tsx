import {
  Document,
  Font,
  Link,
  Page,
  Path,
  StyleSheet,
  Svg,
  Text,
  View,
  renderToBuffer,
} from '@react-pdf/renderer';
import { building, elsewhere, profile, work } from '~/shared/resume';

// Google Fonts serves woff2 to modern clients, which react-pdf cannot embed.
// An old User-Agent gets us the TTF urls instead.
const TTF_UA =
  'Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; de-at) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1';

// Google's build of IBM Plex Mono crashes fontkit ("Offset is outside the
// bounds of the DataView"), so the mono comes from IBM's own release instead.
// Pinned to a tag: the url must stay immutable.
const PLEX_MONO =
  'https://cdn.jsdelivr.net/gh/IBM/plex@v6.4.0/IBM-Plex-Mono/fonts/complete/ttf/IBMPlexMono-Regular.ttf';

async function resolveTtf(family: string, weights: number[]) {
  const query = `${family.replace(/ /g, '+')}:wght@${weights.join(';')}`;
  const css = await fetch(
    `https://fonts.googleapis.com/css2?family=${query}&display=swap`,
    { headers: { 'User-Agent': TTF_UA } },
  ).then((response) => response.text());

  const urls = [
    ...css.matchAll(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/g),
  ].map((match) => match[1]);

  if (urls.length !== weights.length) {
    throw new Error(`Expected ${weights.length} ttf urls for ${family}`);
  }

  return weights.map((weight, index) => ({
    src: urls[index],
    fontWeight: weight,
  }));
}

// Fonts are registered process-wide, so do it once and reuse the promise.
let registered: Promise<void> | undefined;

function registerFonts() {
  if (!registered) {
    registered = (async () => {
      const sans = await resolveTtf('Instrument Sans', [400, 500, 600]);

      Font.register({ family: 'Instrument Sans', fonts: sans });
      Font.register({ family: 'IBM Plex Mono', src: PLEX_MONO });

      // Break urls and long words rather than overflowing the page.
      Font.registerHyphenationCallback((word) => [word]);
    })().catch((error) => {
      registered = undefined;
      throw error;
    });
  }

  return registered;
}

const INK = '#14161A';
const MUTED = '#6B7078';
const BODY = '#3B3F45';
const RULE = '#E4E4E2';

// Mirrors the page: a mono key column with everything hanging off it.
const GUTTER = 96;

const styles = StyleSheet.create({
  page: {
    paddingVertical: 56,
    paddingHorizontal: 56,
    fontFamily: 'Instrument Sans',
    fontSize: 10,
    color: INK,
  },
  name: { fontSize: 26, fontWeight: 600, letterSpacing: -0.6 },
  contact: {
    fontFamily: 'IBM Plex Mono',
    fontSize: 8,
    color: MUTED,
    marginTop: 10,
  },
  intro: { fontSize: 10.5, lineHeight: 1.6, marginTop: 14, maxWidth: 380 },
  section: {
    marginTop: 26,
    borderTopWidth: 1,
    borderTopColor: RULE,
    paddingTop: 16,
  },
  sectionTitle: {
    fontFamily: 'IBM Plex Mono',
    fontSize: 7.5,
    letterSpacing: 1.4,
    color: MUTED,
    marginBottom: 14,
  },
  row: { flexDirection: 'row', marginBottom: 12 },
  label: {
    fontFamily: 'IBM Plex Mono',
    fontSize: 8,
    color: MUTED,
    width: GUTTER,
  },
  body: { flex: 1 },
  title: { fontSize: 10.5, fontWeight: 500 },
  meta: { fontSize: 9, color: MUTED, marginTop: 3 },
  // Capped to roughly the site's 46ch measure rather than the full column.
  summary: {
    fontSize: 9,
    color: MUTED,
    marginTop: 3,
    lineHeight: 1.5,
    maxWidth: 270,
  },
  link: { color: INK, textDecoration: 'underline' },
  roleSummary: {
    fontSize: 8.5,
    color: BODY,
    lineHeight: 1.45,
    marginTop: 4,
    maxWidth: 300,
  },
  linkRow: { flexDirection: 'row', alignItems: 'center' },
  arrow: { marginLeft: 3, marginBottom: 1 },
});

// Same "leaves the page" mark the site uses, drawn with react-pdf primitives
// since the text fonts carry no arrow glyph.
function LinkOut({ src, children }: { src: string; children: string }) {
  return (
    <View style={styles.linkRow}>
      <Link src={src} style={[styles.title, styles.link]}>
        {children}
      </Link>
      <Svg width={5} height={5} viewBox="0 0 10 10" style={styles.arrow}>
        <Path
          d="M2.4 7.6 L7.6 2.4"
          stroke={INK}
          strokeWidth={1.4}
          strokeLinecap="round"
        />
        <Path
          d="M3.6 2.4 L7.6 2.4 L7.6 6.4"
          stroke={INK}
          strokeWidth={1.4}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </Svg>
    </View>
  );
}

function Row({
  label,
  children,
}: { label: string; children: React.ReactNode }) {
  return (
    <View style={styles.row} wrap={false}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.body}>{children}</View>
    </View>
  );
}

function Resume() {
  return (
    <Document
      title={`${profile.name} — Resume`}
      author={profile.name}
      subject={profile.role}
    >
      <Page size="A4" style={styles.page}>
        <Text style={styles.name}>{profile.name}</Text>
        <Text style={styles.contact}>
          {profile.role} · {profile.site}
        </Text>
        <Text style={styles.intro}>{profile.intro}</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>WORK</Text>
          {work.map((element) => (
            <Row key={element.period} label={element.period}>
              <Text style={styles.title}>{element.role}</Text>
              <Text style={styles.meta}>{element.meta.join('  ·  ')}</Text>
              {element.summary && (
                <Text style={styles.roleSummary}>{element.summary}</Text>
              )}
            </Row>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>BUILDING</Text>
          {building.map((element) => (
            <Row key={element.name} label={element.label}>
              <LinkOut src={element.url}>{element.name}</LinkOut>
              <Text style={styles.summary}>{element.summary}</Text>
            </Row>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ELSEWHERE</Text>
          {elsewhere.map((element) => (
            <Row key={element.url} label={element.label}>
              <LinkOut src={element.url}>{element.handle}</LinkOut>
            </Row>
          ))}
        </View>
      </Page>
    </Document>
  );
}

export async function loader() {
  await registerFonts();

  const body = await renderToBuffer(<Resume />);

  return new Response(body, {
    headers: {
      'Content-Type': 'application/pdf',
      // inline so the browser previews it; the name still applies on save.
      'Content-Disposition': 'inline; filename="renato-pozzi.pdf"',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
