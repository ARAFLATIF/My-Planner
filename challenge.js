document.addEventListener('DOMContentLoaded', function() {
    const challengeDate = document.getElementById('challengeDate');
    const saveButton = document.getElementById('saveChallenge');
    const checkboxes = document.querySelectorAll('.challenge-checkbox');

    // Set default date to today
    challengeDate.valueAsDate = new Date();

    // Load saved progress for the current date
    loadProgress();

    challengeDate.addEventListener('change', loadProgress);

    saveButton.addEventListener('click', saveProgress);

    function saveProgress() {
        const date = challengeDate.value;
        const progress = {};

        checkboxes.forEach(checkbox => {
            progress[checkbox.id] = checkbox.checked;
        });

        let challenges = JSON.parse(localStorage.getItem('challenges')) || {};
        challenges[date] = progress;
        localStorage.setItem('challenges', JSON.stringify(challenges));

        alert('Progress saved successfully!');
    }

    function loadProgress() {
        const date = challengeDate.value;
        const challenges = JSON.parse(localStorage.getItem('challenges')) || {};
        const progress = challenges[date] || {};

        checkboxes.forEach(checkbox => {
            checkbox.checked = progress[checkbox.id] || false;
        });
    }
});
