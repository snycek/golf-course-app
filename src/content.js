// All site copy and business details live here so the real content from
// teeinitup.net can be dropped in without touching components.
// Anything wrapped in [brackets] is a placeholder still to be replaced.

export const business = {
  name: 'Tee It Up',
  tagline: '[Tagline from current site]',
  description:
    '[Short intro paragraph from the current site: who we are, what we offer, why people come.]',
  phone: '[Phone]',
  email: '[Email]',
  address: {
    line1: '[Street address]',
    city: '[City]',
    state: '[ST]',
    zip: '[ZIP]',
  },
  // Google Maps link for the address; leave '' until the real address is in.
  mapUrl: '',
  social: {
    facebook: '',
    instagram: '',
  },
}

// Each row: { days: 'Mon–Fri', time: '10am – 10pm' }
export const hours = [
  { days: '[Days]', time: '[Hours]' },
  { days: '[Days]', time: '[Hours]' },
]

// Trackman booking widget. Paste the iframe src (or booking page URL) from the
// Trackman section on the Wix site or from the Trackman Portal.
export const trackman = {
  bookingUrl: '',
  widgetHeight: 900,
}

export const features = [
  {
    title: 'Trackman Range technology',
    body: 'Every shot tracked: ball speed, carry, spin and more, live on the screen in your bay.',
  },
  {
    title: '[Feature]',
    body: '[Feature description from the current site.]',
  },
  {
    title: '[Feature]',
    body: '[Feature description from the current site.]',
  },
]

// Each: { name, price, unit, details: [] }
export const rates = [
  { name: '[Rate name]', price: '[$]', unit: '[per hour]', details: ['[Detail]'] },
  { name: '[Rate name]', price: '[$]', unit: '[per hour]', details: ['[Detail]'] },
  { name: '[Rate name]', price: '[$]', unit: '[per hour]', details: ['[Detail]'] },
]

export const about = {
  heading: 'About us',
  paragraphs: ['[About text from the current site.]'],
}

export const faqs = [
  { q: 'How do I check in?', a: 'Book online, then enter the PIN from your confirmation at your bay to start your session.' },
  { q: '[Question]', a: '[Answer]' },
]
