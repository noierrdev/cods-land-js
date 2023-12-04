const User=require('./User.model');
const Event=require('./Event.model');
const Appointment=require('./Appointment.model')
const AppointmentType=require('./AppointmentType.model');
const Token=require('./Token.mode')
const Notification=require('./Notification.model')
const Following=require('./Following.model')
const Friendship=require('./Friendship.model')
const UserGroup=require('./UserGroup.model');
const UserGroupMember=require('./UserGroupMember.model');
const SharedContent=require('./SharedContent.model');
const Share=require('./Share.model');
const Like=require("./Like.model");
const SharedContentCategory=require('./SharedContentCategory')

module.exports={
    User,
    Event,
    Appointment,
    AppointmentType,
    Token,
    Following,
    Notification,
    Friendship,
    UserGroup,
    UserGroupMember,
    SharedContent,
    SharedContentCategory,
    Share,
    Like
}