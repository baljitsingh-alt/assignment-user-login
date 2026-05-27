import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt"

const userSchema = new Schema({
    firstName:{
        type: String,
        require:true
    },
    lastName:{
        type: String,
    },
    email:{
        type: String,
        unique:true,
        require:[true, "email is required"],
        validate:{
            validator: function (v){
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: props=>`${props.value} is not a vallid Email`
        }

    },
    password:{
        type: String,
        require:true
    },

})


userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.isPasswordMatched =  async function(password){
    try {
    return await bcrypt.compare(password, this.password);
    } catch (error) {
        console.log("error",error);
        throw new Error("passwod comparison failed");
    }
};

const User = mongoose.model('User', userSchema);

export default User;