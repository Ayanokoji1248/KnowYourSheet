import { model, Schema } from "mongoose";

const userSchema = new Schema({
    fullName: String,
    email: String,
    password: String,
}, {
    timestamps: true
})

const User = model("user", userSchema);

export default User;