//require - import các thư viện/cấu hình cần thiết cho app
const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
//utils
const AppError = require('./utils/appError');

const userModel = require('./models/userModel');
const commentModel = require('./models/commentModel');
const emotionEntryModel = require('./models/emotionEntryModel');
const familyModel = require('./models/familyModel');
const specialDayModel = require('./models/specialDayModel');

//import routers
const userRouter = require('./routes/userRoutes');
const authenticationRouter = require('./routes/authenticationRoutes');
const emotionEntryRoutes = require('./routes/emotionEntryRoutes');
const commentRouter = require('./routes/commentRoutes');
const specialDayRoutes = require('./routes/specialDayRoutes');
const familyRoutes = require('./routes/familyRoutes');

// const frontendURL = process.env.FRONTEND_URL;

//các middleware phục vụ cho việc develop
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// app.use(
//   cors({
//     origin: frontendURL, // Change to your front-end's URL
//     credentials: true,
//   })
// );
app.use(cors());

//routing handlers
// --Định tuyến sẵn cho các request từ client với các domain như /recipes, /users
app.use('/families', familyRoutes);
app.use('/users', userRouter);
app.use('/comments', commentRouter);
app.use('/authentication', authenticationRouter);
app.use('/emotions', emotionEntryRoutes);
app.use('/special-days', specialDayRoutes);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

module.exports = app;
