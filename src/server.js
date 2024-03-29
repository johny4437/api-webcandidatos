const express = require('express')
const compression = require('compression');

const app = express();

app.use(compression());

const path = require('path')
//const morgan = require('morgan');
const cors = require('cors')
const candidateRoute = require('./routes/candidatesRoute');
const postsRoute = require('./routes/postsRoute');
const usersRoute = require('./routes/userRoute');
const propRoute = require('./routes/proposalRoute');
const favRoute = require('./routes/favoritesRoute');
const visitRoute = require('./routes/visitsRoute');
const viewPostRoute = require('./routes/viewPostRoute');
const bodyParser = require("body-parser");
const viewProposalRoute = require('./routes/viewProposalRoute');
const badgeRoute = require('./routes/badgeRoute');
const searchRoute = require('./routes/searchQueryRoute');
const paymentRoute = require('./routes/paymentRoute');
const adminRoute = require('./routes/adminRoute');
const likeRoute = require('./routes/likesRoute');
const qrCodeRoute = require('./routes/qrCodeViewRoute');
const shareWpRoute = require('./routes//shareWpRoute');
const addressRoute = require('./routes/addressRoute');
const route = require('./routes/addressRoute');
const hastagsRoute = require('./routes/hastagsRoute');
const formContactRoute = require('./routes/formContactRoute')

app.use(cors());

// app.use(express.json());
// app.use(express.urlencoded({extended:true}));
//app.use(morgan("dev"));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.json({limit: '2100mb', extended: true}));
app.use('/files', express.static(path.resolve(__dirname,'..','tmp','uploads')))
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended:true}))


app.use(express.json({limit: '500mb', extended: true}));
app.use(express.urlencoded( {limit: '500mb', extended: true}));
app.use(express.json());

// app.use(fileUpload());
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
app.use(qrCodeRoute);
app.use(shareWpRoute);
app.use(addressRoute);
app.use(hastagsRoute);
app.use(formContactRoute)


const PORT = process.env.PORT || 3333;

app.listen(PORT,()=>{
    console.log("==============================");
    console.log("WEBCANDIDATE-API");
    console.log("==============================");
    console.log("SERVER RUNNING  ON PORT",PORT);
    console.log("==============================");
})


