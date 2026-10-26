// Client testimonials shown at the foot of the home page. Real words from real clients only —
// get their OK to be named. The section stays hidden while this list is empty.

export type TestimonialItem = {
  quote: string;
  name: string;
  role: string;
  /** Matches a name in CLIENTS (components/client-logos.tsx) to show their logo */
  client: string;
  /** The client's own star rating, out of 5 */
  rating?: number;
};

export const TESTIMONIALS: TestimonialItem[] = [
  {
    quote:
      "Working with RudraAI was a great experience! They built my website, RankWise-XI, and did a fantastic job bringing my vision to life. The website looks clean, modern, and professional, and the overall experience was smooth from start to finish. I really appreciate the effort, attention to detail, and dedication that went into the project. I’d definitely recommend RudraAI to anyone looking for quality website development! Highly recommended!",
    name: "Founder",
    role: "Rankwise",
    client: "Rankwise",
    rating: 5,
  },
];
