module.exports = {
  globals: {
    __PATH_PREFIX__: true,
  },
  extends: ["react-app"],
  ignorePatterns: ["functions/src/email/templates/**/*", "functions/lib/**/*"],
  rules: {
    "prefer-const": "error",
  },
};
