//import liraries
import React from 'react';


export default function Todo({todo, toggleTodo}){

const handleTodoClick = () => {
    console.log('clicked')
    toggleTodo(todo.id)
}

    return (
        <div>
            <label>
                <input type = "checkbox" checked={todo.complete} onChange={handleTodoClick}/>
                {todo.name}
            </label>
        </div>
    )
}
