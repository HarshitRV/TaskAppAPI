const request = require("supertest");
const app = require("../app");
const User = require("../models/user.model");
const { newToken } = require("../utils/jwt");
const mongoose = require("mongoose");

// Mocking the nodemailer to prevent actually sending
// sending mails.
jest.mock('../utils/nodemailer')

// Test User.
const testUserId = new mongoose.Types.ObjectId();
const testUser = {
    _id: testUserId,
    name: "John Van Doe",
    email: "lickishor90@gmail.com",
    password: "someplainpass",
    tokens: [{
        token: newToken(testUserId)
    }]
}
const token = `${testUser.tokens[0].token}`

beforeEach(async ()=>{
    await User.deleteMany({});
    await new User(testUser).save();
}, 5000);

test("Should signup a new user", async ()=>{
    const response = await request(app)
        .post("/users")
        .send({
            name: "Harshit",
            email: "vharshitkr360@yahoo.com",
            password: "hrv786"
        })
        .expect(201);

    const user = await User.findById(response.body.data.savedUser._id);

    // Assertion about the changes in the database
    expect(user).not.toBeNull()

    // Assertion about the new user that has been created
    expect(response.body).toMatchObject({
        status: 'success',
        data: {
          savedUser: {
            name: 'Harshit',
            email: 'vharshitkr360@yahoo.com',
          },
          token: user.tokens[0].token
        }
    })

    // Assertion that the saved password is not plain test
    expect(user.password).not.toBe('hrv786')
    
}, 5000);

test("Should login the existing user", async()=>{
    const response = await request(app)
        .post("/users/login")
        .send({
            email: testUser.email,
            password: testUser.password
        })
        .expect(200);
    
    const user = await User.findOne({ email: testUser.email });
    
    expect(response.body.data.token).toBe(user.tokens[1].token);
});

test("Should not login the user with incorrect credentials", async ()=> {
    await request(app)
        .post("/users/login")
        .send({
            email: testUser.email,
            password: "34556"
        })
        .expect(400);
});

test("Should get the logged in user profile", async ()=>{
    await request(app)
        .get("/users/me")
        .set('Authorization', 'Bearer ' + token) 
        .send()
        .expect(200);
});

test("Should not get profile for unauthenticated user", async ()=>{
    await request(app)
        .get("/users/me")
        .send()
        .expect(400)
});

test("Should delete account for authenticated user", async()=>{
    await request(app)
        .delete("/users/me")
        .set('Authorization', 'Bearer ' + token) 
        .expect(200)

    const user = await User.findOne({email: testUser.email});
    expect(user).toBeNull();

}, 5000);

test("Should not delete account for unauthenticated user", async()=>{
    await request(app)
        .delete("/users/me")
        .expect(400)
});

test("Should upload avatar image", async()=>{
    await request(app)
        .post("/users/me/avatar")
        .set('Authorization', 'Bearer ' + token) 
        //   Field name   File path relative to tests
        .attach("avatar", "tests/fixtures/profile-pic.jpg")
        .expect(200)

    const user = await User.findOne({email: testUser.email});

    expect(user.avatar).toEqual(expect.any(Buffer))
});

test("Should update valid user fields", async()=>{
    const response = await request(app)
        .patch("/users/me")
        .set('Authorization', 'Bearer ' + token) 
        .send({
            name: "John Doe"
        })
        .expect(200)

    expect(response.body.data.user.name).toBe("John Doe")
});

test("Should not update invalid user fields", async()=>{
    const response = await request(app)
        .patch("/users/me")
        .set('Authorization', 'Bearer ' + token) 
        .send({
            name: "John Doe",
            location: "IND"
        })
        .expect(400)
});