import mongoose, { Schema, model } from "mongoose";

const fileSchema = new Schema({
    fileName: String,
    fileSize: Number,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    }
}, {
    timestamps: true
})

const File = model("file", fileSchema);
export default File;