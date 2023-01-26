import "reflect-metadata";
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { EnvService } from "./services/env-service";


// Load any environmental variables from the local .env file
dotenv.config();


const app: Express = express();
const port = EnvService.instance.env.PORT;

console.log("Hallo");