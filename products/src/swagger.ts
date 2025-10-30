import { Express } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

export const setupSwagger = (app: Express) => {
  const options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Product API",
        version: "1.0.0",
        description: "API documentation for Categories, Subcategories, and Products",
      },
      servers: [
        {
          url: "http://localhost:5000",
        },
      ],
    },
    
    apis: ["./src/routes/*.ts"],
  };

  const swaggerSpec = swaggerJsdoc(options);

  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log("📘 Swagger docs available at: http://localhost:5000/api-docs");
};
