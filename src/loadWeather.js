import { insertContent, clearContent, loadHeaderFooter, renderTemplate, createElement, formatDateTime, setInLocalStorage } from './utils.mjs';
import { apiRequest } from './externalServices.js';

export default function loadWeather() {
    document.body.className = '';
    document.body.classList.add('weather-page');
    setInLocalStorage('pageId', 'weather');
    const root = document.getElementById('root');
    clearContent(root);

    const mainContainerHTML = `
        <div class="container my-5 text-dark">
            <h2 class="text-center mb-4">Space Weather</h2>
            <div class="d-flex justify-content-center mb-3">
                <input type="date" id="date-picker" class="form-control w-25" aria-label="Select Date" placeholder="Select Date">
                <button id="fetch-weather" class="btn btn-primary ms-3">Get Weather</button>
            </div>
            <div id="weather-container" class="container my-4"></div>
        </div>
    `;

    insertContent(root, mainContainerHTML);
    loadHeaderFooter();

    const today = new Date().toISOString().split('T')[0];
    document.getElementById('date-picker').value = today;
    

    fetchWeatherData(today);

    document.getElementById('fetch-weather').addEventListener('click', () => {
        const selectedDate = document.getElementById('date-picker').value;
        fetchWeatherData(selectedDate);
    });
}

async function fetchWeatherData(date) {
    const container = document.getElementById('weather-container');
    clearContent(container);

    const start = new Date(date);
    const end = new Date(start);
    end.setDate(start.getDate() + 7);
    const endDate = end.toISOString().split('T')[0];

    try {
        const [cmeData, gstData, flrData] = await Promise.all([
            apiRequest(`https://api.nasa.gov/DONKI/CME?startDate=${date}&endDate=${date}&api_key=hOUu9YWVpurhbtNw3TsOcbLz8wuiHMG7v9UMur8i`),
            apiRequest(`https://api.nasa.gov/DONKI/GST?startDate=${date}&endDate=${endDate}&api_key=hOUu9YWVpurhbtNw3TsOcbLz8wuiHMG7v9UMur8i`),
            apiRequest(`https://api.nasa.gov/DONKI/FLR?startDate=${date}&endDate=${date}&api_key=hOUu9YWVpurhbtNw3TsOcbLz8wuiHMG7v9UMur8i`)
        ]);

        renderWeather(cmeData, 'CME');
        renderWeather(gstData, 'GST');
        renderWeather(flrData, 'FLR');
    } catch (error) {
        console.error('Failed to load weather data:', error);
    }
}

function renderWeather(events, eventType) {
    const container = document.getElementById('weather-container');

    const sectionTitle = {
        CME: 'Coronal Mass Ejections (CME)',
        GST: 'Geomagnetic Storms (GST)',
        FLR: 'Solar Flares (FLR)'
    };

    const colorClass = {
        CME: 'bg-warning-subtle',
        GST: 'bg-primary-subtle',
        FLR: 'bg-danger-subtle'
    };

    const sectionContainer = createElement('div', { className: 'mb-5' }, [
        createElement('h3', { className: 'text-center mb-4', textContent: sectionTitle[eventType] })
    ]);
    container.appendChild(sectionContainer);

    if (events.length === 0) {
        const noEventsMessage = createElement('p', {
            className: 'text-center',
            textContent: `No events of this type found for the selected date.`
        });
        sectionContainer.appendChild(noEventsMessage);
        return;
    }

    const eventsRow = createElement('div', { className: 'row g-4' });

    events.forEach(event => {
        let basicContent, expandedContent;

        if (eventType === 'GST') {
            const maxKpIndex = Math.max(...event.allKpIndex.map(kp => kp.kpIndex));

            basicContent = `
                <div class="card-body">
                    <h5 class="card-title">Geomagnetic Storm: ${event.gstID}</h5>
                    <p class="card-text"><strong>Start Date:</strong> ${formatDateTime(event.startTime)}</p>
                    <p class="card-text"><strong>Max Kp Index:</strong> ${maxKpIndex}</p>
                </div>
            `;

            expandedContent = `
                <p class="card-text"><strong>Kp Index Observations:</strong></p>
                <ul class="list-group mb-3">
                    ${event.allKpIndex.map(kp => `
                        <li class="list-group-item">
                            <strong>Time:</strong> ${formatDateTime(kp.observedTime)} - <strong>Kp Index:</strong> ${kp.kpIndex}
                        </li>
                    `).join('')}
                </ul>
                <a href="${event.link}" target="_blank" class="btn btn-secondary">More Info</a>
            `;
        } else if (eventType === 'CME') {
            basicContent = `
                <div class="card-body">
                    <h5 class="card-title">CME Event: ${event.activityID}</h5>
                    <p class="card-text"><strong>Start Date:</strong> ${formatDateTime(event.startTime)}</p>
                </div>
            `;
            expandedContent = `
                <p class="card-text"><strong>Note:</strong> ${event.note || 'N/A'}</p>
                <a href="${event.link}" target="_blank" class="btn btn-secondary">More Info</a>
            `;
        } else if (eventType === 'FLR') {
            basicContent = `
                <div class="card-body">
                    <h5 class="card-title">FLR Event: ${event.flrID}</h5>
                    <p class="card-text"><strong>Location:</strong> ${event.sourceLocation || 'Unknown'}</p>
                    <p class="card-text"><strong>Start Date:</strong> ${formatDateTime(event.beginTime)}</p>
                </div>
            `;
            expandedContent = `
                <p class="card-text"><strong>Peak Time:</strong> ${formatDateTime(event.peakTime)}</p>
                <p class="card-text"><strong>End Time:</strong> ${formatDateTime(event.endTime)}</p>
                <p class="card-text"><strong>Note:</strong> ${event.note || 'N/A'}</p>
                <a href="${event.link}" target="_blank" class="btn btn-secondary">More Info</a>
            `;
        }

        const cardBody = renderTemplate(basicContent);
        const eventCard = createElement('div', {
            className: `col-12 card h-100 ${colorClass[eventType]} expandable-card`
        }, [cardBody]);

        eventCard.addEventListener('click', () => {
            const isExpanded = eventCard.classList.toggle('expanded');

            if (isExpanded) {
                cardBody.insertAdjacentHTML('beforeend', expandedContent);

                const closeButton = createElement('button', {
                    className: 'close-btn btn btn-sm btn-danger',
                    textContent: 'Close'
                });
                closeButton.addEventListener('click', (e) => {
                    e.stopPropagation();
                    eventCard.classList.remove('expanded');

                    const extraContent = cardBody.querySelectorAll('.card-text:not(:first-child), .btn, .close-btn, ul');
                    extraContent.forEach(element => element?.remove());
                });

                cardBody.prepend(closeButton);
            } else {
                const extraContent = cardBody.querySelectorAll('.card-text:not(:first-child), .btn, .close-btn, ul');
                extraContent.forEach(element => element?.remove());
            }
        });

        eventsRow.appendChild(eventCard);
    });

    sectionContainer.appendChild(eventsRow);
}
