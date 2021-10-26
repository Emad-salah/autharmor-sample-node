const Http = require("http");
const Express = require("express");
const { AuthArmorSDK } = require("autharmor-node-sdk");
const Dotenv = require("dotenv-safe");
const Cors = require("cors");

// Setup Env variables
Dotenv.config();

// Initialize Express app
const app = Express();
const Server = Http.createServer(app);

// Initialize AuthArmor SDK
const AuthArmor = new AuthArmorSDK({
  server: Server, // Enables Authentication through WebSockets
  clientId: process.env.CLIENT_ID, // AuthArmor API Client ID
  clientSecret: process.env.CLIENT_SECRET, // AuthArmor API Client Secret
  secret: process.env.SECRET // Specify a Secret for the tokens that will be generated through the SDK
});

app.use(
  Cors({
    origin: ["http://localhost:3000", "https://autharmor-demo.vercel.app"],
    credentials: true
  })
);

// Mount the SDK routes under "/auth/autharmor" (which is the default path prefix specified in the client-side SDK)
app.use(
  "/api/auth/autharmor",
  AuthArmor.routes({
    onAuthSuccess: data => {
      console.log(data);
    }
  })
);

// (Optional) Adds a middleware that allows you to access the user's nickname through `res.locals.user.nickname`
app.use(AuthArmor.middleware);

console.log(`🎉 Server is up and running at port ${process.env.PORT}!`);

Server.listen(process.env.PORT);
