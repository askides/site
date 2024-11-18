interface MetadataOptions {
  imageUrl?: string;
  canonicalPath?: string;
}

export function createMetadata(
  title: string,
  description: string,
  opts: MetadataOptions = {}
) {
  const baseUrl = process.env.APP_URL as string;
  const { imageUrl = '/og-image.png', canonicalPath = '/' } = opts;
  const fullImageUrl = `${baseUrl}${imageUrl}`;
  const fullCanonicalUrl = `${baseUrl}${canonicalPath}`;

  return [
    { title },
    { name: 'description', content: description },

    // OpenGraph
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: fullCanonicalUrl },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:image', content: fullImageUrl },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    { property: 'og:image:alt', content: title },

    // Twitter
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:site', content: '@usevoltion' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: fullImageUrl },
    { name: 'twitter:image:alt', content: title },

    // Canonical
    { tagName: 'link', rel: 'canonical', href: fullCanonicalUrl },
  ];
}
