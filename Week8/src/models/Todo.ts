import mongoose, { Document, Schema } from "mongoose"

interface ITodo extends Document{
    user: string,
    items: string[]
}

let todoSchema: Schema = new Schema({
    user: { type: String },
    items: { type: [String] }
})

const Todo: mongoose.Model<ITodo> = mongoose.model<ITodo>('Todo', todoSchema)

export { Todo, ITodo }