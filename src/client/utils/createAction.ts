type BaseType = string;

export default function createAction<T extends BaseType>(type: T) {
  return function <K = undefined>() {
    const builder = function (payload?: K): { type: T; payload: K } {
      return {
        type,
        payload: payload,
      };
    };

    builder.type = type;

    return builder;
  };
}
