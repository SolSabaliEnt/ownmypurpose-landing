# Own My Purpose — Founder-Led MVP Studio

This repository powers **[OwnMyPurpose.io](https://ownmypurpose.io/)**, a founder-focused portfolio and service website for MVP planning, custom software development, and independent product proof.

## Commercial model

- **App Idea Fit Call:** short free qualification conversation, coordinated following a project inquiry.
- **MVP Blueprint:** fixed-scope $1,250 product planning engagement; no immediate online checkout.
- **Custom MVP Development:** scoped and quoted separately, with agreed milestones and handoff terms.

Public copy must **not** be treated as signed commercial terms. Refund, ownership, and specific deliverable terms require a written agreement.

## Site structure

- \`/\` — homepage and conversion funnel
- \`/mvp-blueprint/\` — paid planning offer
- \`/mvp-development/\` — custom software development
- \`/work/\` — selected independent product work
- \`/work/simple-paws/\`, \`/work/cleanr/\`, \`/work/kinex-core/\` — case studies
- \`/about/\` — founder story
- \`/start/\` — project inquiry handoff to existing Google Form

The website is static HTML, CSS, and JavaScript, published via GitHub Pages. Design tokens and responsive styles are in \`assets/site.css\`, interaction helpers in \`assets/site.js\`.

## Local preview

From repository root:

\`\`\`sh
python3 -m http.server 8000
\`\`\`

Visit \`http://localhost:8000/\`.

## Checks

\`\`\`sh
node --check assets/site.js
node scripts/check-site.mjs
\`\`\`

Automated checks also run through GitHub Actions on relevant pull requests.

## Known limitations / production checklist

1. **Lead intake:** The existing Google Form is preserved as the live route. Replace it only when a real form backend, confirmation, notification, privacy disclosure, and error handling have been tested.
2. **Booking:** A direct calendar booking is **not** configured. Inquiry submission does not confirm a meeting.
3. **Blueprint payment:** No checkout or paid-order confirmation is implemented. Payment and refund terms need business and contract approval.
4. **Analytics:** \`data-event\` hooks exist, but analytics is only sent if a configured \`gtag\` integration is present. Completion events must only fire after verified results.
5. **Portfolio media:** Case-study workflow diagrams are clearly labeled illustrations, **not screenshots**. Replace with approved real screenshots and demos as available.
6. **Product status:** Case-study claims derive from prior technical reviews and need re-verification against current product code and deployments before broader marketing promises.
7. **SEO social preview:** Review and regenerate the existing social preview file once final case-study imagery has been approved.
8. **Legal:** Add formal privacy and service/Blueprint purchase terms before collecting more data or taking payment.
9. **Visual QA:** Review mobile, desktop, keyboard, reduced-motion, and actual page speed in a browser on a preview deployment before merging.

## Deployment safety

Do not push unreviewed changes directly to \`main\`. The \`CNAME\` and existing \`images/\` files remain unchanged, preserving the configured custom domain and media assets. Deploy after review and validation.
