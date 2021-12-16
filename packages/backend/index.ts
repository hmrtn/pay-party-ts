import express from "express";
import cors from "cors";
import { connectToDatabase } from "./services/databaseService";
import { partyRouter } from "./routes/partyRouter";

const app = express();
const port = 8080; // default port to listen

connectToDatabase()
  .then(() => {
    app.use(
      cors({
        origin: function (origin, callback) {
          const validPatternRegexes = [
            // TODO: Add other hosts to valid patterns
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

    // send all calls to /party to our partyRouter
    app.use("/party", partyRouter);

    // start the Express server
    app.listen(port, () => {
      console.log(`Server started at http://localhost:${port}`);
    });
  })
  .catch((error: Error) => {
    console.error("Database connection failed", error);
    process.exit();
  });
