/*
 * UX Enhancements
 * Vanilla JS, no dependencies. Progressive enhancement only: if it
 * throws or is blocked, the page still works exactly as before.
 *
 *  - Skip-to-content link + focusable main landmark
 *  - Accessible, keyboard-operable mobile menu toggle (ARIA)
 *  - Native lazy-loading + fade-in for below-the-fold images
 *  - Persistent theme toggle (auto / light / dark)
 */
(function () {
	"use strict";

	function ready(fn) {
		if (document.readyState !== "loading") {
			fn();
		} else {
			document.addEventListener("DOMContentLoaded", fn);
		}
	}

	/* ---------- Skip link + main landmark ---------- */
	function setupSkipLink() {
		var header = document.querySelector("header.site-header") ||
			document.querySelector(".site-header") ||
			document.querySelector("header");

		var target = document.getElementById("ux-main");
		if (!target) {
			target = document.createElement("div");
			target.id = "ux-main";
			target.setAttribute("tabindex", "-1");
			if (header && header.parentNode) {
				header.parentNode.insertBefore(target, header.nextSibling);
			} else if (document.body.firstChild) {
				document.body.insertBefore(target, document.body.firstChild);
			}
		}

		if (!document.querySelector(".ux-skip-link")) {
			var skip = document.createElement("a");
			skip.className = "ux-skip-link ux-noinvert";
			skip.href = "#ux-main";
			skip.textContent = "Skip to main content";
			skip.addEventListener("click", function () {
				// Ensure focus actually lands on the target for screen readers.
				window.setTimeout(function () {
					target.focus();
				}, 0);
			});
			document.body.insertBefore(skip, document.body.firstChild);
		}
	}

	/* ---------- Accessible mobile menu toggle ---------- */
	function setupMenuToggle() {
		var bar = document.getElementById("bar");
		var close = document.getElementById("close");
		var nav = document.querySelector(".nav-desktop") ||
			document.querySelector("nav");

		if (nav && !nav.getAttribute("aria-label")) {
			nav.setAttribute("aria-label", "Primary");
		}

		function enhanceToggle(el, label, expanded) {
			if (!el) return;
			el.setAttribute("role", "button");
			el.setAttribute("tabindex", "0");
			el.setAttribute("aria-label", label);
			el.setAttribute("aria-expanded", expanded ? "true" : "false");
			if (nav && nav.id) {
				el.setAttribute("aria-controls", nav.id);
			} else if (nav) {
				nav.id = "primary-navigation";
				el.setAttribute("aria-controls", "primary-navigation");
			}
			// Activate on Enter / Space to mirror the existing click handler.
			el.addEventListener("keydown", function (e) {
				if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
					e.preventDefault();
					el.click();
				}
			});
		}

		enhanceToggle(bar, "Open navigation menu", false);
		enhanceToggle(close, "Close navigation menu", true);

		if (bar) {
			bar.addEventListener("click", function () {
				bar.setAttribute("aria-expanded", "true");
				if (close) close.setAttribute("aria-expanded", "true");
				if (nav && typeof nav.focus === "function") {
					var firstLink = nav.querySelector("a");
					if (firstLink) firstLink.focus();
				}
			});
		}
		if (close) {
			close.addEventListener("click", function () {
				if (bar) {
					bar.setAttribute("aria-expanded", "false");
					bar.focus();
				}
				close.setAttribute("aria-expanded", "false");
			});
		}
	}

	/* ---------- Image loading polish ---------- */
	function setupImages() {
		var imgs = document.querySelectorAll("img");
		Array.prototype.forEach.call(imgs, function (img, i) {
			// Leave the logo and the very first banner eager for LCP.
			if (i > 1) {
				if (!img.hasAttribute("loading")) {
					img.setAttribute("loading", "lazy");
				}
				if (!img.hasAttribute("decoding")) {
					img.setAttribute("decoding", "async");
				}
			}
			// Fade-in on load for a smoother perceived-loading state.
			if (img.complete && img.naturalWidth > 0) {
				return; // already loaded from cache; no flash needed
			}
			img.classList.add("ux-fade");
			img.addEventListener("load", function () {
				img.classList.add("ux-loaded");
			});
			img.addEventListener("error", function () {
				// Never leave a broken image invisible.
				img.classList.add("ux-loaded");
			});
		});
	}

	/* ---------- Theme toggle (auto / light / dark) ---------- */
	function setupThemeToggle() {
		var KEY = "ux-theme";
		var root = document.documentElement;
		var stored = null;
		try {
			stored = window.localStorage.getItem(KEY);
		} catch (e) {
			stored = null;
		}
		if (stored === "light" || stored === "dark") {
			root.setAttribute("data-ux-theme", stored);
		}

		var btn = document.createElement("button");
		btn.type = "button";
		btn.className = "ux-theme-toggle ux-noinvert";
		document.body.appendChild(btn);

		function currentMode() {
			return root.getAttribute("data-ux-theme") || "auto";
		}

		function render() {
			var mode = currentMode();
			var icon = mode === "dark" ? "☀️"      // sun -> tap for light
				: mode === "light" ? "🌙"          // moon -> tap for auto/dark
				: "🌓";                             // crescent -> auto
			btn.innerHTML = icon;
			btn.setAttribute("aria-label", "Theme: " + mode + ". Click to change.");
			btn.title = "Theme: " + mode;
		}

		btn.addEventListener("click", function () {
			var mode = currentMode();
			var next = mode === "auto" ? "dark" : mode === "dark" ? "light" : "auto";
			if (next === "auto") {
				root.removeAttribute("data-ux-theme");
			} else {
				root.setAttribute("data-ux-theme", next);
			}
			try {
				if (next === "auto") {
					window.localStorage.removeItem(KEY);
				} else {
					window.localStorage.setItem(KEY, next);
				}
			} catch (e) { /* storage unavailable; session-only */ }
			render();
		});

		render();
	}

	ready(function () {
		try { setupSkipLink(); } catch (e) {}
		try { setupMenuToggle(); } catch (e) {}
		try { setupImages(); } catch (e) {}
		try { setupThemeToggle(); } catch (e) {}
	});
})();
