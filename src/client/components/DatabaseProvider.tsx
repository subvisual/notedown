import * as React from "react";
import { useDispatch, useSelector } from "react-redux";

import { databaseLoad } from "database";
import { createDatabase } from "models/database";
import { getDb } from "../selectors";
import { themeLoad } from "../theme";

export const DatabaseProvider = ({ children }: { children: any }) => {
  const dispatch = useDispatch();
  const db = useSelector(getDb);

  React.useEffect(() => {
    if (!dispatch) return;

    (async () => {
      const db = await createDatabase();

      dispatch(databaseLoad({ db }));
    })();
  }, [dispatch]);

  React.useEffect(() => {
    if (!dispatch || !db) return;

    dispatch(themeLoad());
  }, [db, dispatch]);

  if (!db) return null;

  return <>{children}</>;
};
