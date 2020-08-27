const express = require('express');
const app = express();
const path = require('path')
const morgan = require('morgan');
const candidateRoute = require('./routes/candidatesRoute');
const postsRoute = require('./routes/postsRoute');
const usersRoute = require('./routes/userRoute');
const propRoute = require('./routes/proposalRoute');

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use('/files', express.static(path.resolve(__dirname,'..','tmp','uploads')))

app.use(morgan("dev"));
app.use(candidateRoute);
app.use(usersRoute);
app.use(postsRoute);
app.use(propRoute);



const PORT = process.env.PORT || 3333;

app.listen(PORT,()=>{
    console.log("==============================");
    console.log("WEBCANDIDATE-API");
    console.log("==============================");
    console.log("SERVER RUNNING  ON PORT",PORT);
    console.log("==============================");
})


