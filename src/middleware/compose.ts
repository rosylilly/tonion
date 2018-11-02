import { Middleware } from "./middleware";
import { NextFunction } from "./next_function";
import { Context } from "../context";

export const compose = (...middlewares: Middleware[]) => {
  return {
    call: async (context: Context, next: NextFunction) => {
      let index = -1;

      const call = (i: number) => {
        if (i <= index) { return Promise.reject(new Error("next() called multiple times")); }
        index = i;

        const middleware = middlewares[i];
        let resolver: Promise<void>;
        if (!middleware) {
          resolver = next(context);
        } else {
          resolver = middleware.call(context, call.bind(null, i + 1));
        }

        try {
          return Promise.resolve(resolver);
        } catch (error) {
          return Promise.reject(error);
        }
      };

      return call(0);
    },
  };
};
