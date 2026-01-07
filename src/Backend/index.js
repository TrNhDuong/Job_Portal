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
import mailRoute from "./routes/mailRoute.js";
import reportRoute from "./routes/reportRoute.js";
import paymentRoute from "./routes/paymentRoute.js";
import adminJobRoute from "./routes/adminJobRoute.js";
import adminUserRoute from "./routes/adminUserRoute.js";
import statisticRoute from "./routes/statisticRoute.js";

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
app.use("/api", mailRoute);
app.use("/api", reportRoute);
app.use("/api", paymentRoute);
app.use("/api", adminJobRoute);
app.use("/api", adminUserRoute);
app.use("/api", statisticRoute);

connectDB();
app.listen(8080, () => {
    if (process.env.RENDER === "true") {
        // Khi chạy trên Render, domain sẽ là https://<appname>.onrender.com
        console.log(`✔️ Server running at Render on port ${PORT}`);
    } else {
        // Khi chạy local
        console.log(`✔️ Server running at http://localhost:${PORT}`);
    }
});

export default app;
