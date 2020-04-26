const request = require("supertest");
const app = require("../src/app");
const Task = require("../src/models/task");
const {userOneId, userOne, setupDatabase, userTwo, taskOne} = require("./fixtures/db");

beforeEach(setupDatabase);


test("Should create task for user", async () => {
    const response = await request(app)
    .post("/tasks")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
        description: "Test task",
        completed: false
    })
    .expect(201);

    const task = await Task.findById(response.body._id);

    expect(task).not.toBeNull();
    expect(task.completed).toEqual(false);
});

test("Should return tasks for user one", async () => {
    const response = await request(app)
    .get("/tasks")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .expect(200);

    expect(response.body.length).toEqual(2);
});

test("Should not delete other owner task", async () => {
    await request(app)
    .delete(`/tasks/`)
    .set("Authorization", `Bearer ${userTwo.tokens[0].token}`)
    .send({
        _id: taskOne._id,
        owner: userOneId
    })
    .expect(404);

    const task = await Task.findById(taskOne._id);
    expect(task).not.toBeNull();
});
