const mongodb=require('mongoose');
const jwt=require('jsonwebtoken');
const bcrypt=require('bcryptjs')

const key="IAMSATYAMIAMWEBDEVELOPER"

const userSchema = new mongodb.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    phone:{
        type:Number,
        required:true
    },
    work:{
        type:String,
        required:true
    },password:{
        type:String,
        required:true
    },
    cpassword:{
        type:String,
        required:true
    },
    tokens:[{
        token:{type:String,
        required:true
    }
}]
})
//
userSchema.pre('save',async function(next){
    console.log("hi pre");
    if(this.isModified('password')){
        console.log("hii pre password");
        this.password=await bcrypt.hash(this.password, 12);
        this.cpassword=await bcrypt.hash(this.cpassword,12);
    }
    next();
})



//generating token
userSchema.methods.generateAuthToken=async function(){
    try{
        let token=jwt.sign({_id:this._id},key);
        this.tokens=this.tokens.concat({token:token});
        await this.save();
        return token;
    }
    catch(err){
        console.log(err);
    }
}

const User=mongodb.model('USER',userSchema);

module.exports=User;
