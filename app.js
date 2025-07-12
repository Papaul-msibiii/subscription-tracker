import express from "express";
import cookieParser from "cookie-parser";
import swaggerUi from 'swagger-ui-express';

import { PORT, NODE_ENV, ENABLE_SWAGGER, SWAGGER_TOKEN } from './config/env.js';
import swaggerSpec from './config/swagger.js';

import userRouter from "./routes/user.routes.js";
import authRouter from "./routes/auth.routes.js";
import subscriptionRouter from "./routes/subscription.routes.js";
import connectToDatabase from "./database/mongodb.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import arcjetMiddleware from "./middlewares/arcjet.middleware.js";
import workflowRouter from "./routes/workflow.routes.js";
import protectSwagger from "./middlewares/swagger.middleware.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(arcjetMiddleware);

const enableSwagger = NODE_ENV !== "production" || ENABLE_SWAGGER === "true";

const swaggerUiOptions = {
  swaggerOptions: {
    authAction: {
      bearerAuth: {
        name: "Authorization",
        schema: {
          type: "http",
          in: "header",
          name: "Authorization",
          description: "Enter your bearer token in the format **Bearer &lt;token>**",
        },
        value: `Bearer ${SWAGGER_TOKEN}`, // Tu peux laisser vide ici si tu veux que l'utilisateur l'entre manuellement
      },
    },
  },
};

if (enableSwagger) {
  app.use('/docs', protectSwagger, swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions));
}

// Login form to access Swagger
app.get('/login-docs', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Login to Swagger Docs</title>
      </head>
      <body>
        <h2>Enter your access token</h2>
        <form method="POST" action="/login-docs">
          <input type="text" name="token" placeholder="Bearer token" style="width: 300px;" required />
          <button type="submit">Access Docs</button>
        </form>
      </body>
    </html>
  `);
});

app.post('/login-docs', (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(400).send('Token required');
  res.cookie('swagger_token', token, { httpOnly: true });
  res.redirect('/docs');
});

// API routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/subscriptions', subscriptionRouter);
app.use('/api/v1/workflows', workflowRouter);

app.use(errorMiddleware);

app.get("/", (req, res) => {
  res.send("Welcome to the Subscription Tracker API!");
});

app.listen(PORT, async () => {
  console.log(`Subscription Tracker API is running on localhost:${PORT}`);

  await connectToDatabase();
});

export default app;