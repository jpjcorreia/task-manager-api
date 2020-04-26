const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/user");
const {userOneId, userOne, setupDatabase} = require("./fixtures/db");

beforeEach(setupDatabase);

test("Should signup a new user", async () => {
  const response = await request(app)
    .post("/users")
    .send({
      name: "Joao",
      password: "821749812749ad",
      email: "jpcorreia@outlook.pt",
    })
    .expect(201);

  //Assert user is in database

  const user = await User.findById(response.body.user._id);
  expect(user).not.toBeNull();

  // Assert response

  expect(response.body).toMatchObject({
    user: {
      name: "Joao",
      email: "jpcorreia@outlook.pt",
    },
    token: user.tokens[0].token,
  });
});

test("Should login existing user", async () => {
  const response = await request(app)
    .post("/users/login")
    .send({
      email: userOne.email,
      password: userOne.password,
    })
    .expect(200);

  const user = await User.findById(userOneId);
  expect(user).not.toBeNull();

  expect(response.body.token).toBe(user.tokens[1].token);
});

test("Should not login nonexisting user", async () => {
  await request(app)
    .post("/users/login")
    .send({
      email: userOne.email,
      password: "92387uidhsfi",
    })
    .expect(400);
});

test("Should get profile for user", async () => {
  await request(app)
    .get("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
});

test("Should delete for user", async () => {
  await request(app)
    .delete("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

  const user = User.findById(userOne.tokens[0].token);
  expect(user).toBeNull;
});

test("Should not delete for nonauthenticated user", async () => {
  await request(app)
    .delete("/users/me")
    .send({
      email: userOne.email,
      password: "92387uidhsfi",
    })
    .expect(401);
});

test("Should upload avatar image", async () => {
  await request(app)
    .post("/users/me/avatar")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .attach("avatar", "tests/fixtures/profile-pic.jpg")
    .expect(200);

  const user = await User.findById(userOneId);
  expect(user.avatar).toEqual(expect.any(Buffer)); // compare objects toEqual
});

test("Should update valid user fields", async () => {
  await request(app)
    .patch("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      name: "Joaquim Ze",
    })
    .expect(200);

  const user = await User.findById(userOneId);

  expect(user.name).toBe("Joaquim Ze");
});

test("Should not update invalid user fields", async () => {
    await request(app)
    .patch("/users/me")
    .set("Authorization",`Bearer ${userOne.tokens[0].token}`)
    .send({
        location: "912874598175"
    })
    .expect(400);
});
