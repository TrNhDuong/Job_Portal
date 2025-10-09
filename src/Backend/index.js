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

app.use("/api", candidateRoute);
app.use("/api", employerRoute);
app.use("/api", postJobRoute);
app.use("/api", loginRoute);
app.use("/api", registerRoute);

connectDB();
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});

export default app;