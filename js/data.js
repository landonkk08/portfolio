/* =====================================================================
   PORTFOLIO CONTENT — edit this file to change everything on the site.
   Every value below is a PLACEHOLDER. Replace it with your own details.
   Both the desktop (index.html) and the plain view (plain.html) read
   from this one file.
   ===================================================================== */

window.PORTFOLIO = {
  // Name of your OS. Shown on the boot screen and in the taskbar.
  osName: "YourOS",

  // Where the site lives once GitHub Pages is on. Shown on the link-preview image.
  siteUrl: "https://landonkk08.github.io/portfolio/",

  owner: {
    name: "Your Name",
    role: "Game & Software Developer",
    location: "City, Country",
    // Path to a square photo or avatar, e.g. "assets/avatar.png".
    // Leave as null to show your initials instead.
    avatar: null,
    // Each string is one paragraph.
    bio: [
      "Write a short introduction here: who you are, what you make and what you're interested in.",
      "Add a second paragraph if you like, e.g. what you're learning right now or what kind of work you're looking for."
    ]
  },

  // Put your resume PDF at this path (create the assets folder if needed).
  resume: "assets/resume.pdf",

  // Email shown in the Contact window. Use null to hide it.
  email: "you@example.com",

  socials: [
    { label: "GitHub",   handle: "@your-username", url: "https://github.com/your-username" },
    { label: "Roblox",   handle: "your-username",  url: "https://www.roblox.com/users/0/profile" },
    { label: "LinkedIn", handle: "your-name",      url: "https://www.linkedin.com/in/your-name" }
  ],

  skills: [
    { group: "Languages",       items: ["Skill one", "Skill two", "Skill three"] },
    { group: "Engines & tools", items: ["Tool one", "Tool two", "Tool three"] },
    { group: "Design",          items: ["Tool one", "Tool two"] }
  ],

  // The Secret.app message (unlocked by clicking your name 5 times) isn't here:
  // it's kept encrypted in js/secret.js. To change it, edit
  // tools/secret.local.json and run: node tools/encrypt-secret.mjs

  projectsIntro: "A one-line intro to your work. Pick a filter or open a project for details.",

  /* Projects
     category: "games" | "software" | "design"
     image:    path to a cover image (16:10 works best), or null for a generated cover
     color:    accent used on the generated cover
     video:    optional YouTube link (any format), e.g. "https://www.youtube.com/watch?v=VIDEO_ID".
               It's embedded in privacy-enhanced mode (youtube-nocookie.com).
     gallery:  optional list of extra image paths
     description: list of paragraphs                                          */
  projects: [
    {
      id: "game-one",
      title: "Example Game One",
      category: "games",
      year: "2026",
      role: "Solo developer",
      summary: "One-line pitch for this game.",
      description: [
        "Describe the game: the genre, the core loop and what makes it fun.",
        "Then explain what you built and what you learned along the way."
      ],
      tags: ["Tag", "Tag", "Tag"],
      links: [{ label: "Play", url: "#" }, { label: "Source", url: "#" }],
      image: null, color: "#FFB020", video: null, gallery: []
    },
    {
      id: "game-two",
      title: "Example Game Two",
      category: "games",
      year: "2025",
      role: "Scripter",
      summary: "One-line pitch for this game.",
      description: ["Describe the project here."],
      tags: ["Tag", "Tag"],
      links: [{ label: "Play", url: "#" }],
      image: null, color: "#FF6B5B", video: null, gallery: []
    },
    {
      id: "app-one",
      title: "Example App One",
      category: "software",
      year: "2026",
      role: "Full-stack developer",
      summary: "One-line description of what this app does.",
      description: ["Describe the problem, your solution and the tech you used."],
      tags: ["Tag", "Tag", "Tag"],
      links: [{ label: "Live demo", url: "#" }, { label: "GitHub", url: "#" }],
      image: null, color: "#4C8DFF", video: null, gallery: []
    },
    {
      id: "app-two",
      title: "Example App Two",
      category: "software",
      year: "2025",
      role: "Developer",
      summary: "One-line description of what this app does.",
      description: ["Describe the project here."],
      tags: ["Tag", "Tag"],
      links: [{ label: "GitHub", url: "#" }],
      image: null, color: "#2EC4A6", video: null, gallery: []
    },
    {
      id: "design-one",
      title: "Example Design One",
      category: "design",
      year: "2026",
      role: "UI designer",
      summary: "One-line description of this design.",
      description: ["Describe the brief, your process and the outcome."],
      tags: ["Tag", "Tag"],
      links: [{ label: "View in Figma", url: "#" }],
      image: null, color: "#A78BFA", video: null, gallery: []
    },
    {
      id: "design-two",
      title: "Example Design Two",
      category: "design",
      year: "2025",
      role: "Designer",
      summary: "One-line description of this design.",
      description: ["Describe the project here."],
      tags: ["Tag"],
      links: [],
      image: null, color: "#F2D04B", video: null, gallery: []
    }
  ]
};
