require('dotenv').config();
const express = require('express');
const app = express();
const ejs = require('ejs');
const path = require('path');
const expressLayout = require('express-ejs-layouts');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('express-flash');
const MongoDbStore = require('connect-mongo');
const passport = require('passport');
const Emitter = require('events');


//Database Connection

;
mongoose.connect(process.env.MONGODBURL,{useNewUrlParser:true,useCreateIndex:true,
    useUnifiedTopology:true,useFindAndModify:true,useFindAndModify:true});
const connection = mongoose.connection;
connection.once('open',()=>{
    console.log('Database Connected...');
}).catch(err=>{
    console.log('Connection failed...');
});

const port = process.env.PORT || 3000;

//event emmitter
const eventEmitter = new Emitter() 
app.set('eventEmitter',eventEmitter)

// session config
app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave:false,
    store:MongoDbStore.create({
        mongoUrl:process.env.MONGODBURL,


    }),
    saveUninitialized:false,
    cookie:{maxAge:1000*60*60*24}   //24 hours


}));
//passport config
const passportInit = require('./app/config/passport');
passportInit(passport);
app.use(passport.initialize());
app.use(passport.session());

app.use(flash())
//assets
app.use(express.static('public'))
app.use(express.urlencoded({extended:false}))
app.use(express.json())
//Global middleware
app.use((req,res,next)=>{
    res.locals.session = req.session ;
    res.locals.user = req.user;
    next();
});
//set Template Engine
app.use(expressLayout);
app.set('views',path.join(__dirname , '/resources/views'));
app.set('view engine' ,'ejs');


require('./routes/web').initRouts(app);


const server = app.listen(port, () => console.log(`Server running on port ${port} 🔥`));


// Socket

const io = require('socket.io')(server)
io.on('connection',(socket)=>{
    // Join 
    //console.log(socket.id);
    socket.on('join',(orderId)=>{
        //console.log(orderId);
        socket.join(orderId)
    })
})

eventEmitter.on('orederUpdated',(data)=>{
    io.to(`order_${data.id}`).emit('orederUpdated',data)

})
eventEmitter.on('orderPlaced',(data)=>{
    io.to('adminRoom').emit('orderPlaced',data)
})