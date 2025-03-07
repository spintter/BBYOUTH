declare module 'suspend-react' {
  export function suspend<T>(
    fn: (...keys: any[]) => T,
    keys: any[],
    config?: {
      lifespan?: number;
      equal?: (a: any, b: any) => boolean;
    }
  ): T;
} 