import { NextFunction } from "./next_function";
import { Context } from "../context";
import { Handler } from "../handler";

export const compose = (...middlewares: Handler[]) => {
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
        } else if (typeof middleware === "function") {
          resolver = middleware(context, call.bind(null, i + 1));
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
