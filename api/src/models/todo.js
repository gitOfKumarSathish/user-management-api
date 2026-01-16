const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ["pending", "in progress", "completed"],
        required: true,
    },
    priority: {
        type: String,
        enum: ["low", "medium", "high"],
        required: true,
    },
    due_date: {
        type: Date,
        required: true,
    },
    is_deleted: {
        type: Boolean,
        default: false,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    updated_at: {
        type: Date,
        default: Date.now,
    },
    deleted_at: {
        type: Date,
        default: null,
    },
    // 🔗 RELATION FIELD
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",   // 👈 IMPORTANT
        required: true
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",   // 👈 IMPORTANT
        required: true
    },
    updated_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",   // 👈 IMPORTANT
    },
    deleted_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",   // 👈 IMPORTANT
    },
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
    },
    toJSON: {
        transform: (doc, ret) => {
            delete ret.__v;
            // delete ret.is_deleted;
            delete ret.deleted_at;
            // delete ret.priority; // Example: Uncomment to hide 'priority'
            return ret;
        }
    }
});

const Todo = mongoose.model("Todo", todoSchema);

module.exports = Todo;
