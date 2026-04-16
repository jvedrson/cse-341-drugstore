const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger-output.json");
const dotenv = require('dotenv').config();
const passport = require('passport');
const session = require('express-session');
const GitHubStrategy = require('passport-github2').Strategy;

const cors = require("cors");

const app = express();
const port = process.env.PORT || 8080;

const mongoDB = require("./db/database");

app.use(express.json());
app.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
}))
    .use(passport.initialize())
    .use(passport.session())
    .use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader(
            'Access-Control-Allow-Headers',
            'Origin, X-Requested-With, Content-Type, Accept, Z-Key'
        );
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        next();
    })
    .use(cors({ methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'] }))
    .use(cors({ origin: '*' }))
    .use("/", require("./routes"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL
},
    async (accesToekn, refreshToken, profile, done) => {
      try {
        const db = mongoDB.getDatabase().collection("users");
        let user = await db.findOne({ github_id: profile.id });
        if (!user) {
          const newUser = {
            github_id: profile.id,
            name: profile.displayName || profile.username,
            email: profile.emails && profile.emails[0] ? profile.emails[0].value : null,
            role: "admin",
          }
          await db.insertOne(newUser);
          user = newUser
        }
        profile = { ...user };

        return done(null, profile);
      } catch (err)
      {
        return done(err, null);
      }}
));

passport.serializeUser((user, done) => {
    done(null, user)
});
passport.deserializeUser((user, done) => {
    done(null, user)
});

app.get('/', (req, res) => { res.send(req.session.user !== undefined ? `Logged in as ${req.session.user.displayName}` : "Logged Out") });

app.get('/github/callback', passport.authenticate('github', {
    failureRedirect: '/api-docs', session: false
}),
    (req, res) => {
        req.session.user = req.user;
        res.redirect('/');
    }
);

mongoDB.initDatabase((err) => {
  if (err) {
    console.error("Error connecting to MongoDB", err);
    process.exit(1);
  }
  app.listen(port, () => {
    console.log(`Database is listening and node Running on port ${port}`);
  });
});
