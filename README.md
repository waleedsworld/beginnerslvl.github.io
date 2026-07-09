<div align="center">

# 🔐 SafeSurf Web

### *Think before you click.*

**A friendly, no-jargon cybersecurity-awareness website that helps everyday people — especially students — stay safe online.**

From phishing and password hygiene to *"help, I think I've actually been hacked"*, SafeSurf turns scary security topics into calm, plain-English advice.

<br>

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![jQuery](https://img.shields.io/badge/jQuery-0769AD?style=for-the-badge&logo=jquery&logoColor=white)

![No build step](https://img.shields.io/badge/build-none%20required-brightgreen?style=flat-square)
![Responsive](https://img.shields.io/badge/design-fully%20responsive-blueviolet?style=flat-square)
![Static site](https://img.shields.io/badge/type-static%20site-informational?style=flat-square)
![License: MIT](https://img.shields.io/badge/license-MIT-yellow?style=flat-square)

</div>

---

## 🎬 Demo

![SafeSurf walkthrough](assets/demo.gif)

> The GIF above cycles through the home, about, and resources pages. Prefer stills? Scroll down to [A peek around the site](#-a-peek-around-the-site).

<br>

![SafeSurf home page](docs/media/home-desktop.png)

---

## ✨ Features

- 🏄 **Learn to protect yourself** — a hero-led landing page with the golden rule front and center: *think before you click*.
- ❓ **Popular Questions** — real questions from students (turning off your firewall, sharing passwords, dealing with online threats) answered in plain English.
- 💬 **Student Security Forums** — a space to swap stories and support each other after a hacking scare.
- 🚑 **"I've been hacked" help** — a calm, step-by-step corner for when things go wrong.
- 📚 **Resources & News** — curated links to keep learning, plus a downloadable security primer (PDF).
- 🖼️ **Gallery & lightbox** — image gallery with click-to-zoom.
- 📱 **Fully responsive** — folds down to a tidy hamburger menu on mobile; sharp on a laptop or a lock screen away on your phone.
- ✉️ **Contact form** — a simple way to reach out, with an optional PHP mailer for PHP-capable hosts.

## 📸 A peek around the site

| About | Resources | On your phone |
|:-----:|:---------:|:-------------:|
| ![About](docs/media/about-desktop.png) | ![Courses](docs/media/courses-desktop.png) | ![Mobile](docs/media/home-mobile.png) |

---

## 🚀 Quickstart

This is a **plain static website** — no build step, no npm gymnastics, no framework to wrestle. If you can open a terminal, you can run this.

**You'll need**
- Any modern web browser (Chrome, Firefox, Safari, Edge — dealer's choice 🎴)
- **Python 3** *(almost certainly already on your machine — check with `python3 --version`)*, or any other tiny static file server

```bash
# 1. Grab the code
git clone https://github.com/waleedsworld/beginnerslvl.github.io.git
cd beginnerslvl.github.io

# 2. Serve it (pages link with relative paths, so don't just double-click index.html)
python3 -m http.server 8242

# 3. Surf on over 🌊
open http://localhost:8242/index.html
```

That's it. You're in. Poke around the pages, the menus, and the forums.

> 🐍 **No Python?** Any static server works. With Node installed run `npx serve`, or use the **Live Server** extension in VS Code. Same idea: serve the folder, open the port.

---

## 🧭 Usage

| Page | What it's for |
|------|---------------|
| `index.html` | Home — hero, popular questions, forums entry point |
| `about.html` | The project, the mission, and the *think before you click* ethos |
| `course-listing.html` / `course-single.html` | Resources & learning material, list and detail views |
| `blog.html` / `blog-edu-single.html` | Awareness articles, list and single-post views |
| `events.html` | Upcoming security-awareness events |
| `gallery2.html` | Image gallery with lightbox zoom |
| `testimonials.html` | What people are saying |
| `contact.html` · `Contact/` | Reach-out form (standalone Contact/ variant included) |

**Editing content:** everything is hand-written HTML — open any `.html` file, edit the copy, save, refresh the browser. Shared look-and-feel lives in `style.css` and `inner-page-style.css`.

---

## 🏗️ Architecture

SafeSurf is a **multi-page static site** — every page is its own HTML document, wired together with relative links and a shared stylesheet + script bundle. No SPA, no router, no bundler: the browser does all the work.

```
.
├── index.html              # Home — the main landing page
├── about.html              # About the project & mission
├── blog.html               # Blog listing
├── blog-edu-single.html    # A single blog post
├── course-listing.html     # Resources / courses grid
├── course-single.html      # A single resource page
├── events.html             # Events
├── gallery2.html           # Image gallery + lightbox
├── testimonials.html       # What people are saying
├── contact.html            # Contact page
├── Contact/                # Standalone contact form (Bootstrap) + optional PHP mailer
├── css/                    # Vendor styles (Owl Carousel, FlexSlider, Lightbox, MeanMenu, RateYo)
├── style.css               # Main site styles
├── inner-page-style.css    # Styles for inner pages
├── js/                     # jQuery + sliders, lightbox, menu logic
├── images/                 # Banners, logos, icons, security.pdf primer
├── webfonts/               # Font Awesome icon fonts
├── assets/                 # README demo GIF
└── docs/media/             # Screenshots used in this README
```

**The stack, in one breath:** HTML5 + CSS3 for structure and style; **jQuery** driving the interactive bits — **Owl Carousel** & **FlexSlider** (sliders), **Lightbox** (gallery zoom), **MeanMenu / mmenu** (responsive nav) and **RateYo** (star ratings). **Font Awesome** provides the icons. **Bootstrap** appears only inside the standalone `Contact/` subfolder. There is **no npm, no build tooling, and no `package.json`** — what you see is what ships.

### Contact form note

The contact form ships with an optional PHP mailer (`Contact/send-mail.php`). It only does anything on a PHP-capable host — on a static host (like GitHub Pages) the rest of the site works perfectly and the form simply won't send. Swap in a form service (Formspree, Netlify Forms, etc.) to make it live without a server.

---

## 🌍 Deployment

Because it's fully static, SafeSurf drops onto any static host with zero config:

- **GitHub Pages** — push to the repo and enable Pages (the site works as-is; only the PHP mailer is inert).
- **Netlify / Vercel / Cloudflare Pages** — point them at the repo, no build command, publish directory `/`.
- **Any web server** — copy the folder into the web root and you're done.

---

## 🗺️ Roadmap

- [ ] Hosted live demo
- [ ] Swap the PHP mailer for a serverless form endpoint so the contact form works on static hosts
- [ ] Expand the "I've been hacked" playbook with more step-by-step scenarios

---

## 📄 License

Released under the **MIT License** — see [`LICENSE`](LICENSE). Do what you like with it; a credit is appreciated but not required.

## 🙏 Credits

Content, structure, and the SafeSurf concept by **Waleed Ajmal**. The visual foundation started from a free open-education HTML theme and was reshaped into this cybersecurity-awareness site.

---

<div align="center">

*Stay curious, stay safe, and — you guessed it — **think before you click**. 🔒*

</div>
