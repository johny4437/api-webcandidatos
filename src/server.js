const express = require('express');
const app = express();
const morgan = require('morgan');
const candidateRoute = require('./routes/candidatesRoute');
const postsRoute = require('./routes/postsRoute');

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(morgan("dev"));
app.use(candidateRoute);
app.use(postsRoute);

const PORT = process.env.PORT || 3333;

app.listen(PORT,()=>{
    console.log("==============================");
    console.log("WEBCANDIDATE-API");
    console.log("==============================");
    console.log("SERVER RUNNING  ON PORT",PORT);
    console.log("==============================");
})


