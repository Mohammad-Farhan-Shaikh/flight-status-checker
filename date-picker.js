export function initDatePicker() {
    const dateInput = document.getElementById('date');
    const dateDisplay = document.getElementById('date-display');
    const dateGroup = document.querySelector('.date-group');

    if (!dateInput || !dateDisplay || !dateGroup) return;

    // 1. Sync hidden date input with display field
    dateInput.addEventListener('change', (e) => {
        if (e.target.value) {
            const date = new Date(e.target.value);
            const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
            dateDisplay.value = date.toLocaleDateString('en-US', options);
        } else {
            dateDisplay.value = '';
        }
    });

    // 2. Explicitly open the date picker when clicking the display field
    dateGroup.addEventListener('click', () => {
        try {
            dateInput.showPicker();
        } catch (error) {
            dateInput.click();
        }
    });

    // 3. Set default date to today
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;
    dateInput.dispatchEvent(new Event('change'));
}
