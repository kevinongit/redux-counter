import deepFreeze from "./deep-freeze.js";

let _id = 0;

const todo = (state, action) => {
    switch (action.type) {
        case 'ADD_TODO':
            return {
                id: action.id,
                task: action.task,
                completed: false,
            }
        case 'TOGGLE_TODO':
            if (state.id !== action.id) 
                return state;
            return {
                ...state,
                completed: !state.completed,
            }
        default: 
            return state;
    }
}
    
const todos = (state = [], action) => {
    switch (action.type) {
        case 'ADD_TODO':
            return [
                ...state,
                todo(undefined, action)
            ]
        case 'TOGGLE_TODO':
            return state.map(t => todo(t, action))
        default:
            return state;

    }
}
const testAddTodos = () => {
    let beforeTodo = []
    let afterTodo = [{
        id: 0,
        task: 'hey',
        completed: false
    }]

    deepFreeze(beforeTodo)
    expect(
        todos(beforeTodo, {
            id: 0,
            type: 'ADD_TODO', 
            task: 'hey'
        })
    ).toEqual(afterTodo)
}
const testToggleTodos = () => {
    let beforeTodo = [{
        id: 0,
        task: 'hey',
        completed: false,
    }]
    let afterTodo = [{
        id: 0,
        task: 'hey',
        completed: true,
    }]

    deepFreeze(beforeTodo)
    expect(
        todos(beforeTodo, {
            type: 'TOGGLE_TODO', 
            id: 0,
        })
    ).toEqual(afterTodo)
}


const visibilityFilter = (state = 'SHOW_ALL', action) => {
    switch (action.type) {
        case 'SET_VISIBILITY_FILTER':
            return action.filter;
        default:
            return state;
    }
}

const { combineReducers } = Redux

// const combineReducers = (reducers) => {
//     return (state={}, action) => {
//         return Object.keys(reducers).reduce(
//             (nextState, key) => {
//                 nextState[key] = reducers[key](state[key], action)
//                 return nextState
//             },
//             {}
//         )
//     }
// }

const todoApp = combineReducers({
    todos, 
    visibilityFilter
})



testAddTodos()
testToggleTodos()

console.log('todoapp: all tests passed!')

const { createStore } = Redux

const store = createStore(todoApp)

const { Component } = React;

const FilterLink = ({filter, children}) => {
    return (
        <a 
            href='#'
            onClick={(e) => {
                e.preventDefault();
                store.dispatch({
                    type: 'SET_VISIBILITY_FILTER',
                    filter,
                })
            }}
        >
            {children}
        </a>
    )
}

const getVisibleTodo = (todos, filter) => {
    switch (filter) {
        case 'SHOW_COMPLETED':
            return todos.filter(t => t.completed)
        case 'SHOW_ACTIVE':
            return todos.filter(t => !t.completed)
        case 'SHOW_ALL':
        default:
            return todos
    }
}

class TodoApp extends Component {
    render() {
        const todos = getVisibleTodo(this.props.todos, this.props.visibilityFilter);

        return (
            <div>
                <input ref={node => this.input = node} />
                <button onClick={
                    () => {
                        store.dispatch({id: _id++, type: 'ADD_TODO', task: this.input.value })
                        this.input.value = ''
                    }
                }>
                    Add Todo
                </button>
                <p></p>
                {todos.map(todo => {
                    return (
                        <li 
                            key={todo.id}
                            onClick={() => store.dispatch({type: 'TOGGLE_TODO', id: todo.id})}
                            style={{
                                textDecoration: todo.completed ? 'line-through' : 'none',
                            }}
                        >
                            {todo.task}
                        </li>
                    )
                })}
                <p>
                    Filter: 
                    {' '}
                    <FilterLink filter="SHOW_ALL">ALL</FilterLink>
                    {' '}
                    <FilterLink filter="SHOW_ACTIVE">ACTIVE</FilterLink>
                    {' '}
                    <FilterLink filter="SHOW_COMPLETED">COMPLETED</FilterLink>

                </p>

            </div>
        )
    }
}

const render = () => {
    ReactDOM.render(
        <TodoApp 
            {...store.getState()}
        />,
        document.getElementById('root')
    )
}


store.subscribe(render)
render()
