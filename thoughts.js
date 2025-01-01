document.addEventListener('DOMContentLoaded', function() {
    const saveButton = document.getElementById('saveThought');
    const thoughtDate = document.getElementById('thoughtDate');
    const thoughtText = document.getElementById('thoughtText');
    const previousThoughts = document.getElementById('previousThoughts');

    let editingIndex = -1;

    // Set default date to today
    thoughtDate.valueAsDate = new Date();

    saveButton.addEventListener('click', function() {
        const date = thoughtDate.value;
        const text = thoughtText.value.trim();

        if (text) {
            if (editingIndex === -1) {
                saveThought(date, text);
            } else {
                updateThought(editingIndex, date, text);
            }
            thoughtText.value = '';
            editingIndex = -1;
            saveButton.textContent = 'Save Thought';
            displayThoughts();
        }
    });

    function saveThought(date, text) {
        let thoughts = JSON.parse(localStorage.getItem('thoughts')) || [];
        thoughts.push({ date, text });
        localStorage.setItem('thoughts', JSON.stringify(thoughts));
    }

    function updateThought(index, date, text) {
        let thoughts = JSON.parse(localStorage.getItem('thoughts')) || [];
        thoughts[index] = { date, text };
        localStorage.setItem('thoughts', JSON.stringify(thoughts));
    }

    function displayThoughts() {
        let thoughts = JSON.parse(localStorage.getItem('thoughts')) || [];
        previousThoughts.innerHTML = '';

        thoughts.sort((a, b) => new Date(b.date) - new Date(a.date));

        thoughts.forEach((thought, index) => {
            const thoughtElement = document.createElement('div');
            thoughtElement.classList.add('thought-entry');
            thoughtElement.innerHTML = `
                <strong>${thought.date}</strong>
                <p>${thought.text}</p>
                <button class="btn btn-outline-primary btn-sm edit-thought" data-index="${index}">Edit</button>
                <button class="btn btn-outline-danger btn-sm delete-thought" data-index="${index}">Delete</button>
            `;
            previousThoughts.appendChild(thoughtElement);
        });

        // Add event listeners for edit and delete buttons
        document.querySelectorAll('.edit-thought').forEach(button => {
            button.addEventListener('click', function() {
                const index = this.getAttribute('data-index');
                editThought(index);
            });
        });

        document.querySelectorAll('.delete-thought').forEach(button => {
            button.addEventListener('click', function() {
                const index = this.getAttribute('data-index');
                deleteThought(index);
            });
        });
    }

    function editThought(index) {
        let thoughts = JSON.parse(localStorage.getItem('thoughts')) || [];
        const thought = thoughts[index];
        thoughtDate.value = thought.date;
        thoughtText.value = thought.text;
        editingIndex = index;
        saveButton.textContent = 'Update Thought';
    }

    function deleteThought(index) {
        let thoughts = JSON.parse(localStorage.getItem('thoughts')) || [];
        thoughts.splice(index, 1);
        localStorage.setItem('thoughts', JSON.stringify(thoughts));
        displayThoughts();
    }

    // Load thoughts for a specific date
    function loadThoughtsForDate(date) {
        let thoughts = JSON.parse(localStorage.getItem('thoughts')) || [];
        let filteredThoughts = thoughts.filter(thought => thought.date === date);
        
        thoughtDate.value = date;
        previousThoughts.innerHTML = '';

        filteredThoughts.forEach((thought, index) => {
            const thoughtElement = document.createElement('div');
            thoughtElement.classList.add('thought-entry');
            thoughtElement.innerHTML = `
                <strong>${thought.date}</strong>
                <p>${thought.text}</p>
                <button class="btn btn-outline-primary btn-sm edit-thought" data-index="${index}">Edit</button>
                <button class="btn btn-outline-danger btn-sm delete-thought" data-index="${index}">Delete</button>
            `;
            previousThoughts.appendChild(thoughtElement);
        });

        // Add event listeners for edit and delete buttons
        document.querySelectorAll('.edit-thought').forEach(button => {
            button.addEventListener('click', function() {
                const index = this.getAttribute('data-index');
                editThought(index);
            });
        });

        document.querySelectorAll('.delete-thought').forEach(button => {
            button.addEventListener('click', function() {
                const index = this.getAttribute('data-index');
                deleteThought(index);
            });
        });
    }

    // Check if a date parameter is in the URL
    const urlParams = new URLSearchParams(window.location.search);
    const dateParam = urlParams.get('date');
    if (dateParam) {
        loadThoughtsForDate(dateParam);
    } else {
        displayThoughts();
    }
});


