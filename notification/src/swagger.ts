import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const options = {
definition: {
openapi: "3.0.0",
info: {
title: "Notification API",
version: "1.0.0",
description: "API documentation for Notification System",
},
servers: [
{
url: "http://localhost:5000",
description: "Local Server",
},
],
},
apis: ["./src/routes/*.ts", "./src/controllers/*.ts"],
};

const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app: Express) => {
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
console.log("📘 Swagger UI running at http://localhost:5000/api-docs");
};
