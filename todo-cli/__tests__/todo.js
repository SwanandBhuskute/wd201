const todoList = require('../todo');

const { all, markAsComplete, add } = todoList();

describe("Todolist Test Suite" , () => {
    beforeAll(() => {
        add ({
            title: "Test todo",
            completed: false,
            dueDate: new Date().toLocaleDateString("en-CA")
        })
    })
    test("Should add new todo" , () => {
        // expect(all.length).toBe(0);
        const cnt = all.length
        add ({
            title: "Test todo",
            completed: false,
            dueDate: new Date().toLocaleDateString("en-CA")
        })
        expect(all.length).toBe(cnt + 1);
    })

    test("Should mark a todo as complete", () => {
        expect(all[0].completed).toBe(false)
        markAsComplete(0)
        expect(all[0].completed).toBe(true)
    })
})

// describe("Calculator test suite", () => {
//   test("Addition Test Case", () => {
//     expect(1+2).toEqual(3);
//   });
//   test("Subtraction Test Case", () => {
//     expect(1-2).toEqual(1);
//   });
//   test("Multiplication Test Case", () => {
//     expect(4*2).toEqual(8);
//   });
// });