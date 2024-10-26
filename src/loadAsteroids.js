import { insertContent, clearContent, loadHeaderFooter, renderTemplate } from './utils.mjs';
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
            <div class="d-flex justify-content-center mb-3">
                <input type="date" id="date-picker" class="form-control w-50" aria-label="Select a date">
            </div>
            <div id="asteroid-container" class="row gy-4"></div>
        </div>
    `;

    insertContent(root, mainContainerHTML);
    loadHeaderFooter();
    loadAsteroidsData();

    document.getElementById('date-picker').addEventListener('change', (event) => {
        const selectedDate = event.target.value;
        loadAsteroidsData(selectedDate);
    });
}

async function loadAsteroidsData(date = new Date().toISOString().split('T')[0]) {
    const apiKey = 'hOUu9YWVpurhbtNw3TsOcbLz8wuiHMG7v9UMur8i';
    const url = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${date}&end_date=${date}&api_key=${apiKey}`;

    try {
        const data = await apiRequest(url);
        const asteroids = data.near_earth_objects[date] || [];
        renderAsteroids(asteroids);
    } catch (error) {
        console.error('Failed to load asteroid data:', error);
    }
}

function renderAsteroids(asteroids) {
    const container = document.getElementById('asteroid-container');
    container.innerHTML = '';

    let hazardousCount = 0;

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

        const cardHTML = renderTemplate(`
            <div class="col-md-4">
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
                    </div>
                </div>
            </div>
        `);

        container.insertAdjacentHTML('beforeend', cardHTML);
    });

    const summaryHTML = `
        <div class="alert alert-primary text-center mb-4">
            <h4>Total Near-Earth Objects: ${asteroids.length}</h4>
            <p>Hazardous Objects: ${hazardousCount}</p>
        </div>
    `;
    container.insertAdjacentHTML('afterbegin', summaryHTML);
}
