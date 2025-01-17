import  React, { useState, useEffect, useRef } from 'react';
import TodoCreator from "./FormInput";
import TodoList from "./List";
import { createMuiTheme } from "@material-ui/core/styles";
import axios from "axios";

const theme = createMuiTheme({
    palette: {
        primary: { main: '#000000' },
    },
});

const client = axios.create({
    baseURL: "https://nl4jlozjo6.execute-api.eu-west-2.amazonaws.com/Prod/todos/" 
  });

const Form = () => {

    const [ newTodo, setNewTodo ] = useState('');
    const [ todos, setTodos ] = useState([]);
    const inputRef = useRef();
    const noteRef = useRef({});
    const [ isInputEmpty, setInputEmpty ] = useState(false)


    React.useEffect(() => {
        async function getPost() {
          const response = await client.get("/");
          console.log(response.data)
          setTodos(response.data);
        }
        getPost();
      }, []);

    const handleSubmit = e => {
        e.preventDefault();
        addTodo(newTodo);
        clearInput();
        inputRef.current.focus();
    };

    const preventSubmit = e => {
        if (e.key === 'Enter') {
            e.preventDefault();
        }
    };

    const addTodo = text => {
        if ( text !== '') {
            const newTodos = [...todos, { text }]
            setNewTodo('')
            setTodos(newTodos);
        } else {
            console.log('text', text)
            setInputEmpty(true);
        }
    };

    const removeTodo = inx => {
        const newArr = [...todos]
        newArr.splice(inx, 1)
        setTodos(newArr)
    }

    const completeTodo = inx => {
        const newTodos = [...todos];
        newTodos[inx].isCompleted = !newTodos[inx].isCompleted;
        setTodos(newTodos);
    };

    const editTodo = inx => {
        const newTodos = [...todos];
        newTodos[inx].isEditing = !newTodos[inx].isEditing;
        setTodos(newTodos);
    }

    const saveTodo = (inx) => {
        const newTodos = [...todos];
        newTodos[inx].isEditing = !newTodos[inx].isEditing;
        newTodos[inx].text = noteRef.current[inx].value;
        setTodos(newTodos);
    }

    const clearInput = () => {
        setNewTodo('');
    }

    const setTodo = todo => {
        setInputEmpty(false);
        setNewTodo(todo);
    }

    useEffect(() => {

    }, [todos])

    return (
        <form onSubmit={handleSubmit} className="form">

                <TodoCreator
                    theme={theme}
                    todo={newTodo}
                    setTodo={setTodo}
                    clearInput={clearInput}
                    inputRef={inputRef}
                    isInputEmpty={isInputEmpty}
                    preventSubmit={preventSubmit}
                />

                <TodoList
                    theme={theme}
                    todos={todos}
                    completeTodo={completeTodo}
                    editTodo={editTodo}
                    deleteTodo={removeTodo}
                    saveTodo={saveTodo}
                    noteRef={noteRef}
                    preventSubmit={preventSubmit}
                />
            </form>
    )
}

export default Form;