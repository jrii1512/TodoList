import { useState, useEffect, useRef } from "react"
import logo from './logo.svg';
import './App.css';
import TodoList from "./TodoList";
import { v4 as uuidv4 } from 'uuid';

const LOCAL_STORAGE_KEY = 'todoApp.todos';

function App() {
  const [todos, setTodo] = useState([])
  const todoNameRef = useRef()

  
  useEffect(() => {
    const storedTodos = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY))
    if (storedTodos) setTodo(storedTodos)
  }, [])

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(todos))
  }, [todos])


  const addTask = (e) => {
    console.log('Add Todo clicked')
    const name = todoNameRef.current.value;
    console.log('Input boxissa:', name);
    console.log('Todos:', todos);
    if (name === '') { return} else{
      console.log("Asetetaan uusi arvo todos parametriin")  
      setTodo(prev => {
      return [...prev, {id: uuidv4(), name:name, complete:false}]
    })
  }
    todoNameRef.current.value = null;
  }


  const toggleTodo = (id) => {
    console.log('Toggle checkbox')
    const newTodos = [...todos] // Create a copy to which you need to make modifications.
    const todo = newTodos.find(todo => todo.id === id)
    todo.complete = !todo.complete
    setTodo(newTodos)
  }

  const clearTasks = () => {
    const newTodos = todos.filter(todo => !todos.complete)
    setTodo(newTodos)
  }
 
  return (
    <>
      <TodoList key = {uuidv4()} todos={todos} toggleTodo={toggleTodo}/>
      <input ref={todoNameRef} type = "text" />
      <button onClick={addTask}>Add todo</button>
      <button onClick={clearTasks}>Clear completed</button>
      <div>{todos.filter(todo => !todo.complete).length} left to do</div>
    </>
  )
  
}

export default App;
