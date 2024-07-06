import { Schema, model } from "mongoose";

const loginSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
password: {
    type: String,
    required: true
}
});

export const LoginModel = model ('login', loginSchema)