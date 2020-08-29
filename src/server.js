const express = require('express');
const app = express();
const path = require('path')
const morgan = require('morgan');
const cors = require(cors)
const candidateRoute = require('./routes/candidatesRoute');
const postsRoute = require('./routes/postsRoute');
const usersRoute = require('./routes/userRoute');
const propRoute = require('./routes/proposalRoute');
const favRoute = require('./routes/favoritesRoute');
const visitRoute = require('./routes/visitsRoute');
const viewPostRoute = require('./routes/viewPostRoute');
const viewProposalRoute = require('./routes/viewProposalRoute')
const badgeRoute = require('./routes/badgeRoute');
const searchRoute = require('./routes/searchQueryRoute');
const paymentRoute = require('./routes/paymentRoute');
const adminRoute = require('./routes/adminRoute');
const likeRoute = require('./routes/likesRoute');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use('/files', express.static(path.resolve(__dirname,'..','tmp','uploads')))

app.use(morgan("dev"));
app.use(candidateRoute);
app.use(usersRoute);
app.use(postsRoute);
app.use(propRoute);
app.use(favRoute);
app.use(visitRoute);
app.use(viewPostRoute);
app.use(viewProposalRoute);
app.use(badgeRoute);
app.use(searchRoute);
app.use(paymentRoute);
app.use(adminRoute);
app.use(likeRoute);


const PORT = process.env.PORT || 3333;

app.listen(PORT,()=>{
    console.log("==============================");
    console.log("WEBCANDIDATE-API");
    console.log("==============================");
    console.log("SERVER RUNNING  ON PORT",PORT);
    console.log("==============================");
})


