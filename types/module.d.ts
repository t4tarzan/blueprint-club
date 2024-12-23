declare module '@boxyhq/saml-jackson' {
  export interface SAMLConfig {
    acsUrl: string;
    entityId: string;
    tenant: string;
    product: string;
    metadata?: string;
  }

  export interface SAMLProfile {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    name?: string;
  }
}

declare module '@boxyhq/scim-server' {
  export interface SCIMUser {
    id: string;
    userName: string;
    name: {
      givenName: string;
      familyName: string;
    };
    emails: Array<{
      value: string;
      primary?: boolean;
    }>;
    active: boolean;
  }

  export interface SCIMGroup {
    id: string;
    displayName: string;
    members: Array<{
      value: string;
      display: string;
    }>;
  }
}

declare module '@boxyhq/scim-server-node' {
  export interface SCIMServerConfig {
    tenant: string;
    product: string;
    apiKey: string;
  }

  export class SCIMServer {
    constructor(config: SCIMServerConfig);
    handleRequest(req: any, res: any): Promise<void>;
  }
}

declare module '@tanstack/react-query' {
  export interface UseQueryOptions<
    TQueryFnData = unknown,
    TError = unknown,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey,
  > {
    queryKey: TQueryKey;
    queryFn: QueryFunction<TQueryFnData, TQueryKey>;
    enabled?: boolean;
    retry?: boolean | number | ((failureCount: number, error: TError) => boolean);
    retryDelay?: (retryAttempt: number) => number;
    staleTime?: number;
    cacheTime?: number;
    refetchInterval?: number | false;
    refetchIntervalInBackground?: boolean;
    refetchOnWindowFocus?: boolean;
    refetchOnReconnect?: boolean;
    notifyOnChangeProps?: Array<keyof InfiniteQueryObserverResult>;
    notifyOnChangePropsExclusions?: Array<keyof InfiniteQueryObserverResult>;
  }
}

declare module 'plaiceholder/dist/types' {
  export interface GetPlaiceholderSrc {
    src: string;
    width?: number;
    height?: number;
    quality?: number;
    format?: string;
  }

  export interface GetPlaiceholderReturn {
    base64: string;
    img: {
      src: string;
      width: number;
      height: number;
      type: string;
    };
  }
}
