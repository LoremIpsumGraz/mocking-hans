import 'reflect-metadata';
import {Metadata, RouteDefinition, SocketDefinition} from './Model';
import {JsonResponse, Response, XmlFromJsonResponse, FileResponse} from './Response';
import {State} from './Utility';
import chalk from 'chalk';
import WebSocket = require('ws');
import * as url from 'url';
import * as express from 'express';
import * as morgan from 'morgan';
import * as bodyParser from 'body-parser';
import * as path from 'path';

interface HansOptions {
  publicDirectory: string;
}

// Let's be honest here: I've always wanted to name a class "Hans".
export class Hans {
  private appInstances: Map<string, object> = new Map<string, object>();

  /**
   * Hans-wide state, shared across all applications; will be injected to application constructors as first argument.
   */
  private state: State = new State();

  constructor(protected apps: Array<{ new(...args: any[]) }>) {
  }

  public async bootstrap(options: HansOptions) {
    if (this.apps.length === 0) {
      // tslint:disable-next-line
      console.error("Nothing to mock. Farewell, friend.");
    }

    this.apps.forEach((app) => {
      const expressApp: express.Application = express();
      expressApp.use(express.static(options.publicDirectory));
      expressApp.use(bodyParser.json());

      const port = Reflect.getMetadata(Metadata.Port, app);
      const name = Reflect.getMetadata(Metadata.Name, app);

      this.applyLogger(expressApp, name, port);

      const server = require('http').Server(expressApp);
      server.listen(port, () => {
        // tslint:disable-next-line
        console.info(`\t✔️  Started ${chalk.underline(name)} on localhost:${chalk.bold(port)}`);
      });

      const io = require('socket.io')(server);
      this.registerSockets(app, io);
      this.registerWebsockets(app, server);
      this.registerRoutes(app, expressApp, io);
    });
  }

  private registerSockets(app, io) {
    const sockets  = Reflect.getMetadata(Metadata.SocketIORoutes, app) as Array<SocketDefinition>;
    const instance = this.getAppInstance(app);

    sockets.forEach(socket => {
      const s = io.of(socket.namespace);
      s.on(socket.event, sock => instance[socket.methodName](sock));
    });
  }

  private registerWebsockets(app, server) {
    const sockets  = Reflect.getMetadata(Metadata.NativeSocketRoutes, app) as Array<SocketDefinition>;
    const port     = Reflect.getMetadata(Metadata.Port, app);
    const name     = Reflect.getMetadata(Metadata.Name, app);
    const instance = this.getAppInstance(app);

    sockets.forEach(websocket => {
      const wss = new WebSocket.Server({
        noServer: true,
        perMessageDeflate: false,
      });

      wss.on(websocket.event, function (ws) {
        instance[websocket.methodName](ws);
      });

      server.on('upgrade', function (request, socket, head) {
        if (url.parse(request.url).pathname !== websocket.namespace) {
          return;
        }
        // tslint:disable-next-line
        console.info(`${chalk.underline(name)} (:${port}): ` + [
          'WS',
          chalk.bold(websocket.event),
          websocket.namespace,
        ].join(' '));
        wss.handleUpgrade(request, socket, head, function done(ws) {
          wss.emit(websocket.event, ws, request);
        });
      });
    });
  }

  private registerRoutes(app, expressApp, io) {
    const routes     = Reflect.getMetadata(Metadata.Routes, app) as Array<RouteDefinition>;
    const middleware = Reflect.getMetadata(Metadata.Middleware, app) as
      Map<string, (req: express.Request, res: express.Response, next: express.NextFunction) => void>;
    const instance   = this.getAppInstance(app);

    if (Reflect.hasMetadata(Metadata.AppMiddleware, app)) {
      const appMiddleware = Reflect.getMetadata(Metadata.AppMiddleware, app);
      appMiddleware.forEach(callback => expressApp.use(callback));
    }

    routes.forEach(route => {
      if (middleware instanceof Map) {
        const callbacks = middleware.get(route.methodName);
        if (Array.isArray(callbacks)) {
          callbacks.forEach(callback => expressApp.use(route.path, callback));
        }
      }

      expressApp[route.requestMethod](route.path, (req, res, next) => {
        const cb = instance[route.methodName](req, res, next, io);

        if (!(cb instanceof Response)) {
          return cb;
        }

        res.status(cb.getStatusCode());
        res.set(cb.getHeaders());

        if (cb instanceof FileResponse) {
          return res.sendFile(path.join(__dirname, '../public', cb.getFilename()));
        }

        if (cb instanceof JsonResponse) {
          return res.json(cb.getContent());
        }

        if (cb instanceof XmlFromJsonResponse) {
          res.set('Content-Type', 'text/xml');
        }

        return res.send(cb.getContent());
      });
    });
  }

  private applyLogger(expressApp, name, port) {
    expressApp.use(morgan((tokens, req, res) => {
      const status = tokens.status(req, res);

      return `${chalk.underline(name)} (:${port}): ` + [
        tokens.method(req, res),
        tokens.url(req, res),
        status.toString().charAt(0) === '4' ? chalk.red.bold(status) : chalk.bold(status),
        tokens['response-time'](req, res),
        'ms',
      ].join(' ');
    }));
  }

  private getAppInstance(app: { new(...args: any[]) }) {
    const name = Reflect.getMetadata(Metadata.Name, app);

    if (!this.appInstances.has(name)) {
      this.appInstances.set(name, new app(this.state));
    }

    return this.appInstances.get(name);
  }
}
