const API = "http://localhost:5000/todos";
const todoForm=document.querySelector("form");
const todoInput=document.getElementById("todo-input");
const todoListUL=document.getElementById("todo-list");
const filterButtons=document.querySelectorAll(".filter-btn");
const toast=document.getElementById("toast");

const prevBtn=document.getElementById("prev-btn");
const nextBtn=document.getElementById("next-btn");
const pageNumbers=document.getElementById("page-numbers");

let allTodos = [];

async function loadTodos(){
 const res = await fetch(API);
 allTodos = await res.json();
 updateTodoList();
}

loadTodos();
let currentFilter="all";
let currentPage=1;
const ITEMS_PER_PAGE=10;

updateTodoList();

todoForm.addEventListener("submit",(e)=>{
 e.preventDefault();
 addTodo();
});

filterButtons.forEach(btn=>{
 btn.onclick=()=>{

  // ⭐ remove active from all buttons
  filterButtons.forEach(b=>b.classList.remove("active"));

  // ⭐ add active only to clicked button
  btn.classList.add("active");

  currentFilter = btn.dataset.filter;
  currentPage = 1;
  updateTodoList();
 };
});

prevBtn.onclick=()=>{currentPage--;updateTodoList();}
nextBtn.onclick=()=>{currentPage++;updateTodoList();}

async function addTodo(){
 const text = todoInput.value.trim();
 if(!text) return;

 const res = await fetch(API,{
  method:"POST",
  headers:{ "Content-Type":"application/json" },
  body: JSON.stringify({ text })
 });

 const data = await res.json();

 // ⭐ NEW PART — HANDLE BACKEND ERROR
 if(!res.ok){
  showToast(data.message || "Error");
  return;
 }

 allTodos.unshift(data);

 updateTodoList();
 todoInput.value="";
}

function updateTodoList(){
 todoListUL.innerHTML="";
 let filtered=allTodos;

 if(currentFilter==="completed")filtered=allTodos.filter(t=>t.isCompleted);
 if(currentFilter==="pending")filtered=allTodos.filter(t=>!t.isCompleted);

 const totalPages=Math.ceil(filtered.length/ITEMS_PER_PAGE);
 if(currentPage>totalPages)currentPage=totalPages||1;

 const start=(currentPage-1)*ITEMS_PER_PAGE;
 const paginated=filtered.slice(start,start+ITEMS_PER_PAGE);

 paginated.forEach((todo,index)=>{
  const realIndex=allTodos.indexOf(todo);
  todoListUL.append(createTodoItem(todo,realIndex));
 });

 renderPages(totalPages);
}

function renderPages(totalPages){
 pageNumbers.innerHTML="";
 for(let i=1;i<=totalPages;i++){
  const btn=document.createElement("button");
  btn.textContent=i;
  btn.className="page-btn";
  if(i===currentPage)btn.classList.add("active");
  btn.onclick=()=>{currentPage=i;updateTodoList();}
  pageNumbers.append(btn);
 }
}

function createTodoItem(todo,todoIndex){
 const id="todo-"+todoIndex;
 const li=document.createElement("li");
 li.className="todo";

 li.innerHTML=`
 <input type="checkbox" id="${id}">
 <label class="custom-checkbox" for="${id}">
 <span class="material-symbols-outlined">check</span></label>
 <label class="todo-text">${todo.text}</label>
 <button class="edit-button"><span class="material-symbols-outlined">edit_square</span></button>
 <button class="delete-button"><span class="material-symbols-outlined">delete</span></button>
 `;

 const checkbox=li.querySelector("input");
 checkbox.checked=todo.isCompleted;

checkbox.onchange = async ()=>{
 allTodos[todoIndex].isCompleted = checkbox.checked;

 await fetch(`${API}/${todo.id}`,{
  method:"PUT",
  headers:{ "Content-Type":"application/json" },
  body: JSON.stringify({ isCompleted: checkbox.checked })
 });
};

li.querySelector(".delete-button").onclick = async ()=>{
 await fetch(`${API}/${todo.id}`,{
  method:"DELETE"
 });

 allTodos = allTodos.filter(t=>t.id !== todo.id);
 updateTodoList();
};

 const editBtn=li.querySelector(".edit-button");
 const label=li.querySelector(".todo-text");

 editBtn.onclick=()=>{
  startEditing(label,todoIndex);
 };

 return li;
}

function startEditing(labelElement,todoIndex){
 const li=labelElement.closest(".todo");

 const input=document.createElement("input");
 input.value=allTodos[todoIndex].text;
 input.className="edit-input";

 const saveBtn=document.createElement("button");
 saveBtn.className="save-button";
 saveBtn.innerHTML='<span class="material-symbols-outlined">check</span>';

 const cancelBtn=document.createElement("button");
 cancelBtn.className="cancel-button";
 cancelBtn.innerHTML='<span class="material-symbols-outlined">close</span>';

 labelElement.replaceWith(input);
 const editBtn=li.querySelector(".edit-button");
 editBtn.replaceWith(saveBtn);
 saveBtn.after(cancelBtn);

 saveBtn.onclick=()=>finishEditing(input.value.trim(),todoIndex);
 cancelBtn.onclick=()=>updateTodoList();
}

function finishEditing(newText,todoIndex){
 if(!newText)return;

 if(allTodos.some((t,i)=>t.text.toLowerCase()===newText.toLowerCase()&&i!==todoIndex)){
  showToast("Duplicate not allowed");
  return;
 }

 allTodos[todoIndex].text=newText;
 
 updateTodoList();
}




function showToast(msg){
 toast.textContent=msg;
 toast.classList.add("show");
 setTimeout(()=>toast.classList.remove("show"),2000);
}