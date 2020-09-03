const Express = require("express");
const Helmet = require("helmet");
const Mongoose = require("mongoose");
const Session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(Session);
const Path = require("path");
const Dotenv = require("dotenv-safe");
const BodyParser = require("body-parser");
const Cors = require("cors");
const AuthArmor = require("autharmor-node-express");

// Models
const User = require("./models/user");
const Invite = require("./models/invite");

// Initialize .env variables
Dotenv.config({
  path: Path.join(__dirname, "../.env"),
  example: Path.join(__dirname, "../.env.example")
});

const app = Express();
const store = new MongoDBStore({
  uri: process.env.MONGODB_URI,
  collection: "sessions"
});

app.use(BodyParser.json());

app.use(
  Session({
    secret: process.env.SECRET,
    cookie: {
      maxAge: parseInt(process.env.SESSION_AGE, 10) // 1 week
    },
    store,
    resave: true,
    saveUninitialized: true
  })
);

app.use(
  Cors({
    origin: [
      "http://localhost:3000",
      "https://autharmor-sample-react.herokuapp.com"
    ],
    credentials: true
  })
);

// Setup AuthArmor Express SDK
const authArmorSDK = AuthArmor(app, {
  clientId: process.env.AUTHARMOR_CLIENT_ID,
  clientSecret: process.env.AUTHARMOR_CLIENT_SECRET,
  getUser: async session => {
    const user = await User.findOne({ username: session.user.username });

    return { username: user.username, avatar: user.avatar };
  }
});

authArmorSDK.validate("inviteRequest", async body => {
  const user = await User.findOne({ username: body.nickname.toLowerCase() });

  if (user) {
    throw {
      code: 400,
      message: "Username is already taken"
    };
  }

  return true;
});

authArmorSDK.validate("authRequest", async body => {
  const user = await User.findOne({ username: body.nickname.toLowerCase() });

  if (!user) {
    throw {
      code: 404,
      message: "User doesn't exist"
    };
  }

  console.log(user);

  return {
    nickname: user.autharmor.nickname,
    metadata: { username: user.username.toLowerCase() }
  };
});

authArmorSDK.on("inviteGenerated", async data => {
  console.log(data);
  await Invite.create({
    nickname: data.invite.nickname,
    username: data.nickname.toLowerCase(),
    expiresAt: data.invite.date_expires
  });
  return;
});

authArmorSDK.on("inviteConfirmSuccess", async (data, session) => {
  console.log("Invite confirm success!", data);
  const invite = await Invite.findOne({ nickname: data.nickname });
  const user = await User.create({
    username: invite.username,
    autharmor: {
      nickname: invite.nickname
    }
  });
  session.save({
    username: user.username,
    autharmor: user.autharmor
  });
});

authArmorSDK.on("authSuccess", async (data, session) => {
  const user = await User.findOne({ username: data.metadata.nickname });

  session.save({
    username: user.username,
    autharmor: user.autharmor
  });
});

// Connect to MongoDB
Mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.listen(process.env.PORT);

console.log("------------------------------");
console.log(`---- Backend initialized! ----`);
console.log("------------------------------");
console.log(`Listening on port ${process.env.PORT}!`);
