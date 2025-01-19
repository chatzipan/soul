module.exports = {
  globals: {
    __PATH_PREFIX__: true,
  },
  plugins: ["import"],
  extends: [
    "react-app",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "plugin:prettier/recommended",
    "eslint-config-prettier",
  ],
  rules: {
    "prefer-const": "error",
    "import/order": [
      "warn",
      {
        groups: [
          "builtin", // e.g. node built-ins like fs or path
          "external", // e.g. npm modules like react, firebase
          "internal", // your internal code (alias-based imports)
          ["parent", "sibling"], // imports from parent or sibling folders
          "index", // index files
          "object", // e.g. JSON files
          "type", // Type imports
        ],
        "newlines-between": "always",
        alphabetize: {
          order: "asc", // sort alphabetically
          caseInsensitive: true, // case-insensitive sorting
        },
      },
    ],
  },
};
