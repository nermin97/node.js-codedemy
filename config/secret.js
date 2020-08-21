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
  stripe: {
    secretTestKey:
      "sk_test_51HIdtEBVLXIEqtQE81hm26pQdEBFu6HcGw4x1NfVsVW9zfQJpLK6V7RDeE9DkXPUPn7JDt6HWmzBhC3VCsgA6ejT00829RoetT",
    publishableTestKey:
      "pk_test_51HIdtEBVLXIEqtQEQtrqYioyQNHqA3CgnE2IvwzkROIM6W47crqbaUsMD3wTfnC0oPd4eMKlGDbBsuuHCv3qMfL200btkst7mO",
  },
};
