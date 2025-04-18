import mongoose from "mongoose"

const schema = mongoose.Schema;

const userSchmea = new schema({
    name:{
        type: String,
        required: true,
    },
    username:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    token:{
        type: String
    }
});

const User = mongoose.model("User", userSchmea);

export{User}