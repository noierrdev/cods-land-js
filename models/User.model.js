const mongoose=require('mongoose');
const bcrypt=require('bcrypt');

const schema=mongoose.Schema;

const UserSchema=new schema({
    fullname:{
        type:String
    },
    email:{
        type:String
    },
    gender:{
        type:String
    },
    birthday:{
        type:String
    },
    city:{
        type:String
    },
    country:{
        type:String
    },
    avatar:{
        type:Object
    },
    password:{
        type:String
    },
    otp:{
        type:Number
    },
    verified:{
        type:Boolean
    }
},
{
    timestamps: true,
});
UserSchema.pre('save',async (next)=>{
    const user = this;
    // Hash the password only if it's modified or new
    if (!user.isModified('password')) return next();
    try {
    // Generate a salt and hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.password, salt);

    // Set the hashed password back to the user object
    user.password = hashedPassword;
    next();
    } catch (error) {
    return next(error);
    }
})

UserSchema.methods.comparePassword = async function(candidatePassword) {
    try {
      // Use bcrypt to compare the candidate password with the hashed password
      return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
      throw error;
    }
};

const User=mongoose.model('User',UserSchema)
module.exports=User;