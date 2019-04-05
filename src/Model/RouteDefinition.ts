import {HttpMethod} from '@loremipsum/mocking-hans/model';

export interface RouteDefinition {
  // Path to our route
  path: string;
  // HTTP Request method (get, post, ...)
  requestMethod: HttpMethod;
  // Method name within our class responsible for this route
  methodName: string;
}
