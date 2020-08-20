module.exports = {
  database:
    "mongodb+srv://root:Password123@mongoosetestnermin.t5g7o.mongodb.net/mongotestnermin?retryWrites=true&w=majority",
  port: 8080,
  secretKey: "s5dfsF2sdf24adfwrfa2sdfadffwre",
  facebook: {
    clientID: "618651965514771",
    clientSecret: "56ceeb71a4747742c5d152e354d57892",
    profileFields: ["emails", "displayName"],
    callbackURL: "http://localhost:8080/auth/facebook/callback",
    passReqToCallback: true,
  },
};
