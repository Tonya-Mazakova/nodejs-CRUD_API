export const userSchema = {
    username: {
        type: "string",
    },
    age: {
        type: "number",
    },
    hobbies: {
        type: 'array',
        items: {
            type: 'string',
        },
    },
    required: ["username", "age", "hobbies"]
}
