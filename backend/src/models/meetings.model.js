import mongoose from "mongoose"

const schema = mongoose.Schema;

const meetingSchema = new schema({
    user_id:{
        type:schema.Types.ObjectId,
        ref: "User"
    },
    meetingCode: {
        type: String,
        required: true
    },
    date:{
        type : Date,
        default: Date.now,
        required: true
    }
});

const Meeting = mongoose.model("Meeting", meetingSchema);

export{Meeting}