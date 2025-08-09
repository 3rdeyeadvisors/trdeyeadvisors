export const siteConfig = {
  name: "3rdeyeadvisors",
  tagline: "master defi & build true wealth",
  brandLabel: "master defi & build true wealth | 3rdeyeadvisors",
  siteUrl: "https://www.the3rdeyeadvisors.com",
  logo: {
    svg: "/favicon-3ea.svg",
    squarePng: "/favicon-3ea-new.png"
  },
  defaultSocialImage: "/social-share-3rdeyeadvisors-new.jpg",
} as const;

export type SiteConfig = typeof siteConfig;
