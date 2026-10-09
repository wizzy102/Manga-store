/**
 * Store-wide configuration.
 * Values marked PLACEHOLDER are not final and must be replaced before launch.
 */
export const site = {
  brand: 'MANGASTORE',
  tagline: 'For Luxury Menswear',
  instagram: {
    handle: '@mangastore.eg',
    url: 'https://www.instagram.com/mangastore.eg/',
  },
  /** PLACEHOLDER: real WhatsApp number not provided yet. International format, digits only. */
  whatsapp: '201000000000',
  /** Footer line only. */
  location: {
    label: 'High Town Mall, 6 October',
    mapsUrl: 'https://maps.app.goo.gl/dWfJZ5dXy9b2aNoD7',
  },
  deliveryBanner: {
    title: 'Delivery across Egypt',
    body: 'Order online. Pay cash when it arrives.',
  },
} as const
