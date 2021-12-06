import express from "express";
import cors from "cors";
import { connectToDatabase } from "./services/database.service";
import { partiesRouter } from "./routes/party.router";

const app = express();
const port = 8080; // default port to listen

connectToDatabase()
  .then(() => {
    app.use(
      cors({
        origin: function (origin, callback) {
          const validPatternRegexes = [
            // /^(.*)qd-web-staging.herokuapp.com(\/(.*)|)$/,
            // /^(www.|)qd-web-staging.herokuapp.com(\/(.*)|)$/,
            /^http:\/\/localhost:[0-9]{4}$/,
          ];
          if (validPatternRegexes.some((rx) => rx.test(origin)) || !origin) {
            callback(null, true);
          } else {
            callback(new Error("Not allowed by CORS"));
          }
        },
      })
    );

    // send all calls to /parties to our partyRouter
    app.use("/parties", partiesRouter);

    // start the Express server
    app.listen(port, () => {
      console.log(`Server started at http://localhost:${port}`);
    });
  })
  .catch((error: Error) => {
    console.error("Database connection failed", error);
    process.exit();
  });
