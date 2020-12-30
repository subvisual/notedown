import * as React from "react";

export const useEditorKeydown = (
  ref: React.MutableRefObject<HTMLDivElement>
) => {
  React.useLayoutEffect(() => {
    if (!ref.current) return;

    const localHandler = (e: KeyboardEvent) => {
      e.stopPropagation();
    };

    ref.current.addEventListener("keydown", localHandler);

    return () => ref.current.removeEventListener("keydown", localHandler);
  }, [ref.current]);
};
