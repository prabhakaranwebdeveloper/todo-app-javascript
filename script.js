const todoForm = document.querySelector("form");
const todoInput = document.getElementById("todo-input");
const todoListUL = document.getElementById("todo-list");

let allTodos = getTodos();
updateTodoList();

todoForm.addEventListener("submit", function (e) {
  e.preventDefault();
  addTodo();
});

function addTodo() {
  const todoText = todoInput.value.trim();

  if (todoText.length > 0) {
    const todoObject = {
      text: todoText,
      isCompleted: false,
    };

    allTodos.push(todoObject);
    saveTodos();
    updateTodoList();
    todoInput.value = "";
  }
}

function updateTodoList() {
  todoListUL.innerHTML = "";

  allTodos.forEach((todo, todoIndex) => {
    const todoItem = createTodoItem(todo, todoIndex);
    todoListUL.append(todoItem);
  });
}

function createTodoItem(todo, todoIndex) {
  const todoID = "todo-" + todoIndex;
  const todoLI = document.createElement("li");

  todoLI.className = "todo";
  todoLI.innerHTML = `
    <input type="checkbox" id="${todoID}" />
    <label class="custom-checkbox" for="${todoID}">
      <span class="material-symbols-outlined"> check </span>
    </label>
    <label for="${todoID}" class="todo-text">${todo.text}</label>
    <button class="delete-button">
      <span class="material-symbols-outlined"> delete </span>
    </button>
  `;

  const deleteButton = todoLI.querySelector(".delete-button");
  deleteButton.addEventListener("click", () => {
    deleteTodoItem(todoIndex);
  });

  const checkbox = todoLI.querySelector("input");
  checkbox.checked = todo.isCompleted;

  checkbox.addEventListener("change", () => {
    allTodos[todoIndex].isCompleted = checkbox.checked;
    saveTodos();
  });

  return todoLI;
}

function deleteTodoItem(todoIndex) {
  allTodos = allTodos.filter((_, i) => i !== todoIndex);
  saveTodos();
  updateTodoList();
}

function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(allTodos));
}

function getTodos() {
  const todos = localStorage.getItem("todos") || "[]";
  return JSON.parse(todos);
}