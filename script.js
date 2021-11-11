
// import expect from 'expect'
// const expect = require('expect')

// import * as expect from 'expect'
import deepFreeze from './deep-freeze.js'

const counter = (state=0, {type}) => {
    switch (type) {
        case 'INCREMENT':
            return state+1;
        case 'DECREMENT':
            return state-1;
        default:
            return state;
    }
}

const testCounter = () => {
    expect(
        counter(undefined,{type: 'INCREMENT'})
    ).toEqual(1);
    expect(
        counter(0,{type: 'SOMETHING'})
    ).toEqual(0);
    expect(
        counter(0, {type: 'INCREMENT'})
    ).toEqual(1);
    expect(
        counter(1, {type: 'INCREMENT'})
    ).toEqual(2);
    expect(
        counter(2, {type: 'DECREMENT'})
    ).toEqual(1);
    expect(
        counter(1, {type: 'DECREMENT'})
    ).toEqual(0);
}

testCounter()
console.log(`all test passed`)

// const { createStore } = Redux
const createStore = (reducer) => {
    let state = reducer(undefined, {});
    const listners = []

    const getState = () => (state);
    const dispatch = (action) => {
        state = reducer(state, action)
        listners.map(listner => {
            listner()
        })
    }
    const subscribe = (listner) => {
        listners.push(listner) 
        return () => {
            listners.filter(l => l !== listner)
        }
    }
    return { getState, dispatch, subscribe };
}

const store = createStore(counter)


const render = () => {
    document.body.innerText = store.getState()
}

store.subscribe(render)
render()

document.body.addEventListener('click', () => {
    store.dispatch({ type: 'INCREMENT' })
})
