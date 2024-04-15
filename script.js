document.addEventListener('DOMContentLoaded', function () {
    const taskInput = document.getElementById("taskInput");
    taskInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    // Load tasks from localStorage when the page is loaded
    loadTasks();
});

let draggedItem = null;

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    draggedItem = ev.target;
}

function drop(ev) {
    ev.preventDefault();
    if (ev.target.tagName === 'LI') {
        ev.target.parentNode.insertBefore(draggedItem, ev.target.nextSibling);
    } else {
        ev.target.appendChild(draggedItem);
    }
}

function addTask() {
    const input = document.getElementById("taskInput");
    const task = input.value.trim(); // Trim whitespace

    if (task === "") {
        alert("Please enter a task!");
        return;
    }

    const ul = document.getElementById("taskList");
    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between align-items-center";
    li.draggable = true;
    li.id = "task-" + Date.now(); // Unique ID for the task
    li.addEventListener('dragstart', drag);

    const taskText = document.createElement("span");
    taskText.textContent = task;
    li.appendChild(taskText);

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "btn btn-sm btn-danger delete-btn ml-2";
    deleteBtn.appendChild(document.createTextNode("Delete"));
    deleteBtn.onclick = function() {
        const taskId = this.parentElement.id;
        const taskElement = document.getElementById(taskId);
        taskElement.remove();
        saveTasks(); // Save tasks after deleting a task
    };

    li.appendChild(deleteBtn);

    const creationDate = document.createElement("small");
    creationDate.textContent = new Date().toLocaleDateString();
    li.appendChild(creationDate);

    ul.appendChild(li);

    input.value = "";

    saveTasks(); // Save tasks after adding a new task
}

function saveTasks() {
    const tasks = [];
    const taskElements = document.querySelectorAll('.list-group-item');
    taskElements.forEach(function(taskElement) {
        const task = {
            id: taskElement.id,
            text: taskElement.querySelector('span').textContent,
            creationDate: taskElement.querySelector('small').textContent
        };
        tasks.push(task);
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
        const tasks = JSON.parse(savedTasks);
        tasks.forEach(function(task) {
            const ul = document.getElementById('taskList');
            const li = document.createElement('li');
            li.className = 'list-group-item d-flex justify-content-between align-items-center';
            li.id = task.id;

            const taskText = document.createElement('span');
            taskText.textContent = task.text;
            li.appendChild(taskText);

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'btn btn-sm btn-danger delete-btn ml-2';
            deleteBtn.appendChild(document.createTextNode('Delete'));
            deleteBtn.onclick = function() {
                const taskId = this.parentElement.id;
                const taskElement = document.getElementById(taskId);
                taskElement.remove();
                saveTasks(); // Save tasks after deleting a task
            };
            li.appendChild(deleteBtn);

            const creationDate = document.createElement('small');
            creationDate.textContent = task.creationDate;
            li.appendChild(creationDate);

            ul.appendChild(li);
        });
    }
}
