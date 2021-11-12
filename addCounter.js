
import deepFreeze from './deep-freeze.js'

const addCounter = (list) => {
    return [...list, 0];
}
const testAddCounter = () => {
    const listBefore = []
    const listAfter = [0]

    deepFreeze(listBefore)

    expect(
        addCounter(listBefore)
    ).toEqual(listAfter)

}

const removeCounter = (list, i) => {

    return [
        ...list.slice(0,i),
        ...list.slice(i+1)
    ]
}
const testRemoveCounter = () => {
    const listBefore = [0]
    const listAfter = []
    
    deepFreeze(listBefore)
    expect(
        removeCounter(listBefore, 0)
    ).toEqual(listAfter)
    
}

const incrementCounter = (list, index) => {
    return [
        ...list.slice(0,index),
        list[index] + 1,
        ...list.slice(index+1)
    ]
}
const testIncrementCounter = () => {
    const listBefore = [0, 3, 5]
    const listAfter = [0, 4, 5]

    deepFreeze(listBefore)

    expect(
        incrementCounter(listBefore, 1)
    ).toEqual(listAfter)
}


testAddCounter()
testRemoveCounter()
testIncrementCounter()

console.log(`addCounter : all tests passed`)
