import mongoose, { Schema } from "mongoose"

interface IUser {
    email: string,
    username: String,
    password: string
}

let userSchema: Schema = new Schema({
    email: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true }
})

const User: mongoose.Model<IUser> = mongoose.model<IUser>('User', userSchema)

export default User