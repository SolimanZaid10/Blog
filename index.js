const express = require('express');
const mongoose = require('mongoose');
const blogRoutes=require('./routes/blog');
const userRoutes=require('./routes/user');
const homeRoute=require('./routes/home')
const authMiddleware = require('./middlewares/authentication');

const { MONGODB_URI } = process.env;
mongoose.connect(MONGODB_URI, {useNewUrlParser: true})
.catch((err) => console.log(err))
const app = express();
app.use(express.json())


app.use('/blogs',authMiddleware ,blogRoutes);
app.use('/users',userRoutes);
app.use('/',homeRoute);



 //not found
app.use('*', (req, res, next) => {
    res.status(404).json({ err: 'NOT_FOUND' });
});
//error handler
app.use((err, req, res, next) => {
    if (err instanceof mongoose.Error.ValidationError) {
        return res.status(422).json(err.errors);
      }
      if (err.code === 11000) {
        res.status(422).json({ statusCode: 'ValidationError', property: err.keyValue });
      }
      if (err.message === 'UN_AUTHENTICATED') {
        res.status(401).json({ statusCode: 'UN_AUTHENTICATED' });
      }
      res.status(503).end();
});


const { port = 4000 } = process.env;
app.listen(port, () => {
    console.log('app is ready on :', port);
})