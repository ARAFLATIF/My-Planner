document.addEventListener('DOMContentLoaded', function() {
    const calendarBody = document.getElementById('calendarBody');
    const currentMonthElement = document.getElementById('currentMonth');
    const prevMonthButton = document.getElementById('prevMonth');
    const nextMonthButton = document.getElementById('nextMonth');
    const selectedDateElement = document.getElementById('selectedDate');
    const thoughtsSummaryElement = document.getElementById('thoughtsSummary');
    const challengesSummaryElement = document.getElementById('challengesSummary');
    const todosSummaryElement = document.getElementById('todosSummary');

    let currentDate = new Date();
    let selectedDate = new Date();

    function generateCalendar(year, month) {
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDay = firstDay.getDay();

        currentMonthElement.textContent = `${firstDay.toLocaleString('default', { month: 'long' })} ${year}`;

        let date = 1;
        let calendarHTML = '';

        for (let i = 0; i < 6; i++) {
            let row = '<tr>';
            for (let j = 0; j < 7; j++) {
                if (i === 0 && j < startingDay) {
                    row += '<td></td>';
                } else if (date > daysInMonth) {
                    row += '<td></td>';
                } else {
                    const isToday = date === currentDate.getDate() && month === currentDate.getMonth() && year === currentDate.getFullYear();
                    const isSelected = date === selectedDate.getDate() && month === selectedDate.getMonth() && year === selectedDate.getFullYear();
                    const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
                    const { hasThought, hasChallenge, hasTodo } = checkContentForDate(dateString);
                    const cellClass = `${isToday ? 'today' : ''} ${hasThought ? 'has-thought' : ''} ${hasChallenge ? 'has-challenge' : ''} ${hasTodo ? 'has-todo' : ''} ${isSelected ? 'selected' : ''}`;
                    row += `<td class="${cellClass}" data-date="${dateString}">${date}</td>`;
                    date++;
                }
            }
            row += '</tr>';
            calendarHTML += row;
            if (date > daysInMonth) {
                break;
            }
        }

        calendarBody.innerHTML = calendarHTML;

        // Add click event to calendar cells
        document.querySelectorAll('#calendarBody td[data-date]').forEach(cell => {
            cell.addEventListener('click', function() {
                const date = this.getAttribute('data-date');
                selectedDate = new Date(date);
                updateCalendar();
                showDayDetails(date);
            });
        });
    }

    function checkContentForDate(dateString) {
        const thoughts = JSON.parse(localStorage.getItem('thoughts')) || [];
        const challenges = JSON.parse(localStorage.getItem('challenges')) || {};
        const todos = JSON.parse(localStorage.getItem('todos')) || {};
        return {
            hasThought: thoughts.some(thought => thought.date === dateString),
            hasChallenge: challenges[dateString] !== undefined,
            hasTodo: todos[dateString] !== undefined && todos[dateString].length > 0
        };
    }

    function showDayDetails(dateString) {
        selectedDateElement.textContent = new Date(dateString).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

        // Show thoughts
        const thoughts = JSON.parse(localStorage.getItem('thoughts')) || [];
        const dayThoughts = thoughts.filter(thought => thought.date === dateString);
        thoughtsSummaryElement.innerHTML = `<h4>Thoughts</h4>`;
        if (dayThoughts.length > 0) {
            thoughtsSummaryElement.innerHTML += dayThoughts.map(thought => `<p>${thought.text}</p>`).join('');
        } else {
            thoughtsSummaryElement.innerHTML += `<p>No thoughts for this day.</p>`;
        }

        // Show challenges
        const challenges = JSON.parse(localStorage.getItem('challenges')) || {};
        const dayChallenge = challenges[dateString];
        challengesSummaryElement.innerHTML = `<h4>Challenges</h4>`;
        if (dayChallenge) {
            challengesSummaryElement.innerHTML += `<ul>`;
            for (const [key, value] of Object.entries(dayChallenge)) {
                challengesSummaryElement.innerHTML += `<li>${key}: ${value ? 'Completed' : 'Not completed'}</li>`;
            }
            challengesSummaryElement.innerHTML += `</ul>`;
        } else {
            challengesSummaryElement.innerHTML += `<p>No challenges for this day.</p>`;
        }

        // Show todos
        const todos = JSON.parse(localStorage.getItem('todos')) || {};
        const dayTodos = todos[dateString] || [];
        todosSummaryElement.innerHTML = `<h4>To-Do List</h4>`;
        if (dayTodos.length > 0) {
            todosSummaryElement.innerHTML += `<ul>`;
            dayTodos.forEach(todo => {
                todosSummaryElement.innerHTML += `<li>${todo.text} - ${todo.completed ? 'Completed' : 'Not completed'}</li>`;
            });
            todosSummaryElement.innerHTML += `</ul>`;
        } else {
            todosSummaryElement.innerHTML += `<p>No to-do items for this day.</p>`;
        }
    }

    function updateCalendar() {
        generateCalendar(selectedDate.getFullYear(), selectedDate.getMonth());
    }

    prevMonthButton.addEventListener('click', function() {
        selectedDate.setMonth(selectedDate.getMonth() - 1);
        updateCalendar();
    });

    nextMonthButton.addEventListener('click', function() {
        selectedDate.setMonth(selectedDate.getMonth() + 1);
        updateCalendar();
    });

    updateCalendar();
    showDayDetails(selectedDate.toISOString().split('T')[0]);
});
