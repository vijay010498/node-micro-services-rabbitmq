import * as express from "express";
import * as cors from "cors";
import { createConnection } from "typeorm";
import { Request, Response } from "express";
import { Product } from "./entity/product";

createConnection().then((db) => {
  const productRepository = db.getRepository(Product);
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

  app.get("/api/products", async (req: Request, res: Response) => {
    const products = await productRepository.find();
    res.json(products);
  });

  app.post("/api/products", async (req: Request, res: Response) => {
    const product = await productRepository.create(req.body);
    const result = await productRepository.save(product);
    return res.send(result);
  });
  app.listen(8000, () => {
    console.log("Server listening on port 8000");
  });
});
