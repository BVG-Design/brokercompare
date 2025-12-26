import imageUrlBuilder from '@sanity/image-url';
import { client, sanityConfigured } from './client';

const builder = sanityConfigured ? imageUrlBuilder(client as any) : null;

export function urlFor(source: any) {
  if (!builder) {
    const emptyBuilder = {
      width: () => emptyBuilder,
      height: () => emptyBuilder,
      url: () => '',
    } as any;

    return emptyBuilder.image ? emptyBuilder.image(source) : emptyBuilder;
  }

  return builder.image(source);
}

