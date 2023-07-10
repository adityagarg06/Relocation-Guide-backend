const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  confirmPassword: { type: String, required: true },
  option: { type: String, required: true },
  country: { type: String, required: true },
  tokens:[
      {
          token:{
              type:String,
              required:true
          }
      }
  ]
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
    this.confirmPassword = await bcrypt.hash(this.confirmPassword, 12);
  }
  next();
});

userSchema.methods.generateAuthToken = async function(){
    try {
        let token = jwt.sign({_id: this._id},process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({token:token})
        await this.save();
        return token;
    } catch (error) {
        console.log(error);
    }
}

const User = mongoose.model("User", userSchema);

module.exports = User;






