/* Privacy policy text, shared by privacy.html and the Privacy window on the
   desktop. Name and email come from js/data.js. If you change what the site
   does (add analytics, a contact form, another embed...), update this text
   and LAST_UPDATED. */
(() => {
  "use strict";

  const LAST_UPDATED = "2026-11-24";

  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => (
    { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const ext = (url, label) => `<a href="${url}" target="_blank" rel="noopener noreferrer">${label}</a>`;

  // `h` is the heading tag for section titles ("h2" on the page, "h3" in a window).
  window.renderPrivacy = function (container, h = "h2") {
    const D = window.PORTFOLIO;
    const name = esc(D.owner.name);
    const updated = new Date(LAST_UPDATED + "T12:00:00").toLocaleDateString("en", { day: "numeric", month: "long", year: "numeric" });
    const hasVideo = D.projects.some((p) => p.video);
    const contact = D.email
      ? `email me at <a href="mailto:${esc(D.email)}">${esc(D.email)}</a>`
      : "reach me through any of the links in the Contact section";

    const sec = (title, body) => `<section class="policy-sec"><${h} class="policy-h">${title}</${h}>${body}</section>`;

    container.innerHTML = `
      <p class="eyebrow">Last updated ${esc(updated)}</p>
      <p class="lead">This site is the personal portfolio of ${name}. It doesn't use cookies, analytics or ads, doesn't track you, and doesn't ask for any personal information.</p>

      ${sec("Saved in your browser", `
        <p>To remember your choices, the site saves a few small settings <strong>in your own browser</strong>. They are never sent to me or anyone else:</p>
        <ul>
          <li><strong>Your Settings</strong> (theme, accent color, wallpaper, motion and sounds) are kept in your browser's local storage until you clear them.</li>
          <li><strong>A note that the start-up animation has played</strong> is kept in session storage, so it doesn't replay on every page. It's deleted when you close the tab.</li>
        </ul>
        <p>To remove them, use <em>Settings → Reset to defaults</em> or clear this site's data in your browser.</p>`)}

      ${sec("Hosting", `
        <p>The site is hosted on GitHub Pages. Like most web hosts, GitHub may receive technical information such as your IP address and browser type when you visit, and uses it to run and secure its service. I don't have access to this information. See the ${ext("https://docs.github.com/site-policy/privacy-policies/github-general-privacy-statement", "GitHub Privacy Statement")}.</p>
        <p>Fonts, images and code are all served from this site; no other font or content services are used.</p>`)}

      ${hasVideo ? sec("Embedded videos", `
        <p>Some projects include a YouTube video. These use YouTube's privacy-enhanced mode (youtube-nocookie.com). YouTube receives your IP address when the player loads and may store information in your browser once you play a video. See ${ext("https://policies.google.com/privacy", "Google's Privacy Policy")}.</p>`) : ""}

      ${sec("Links to other sites", `
        <p>Links to other sites, such as GitHub, LinkedIn or game platforms, are covered by those sites' own privacy policies once you follow them.</p>`)}

      ${sec("If you contact me", `
        <p>If you email me, I'll use your email address and message only to reply. I won't share them, and I'll delete them if you ask.</p>`)}

      ${sec("Questions", `
        <p>For any privacy question, ${contact}. If this policy changes, the date at the top will be updated.</p>`)}`;
  };
})();
