import * as express from "express";
import * as cors from "cors";
import { createConnection } from "typeorm";

createConnection().then((db) => {
  const app = express();
  app.use(
    cors({
      origins: [
        "http://localhost:3000",
        "http://localhost:8080",
        "http://localhost:4200",
      ],
    })
  );
  app.use(express.json());
  app.listen(8001, () => {
    console.log("Server listening on port 8001");
  });
});
