const User=require('./User.model');
const Event=require('./Event.model');
const Appointment=require('./Appointment.model')
const AppointmentType=require('./AppointmentType.model');
const Token=require('./Token.mode')
const Notification=require('./Notification.model')
const Following=require('./Following.model')

module.exports={
    User,
    Event,
    Appointment,
    AppointmentType,
    Token,
    Following,
    Notification
}