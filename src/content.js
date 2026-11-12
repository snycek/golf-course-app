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

export const hero = {
  eyebrow: 'Private indoor golf in Southgate',
  title: 'Your own private TrackMan studio.',
  titleAccent: 'Available 24/7.',
  lead:
    'Practice, play world-famous courses, or enjoy a round with friends—all inside a private studio reserved exclusively for your group.',
  priceNote: 'As low as $40 per hour • Entire studio • Up to six golfers',
}

export const highlights = ['Private studio', 'TrackMan iO', 'Open 24/7', 'Up to 6 golfers']

export const howItWorks = {
  title: 'Golf on your schedule',
  lead: 'No front desk, no waiting, and no sharing the studio with strangers.',
  steps: [
    { title: 'Book online', body: 'Select your date and time through our online booking system.' },
    {
      title: 'Receive your access codes',
      body: 'Your confirmation email will include the codes needed to enter the facility and access the simulator.',
    },
    {
      title: 'Arrive and play',
      body: 'Enter the private studio, start your TrackMan session, and enjoy the space for your reserved time.',
    },
  ],
}

export const why = {
  title: 'Your game. Your time. Your space.',
  body:
    'Teein’ It Up gives you the freedom to practice, play, and compete without crowds, waiting, or shared bays. Every reservation provides a comfortable private environment for serious practice, casual rounds, and time with friends or family.',
  points: [
    'Private studio reservations',
    'Play alone or bring up to five guests',
    'Available around the clock',
    'Comfortable, distraction-free environment',
    'Automated booking and facility access',
  ],
}

export const options = {
  title: 'Choose how you play',
  lead:
    'Whether you’re stopping in for a round, playing regularly, or planning a private gathering, Teein’ It Up gives you a space of your own.',
  items: [
    {
      key: 'hourly',
      title: 'Hourly bookings',
      body: 'Reserve the entire private studio by the hour. Practice alone or bring up to five additional golfers.',
      price: 'As low as $40/hr',
      cta: 'View hourly bookings',
      to: '/book',
    },
    {
      key: 'memberships',
      title: 'Memberships',
      body: 'Play more often with included monthly hours, discounted additional bookings, and the freedom to bring guests.',
      cta: 'View memberships',
      to: '/memberships',
    },
    {
      key: 'events',
      title: 'Private events',
      body: 'Plan a birthday, team outing, client event, golf night, or private gathering inside your own TrackMan studio.',
      cta: 'Plan an event',
      href: 'mailto:teeinitupsimgolf@gmail.com?subject=Inquiry%20about%20a%20Private%20Event',
    },
  ],
}

export const tech = {
  title: 'Powered by TrackMan iO',
  lead:
    'Experience advanced indoor golf technology designed to deliver accurate data, realistic gameplay, and immediate feedback.',
  items: [
    { title: 'Tour-level accuracy', body: 'Capture precise ball and club data on every shot.' },
    { title: 'World-class courses', body: 'Play iconic courses from around the world without leaving Southgate.' },
    { title: 'Realistic ball flight', body: 'See accurate shot shape, carry, bounce, and roll.' },
    { title: 'Immediate feedback', body: 'Use detailed performance information to understand and improve your game.' },
  ],
}

export const giftCards = {
  title: 'Give the gift of golf',
  body:
    'Give someone private access to TrackMan technology, world-famous courses, and golf on their own schedule.',
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
