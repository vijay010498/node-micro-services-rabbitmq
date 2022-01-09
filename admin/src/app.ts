import * as express from "express";
import * as cors from "cors";
import { createConnection } from "typeorm";
import { Request, Response } from "express";
import { Product } from "./entity/product";
import * as amqp from "amqplib/callback_api";
createConnection().then((db) => {
  const productRepository = db.getRepository(Product);
  amqp.connect(
    "", // AMPQ - server URL
    (error0, connection) => {
      if (error0) {
        throw error0;
      }
      connection.createChannel((error1, channel) => {
        if (error1) throw error1;
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

        // Get All Products
        app.get("/api/products", async (req: Request, res: Response) => {
          const products = await productRepository.find();
          res.json(products);
        });

        // Create A New Product
        app.post("/api/products", async (req: Request, res: Response) => {
          const product = await productRepository.create(req.body);
          const result = await productRepository.save(product);
          channel.sendToQueue(
            "product_created",
            Buffer.from(JSON.stringify(result))
          );
          return res.send(result);
        });

        // Get One Product
        app.get("/api/products/:id", async (req: Request, res: Response) => {
          const product = await productRepository.findOne(req.params.id);
          return res.send(product);
        });

        // Update A Product
        app.put("/api/products/:id", async (req: Request, res: Response) => {
          const product = await productRepository.findOne(req.params.id);
          productRepository.merge(product, req.body);
          const result = await productRepository.save(product);
          channel.sendToQueue(
            "product_updated",
            Buffer.from(JSON.stringify(result))
          );
          return res.send(result);
        });

        // Delete A product
        app.delete("/api/products/:id", async (req: Request, res: Response) => {
          const result = await productRepository.delete(req.params.id);
          channel.sendToQueue("product_deleted", Buffer.from(req.params.id));
          return res.send(result);
        });

        //Like A product
        app.post(
          "/api/products/:id/like",
          async (req: Request, res: Response) => {
            const product = await productRepository.findOne(req.params.id);
            product.likes++;
            const result = await productRepository.save(product);
            return res.send(result);
          }
        );

        app.listen(8000, () => {
          console.log("Server listening on port 8000");
        });
        process.on("beforeExit", () => {
          console.log("Closing The Connection");
          connection.close();
        });
      });
    }
  );
});
