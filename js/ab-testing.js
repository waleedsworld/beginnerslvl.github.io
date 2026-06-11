/*!
 * ab-testing.js — lightweight, dependency-free A/B testing harness
 *
 * Provides sticky per-visitor variant assignment plus a pluggable event
 * hook. No external libraries, no network calls, no cookies — everything is
 * kept in localStorage (with a graceful in-memory fallback).
 *
 * Declarative usage (no JS required on the page):
 *
 *   <h1 data-ab="hero_headline"
 *       data-ab-text-a="Learn To Protect Yourself Today"
 *       data-ab-text-b="Stay Safe Online — Start Today"></h1>
 *
 *   <a class="btn" href="..."
 *      data-ab="cta_copy"
 *      data-ab-text-a="read more"
 *      data-ab-text-b="Get Protected Now"
 *      data-ab-cta="hero_learn_more"></a>
 *
 * Programmatic usage:
 *
 *   var v = AB.assign('pricing_layout', ['grid', 'list']);
 *   if (v === 'grid') { ... }
 *   AB.track('signup', { plan: 'free' });
 *   AB.on(function (evt) { console.log(evt.name, evt.props); });
 */
(function (global) {
	'use strict';

	var STORAGE_KEY = 'ab.assignments';
	var VISITOR_KEY = 'ab.visitor';
	var EVENT_NAME = 'ab:event';

	/* ----------------------------------------------------------------- *
	 * Storage — localStorage when available, in-memory otherwise.
	 * ----------------------------------------------------------------- */
	var memory = {};
	var hasLocalStorage = (function () {
		try {
			var t = '__ab_test__';
			global.localStorage.setItem(t, t);
			global.localStorage.removeItem(t);
			return true;
		} catch (e) {
			return false;
		}
	})();

	function readStore(key) {
		if (hasLocalStorage) {
			try {
				return global.localStorage.getItem(key);
			} catch (e) {
				/* fall through */
			}
		}
		return Object.prototype.hasOwnProperty.call(memory, key) ? memory[key] : null;
	}

	function writeStore(key, value) {
		if (hasLocalStorage) {
			try {
				global.localStorage.setItem(key, value);
				return;
			} catch (e) {
				/* fall through */
			}
		}
		memory[key] = value;
	}

	function readJSON(key, fallback) {
		var raw = readStore(key);
		if (!raw) {
			return fallback;
		}
		try {
			return JSON.parse(raw);
		} catch (e) {
			return fallback;
		}
	}

	/* ----------------------------------------------------------------- *
	 * Visitor id + deterministic hashing (FNV-1a).
	 * ----------------------------------------------------------------- */
	function makeVisitorId() {
		var rnd = Math.random().toString(36).slice(2);
		return 'v_' + Date.now().toString(36) + rnd;
	}

	function getVisitorId() {
		var id = readStore(VISITOR_KEY);
		if (!id) {
			id = makeVisitorId();
			writeStore(VISITOR_KEY, id);
		}
		return id;
	}

	function hash(str) {
		var h = 0x811c9dc5;
		for (var i = 0; i < str.length; i++) {
			h ^= str.charCodeAt(i);
			h = (h + ((h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24))) >>> 0;
		}
		return h >>> 0;
	}

	/* ----------------------------------------------------------------- *
	 * Assignment. Sticky per visitor; deterministic so it survives even
	 * if localStorage is cleared, as long as the variant list is stable.
	 * ----------------------------------------------------------------- */
	function normalize(variants, weights) {
		var out = [];
		for (var i = 0; i < variants.length; i++) {
			var w = weights && typeof weights[i] === 'number' && weights[i] > 0 ? weights[i] : 1;
			out.push({ name: String(variants[i]), weight: w });
		}
		return out;
	}

	function assign(experiment, variants, weights) {
		experiment = String(experiment);
		if (!variants || !variants.length) {
			variants = ['a', 'b'];
		}
		var store = readJSON(STORAGE_KEY, {});
		if (store && typeof store[experiment] === 'string') {
			// Honour an existing assignment only if it is still a valid variant.
			for (var k = 0; k < variants.length; k++) {
				if (String(variants[k]) === store[experiment]) {
					return store[experiment];
				}
			}
		}

		var buckets = normalize(variants, weights);
		var total = 0;
		var b;
		for (b = 0; b < buckets.length; b++) {
			total += buckets[b].weight;
		}
		var point = (hash(getVisitorId() + ':' + experiment) % 10000) / 10000 * total;
		var chosen = buckets[buckets.length - 1].name;
		var acc = 0;
		for (b = 0; b < buckets.length; b++) {
			acc += buckets[b].weight;
			if (point < acc) {
				chosen = buckets[b].name;
				break;
			}
		}

		store = store && typeof store === 'object' ? store : {};
		store[experiment] = chosen;
		writeStore(STORAGE_KEY, JSON.stringify(store));
		return chosen;
	}

	/* ----------------------------------------------------------------- *
	 * Event hook. Subscribers get every tracked event; events are also
	 * mirrored to a global queue (window.abDataLayer) and dispatched as a
	 * DOM CustomEvent so external analytics can listen without coupling.
	 * ----------------------------------------------------------------- */
	var subscribers = [];
	global.abDataLayer = global.abDataLayer || [];

	function on(fn) {
		if (typeof fn === 'function') {
			subscribers.push(fn);
		}
		return function off() {
			var i = subscribers.indexOf(fn);
			if (i !== -1) {
				subscribers.splice(i, 1);
			}
		};
	}

	function track(name, props) {
		var evt = {
			name: String(name),
			props: props || {},
			experiments: readJSON(STORAGE_KEY, {}),
			visitor: getVisitorId(),
			ts: Date.now()
		};
		global.abDataLayer.push(evt);
		for (var i = 0; i < subscribers.length; i++) {
			try {
				subscribers[i](evt);
			} catch (e) {
				/* a bad subscriber must not break tracking */
			}
		}
		if (typeof global.CustomEvent === 'function' && global.dispatchEvent) {
			try {
				global.dispatchEvent(new global.CustomEvent(EVENT_NAME, { detail: evt }));
			} catch (e) {
				/* ignore */
			}
		}
		return evt;
	}

	/* ----------------------------------------------------------------- *
	 * Declarative DOM application.
	 *   data-ab="<experiment>"       -> assigns and marks the element
	 *   data-ab-variants="a,b,c"     -> optional explicit variant list
	 *   data-ab-weights="3,1"        -> optional weights matching variants
	 *   data-ab-text-<variant>       -> text content for that variant
	 *   data-ab-href-<variant>       -> href for that variant (links)
	 *   data-ab-class-<variant>      -> class(es) added for that variant
	 *   data-ab-cta="<label>"        -> auto-track a click as "cta_click"
	 * The chosen variant is exposed on the element as data-ab-variant and a
	 * "ab-<experiment>-<variant>" class for CSS targeting.
	 * ----------------------------------------------------------------- */
	function readVariants(el) {
		var raw = el.getAttribute('data-ab-variants');
		if (raw) {
			return raw.split(',').map(function (s) { return s.trim(); }).filter(Boolean);
		}
		// Infer from data-ab-text-* / data-ab-href-* / data-ab-class-* attrs.
		var found = {};
		var attrs = el.attributes;
		for (var i = 0; i < attrs.length; i++) {
			var m = /^data-ab-(?:text|href|class)-(.+)$/.exec(attrs[i].name);
			if (m) {
				found[m[1]] = true;
			}
		}
		return Object.keys(found);
	}

	function readWeights(el, variants) {
		var raw = el.getAttribute('data-ab-weights');
		if (!raw) {
			return null;
		}
		var parts = raw.split(',').map(function (s) { return parseFloat(s.trim()); });
		return variants.map(function (_, i) {
			return typeof parts[i] === 'number' && !isNaN(parts[i]) ? parts[i] : 1;
		});
	}

	function applyElement(el) {
		var experiment = el.getAttribute('data-ab');
		if (!experiment || el.getAttribute('data-ab-applied') === '1') {
			return;
		}
		var variants = readVariants(el);
		if (!variants.length) {
			return;
		}
		var variant = assign(experiment, variants, readWeights(el, variants));

		var text = el.getAttribute('data-ab-text-' + variant);
		if (text !== null) {
			el.textContent = text;
		}
		var href = el.getAttribute('data-ab-href-' + variant);
		if (href !== null && 'href' in el) {
			el.setAttribute('href', href);
		}
		var cls = el.getAttribute('data-ab-class-' + variant);
		if (cls) {
			cls.split(/\s+/).forEach(function (c) {
				if (c) { el.classList.add(c); }
			});
		}

		el.setAttribute('data-ab-variant', variant);
		el.classList.add('ab-' + experiment + '-' + variant);
		el.setAttribute('data-ab-applied', '1');

		track('experiment_exposure', { experiment: experiment, variant: variant });

		if (el.getAttribute('data-ab-cta') !== null) {
			el.addEventListener('click', function () {
				track('cta_click', {
					cta: el.getAttribute('data-ab-cta') || experiment,
					experiment: experiment,
					variant: variant
				});
			});
		}
	}

	function applyAll(root) {
		var scope = root || global.document;
		if (!scope || !scope.querySelectorAll) {
			return;
		}
		var nodes = scope.querySelectorAll('[data-ab]');
		for (var i = 0; i < nodes.length; i++) {
			applyElement(nodes[i]);
		}
	}

	function ready(fn) {
		var doc = global.document;
		if (!doc) {
			return;
		}
		if (doc.readyState === 'loading') {
			doc.addEventListener('DOMContentLoaded', fn);
		} else {
			fn();
		}
	}

	var AB = {
		assign: assign,
		variant: function (experiment) {
			return readJSON(STORAGE_KEY, {})[String(experiment)] || null;
		},
		track: track,
		on: on,
		apply: applyAll,
		visitorId: getVisitorId,
		reset: function () {
			writeStore(STORAGE_KEY, JSON.stringify({}));
		},
		_hash: hash
	};

	global.AB = AB;

	// Auto-apply declarative experiments once the DOM is ready.
	ready(function () {
		applyAll(global.document);
	});

	// CommonJS export for tooling/tests, harmless in the browser.
	if (typeof module !== 'undefined' && module.exports) {
		module.exports = AB;
	}
})(typeof window !== 'undefined' ? window : this);
