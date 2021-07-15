# AuthArmor Node.js Sample (Express.js)

## 🌟 Live Demo

You can check out a live example of this Node.js backend and interact with it in this [sample site](https://autharmor-sample-react.herokuapp.com)

## ⚙ Setup

In order to run this sample backend in your local machine, you'll need to get a few things setup first:

- Node.js 12+
- Yarn (optional but recommended)
- MongoDB Server (You can get a server setup easily through [MongoDB Atlas](https://atlas.mongodb.com) for free)
- Create an AuthArmor project and generate a client ID/Secret for it ([You can read more about this here](https://support.autharmor.com/hc/en-us/articles/360053309753-Using-the-Auth-Armor-API))

Once you have everything ready on your local machine, you'll need to modify the .env file to contain the following info:

```env
PORT=8000
SECRET=<any random string you want>
SESSION_AGE=8600
MONGODB_URI=<MongoDB Atlas server URI>
AUTHARMOR_API_URL=https://api.autharmor.com/v1
AUTHARMOR_CLIENT_ID=<Your AuthArmor project client ID>
AUTHARMOR_CLIENT_SECRET=<Your AuthArmor project client secret>
```

Once you've edited the .env file to use the right info, you can start up the server by simply running:

```shell
# Using Yarn
yarn && yarn start

# Using NPM
npm i && npm start
```

And that's it! You should have the AuthArmor sample node backend up and running on your machine!
