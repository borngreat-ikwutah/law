import express from "express";
import websiteApp from "./server/_core/index";

const app = express();
app.use(websiteApp);

export default app;
