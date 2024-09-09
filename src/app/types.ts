const ImageSize = {
  SQUARE: 'square',
  PORTRAIT: 'portrait',
  LANDSCAPE: 'landscape',
} as const;

export type ImageSize = (typeof ImageSize)[keyof typeof ImageSize];
