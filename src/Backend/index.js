import express from "express";
import cors from "cors";
import {connectDB} from "./config/connectDB.js";


const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());   

import candidateRoute from "./routes/candidateRoute.js";
import employerRoute from "./routes/employerRoute.js";
import postJobRoute from "./routes/postJobRoute.js";
import loginRoute from "./routes/loginRoute.js";
import registerRoute from "./routes/registerRoute.js";
import otpRoute from "./routes/otpRoute.js";
import adminRoute from "./routes/adminRoute.js";
import passwordRoute from "./routes/passwordRoute.js";
import applicationRoute from "./routes/applicationRoute.js";
import imageRoute from "./routes/imageRoute.js";
import cvRoute from "./routes/cvRoute.js";

app.use("/api", candidateRoute);
app.use("/api", employerRoute);
app.use("/api", postJobRoute);
app.use("/api", loginRoute);
app.use("/api", registerRoute);
app.use("/api", otpRoute);
app.use("/api", adminRoute);
app.use("/api", passwordRoute);
app.use("/api", applicationRoute);
app.use("/api", imageRoute);
app.use("/api", cvRoute);
connectDB();
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});


export default app;