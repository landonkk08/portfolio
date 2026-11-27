/* =====================================================================
   PORTFOLIO CONTENT — edit this file to change everything on the site.
   Every value below is a PLACEHOLDER. Replace it with your own details.
   Both the desktop (index.html) and the plain view (plain.html) read
   from this one file.
   ===================================================================== */

window.PORTFOLIO = {
  // Name of your OS. Shown on the boot screen and in the taskbar.
  osName: "Lantern OS",

  // Where the site lives once GitHub Pages is on. Shown on the link-preview image.
  siteUrl: "https://landonkk08.github.io/portfolio/",

  /* Page titles and descriptions, shown in browser tabs, search results and
     link previews. {name} and {role} are replaced with owner.name and
     owner.role below. After changing these (or your name or role), run:
         node tools/update-meta.mjs
     so the text is also written into each page's HTML, where search engines
     and link previews read it. Titles: under about 60 characters.
     Descriptions: under about 155. */
  meta: {
    title: "{name} · {role}",
    // Update "aspiring cybersecurity professional" here if your role changes.
    description: "{name} is an aspiring cybersecurity professional. Explore projects, skills and experience in a portfolio built as a desktop OS you can click around.",
    // Browser tab title while a window is in front; {window} is its name.
    windowTitle: "{window} · {name}",
    pages: {
      plain:    { title: "{name} · {role} · Plain view",
                  description: "A simple, scrollable version of {name}'s portfolio: projects, skills, resume and contact details." },
      privacy:  { title: "Privacy policy · {name}",
                  description: "How {name}'s portfolio site handles your data: no cookies of its own, no analytics and no tracking." },
      terms:    { title: "Terms and conditions · {name}",
                  description: "Terms for using {name}'s portfolio site and the work shown on it." },
      notFound: { title: "File not found · {name}" }
    }
  },

  owner: {
    name: "Landon Koch",
    role: "Aspiring Cybersecurity Professional",
    location: "Greater Chattanooga",
    // Path to a square photo or avatar, e.g. "assets/avatar.png".
    // Leave as null to show your initials instead.
    avatar: null,
    // Each string is one paragraph.
    bio: [
      "I'm a student at the BlueSky Tennessee Institute, working toward a career in cybersecurity.",
      "This site collects my projects and the skills I'm building along the way. Have a look around, and feel free to get in touch."
    ]
  },

  // Path to your resume PDF, e.g. "assets/resume.pdf". While it's null, the
  // Resume icon, window, menu entry, shortcut and plain-view link are hidden.
  // Put the PDF in assets/, then set the path here to show them.
  resume: "assets/Landon-Koch-Resume.pdf",

  // Email shown in the Contact window. Use null to hide it.
  email: "landon.kenneth.koch@gmail.com",

  socials: [
    { label: "GitHub",   handle: "@landonkk08",    url: "https://github.com/landonkk08" },
    { label: "LinkedIn", handle: "Landon Koch",    url: "https://www.linkedin.com/in/landon-koch-754938437/" }
  ],

  skills: [
    { group: "Tools",       items: ["Wireshark"] },
    { group: "Systems",     items: ["Windows", "macOS"] },
    { group: "Programming", items: ["Python", "HTML"] }
  ],

  // The Secret.app message (unlocked by clicking your name 5 times) isn't here:
  // it's kept encrypted in js/secret.js. To change it, edit
  // tools/secret.local.json and run: node tools/encrypt-secret.mjs

  projectsIntro: "A one-line intro to your work. Pick a filter or open a project for details.",

  // Shown in the Projects window and the plain view while `projects` below is
  // empty, with a "Visit my GitHub" button if you have a GitHub link above.
  projectsEmpty: {
    title: "Projects are on the way",
    text: "I'm working on my first cybersecurity projects. Check back soon, or follow along on GitHub."
  },

  // The project shown in the "Featured" card on the desktop and phone home
  // screen. Use a project's id from the list below. If it doesn't match, the
  // first project is shown. While it's null (or there are no projects), the
  // card is hidden.
  featured: null,

  /* Projects. Empty for now: the Projects window shows `projectsEmpty` above.
     To add one, copy this template inside the [ ] and fill it in:

    {
      id: "my-project",              // short, unique, no spaces (used in links)
      title: "My Project",
      category: "software",          // "games" | "software" | "design"
      year: "2026",
      role: "Solo",
      summary: "One-line description.",
      description: ["A paragraph.", "Another paragraph."],
      tags: ["Python", "Wireshark"],
      links: [{ label: "GitHub", url: "https://github.com/landonkk08/my-project" }],
      image: null,                   // e.g. "assets/projects/my-project.png" (16:10), or null for a generated cover
      color: "#FFB020",              // accent for the generated cover
      video: null,                   // optional YouTube link; embedded via youtube-nocookie.com
      gallery: []                    // optional extra screenshot paths
    },
  */
  projects: []
};
