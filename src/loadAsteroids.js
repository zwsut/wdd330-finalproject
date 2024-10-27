import { insertContent, clearContent, loadHeaderFooter, renderTemplate, createElement } from './utils.mjs';
import { apiRequest } from './externalServices.js';

export default function loadAsteroids() {
    document.body.className = '';
    document.body.classList.add('asteroids-page');
    document.body.style.backgroundColor = '#0c1b3a';
    document.body.style.color = '#ffffff';

    const root = document.getElementById('root');
    clearContent(root);

    const mainContainerHTML = `
    <div class="container my-5 text-light">
        <h2 class="text-center mb-4">Asteroid Data</h2>
        <div class="d-flex justify-content-center align-items-center mb-3">
            <input type="date" id="date-picker" class="form-control w-50" placeholder="Select Date">
            <button id="fetch-asteroids" class="btn btn-primary ms-3">Get Asteroids</button>
        </div>
        <div id="asteroid-container" class="row gy-4"></div>
    </div>
`;

    insertContent(root, mainContainerHTML);
    loadHeaderFooter();

    const today = new Date().toISOString().split('T')[0];
    document.getElementById('date-picker').value = today;
    loadAsteroidsData(today);

    document.getElementById('fetch-asteroids').addEventListener('click', () => {
        const selectedDate = document.getElementById('date-picker').value;
        loadAsteroidsData(selectedDate);
    });
}

async function loadAsteroidsData(date = new Date().toISOString().split('T')[0]) {
    const container = document.getElementById('asteroid-container');
    clearContent(container);
    
    const apiKey = 'hOUu9YWVpurhbtNw3TsOcbLz8wuiHMG7v9UMur8i';
    const url = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${date}&end_date=${date}&api_key=${apiKey}`;

    try {
        const data = await apiRequest(url);
        const asteroids = data.near_earth_objects[date] || [];
        renderAsteroids(asteroids, date);
    } catch (error) {
        console.error('Failed to load asteroid data:', error);
    }
}

function renderAsteroids(asteroids, date) {
    const container = document.getElementById('asteroid-container');
    container.innerHTML = '';

    let hazardousCount = 0;

    const summaryHTML = `
        <div class="alert alert-primary text-center mb-4">
            <h4>Near-Earth Objects for ${new Date(date).toLocaleDateString()}</h4>
            <p>Total Objects: ${asteroids.length}</p>
            <p>Hazardous Objects: ${hazardousCount}</p>
        </div>
    `;
    container.insertAdjacentHTML('afterbegin', summaryHTML);

    const cardsContainer = createElement('div', { className: 'row row-cols-1 row-cols-md-3 g-4' });

    asteroids.forEach(asteroid => {
        const asteroidData = {
            id: asteroid.id,
            name: asteroid.name,
            diameter: asteroid.estimated_diameter.meters.estimated_diameter_max.toFixed(2),
            isHazardous: asteroid.is_potentially_hazardous_asteroid,
            velocity: parseFloat(asteroid.close_approach_data[0].relative_velocity.miles_per_hour).toFixed(2),
            missDistance: parseFloat(asteroid.close_approach_data[0].miss_distance.astronomical).toFixed(4)
        };

        if (asteroidData.isHazardous) hazardousCount++;

        const cardClass = asteroidData.isHazardous ? 'bg-danger-subtle text-dark' : 'bg-success-subtle text-dark';
        const icon = asteroidData.isHazardous ? 'fas fa-exclamation-circle' : 'fas fa-shield-alt';

        const cardHTML = `
            <div class="card h-100 ${cardClass}">
                <div class="card-body">
                    <h5 class="card-title">
                        <i class="${icon}"></i> Asteroid ${asteroidData.id}
                    </h5>
                    <p class="card-text"><strong>Name:</strong> ${asteroidData.name}</p>
                    <p class="card-text"><strong>Diameter (meters):</strong> ${asteroidData.diameter}</p>
                    <p class="card-text"><strong>Hazardous:</strong> ${asteroidData.isHazardous ? 'Yes' : 'No'}</p>
                    <p class="card-text"><strong>Velocity (mph):</strong> ${asteroidData.velocity}</p>
                    <p class="card-text"><strong>Miss Distance (AU):</strong> ${asteroidData.missDistance}</p>
                    <a href="https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html#/?sstr=${asteroidData.id}" target="_blank" class="btn btn-secondary mt-2">More Info</a>
                </div>
            </div>
        `;

        const cardElement = createElement('div', { className: 'col' }, [renderTemplate(cardHTML)]);
        cardsContainer.appendChild(cardElement);
    });

    container.appendChild(cardsContainer);
    container.querySelector('.alert').innerHTML += `<p>Hazardous Objects: ${hazardousCount}</p>`;
}