import express from "express";
import morgan from 'morgan'
import createError from "http-errors";
import cors from "cors";
import cluster from "cluster";
import os from "os";

const app = express();

const numOfCPU = os.cpus().length;

// dotenv
require("dotenv").config();

// database connection
import "./config/database";

const PORT = process.env.PORT || 5678;

// middleware
app.use(express.static(__dirname));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan("dev"))



app.get("/", (req, res, next) => {
  try {
    console.log("Process Id: ", process.pid);
    res.redirect("/videos/all");
    //res.status(200).json({"Process Id":process.pid})
    // cluster.worker.kill()
  } catch (error) {
    next(error);
  }
});

// routes
import videos from "./routes/videos";
import videostream from "./routes/videostream";
import users from "./routes/users";
import channels from "./routes/channels";
import auth from "./routes/auth";
import comments from "./routes/comments";
import replies from "./routes/replies";
import subscription from "./routes/subscription";
import playlist from "./routes/playlist";

app.use("/videos", videos);
app.use("/videostream", videostream);
app.use("/users", users);
app.use("/channels", channels);
app.use("/auth", auth);
app.use("/comments", comments);
app.use("/replies", replies);
app.use("/subscriptions", subscription);
app.use("/playlists", playlist);

app.use(async (req, res, next) => {
  next(createError.NotFound());
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    success: false,
    message: err.message,
    error: err,
  });
});


// consuming all the cpu cores using cluster
// if (cluster.isMaster) {
//   for (let i = 0; i < numOfCPU; i++) {
//     cluster.fork();
//   }

//   cluster.on("exit", (worker, code, signal) => {
//     // console.log("worker " + worker.process.pid + " died");
//     cluster.fork();
//   });
// } else {
//   app.listen(PORT, () =>
//     console.log(
//       "Server is listening on port: " + PORT + ", Process Id: " + process.pid
//     )
//   );
// }

app.listen(PORT, ()=> console.log("Server is listening on port: "+ PORT))
