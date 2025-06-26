const mongoose = require("mongoose")

const applicationSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    },
    { timestamps: true }
)

applicationSchema.index({ user: 1, job: 1 }, { unique: true }) // no duplicate

module.exports = mongoose.model("Application", applicationSchema)
