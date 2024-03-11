/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck

import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import SignIn from "../pages/auth/sign_in";
import Home from "../pages/dashboard/home/home";
import Transaction from "../pages/dashboard/transactions";
import Statement from "../pages/dashboard/statement";
import Report from "../pages/dashboard/report";
import Settings from "../pages/dashboard/settings";
import Usersers from "../pages/dashboard/users";
import { logRouter } from "./log/logRoute";
import { accountRouters } from "./accounts";
import LogWallet from "../pages/dashboard/userLogs/wallet";
import { complaintRoute } from "./compalains";
import WalletTransactions from "../pages/dashboard/otherLogs/walletTransactions";
import {
  getAdminUsers,
  getBankList,
  getTotalWalletTransactions,
  getWalletTransactions,
} from "../utils/indexRequest";
import { getAgents } from "../utils/indexRequest";
import { getAppUseres } from "../utils/indexRequest";
import { getFeedBacks } from "../utils/indexRequest";
import { getDispenseErrors } from "../utils/indexRequest";
import { getAgentManagers } from "../utils/indexRequest";
import { getTotalPosReversals } from "../redux/slice/totalCountSlice";
import IndexSettlement from "../pages/dashboard/settlement";
import { groupingRoute } from "./grouping";
import IndexGrouping from "../pages/dashboard/group";
import AssignGroup from "../pages/dashboard/group/assign-group";
import IndexAssignGroupItem from "../pages/dashboard/group/assign-group";

const RouteContainer = () => {
  getAdminUsers();
  getAgents();
  getAppUseres();
  getFeedBacks();
  getDispenseErrors();
  getAgentManagers();
  getTotalPosReversals();
  getWalletTransactions();
  getTotalWalletTransactions();
  getBankList();

  return (
    <Router>
      <Routes>
        {localStorage.getItem("_authToken") ? (
          <>
            <Route path="/" element={<Home />} />
            <Route path="/home/transactions" element={<Transaction />} />
            <Route path="/home/statements" element={<Statement />} />
            <Route path="/home/users" element={<Usersers />} />
            <Route path="/home/reports" element={<Report />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/admin/settlement" element={<IndexSettlement />} />

            <Route path="/home/logs/wallet" element={<LogWallet />} />
            <Route
              path="/home/logs/walletTransactions"
              element={<WalletTransactions />}
            />

            <Route path="/home/grouping" element={<IndexGrouping />} />
            {/* <Route
              path="/home/assign-group"
              element={<IndexAssignGroupItem />}
            /> */}

            {logRouter}
            {accountRouters}
            {complaintRoute}
            {groupingRoute}
          </>
        ) : (
          <Route path="/" element={<SignIn />} />
        )}
      </Routes>
    </Router>
  );
};
export default RouteContainer;
