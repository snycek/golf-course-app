// All site copy and business details. Content ported from teeinitup.net.
// Anything wrapped in [brackets] is still a placeholder.

export const business = {
  name: 'Teein’ It Up',
  location: 'Southgate',
  phone: '734-252-9717',
  email: 'teeinitupsimgolf@gmail.com',
  address: {
    line1: '18708 Eureka Rd',
    city: 'Southgate',
    state: 'MI',
    zip: '48195',
  },
  hoursNote: 'Open 24/7 by reservation',
  mapUrl:
    'https://www.google.com/maps/dir/?api=1&destination=18708+Eureka+Rd%2C+Southgate%2C+MI+48195%2C+USA',
}

// TrackMan's booking site (yourgolfbooking.com) handles bookings, payment and
// the access codes. We link out to it rather than reimplementing any of that.
export const booking = {
  url: 'https://yourgolfbooking.com/venues/tee-in-it-up-southgate',
  giftCardUrl: 'https://yourgolfbooking.com/venues/tee-in-it-up-southgate/topups',
  eventsMailto:
    'mailto:teeinitupsimgolf@gmail.com?subject=Inquiry%20about%20a%20Private%20Event',
}

// Photos from the current site, faded behind the home page. Drop the files in
// public/images/ and list them here (e.g. '/images/studio-1.jpg').
export const heroImages = []

export const hero = {
  eyebrow: 'Southgate, Michigan',
  title: 'Your private',
  titleAccent: 'TrackMan studio.',
  lead: 'The whole studio, just your group. Open around the clock.',
  priceNote: 'From $40/hr · up to 6 golfers',
}

export const highlights = ['Private studio', 'Open 24/7', 'Up to 6 golfers']

export const howItWorks = {
  title: 'Golf on your schedule',
  lead: 'No front desk. No waiting. No strangers.',
  steps: [
    { title: 'Book', body: 'Pick a time online.' },
    { title: 'Get your codes', body: 'Door and bay PINs arrive by email.' },
    { title: 'Play', body: 'Walk in and tee off.' },
  ],
}

export const options = {
  title: 'Ways to play',
  items: [
    { key: 'hourly', title: 'Hourly', body: 'The whole studio for up to six.', price: 'From $40/hr', cta: 'Book', to: '/book' },
    { key: 'memberships', title: 'Membership', body: 'Monthly hours and member pricing.', price: 'From $109/mo', cta: 'View plans', to: '/memberships' },
    {
      key: 'events',
      title: 'Private events',
      body: 'Birthdays, team outings, golf nights.',
      price: 'Inquire',
      cta: 'Plan an event',
      href: 'mailto:teeinitupsimgolf@gmail.com?subject=Inquiry%20about%20a%20Private%20Event',
    },
    {
      key: 'gift',
      title: 'Gift cards',
      body: 'Studio time, on their schedule.',
      price: 'Any amount',
      cta: 'Buy a gift card',
      href: 'https://yourgolfbooking.com/venues/tee-in-it-up-southgate/topups',
      external: true,
    },
  ],
}

export const tech = {
  title: 'TrackMan iO',
  items: [
    { title: 'Tour-level accuracy', body: 'Ball and club data on every shot.' },
    { title: 'World-class courses', body: 'Iconic courses, right in Southgate.' },
    { title: 'True ball flight', body: 'Shape, carry, bounce and roll.' },
    { title: 'Instant feedback', body: 'See it. Fix it. Swing again.' },
  ],
}

export const giftCards = {
  title: 'Give the gift of golf',
  body: 'Private studio time, on their schedule.',
}

// Answers drawn only from what the current site states.
export const faqs = [
  {
    q: 'How many people can play?',
    a: 'Your reservation covers the entire private studio for up to six golfers—you plus five guests.',
  },
  {
    q: 'When are you open?',
    a: 'We’re open 24/7 by reservation. Book any time slot that works for you.',
  },
  {
    q: 'How do I get in?',
    a: 'Your door and bay PINs are emailed after booking and activate 5 minutes before your tee time. There’s no front desk—just arrive and play.',
  },
  { q: 'Do you have clubs?', a: 'Clubs aren’t currently available, so please bring your own. Light-colored clubs may cause misreads.' },
  { q: 'Can I walk in?', a: 'Reservations are required; walk-ins are not available.' },
  { q: 'How much does it cost?', a: 'Hourly bookings start as low as $40 per hour for the entire studio.' },
  {
    q: 'Can I host a private event?',
    a: 'Yes—birthdays, team outings, client events and golf nights. Email us to plan yours.',
  },
]

export const memberships = {
  eyebrow: 'Play more. Save more.',
  title: 'Make golf part of your routine',
  lead:
    'Teein’ It Up memberships give you private simulator time every month, savings on additional bookings and the flexibility to practice or play whenever it works for you.',
  signupUrl: 'https://yourgolfbooking.com/venues/tee-in-it-up-southgate/memberships',
  benefits: [
    { title: 'Private monthly hours', body: 'Enjoy included simulator hours in your own private studio.' },
    { title: 'Save on extra time', body: 'Members receive discounted pricing on additional hourly bookings.' },
    {
      title: 'Bring your group',
      body: 'Bring up to five guests. Maximum occupancy is six golfers, and the member must be present.',
    },
  ],
  plansTitle: 'Choose your membership',
  plansLead:
    'Whether you want a few focused practice sessions or plan to play every week, there is a membership built around your game.',
  tiers: [
    {
      name: 'Silver',
      price: '$109',
      includes: [
        '3 private simulator hours every month',
        '15% off additional hourly bookings',
        'Bring up to five guests',
        'Member must be present',
        'Book up to 14 days in advance',
        'Private access to the entire studio',
      ],
    },
    {
      name: 'Gold',
      price: '$199',
      badge: 'Best value',
      includes: [
        '6 private simulator hours every month',
        '20% off additional hourly bookings',
        'Bring up to five guests',
        'Member must be present',
        'Book up to 14 days in advance',
        'Private access to the entire studio',
      ],
    },
  ],
  notReady: {
    title: 'Not ready for a membership?',
    body:
      'Start with a single private session and experience Teein’ It Up for yourself. Reserve the entire studio for as low as $40 per hour and bring up to five friends—no membership required.',
  },
  steps: [
    { title: 'Choose your plan', body: 'Select the membership that matches how often you want to play.' },
    {
      title: 'Book your time',
      body: 'Sign into your account and apply your included monthly hours when reserving the studio.',
    },
    {
      title: 'Receive your codes',
      body: 'Your door and bay access codes will be emailed after booking. Codes activate 5 minutes before your tee time.',
    },
  ],
  guidelines: [
    'Membership hours reset each monthly billing cycle and do not roll over.',
    'The account-holding member must be present for every membership reservation.',
    'Reservations may include up to six golfers total.',
    'Members may have one active reservation at a time.',
    'A maximum of two consecutive included membership hours may be booked.',
    'Additional sessions receive the discount included with the selected plan.',
    'Memberships are individual and cannot be transferred or shared.',
    'Memberships renew monthly. Complete terms are available during checkout.',
  ],
}

export const waiverIntro = {
  title: 'Participant waiver',
  lead:
    'Every participant must complete a waiver before using the Teein’ It Up facility. Complete the form below before arriving for your reservation.',
}

export const bookPage = {
  title: 'Book your private tee time',
  lead: 'Reserve the entire Teein’ It Up studio for yourself or your group—never share the bay with strangers.',
  note: 'As low as $40 per hour • Up to 6 golfers • Open 24/7 by reservation',
  beforeYouBook: [
    'Your group receives private access to the entire studio.',
    'Each reservation can include up to six golfers.',
    'Clubs are not currently available—please bring your own. Light-colored clubs may cause misreads.',
    'A vending machine is available inside the facility.',
    'Reservations are required; walk-ins are not available.',
  ],
  steps: [
    { title: 'Book online', body: 'Choose your date, time and session.' },
    { title: 'Receive your access codes', body: 'Your door and bay PINs will be emailed after booking.' },
    { title: 'Arrive & play', body: 'Your access codes activate 5 minutes before your scheduled tee time.' },
  ],
  safety: 'Safety first. All guests must complete our waiver before entering the facility.',
  agreement: 'By completing your reservation, you agree to our Waiver, Cancellation Policy and Facility Rules.',
}
