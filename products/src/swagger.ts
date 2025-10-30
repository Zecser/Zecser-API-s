import { Express } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

export const setupSwagger = (app: Express) => {
  const port = process.env.PORT || 5000;
  const baseUrl =
    process.env.NODE_ENV === "production"
      ? process.env.BASE_URL || `https://your-app-name.onrender.com`
      : `http://localhost:${port}`;

  const options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Product API",
        version: "1.0.0",
        description:
          "API documentation for Categories, Subcategories, and Products",
      },
      servers: [
        {
          url: baseUrl,
          description:
            process.env.NODE_ENV === "production"
              ? "Production server"
              : "Local development server",
        },
      ],
    },
    apis: ["./src/routes/*.ts"],
  };

  const swaggerSpec = swaggerJsdoc(options);

  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  console.log(`📘 Swagger docs available at: ${baseUrl}/api-docs`);
};
