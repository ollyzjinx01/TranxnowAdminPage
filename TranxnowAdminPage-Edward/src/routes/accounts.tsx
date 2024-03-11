import { Route } from "react-router-dom";
import AccountNumbers from "../pages/dashboard/accounts";
import AccountManager from "../pages/dashboard/accounts/accountManager";
import AccountAgent from "../pages/dashboard/accounts/accountAgent";
import AccountUsers from "../pages/dashboard/accounts/users";

const accountRouters = (
  <Route path="/account">
    <Route path="accounts" element={<AccountNumbers />} />
    <Route path="account-manager" element={<AccountManager />} />
    <Route path="agents" element={<AccountAgent />} />
    <Route path="users" element={<AccountUsers />} />
  </Route>
);
export { accountRouters };
