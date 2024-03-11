/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck

import { Route } from "react-router-dom";
import AirtimeLog from "../../pages/dashboard/userLogs/airtime";
import DataLog from "../../pages/dashboard/userLogs/dataLog";
import ElectricityLog from "../../pages/dashboard/userLogs/electricityLog";
import TvLog from "../../pages/dashboard/userLogs/tv";
import FundTransfer from "../../pages/dashboard/userLogs/fundTransfer";
import PosLogs from "../../pages/dashboard/otherLogs/pos";
import PosReversal from "../../pages/dashboard/otherLogs/posReversal";
import LogHistories from "../../pages/dashboard/pages/history";

const logRouter = (
  <Route path="/home/logs">
    <Route path="airtime" element={<AirtimeLog />} />
    <Route path="data" element={<DataLog />} />
    <Route path="electricity" element={<ElectricityLog />} />
    <Route path="transfer" element={<FundTransfer />} />
    <Route path="tv" element={<TvLog />} />
    <Route path="wallet" element={<TvLog />} />
    <Route path="pos-reversal" element={<PosReversal />} />
    <Route path="pos" element={<PosLogs />} />
    <Route path="history" element={<LogHistories />} />
  </Route>
);

export { logRouter };
