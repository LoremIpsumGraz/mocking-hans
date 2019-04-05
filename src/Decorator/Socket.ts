import 'reflect-metadata';
import {Metadata, SocketDefinition} from '@loremipsum/mocking-hans/model';

export const Socket = (event: string, namespace: string = '/'): MethodDecorator => {
  return (target: any, propertyKey: string): void => {
    if (!Reflect.getMetadata(Metadata.SocketIORoutes, target.constructor)) {
      Reflect.defineMetadata(Metadata.SocketIORoutes, [], target.constructor);
    }

    const sockets = Reflect.getMetadata(Metadata.SocketIORoutes, target.constructor) as Array<SocketDefinition>;

    sockets.push({
      event,
      namespace,
      methodName: propertyKey
    });
  };
};
