import mongoose from "mongoose";
import { Statistic } from "./model/statistic.js"; // path đúng của bạn

mongoose.connect("mongodb://localhost:27017/<tên_db>", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const checkStatistic = async () => {
  const stats = await Statistic.find({});
  console.log(stats);
  mongoose.disconnect();
};

checkStatistic();
