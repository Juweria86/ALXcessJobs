import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from 'dotenv';
import morgan from "morgan";

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import jobRoute from './routes/jobsRoutes.js';
import jobTypeRoute from './routes/jobsTypeRoutes.js';


import cookieParser  from "cookie-parser";
import errorHandler from"./middleware/error.js";

dotenv.config();
const app = express();



//database connection
mongoose.connect(process.env.DATABASE)
    .then(() => {
        console.log('Database connected successfully');
    })
    .catch((error) => {
        console.error('Error connecting to the database', error);
    });

app.use(morgan('dev'));
app.use(bodyParser.json({ limit: "5mb" }));
app.use(bodyParser.urlencoded({
    limit: "5mb",
    extended: true
}));
app.use(cookieParser());
app.use(cors());

//Routes
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', jobTypeRoute);
app.use('/api', jobRoute);

// error middleware
app.use(errorHandler);


//port
const port = process.env.PORT || 9000

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});