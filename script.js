const todos = document.getElementById("todos");
const todoForm = document.getElementById("todo-form");
const todoInput = document.getElementById("todo-input");
const themeBtn = document.querySelector(".theme-btn");

let onDarkMode = false;

function onSubmit(e) {
  e.preventDefault();

  handleAddTodo();
}

function handleAddTodo() {
  const todo = todoInput.value;

  if (todo !== "") {
    createTodo(todo);
    addTodoOnStorage(todo);
  }

  todoInput.value = "";
}

function createTodo(todo, completed) {
  // Delete edited item first
  const todoItems = document.querySelectorAll("li");

  todoItems.forEach((todoItem) => {
    if (todoItem.classList.contains("editing")) {
      deleteTodo(todoItem);
    }
  });

  // Create element
  const li = document.createElement("li");
  li.className =
    "todo flex items-center justify-between gap-2 w-full  p-4 bg-white dark:bg-[#2a2a3b] dark:text-white text-xl border-t-1 border-[#e5e5e5] dark:border-[#3a3a4a] cursor-pointer list-none";
  if (completed) {
    li.classList.add("completed");
  }
  li.innerHTML = `
  <span>${todo}</span>
  <div class="flex items-center justify-center gap-2">
    <button class="edit-btn cursor-pointer group" >
        <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#5f6368"><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z" class="dark:fill-[#ccc] group-hover:fill-black dark:group-hover:fill-white transition-all duration-200"/></svg>
    </button>
    <button class="delete-btn cursor-pointer group" >
        <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#5f6368"><path d="M312-144q-29.7 0-50.85-21.15Q240-186.3 240-216v-480h-48v-72h192v-48h192v48h192v72h-48v479.57Q720-186 698.85-165T648-144H312Zm336-552H312v480h336v-480ZM384-288h72v-336h-72v336Zm120 0h72v-336h-72v336ZM312-696v480-480Z"class="dark:fill-[#ccc] group-hover:fill-black dark:group-hover:fill-white transition-all duration-200"/></svg>
        
    </button>
  </div>
  `;

  todos.appendChild(li);
}

function addTodoOnStorage(todo) {
  const todoFromStorage = getTodoFromStorage();
  let completed = false;

  todoFromStorage.push({ todo, completed });

  localStorage.setItem("todos", JSON.stringify(todoFromStorage));
}

function getTodoFromStorage() {
  let todoFromStorage;

  if (localStorage.getItem("todos") === null) {
    todoFromStorage = [];
  } else {
    todoFromStorage = JSON.parse(localStorage.getItem("todos"));
  }

  return todoFromStorage;
}

function onClick(e) {
  const li = e.target.closest(".todo");
  const editBtn = e.target.closest(".edit-btn");
  const deleteBtn = e.target.closest(".delete-btn");

  if (editBtn) {
    const span = editBtn.parentElement.previousElementSibling;

    li.classList.add("editing");

    todoInput.focus();
    todoInput.value = span.innerHTML;
    span.classList.add("italic", "text-[#b383e2]/40", "dark:text-[#b383e2]/30");

    editBtn.nextElementSibling.remove();
    editBtn.remove();
  } else if (deleteBtn) {
    deleteTodo(deleteBtn.parentElement.parentElement);
  } else if (li) {
    li.classList.toggle("completed");

    let todoFromStorage = getTodoFromStorage();

    if (e.target.closest(".completed")) {
      todoFromStorage.forEach((todo) => {
        if (todo.todo === li.firstElementChild.innerHTML) {
          todo.completed = true;
        }
      });
    } else {
      todoFromStorage.forEach((todo) => {
        if (todo.todo === li.firstElementChild.innerHTML) {
          todo.completed = false;
        }
      });
    }

    localStorage.setItem("todos", JSON.stringify(todoFromStorage));
  }
}

function deleteTodo(item) {
  let todoFromStorage = getTodoFromStorage();

  item.remove();

  todoFromStorage = todoFromStorage.filter(
    (todo) => todo.todo !== item.firstElementChild.innerHTML
  );

  localStorage.setItem("todos", JSON.stringify(todoFromStorage));
}

function saveEdit(e) {
  if (e.target === document.body) {
    handleAddTodo();
  }
}

function addTodoOnDOM() {
  const todoFromStorage = getTodoFromStorage();

  todoFromStorage.forEach((todo) => {
    createTodo(todo.todo, todo.completed);
  });
}

function toggleTheme() {
  onDarkMode = !onDarkMode;

  themeBtn.classList.toggle("dark", onDarkMode);
  document.documentElement.classList.toggle("dark", onDarkMode);

  localStorage.setItem("onDarkMode", JSON.stringify(onDarkMode));
}

function setTheme() {
  if (JSON.parse(localStorage.getItem("onDarkMode")) === true) {
    onDarkMode = !onDarkMode;

    document.documentElement.classList.add("dark");
    themeBtn.classList.add("dark");
  }
}

function init() {
  addTodoOnDOM();
  setTheme();
}

document.addEventListener("DOMContentLoaded", init);
todoForm.addEventListener("submit", onSubmit);
todos.addEventListener("click", onClick);
window.addEventListener("click", saveEdit);
themeBtn.addEventListener("click", toggleTheme);
