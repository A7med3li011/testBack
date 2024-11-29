import mongoose from "mongoose";
const connection = () => {
  mongoose
    .connect(process.env.DATABASEONLINE)
    .then((res) => console.log("connection established"))
    .catch((err) => "connection err");
};

export default connection;
