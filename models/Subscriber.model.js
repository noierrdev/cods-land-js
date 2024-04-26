const mongoose=require('mongoose');
const schema=mongoose.Schema;

const SubscriberSchema=new schema({
    email:{
        type:String,
    },
    fullname:{
        type:String
    },
    country:{
        type:String
    },
    state:{
        type:String
    },
    city:{
        type:String
    },
    continent_code:{
        type:String
    },
    country_code:{
        type:String
    },
    state_code:{
        type:String
    },
    zipcode:{
        type:String
    },
    homephone:{
        type:String
    },
    mobilephone:{
        type:String
    }
},{
    timestamps:true
});

const Subscriber=mongoose.model("Subscriber",SubscriberSchema);
module.exports=Subscriber;