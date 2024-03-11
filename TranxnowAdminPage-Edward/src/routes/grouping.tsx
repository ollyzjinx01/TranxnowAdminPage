/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck

import { Route } from "react-router-dom";
import IndexGrouping from "../pages/dashboard/group";

const groupingRoute = (
  <Route path="/grouping" element={<IndexGrouping />}>
    <Route path="agent" element={<IndexGrouping />} />
  </Route>
);
export { groupingRoute };
