import "reflect-metadata";
// import "websocket-polyfill";
// import * as crypto from "node:crypto";
// declare global {
//     var crypto: any;
//     var fetch: any;
// }
// global.crypto = crypto;

// //const fetch = require("node-fetch");
// import * as fetch from "node-fetch";
// global.fetch = fetch;

import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { EnvService } from "./services/env-service";
import { graphqlHTTP } from "express-graphql";
import { getGraphqlContext } from "./graphql/type-defs";
import { buildSchema } from "type-graphql";
import { schemaOptions } from "./graphql/schema";
import { wellKnownController } from "./controllers/well-known-controller";
import { hexController } from "./controllers/hex-controller";

// Load any environmental variables from the local .env file
dotenv.config();

const GRAPHQL_ENDPOINT = "/graphql";

const app: Express = express();
const port = EnvService.instance.env.PORT;

app.use(express.json());
app.use(cors());

// API Controller routes

//app.get("/.well-known/nostr.json", async (req: Request, res: Response) => {
//     const query = req.query as Query;
//     if (typeof query.name === "undefined") {
//         res.status(200).send(
//             "Please provide a name parameter with the identifier you want to query."
//         );
//         return;
//     }
//     // TODO: Query database here
//     res.status(200).send(req.query);
// });

app.get("/.well-known/nostr.json", wellKnownController);
app.get("/hex", hexController);

async function bootstrap() {
    const schema = await buildSchema(schemaOptions);
    app.use(
        GRAPHQL_ENDPOINT,
        graphqlHTTP((req, res, graphQLParams) => {
            return {
                schema: schema,
                context: getGraphqlContext(req),
                graphiql: { headerEditorEnabled: true },
                pretty: true,
            };
        })
    );

    const server = app.listen(port, () => {
        console.log(`⚡️[server]: Running at http://localhost:${port}`);
        console.log(`⚡️[server]: GraphQL endpoint is '${GRAPHQL_ENDPOINT}'`);
        //console.log(`⚡️[server]: WS endpoint is '${WS_ENDPOINT}'`);

        // Start the Web Socket Server on the same port
        // const wsServer = new WebSocketServer({
        //     server,
        //     path: WS_ENDPOINT,
        // });

        // https://github.com/enisdenjo/graphql-ws
        // useServer(
        //     {
        //         schema,
        //         // On initial WS connect: Check and verify the user JWT and only setup the subscription with a valid token
        //         onConnect: async (ctx: WsContext) => {
        //             const params =
        //                 ctx.connectionParams as unknown as WebSocketConnectionParams;
        //             try {
        //                 const decodedPayload =
        //                     await AccessTokenService.instance.verifyAsync(
        //                         params.accessToken
        //                     );
        //                 console.log(
        //                     `[ws-server] - ${new Date().toISOString()} - ${
        //                         decodedPayload.email
        //                     } has opened an authenticated web socket connection.`
        //                 );
        //             } catch (error) {
        //                 (ctx.extra as WsContextExtra).socket.close(
        //                     4401,
        //                     "Unauthorized"
        //                 ); // This will force the client to NOT reconnect
        //             }
        //             return true;
        //         },
        //         // Every following subscription access will uses the initial JWT (from the "onConnect") in the connectionParams
        //         context: (ctx: WsContext) => {
        //             return getGraphqlSubContext(
        //                 ctx.connectionParams as unknown as WebSocketConnectionParams
        //             );
        //         },
        //     },
        //     wsServer
        // );
    });
}

bootstrap();

