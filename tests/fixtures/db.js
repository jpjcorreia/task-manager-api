const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../../src/models/user");
const Task = require("../../src/models/task")

const userOneId = new mongoose.Types.ObjectId();
const userOne = {
  _id: userOneId,
  name: "testuser",
  email: "testuser@example.com",
  password: "1234567@",
  tokens: [
    {
      token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET),
    },
  ],
};

const userTwoId = new mongoose.Types.ObjectId();
const userTwo = {
  _id: userTwoId,
  name: "testuser2",
  email: "testuser2@example.com",
  password: "1234567@2",
  tokens: [
    {
      token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET),
    },
  ],
};

const taskOne = {
    _id: new mongoose.Types.ObjectId(),
    description: "Test task one",
    completed: false,
    owner: userOne._id
}

const taskTwo = {
    _id: new mongoose.Types.ObjectId(),
    description: "Test task two",
    completed: true,
    owner: userOne._id
}

const taskThree = {
    _id: new mongoose.Types.ObjectId(),
    description: "Test task three",
    completed: true,
    owner: userTwo._id
}

const setupDatabase = async () => {
    await User.deleteMany();
    await Task.deleteMany();
    await User(userOne).save();
    await User(userTwo).save();
    await Task(taskOne).save();
    await Task(taskTwo).save();
    await Task(taskThree).save();
}

module.exports = {
    userOneId,
    userOne,
    userTwo,
    userTwoId,
    taskOne,
    setupDatabase
}