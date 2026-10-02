# Changelog

A running log of how this site has evolved, and the thinking behind each version.

---

## v4 — 2026 redesign

The previous version had good bones but was showing its age: Bootstrap 3, a separate stylesheet per section, full-screen "pages" stacked on top of each other, and a layout that was hard to update without breaking something. I wanted to keep the personality of the old site (bold name up front, dark/warm palette, cats included) but rebuild it the way I'd build a frontend today.

### The concept: a reliability engineer's status page

I work in reliability, so I leaned into that instead of using a generic portfolio template. The site borrows the visual language of a status page:

- **"All systems operational"** status pill in the hero, with a live clock showing my local time in San Diego.
- **Career uptime chart.** My history from 2012 to today, drawn as an uptime timeline with three lanes: work, study, and teaching. Hover or tap a segment to see the role and its duration. The current role ends in a green "live" dot. It's generated from a small data array in `js/site.js`, so adding a role is a one-line change.
- **Monospace metadata** (dates, labels, section numbers), like reading logs, paired with a bold grotesque display face for headings.

The metaphor is used as an accent rather than a gimmick. Everything else is clean and content-first.

### Design decisions

- **Typography as the main visual element.** A very large name in the hero, a tight type scale, and only two families: Bricolage Grotesque for display and body, JetBrains Mono for metadata.
- **One accent color.** A warm orange-red for emphasis, with green reserved for meaning "live/current". No decorative colors otherwise.
- **Sticky section labels.** Each section uses a two-column layout where the title stays pinned while you scroll the content, so you always know where you are on a long page.
- **Light and dark themes.** Follows the system setting by default, with a toggle that remembers your choice. All colors are CSS custom properties, so a theme is just a different set of tokens.
- **Experience grouped by organization**, not listed role by role. Seven roles at Intuit now read as one continuous story instead of seven separate boxes. My team has been renamed a few times over the years, so I describe it by what it does, systems and reliability engineering, rather than by whichever org-chart name was current.
- **Filterable projects.** Seventeen projects are too many to dump on a page, so they're cards you can filter by area (systems, hardware, web/ML, research, hackathons), collapsed to a short list by default.
- **Motion with restraint.** Sections fade in as they scroll into view using CSS scroll-driven animations, so browsers that don't support them simply show the content and nothing depends on JavaScript to become visible. All motion is disabled for people who prefer reduced motion.

### Engineering decisions

- **No frameworks, no build step.** Plain HTML, one CSS file, one small vanilla JS file. It's hosted on GitHub Pages, and for a single-page site a framework would add weight without adding anything. jQuery and Bootstrap are gone entirely.
- **Semantic, accessible markup.** Real landmarks and headings, a skip link, keyboard-friendly navigation, `aria` state on toggles and filters, visible focus styles, and alt text on every image.
- **Responsive from the start.** Layouts are built with CSS grid and fluid `clamp()` sizing rather than device-specific breakpoints, with a proper mobile menu.
- **Performance.** Images resized and compressed for the web, below-the-fold images lazy-loaded, fonts preconnected, and no third-party scripts.
- **Shareable.** Open Graph tags so links to the site preview properly.

---

## v3 — 2024 refresh

[View the archived version →](https://kajalv.com/archive/)

Content update after several years: new roles and awards, a new color scheme, and team name fixes.

## v2 — 2021 revamp

Reworked the About Me layout, education and hobbies pages, and font sizing across the site. Mobile CSS fixes.

## v1 — 2017

The original site, built during my first job: full-screen sections for education, skills, work, projects, awards, and hobbies, styled with Bootstrap and custom CSS. Updated over the next few years as I moved through grad school at Georgia Tech and into my role in San Diego.
