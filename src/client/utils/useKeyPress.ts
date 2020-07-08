import { useEffect } from "react";

export function useKeyPress(
  targetKey: string,
  opts: { metaKey?: boolean } = {},
  cb: () => any
) {
  useEffect(() => {
    function downHandler(event: KeyboardEvent) {
      if (event.key !== targetKey) return;

      if (!opts.metaKey && !event.metaKey && !event.ctrlKey) cb();

      if (!!opts.metaKey && (event.metaKey || event.ctrlKey)) cb();
    }

    window.addEventListener("keydown", downHandler);
    return () => {
      window.removeEventListener("keydown", downHandler);
    };
  }, [cb, targetKey]);
}
