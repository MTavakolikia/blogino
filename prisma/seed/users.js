"use strict";

// All seed users share this password (bcrypt-hashed at seed time).
const SEED_PASSWORD = "Password123!";

// role: "ADMIN" | "AUTHOR" | "USER"
const USERS = [
    // Admin — the editor who approves posts.
    { firstName: "Avery", lastName: "Stone", email: "admin@blogino.example", role: "ADMIN" },

    // Authors — the bylines on the posts.
    { firstName: "Maya", lastName: "Lindqvist", email: "maya@blogino.example", role: "AUTHOR" },
    { firstName: "Daniel", lastName: "Okafor", email: "daniel@blogino.example", role: "AUTHOR" },
    { firstName: "Priya", lastName: "Raman", email: "priya@blogino.example", role: "AUTHOR" },
    { firstName: "Lucas", lastName: "Moreau", email: "lucas@blogino.example", role: "AUTHOR" },
    { firstName: "Sofia", lastName: "Delgado", email: "sofia@blogino.example", role: "AUTHOR" },

    // Readers — they like, comment, and save.
    { firstName: "Harper", lastName: "Nguyen", email: "harper@reader.example", role: "USER" },
    { firstName: "Ethan", lastName: "Brooks", email: "ethan@reader.example", role: "USER" },
    { firstName: "Amara", lastName: "Diallo", email: "amara@reader.example", role: "USER" },
    { firstName: "Felix", lastName: "Werner", email: "felix@reader.example", role: "USER" },
    { firstName: "Ingrid", lastName: "Sato", email: "ingrid@reader.example", role: "USER" },
    { firstName: "Marcus", lastName: "Reyes", email: "marcus@reader.example", role: "USER" },
    { firstName: "Lena", lastName: "Kowalski", email: "lena@reader.example", role: "USER" },
    { firstName: "Omar", lastName: "Haddad", email: "omar@reader.example", role: "USER" },
    { firstName: "Chloe", lastName: "Turner", email: "chloe@reader.example", role: "USER" },
    { firstName: "Ravi", lastName: "Menon", email: "ravi@reader.example", role: "USER" },
    { firstName: "Nadia", lastName: "Petrova", email: "nadia@reader.example", role: "USER" },
    { firstName: "Jonas", lastName: "Berg", email: "jonas@reader.example", role: "USER" },
    { firstName: "Yuki", lastName: "Tanaka", email: "yuki@reader.example", role: "USER" },
    { firstName: "Grace", lastName: "Owusu", email: "grace@reader.example", role: "USER" },
];

module.exports = { SEED_PASSWORD, USERS };
