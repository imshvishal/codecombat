export type SiteConfig = typeof siteConfig;

export class User{
  constructor(public username: string) {
  }
}

export const siteConfig = {
  name: "CodeCombat",
  description: "Unleash your algorithms!",
  navItems: [

  ],
  links: {
    github: "https://github.com/imshvishal",
    twitter: "https://twitter.com/imshvishal",
    discord: "https://discord.com/invite/GWH6wykg",
  },
};
