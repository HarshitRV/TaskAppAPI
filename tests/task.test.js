const request = require("supertest");
const app = require("../app");
const User = require("../models/user.model");
const Task = require("../models/task.model");
const { newToken } = require("../utils/jwt");
const mongoose = require("mongoose");

// Test User.
const testUserOneId = new mongoose.Types.ObjectId();
const testUserOne = {
    _id: testUserOneId,
    name: "Brian Larson",
    email: "brianlarson@gmail.com",
    password: "someplainpass",
    tokens: [{
        token: newToken(testUserOneId)
    }]
};
const testUserTwoId = new mongoose.Types.ObjectId();
const testUserTwo = {
    _id: testUserTwoId,
    name: "Jim Halpart",
    email: "annoydwight@gmail.com",
    password: "someplainpass",
    tokens: [{
        token: newToken(testUserTwoId)
    }]
}
const tokenUserOne = `${testUserOne.tokens[0].token}`;
const tokenUserTwo = `${testUserTwo.tokens[0].token}`;
const users = [testUserOne, testUserTwo];

// Test Tasks
const testTaskOne = {
    _id: new mongoose.Types.ObjectId(),
    description: "Task 1",
    owner: testUserOneId 
};
const testTaskTwo = {
    _id:  new mongoose.Types.ObjectId(),
    description: "Task 2",
    owner: testUserOneId 
};
const testTaskThree = {
    _id:  new mongoose.Types.ObjectId(),
    description: "Task 3",
    owner: testUserOneId 
};
const tasks = [testTaskOne, testTaskTwo, testTaskThree];

// This should run before running the tests.
beforeEach(async ()=>{
    await User.deleteMany({});
    await Task.deleteMany({});
    await User.insertMany(users);
    await Task.insertMany(tasks);
});

test("Should create a task for the user", async()=>{
    const response = await request(app)
        .post("/tasks")
        .set('Authorization', 'Bearer ' + tokenUserOne)
        .send({
            description: "Task 4"
        })
        .expect(201);
    
   
    const task = await Task.findById(response.body.data.task._id);
    expect(task.description).not.toBeNull();
    expect(task.completed).toBe(false);
});

test("Should get all tasks for the logged in user", async()=>{
    const response = await request(app)
        .get("/tasks")
        .set('Authorization', 'Bearer ' + tokenUserOne)
        .send()
        .expect(200)

    expect(response.body.data.tasks.length).toBe(3);
});

test("Users can only delete their own tasks", async()=>{
    const response = await request(app)
        .delete(`/tasks/${testTaskOne._id}`)
        .set('Authorization', 'Bearer ' + tokenUserTwo)
        .expect(404)

    const task = await Task.findById(testTaskOne._id);
    expect(task).not.toBeNull();
});