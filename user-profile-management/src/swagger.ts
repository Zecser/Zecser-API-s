import { title } from "process";
import swaggerJSDoc from "swagger-jsdoc";


const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "api",
            version: "1.0.0",
            description: "A sample API with swagger documentation"
        },
        servers: [{ url: "http://localhost:8004/api/v1" }]
    },
    apis: ["./index/*.ts", "./src/routes/*.ts", "./src/controllers/*.ts"]
}


const swaggerSpec = swaggerJSDoc(options)

export default swaggerSpec