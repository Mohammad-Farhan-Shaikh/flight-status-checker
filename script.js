import { initDatePicker } from './date-picker.js';

document.addEventListener('DOMContentLoaded', () => {
    // Initialize date picker module
    initDatePicker();

    const flightForm = document.getElementById('flight-input');
    const dateInput = document.getElementById('date');
    const resultsDiv = document.getElementById('results');

    // Use Vite environment variable
    const API_KEY = import.meta.env.VITE_API_KEY; 

    // Handle Form Submission
    flightForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const flightNumber = document.getElementById('flight-number').value.trim().toUpperCase();
        const date = dateInput.value;

        if (!API_KEY) {
            console.error('API Key missing. Check your .env file.');
            return;
        }

        // Show loading state
        const submitBtn = flightForm.querySelector('.check-flight');
        const originalText = submitBtn.textContent;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Searching...';
        submitBtn.disabled = true;
        
        resultsDiv.innerHTML = '';
        resultsDiv.classList.remove('show');

        try {
            // Note: Aviationstack free tier uses HTTP.
            // Vite dev server might proxy this, but for now we use the direct URL.
            const url = `http://api.aviationstack.com/v1/flights?access_key=${API_KEY}&flight_iata=${flightNumber}`;
            
            const response = await fetch(url);
            const data = await response.json();

            if (data.data && data.data.length > 0) {
                const flight = data.data[0];
                renderFlightResult(flight);
            } else {
                resultsDiv.innerHTML = `<div class="error-msg">No flight found for ${flightNumber}. Try another one!</div>`;
                resultsDiv.classList.add('show');
            }
        } catch (error) {
            console.error('API Error:', error);
            resultsDiv.innerHTML = `<div class="error-msg">Error fetching data. Check your connection or API key.</div>`;
            resultsDiv.classList.add('show');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });

    function renderFlightResult(flight) {
        const departure = flight.departure;
        const arrival = flight.arrival;
        const airline = flight.airline;
        const flightInfo = flight.flight;

        resultsDiv.innerHTML = `
            <div class="result-card">
                <div class="result-header">
                    <h3><i class="fas fa-plane"></i> ${airline.name} (${flightInfo.iata})</h3>
                    <span class="status-badge">${flight.flight_status}</span>
                </div>
                <div class="result-body">
                    <div class="flight-route">
                        <div class="airport">
                            <span class="code">${departure.iata || 'N/A'}</span>
                            <span class="city">${departure.airport || 'Departure'}</span>
                            <span class="time">${formatTime(departure.scheduled)}</span>
                        </div>
                        <div class="plane-icon">
                            <i class="fas fa-plane"></i>
                            <div class="line"></div>
                        </div>
                        <div class="airport">
                            <span class="code">${arrival.iata || 'N/A'}</span>
                            <span class="city">${arrival.airport || 'Arrival'}</span>
                            <span class="time">${formatTime(arrival.scheduled)}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        resultsDiv.classList.add('show');
    }

    function formatTime(dateString) {
        if (!dateString) return '--:--';
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    }
});
