import * as React from "react";
import { useDispatch, useSelector } from "react-redux";

import { databaseLoad } from "database";
import { createDatabase } from "models/database";
import { getDb } from "../selectors";
import { themeLoad } from "../theme";
import * as Notes from "models/notes";

export const DatabaseProvider = ({ children }: { children: any }) => {
  const dispatch = useDispatch();
  const db = useSelector(getDb);
  const [indexLoaded, setIndexLoaded] = React.useState(false);

  React.useEffect(() => {
    if (!dispatch) return;

    (async () => {
      const newDB = await createDatabase();

      dispatch(databaseLoad(newDB));
    })();
  }, [dispatch]);

  React.useEffect(() => {
    if (!dispatch || !db) return;

    dispatch(themeLoad());
    (async () => {
      await Notes.hydrateIndex(db);
      setIndexLoaded(true);
    })();
  }, [db, dispatch, setIndexLoaded]);

  if (!db || !indexLoaded) return null;

  return <>{children}</>;
};
