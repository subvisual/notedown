import { useEffect } from "react";

export function useKeyPress(
  targetKey: string,
  opts: { metaKey?: boolean } = {},
  cb: () => any
) {
  useEffect(() => {
    function downHandler({ key, metaKey }: KeyboardEvent) {
      if (key === targetKey && !!opts.metaKey === metaKey) {
        cb();
      }
    }

    window.addEventListener("keydown", downHandler);
    return () => {
      window.removeEventListener("keydown", downHandler);
    };
  }, [cb, targetKey]);
}
