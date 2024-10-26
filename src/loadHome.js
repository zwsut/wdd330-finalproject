import { insertContent, clearContent, loadHeaderFooter } from './utils.mjs';
import { apiRequest } from './externalServices.js';

export default function home() {
    const root = document.getElementById('root');
    clearContent(root);


    // Main container with Bootstrap classes
    const mainContainerHTML = `
        <div class="container my-5">
            <div class="row gx-5">
                <!-- Left Column: About Us and Image Info -->
                <div class="col-lg-6 d-flex flex-column gap-4">
                    <section id="about-us" class="p-4 bg-light text-dark rounded">
                        <h2>About Us</h2>
                        <p>This site aims to provide an easy way to access and display data from NASA APIs. You can explore space weather, asteroid information, and NASA's Image of the Day. We aim to integrate more APIs over time to allow further investigation by space enthusiasts. Thank you for visiting!</p>
                    </section>
                    <div id="image-info" class="card bg-warning-subtle text-dark p-3 rounded mb-4">
                        <h3 id="image-title" class="card-title"></h3>
                        <p id="image-copyright" class="card-text fst-italic"></p>
                        <p id="image-description" class="card-text"></p>
                    </div>
                </div>
                <!-- Right Column: Image and Date Picker -->
                <div class="col-lg-6 d-flex flex-column align-items-center card bg-warning-subtle text-light p-4 rounded">
                    <input type="date" id="date-picker" class="form-control mb-3" aria-label="Select a date">
                    <img id="image-of-the-day" src="" alt="NASA Image of the Day" class="img-fluid rounded mb-3" style="width: 80%;">
                </div>
            </div>
        </div>
    `;

    insertContent(root, mainContainerHTML);

    loadImageOfTheDay();

    document.getElementById('date-picker').addEventListener('change', (event) => {
        const selectedDate = event.target.value;
        if (selectedDate) {
            location.href = `?date=${selectedDate}`;
        } else {
            location.reload();
        }
    });
    loadHeaderFooter();
}

// Function to load Image of the Day and update card info
async function loadImageOfTheDay() {
    const apiKey = 'hOUu9YWVpurhbtNw3TsOcbLz8wuiHMG7v9UMur8i';
    const date = getQueryParameter('date') || new Date().toISOString().split('T')[0];
    const url = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&date=${date}`;

    try {
        const data = await apiRequest(url);
        const imageElement = document.getElementById('image-of-the-day');
        imageElement.src = data.url;
        imageElement.alt = data.title || 'NASA Image of the Day';

        // Populate the information card
        document.getElementById('image-title').textContent = data.title;
        document.getElementById('image-copyright').textContent = data.copyright 
            ? `© ${data.copyright}` 
            : '';
        document.getElementById('image-description').textContent = data.explanation;
    } catch (error) {
        console.error('Failed to load Image of the Day:', error);
    }
}

// Helper function to get query parameter from URL
function getQueryParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}
