/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck

import { Route } from "react-router-dom";
import DispenseError from "../pages/dashboard/userLogs/components/dispensError";
import FeedBack from "../pages/dashboard/userLogs/components/feedback";

const complaintRoute = (
  <Route path="/complain">
    <Route path="dispense-error" element={<DispenseError />} />
    <Route path="feedback" element={<FeedBack />} />
  </Route>
);
export { complaintRoute };
