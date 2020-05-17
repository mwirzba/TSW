module.exports = {
    root: true,
    env: {
        node: true
    },
    extends: [
        "plugin:vue/essential",
        "@vue/standard"
    ],
    parserOptions: {
        ecmaVersion: 2020
    },
    rules: {
        "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
        "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
        indent: [
            "warn",
            4
        ],
        "linebreak-style": [
            "warn",
            "unix"
        ],
        quotes: [
            "warn",
            "double"
        ],
        semi: [
            "warn",
            "always"
        ],
        "brace-style": [
            "warn",
            "1tbs"
        ],
        "comma-dangle": [
            "warn",
            "never"
        ]
    }
};
