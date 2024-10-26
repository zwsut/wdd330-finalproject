import { loadHeaderFooter, initializePageId } from "./utils.mjs";

import home from './loadHome.js';
import asteroids from './loadAsteroids.js';
import newsletter from './loadNewsletter.js';
import weather from './loadWeather.js';

loadHeaderFooter();

window.home = home;
window.loadAsteroids = asteroids;
window.loadNewsletter = newsletter;
window.loadWeather = weather;

document.addEventListener('DOMContentLoaded', () => {
    const pageId = initializePageId();

    if (typeof window[pageId] === 'function') {
        window[pageId]();
    } else {
        console.error(`Function not found: ${pageId}`);
    }
});
