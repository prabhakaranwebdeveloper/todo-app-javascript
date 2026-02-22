// controllers/todoController.js
const Todo = require("../models/todoModel");

exports.getTodos = (req,res)=>{
 Todo.getAllTodos((err,result)=>{
  if(err) return res.status(500).json(err);
  res.json(result);
 });
};

exports.createTodo = (req,res)=>{
 const { text } = req.body;

 Todo.findByText(text,(err,rows)=>{

  if(err) return res.status(500).json(err);

  if(rows && rows.length){
   return res.status(400).json({
    message:"Duplicate not allowed 🚫"
   });
  }

  Todo.addTodo(text,(err,result)=>{
   if(err) return res.status(500).json(err);

   res.json({
    id: result.insertId,
    text,
    isCompleted:false
   });
  });

 });
};

exports.updateTodo = (req,res)=>{
 const { isCompleted } = req.body;

 Todo.updateTodo(req.params.id,isCompleted,(err)=>{
  if(err) return res.status(500).json(err);
  res.sendStatus(200);
 });
};

exports.deleteTodo = (req,res)=>{
 Todo.deleteTodo(req.params.id,(err)=>{
  if(err) return res.status(500).json(err);
  res.sendStatus(200);
 });
};