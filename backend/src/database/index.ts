import { db } from "../config";
import mongoose from "mongoose";

const dbURI = `mongodb://${db.host}:${db.port}/${db.name}`;
const options = {
  autoIndex: true,
  minPoolSize: db.minPoolSize, //minimum number of connections database will keep open.
  maxPoolSize: db.maxPoolSize, //maximum number of connections database will keep open.
  connectTimeoutMS: 30000, //This option specifies how long (in milliseconds) the driver will attempt to establish a connection to the MongoDB server before timing out.
  socketTimeoutMS: 30000, //This option specifies how long (in milliseconds) the driver will wait for a response from the MongoDB server after sending a query or command before timing out.
};
mongoose
  .connect(dbURI, options)
  .then(() => {
    console.log("Database connected successfully !");
  })
  .catch((err) => {
    console.log("Error connecting to database", err);
  });

mongoose.connection.on("connected", () => {
  console.log("Mongoose connected");
});
mongoose.connection.on("error", (err) => {
  console.log("Mongoose connection error: " + err);
});
mongoose.connection.on("disconnected", () => {
  console.log("Mongoose disconnected");
});
