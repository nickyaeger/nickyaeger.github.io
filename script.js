const toggleButton = document.getElementById('theme-toggle');
const root = document.documentElement;

// Hamburger menu toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        hamburger.setAttribute('aria-expanded', hamburger.classList.contains('active'));
    });

    // Close menu when a link is clicked
    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
        });
    });
}

function applyTheme(theme) {
    if (theme === 'dark') {
        root.setAttribute('data-theme', 'dark');
        if (toggleButton) toggleButton.setAttribute('aria-pressed', 'true');
        if (toggleButton) toggleButton.setAttribute('aria-label', 'Activate light mode');
        if (toggleButton) toggleButton.setAttribute('title', 'Switch to light mode');
    } else {
        root.removeAttribute('data-theme');
        if (toggleButton) toggleButton.setAttribute('aria-pressed', 'false');
        if (toggleButton) toggleButton.setAttribute('aria-label', 'Activate dark mode');
        if (toggleButton) toggleButton.setAttribute('title', 'Switch to dark mode');
    }
}

// Helper: append or remove theme param on internal links (fallback when localStorage unavailable)
function isInternalLink(href) {
    if (!href) return false;
    // mailto:, tel:, javascript: are not internal
    if (/^(mailto:|tel:|javascript:|#)/i.test(href)) return false;
    // Absolute http(s) - check same origin
    try {
        const url = new URL(href, location.href);
        return url.origin === location.origin;
    } catch (e) {
        return true; // relative URLs are internal
    }
}

function setThemeParamOnLinks(theme) {
    document.querySelectorAll('a[href]').forEach(a => {
        const href = a.getAttribute('href');
        if (!isInternalLink(href)) return;
        try {
            const url = new URL(href, location.href);
            if (theme === 'dark') url.searchParams.set('theme', 'dark');
            else url.searchParams.delete('theme');
            // Use relative path when original was relative
            const newHref = href.startsWith('http') ? url.href : url.pathname + url.search + url.hash;
            a.setAttribute('href', newHref);
        } catch (e) {
            // fallback: naive append
            if (theme === 'dark') {
                if (href.includes('?')) a.setAttribute('href', href + '&theme=dark');
                else a.setAttribute('href', href + '?theme=dark');
            } else {
                a.setAttribute('href', href.replace(/[?&]theme=dark/, ''));
            }
        }
    });
}

// On load: first check URL param (explicit override), otherwise check localStorage
const urlParams = new URLSearchParams(location.search);
const urlTheme = urlParams.get('theme');
let storageAvailable = true;
try {
    // test localStorage availability
    const testKey = '__test_theme__';
    localStorage.setItem(testKey, '1');
    localStorage.removeItem(testKey);
} catch (e) {
    storageAvailable = false;
}

if (urlTheme === 'dark') {
    applyTheme('dark');
    // ensure links carry theme when storage not available
    if (!storageAvailable) setThemeParamOnLinks('dark');
} else if (storageAvailable) {
    const currentTheme = localStorage.getItem('theme');
    applyTheme(currentTheme === 'dark' ? 'dark' : 'light');
} else {
    // default light, but ensure links don't carry theme
    applyTheme('light');
    setThemeParamOnLinks('light');
}

// Toggle handler (guard if button missing on some pages)
if (toggleButton) {
    toggleButton.addEventListener('click', () => {
        const isDark = root.getAttribute('data-theme') === 'dark';
        if (isDark) {
            // Switch to light: remove stored preference so default/light is used
            try {
                if (storageAvailable) localStorage.removeItem('theme');
            } catch (e) { storageAvailable = false; }
            applyTheme('light');
            if (!storageAvailable) setThemeParamOnLinks('light');
        } else {
            // Switch to dark and persist (or fallback to URL param on links)
            try {
                if (storageAvailable) localStorage.setItem('theme', 'dark');
            } catch (e) { storageAvailable = false; }
            applyTheme('dark');
            if (!storageAvailable) setThemeParamOnLinks('dark');
        }
    });
}

// Random quote feature
const quotes = [
    "\"The cost of a thing is the amount of life which is required to be exchanged for it.\" – Henry David Thoreau",
    "\"We are what we pretend to be, so we must be careful about what we pretend to be.\" – Kurt Vonnegut",
    "\"The world breaks everyone, and afterward, some are strong at the broken places.\" – Ernest Hemingway",
    "\"I have not failed. I've just found 10,000 ways that won't work.\" – Thomas Edison",
    "\"It is not the mountain we conquer, but ourselves.\" – Edmund Hillary",
    "\"The privilege of a lifetime is to become who you truly are.\" – Carl Jung",
    "\"Adventure is worthwhile in itself.\" – Amelia Earhart",
    "\"Everything you can imagine is real.\" – Pablo Picasso",
    "\"Courage is grace under pressure.\" – Ernest Hemingway",
    "\"Not all those who wander are lost.\" – J.R.R. Tolkien",
    "\"The only impossible journey is the one you never begin.\" – Tony Robbins",
    "\"What we think, we become.\" – Buddha",
    "\"Do not go where the path may lead, go instead where there is no path and leave a trail.\" – Ralph Waldo Emerson",
    "\"The man who moves a mountain begins by carrying away small stones.\" – Confucius",
    "\"We can't help everyone, but everyone can help someone.\" – Ronald Reagan",
    "\"Knowing yourself is the beginning of all wisdom.\" – Aristotle",
    "\"In the middle of difficulty lies opportunity.\" – Albert Einstein",
    "\"You must be the change you wish to see in the world.\" – Mahatma Gandhi",
    "\"Yesterday I was clever, so I wanted to change the world. Today I am wise, so I am changing myself.\" – Rumi",
    "\"He who has a why to live can bear almost any how.\" – Friedrich Nietzsche"
];

function displayRandomQuote() {
    const quoteElement = document.getElementById('random-quote');
    if (quoteElement) {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        quoteElement.textContent = quotes[randomIndex];
    }
}

// Display quote on page load
displayRandomQuote();