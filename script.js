// ==========================================
// DEVTasks
// Sistema de gerenciamento de tarefas
// ==========================================


// ==========================================
// VARIÁVEIS
// ==========================================

let tasks = JSON.parse(localStorage.getItem("devtasks")) || [];

let currentFilter = "todas";


// ==========================================
// ELEMENTOS DO HTML
// ==========================================

const taskForm = document.getElementById("taskForm");

const taskTitle = document.getElementById("taskTitle");

const taskPriority = document.getElementById("taskPriority");

const taskList = document.getElementById("taskList");

const emptyMessage = document.getElementById("emptyMessage");

const totalTasks = document.getElementById("totalTasks");

const pendingTasks = document.getElementById("pendingTasks");

const completedTasks = document.getElementById("completedTasks");

const filterButtons = document.querySelectorAll(".filter-btn");


// ==========================================
// ADICIONAR TAREFA
// ==========================================

taskForm.addEventListener("submit", function(event) {

    event.preventDefault();


    const title = taskTitle.value.trim();

    const priority = taskPriority.value;


    if (title === "") {

        alert("Digite uma tarefa.");

        return;
    }


    const newTask = {

        id: Date.now(),

        title: title,

        priority: priority,

        completed: false

    };


    tasks.push(newTask);


    saveTasks();

    renderTasks();


    taskForm.reset();

});


// ==========================================
// SALVAR TAREFAS
// ==========================================

function saveTasks() {

    localStorage.setItem(
        "devtasks",
        JSON.stringify(tasks)
    );

}


// ==========================================
// MOSTRAR TAREFAS
// ==========================================

function renderTasks() {

    taskList.innerHTML = "";


    const filteredTasks = tasks.filter(function(task) {

        if (currentFilter === "pendentes") {

            return !task.completed;

        }


        if (currentFilter === "concluidas") {

            return task.completed;

        }


        return true;

    });


    if (filteredTasks.length === 0) {

        emptyMessage.style.display = "block";

    } else {

        emptyMessage.style.display = "none";

    }


    filteredTasks.forEach(function(task) {

        const taskElement = createTaskElement(task);

        taskList.appendChild(taskElement);

    });


    updateStatistics();

}


// ==========================================
// CRIAR ELEMENTO DA TAREFA
// ==========================================

function createTaskElement(task) {

    const article = document.createElement("article");


    article.classList.add("task");


    if (task.completed) {

        article.classList.add("completed");

    }


    article.innerHTML = `

        <div class="task-info">

            <input
                type="checkbox"
                class="task-checkbox"
                ${task.completed ? "checked" : ""}
            >

            <span class="task-title">
                ${task.title}
            </span>

            <span class="priority priority-${task.priority}">
                ${formatPriority(task.priority)}
            </span>

        </div>


        <div class="task-actions">

            <button class="btn-delete">
                Excluir
            </button>

        </div>

    `;


    const checkbox =
        article.querySelector(".task-checkbox");


    checkbox.addEventListener("change", function() {

        toggleTask(task.id);

    });


    const deleteButton =
        article.querySelector(".btn-delete");


    deleteButton.addEventListener("click", function() {

        deleteTask(task.id);

    });


    return article;

}


// ==========================================
// FORMATAR PRIORIDADE
// ==========================================

function formatPriority(priority) {

    if (priority === "baixa") {

        return "Baixa";

    }


    if (priority === "media") {

        return "Média";

    }


    if (priority === "alta") {

        return "Alta";

    }


    return priority;

}


// ==========================================
// CONCLUIR / REABRIR TAREFA
// ==========================================

function toggleTask(id) {

    tasks = tasks.map(function(task) {

        if (task.id === id) {

            return {

                ...task,

                completed: !task.completed

            };

        }


        return task;

    });


    saveTasks();

    renderTasks();

}


// ==========================================
// EXCLUIR TAREFA
// ==========================================

function deleteTask(id) {

    const confirmation =
        confirm("Deseja realmente excluir esta tarefa?");


    if (!confirmation) {

        return;

    }


    tasks = tasks.filter(function(task) {

        return task.id !== id;

    });


    saveTasks();

    renderTasks();

}


// ==========================================
// ESTATÍSTICAS
// ==========================================

function updateStatistics() {

    const total = tasks.length;


    const completed =
        tasks.filter(function(task) {

            return task.completed;

        }).length;


    const pending =
        tasks.filter(function(task) {

            return !task.completed;

        }).length;


    totalTasks.textContent = total;

    pendingTasks.textContent = pending;

    completedTasks.textContent = completed;

}


// ==========================================
// FILTROS
// ==========================================

filterButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        currentFilter =
            button.dataset.filter;


        filterButtons.forEach(function(btn) {

            btn.classList.remove("active");

        });


        button.classList.add("active");


        renderTasks();

    });

});


// ==========================================
// INICIALIZAÇÃO
// ==========================================

renderTasks();
