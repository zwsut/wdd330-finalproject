import { insertContent, clearContent, loadHeaderFooter, renderTemplate, createElement } from './utils.mjs';
import { apiRequest } from './externalServices.js';

export default function loadWeather() {
    document.body.className = '';
    document.body.classList.add('weather-page');

    const root = document.getElementById('root');
    clearContent(root);

    const mainContainerHTML = `
        <div class="container my-5 text-light">
            <h2 class="text-center mb-4">Space Weather</h2>
            <div class="d-flex justify-content-center mb-3">
                <input type="date" id="date-picker" class="form-control w-25" aria-label="Select Date">
                <button id="fetch-weather" class="btn btn-primary ms-3">Get Weather</button>
            </div>
            <div id="weather-container" class="row gy-4"></div>
        </div>
    `;

    insertContent(root, mainContainerHTML);
    loadHeaderFooter();

    document.getElementById('fetch-weather').addEventListener('click', fetchWeatherData);
}

async function fetchWeatherData() {
    const date = document.getElementById('date-picker').value;
    if (!date) {
        alert("Please select a date.");
        return;
    }

    try {
        const [cmeData, gstData, flrData] = await Promise.all([
            apiRequest(`https://api.nasa.gov/DONKI/CME?startDate=${date}&endDate=${date}&api_key=hOUu9YWVpurhbtNw3TsOcbLz8wuiHMG7v9UMur8i`),
            apiRequest(`https://api.nasa.gov/DONKI/GST?startDate=${date}&endDate=${date}&api_key=hOUu9YWVpurhbtNw3TsOcbLz8wuiHMG7v9UMur8i`),
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

    const sectionContainer = createElement('div', { className: 'col-12 my-3' }, [
        createElement('h3', { className: 'text-center', textContent: sectionTitle[eventType] })
    ]);
    container.appendChild(sectionContainer);

    if (events.length === 0) {
        const noEventsMessage = createElement('p', {
            className: 'text-center',
            textContent: `No ${sectionTitle[eventType]} events found for the selected date.`
        });
        sectionContainer.appendChild(noEventsMessage);
        return;
    }

    events.forEach(event => {
        let eventContent;
        switch (eventType) {
            case 'CME':
                eventContent = `
                    <div class="card-body">
                        <h5 class="card-title">CME Event: ${event.activityID}</h5>
                        <p class="card-text"><strong>Start Date:</strong> ${event.startTime}</p>
                        <p class="card-text"><strong>Note:</strong> ${event.note || 'N/A'}</p>
                        <p class="card-text"><strong>Location:</strong> ${event.sourceLocation || 'Unknown'}</p>
                        <a href="${event.link}" target="_blank" class="btn btn-secondary">More Info</a>
                    </div>
                `;
                break;

            case 'GST':
                eventContent = `
                    <div class="card-body">
                        <h5 class="card-title">Geomagnetic Storm: ${event.activityID}</h5>
                        <p class="card-text"><strong>Start Date:</strong> ${event.startTime}</p>
                        <p class="card-text"><strong>Kp Index:</strong> ${event.kpIndex || 'N/A'}</p>
                        <a href="${event.link}" target="_blank" class="btn btn-secondary">More Info</a>
                    </div>
                `;
                break;

            case 'FLR':
                eventContent = `
                    <div class="card-body">
                        <h5 class="card-title">Solar Flare: ${event.activityID}</h5>
                        <p class="card-text"><strong>Begin Time:</strong> ${event.beginTime}</p>
                        <p class="card-text"><strong>Peak Time:</strong> ${event.peakTime}</p>
                        <p class="card-text"><strong>End Time:</strong> ${event.endTime}</p>
                        <p class="card-text"><strong>Note:</strong> ${event.note || 'N/A'}</p>
                        <a href="${event.link}" target="_blank" class="btn btn-secondary">More Info</a>
                    </div>
                `;
                break;
        }

        const cardBody = renderTemplate(eventContent);
        const eventCard = createElement('div', { className: 'col-md-4' }, [
            createElement('div', { className: 'card h-100 bg-dark text-light' }, [cardBody])
        ]);

        sectionContainer.appendChild(eventCard);
    });
}

