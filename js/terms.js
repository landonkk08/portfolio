/* Terms and conditions text, shared by terms.html and the Terms window on the
   desktop. Name and email come from js/data.js. If you change how people may
   use your work or code, update this text and LAST_UPDATED. */
(() => {
  "use strict";

  const LAST_UPDATED = "2026-11-24";

  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => (
    { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  // `h` is the heading tag for section titles ("h2" on the page, "h3" in a window).
  window.renderTerms = function (container, h = "h2") {
    const D = window.PORTFOLIO;
    const name = esc(D.owner.name);
    const year = new Date().getFullYear();
    const updated = new Date(LAST_UPDATED + "T12:00:00").toLocaleDateString("en", { day: "numeric", month: "long", year: "numeric" });
    const contact = D.email
      ? `email me at <a href="mailto:${esc(D.email)}">${esc(D.email)}</a>`
      : "reach me through any of the links in the Contact section";

    const sec = (title, body) => `<section class="policy-sec"><${h} class="policy-h">${title}</${h}>${body}</section>`;

    container.innerHTML = `
      <p class="eyebrow">Last updated ${esc(updated)}</p>
      <p class="lead">These terms explain how you may use this site, the personal portfolio of ${name}. By using the site, you agree to them. If you don't agree, please don't use the site.</p>

      ${sec("About this site", `
        <p>This site showcases my projects and how to contact me. There are no accounts or purchases, and nothing here is offered for sale.</p>`)}

      ${sec("Who owns the content", `
        <p>Unless stated otherwise, everything on this site is © ${year} ${name}. All rights reserved. That includes the text, images, screenshots, videos, project work, designs, game assets, and the site's own design and code.</p>
        <p>The site's source code is publicly visible on GitHub, but being able to see it doesn't give you permission to reuse it.</p>
        <p>Names, logos and trademarks of other companies and platforms mentioned on this site belong to their owners.</p>`)}

      ${sec("What you may do", `
        <ul>
          <li>Browse the site and view my work.</li>
          <li>Share links to the site or to individual projects.</li>
        </ul>`)}

      ${sec("What you may not do", `
        <ul>
          <li>Copy, republish, sell or redistribute my work, or the site's design or code, without my written permission.</li>
          <li>Use my work, assets or code in your own projects, or present any of it as your own.</li>
          <li>Try to disrupt, overload or gain unauthorized access to the site.</li>
        </ul>
        <p>If you'd like to use something, just ask. I'm happy to talk about it.</p>`)}

      ${sec("Links, games and other services", `
        <p>This site links to other websites and platforms, such as GitHub, LinkedIn and game platforms, and may embed videos from YouTube. I don't control those services and I'm not responsible for their content. Their own terms and privacy policies apply when you use them, including any game or demo you play there.</p>`)}

      ${sec("No warranty", `
        <p>The site and everything on it are provided "as is", for information and showcase purposes. I try to keep things accurate and working, but I can't promise the site will always be available, error-free or up to date, and I may change or remove anything at any time.</p>`)}

      ${sec("Limitation of liability", `
        <p>To the fullest extent the law allows, I'm not liable for any loss or damage arising from your use of this site or of any linked site, project or download.</p>`)}

      ${sec("Privacy", `
        <p>How the site handles your data is explained in the <a href="privacy.html" data-open="privacy">privacy policy</a>.</p>`)}

      ${sec("Changes and contact", `
        <p>I may update these terms from time to time. The date at the top shows the latest version. For any questions, ${contact}.</p>`)}`;
  };
})();
