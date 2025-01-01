document.addEventListener('DOMContentLoaded', function() {
    const todoDate = document.getElementById('todoDate');
    const newTodo = document.getElementById('newTodo');
    const addTodoBtn = document.getElementById('addTodo');
    const todoList = document.getElementById('todoList');
    const saveTodosBtn = document.getElementById('saveTodos');

    // Set default date to today
    todoDate.valueAsDate = new Date();

    // Load saved todos for the current date
    loadTodos();

    todoDate.addEventListener('change', loadTodos);
    addTodoBtn.addEventListener('click', addTodo);
    saveTodosBtn.addEventListener('click', saveTodos);

    function addTodo() {
        const todoText = newTodo.value.trim();
        if (todoText) {
            const li = createTodoElement(todoText, false);
            todoList.appendChild(li);
            newTodo.value = '';
        }
    }

    function createTodoElement(text, completed) {
        const li = document.createElement('li');
        li.className = 'list-group-item todo-item';
        li.innerHTML = `
            <input type="checkbox" class="todo-checkbox" ${completed ? 'checked' : ''}>
            <span class="todo-text">${text}</span>
            <button class="btn btn-outline-danger btn-sm delete-todo">Delete</button>
        `;

        li.querySelector('.delete-todo').addEventListener('click', function() {
            li.remove();
        });

        return li;
    }

    function saveTodos() {
        const date = todoDate.value;
        const todos = [];

        todoList.querySelectorAll('.todo-item').forEach(item => {
            todos.push({
                text: item.querySelector('.todo-text').textContent,
                completed: item.querySelector('.todo-checkbox').checked
            });
        });

        let allTodos = JSON.parse(localStorage.getItem('todos')) || {};
        allTodos[date] = todos;
        localStorage.setItem('todos', JSON.stringify(allTodos));

        alert('To-Do List saved successfully!');
    }

    function loadTodos() {
        const date = todoDate.value;
        const allTodos = JSON.parse(localStorage.getItem('todos')) || {};
        const todos = allTodos[date] || [];

        todoList.innerHTML = '';
        todos.forEach(todo => {
            const li = createTodoElement(todo.text, todo.completed);
            todoList.appendChild(li);
        });
    }
});
