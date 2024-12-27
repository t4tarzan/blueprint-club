import { NextApiRequest, NextApiResponse } from 'next';

declare module 'node-mocks-http' {
  export interface RequestOptions {
    method?: string;
    url?: string;
    query?: { [key: string]: string };
    params?: { [key: string]: string };
    body?: any;
    headers?: { [key: string]: string };
    session?: any;
  }

  export interface ResponseOptions {
    locals?: { [key: string]: any };
  }

  export interface MockResponse extends NextApiResponse {
    _getJSONData(): any;
    _getData(): string;
    _getStatusCode(): number;
    _getHeaders(): { [key: string]: string };
  }

  export function createRequest(options?: RequestOptions): NextApiRequest;
  export function createResponse(options?: ResponseOptions): MockResponse;
  export function createMocks(reqOptions?: RequestOptions, resOptions?: ResponseOptions): {
    req: NextApiRequest;
    res: MockResponse;
  };
}
