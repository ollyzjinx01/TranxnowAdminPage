/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
import { RiHome6Line } from "react-icons/ri";
import { AiOutlineSetting } from "react-icons/ai";
import { BiCoinStack } from "react-icons/bi";
import { FaChartBar } from "react-icons/fa";
import { MdOutlineFeedback } from "react-icons/md";
import { RiAccountPinBoxLine } from "react-icons/ri";
import React from "react";
import { GrGroup } from "react-icons/gr";

type TSideItems = {
  name: string;
  icon: React.ReactElement;
  path?: string;
  menu?: [];
};

export const SidebarItems: TSideItems[] = [
  {
    name: "Home",
    icon: <RiHome6Line size={"1.2em"} />,
    path: "/",
  },

  {
    name: "Grouping",
    icon: <BiCoinStack size={"1.2em"} />,
    path: "/home/grouping",
  },

  // {
  //   name: "Settlement",
  //   icon: <BiCoinStack size={"1.2em"} />,
  //   path: "/admin/settlement",
  // },
  // {
  //   name: "Transactions",
  //   icon: <BsCreditCard size={"1.2em"} />,
  //   path: "/home/transactions",
  // },

  {
    name: "Transactions",
    icon: <FaChartBar size={"1.2em"} />,

    menu: [
      // {
      //   title: "Airtime",
      //   path: "/home/logs/airtime",
      // },

      {
        title: "Fund Transfer",
        path: "/home/logs/transfer",
      },
      // {
      //   title: "Get Data",
      //   path: "/home/logs/data",
      // },
      // {
      //   title: "History",
      //   path: "/home/logs/history",
      // },
      // {
      //   title: "Electricity",
      //   path: "/home/logs/electricity",
      // },

      // {
      //   title: "TV",
      //   path: "/home/logs/tv",
      // },
      {
        title: "POS",
        path: "/home/logs/pos",
      },
      {
        title: "Pos Reverse",
        path: "/home/logs/pos-reversal",
      },
    ],
  },

  {
    name: "Complains",
    icon: <MdOutlineFeedback size={"1.2em"} />,
    menu: [
      {
        title: "Dispense Error",
        path: "/complain/dispense-error",
      },
      {
        title: "Feedback",
        path: "/complain/feedback",
      },
    ],
  },

  {
    name: "Account",
    icon: <RiAccountPinBoxLine size={"1.2em"} />,
    menu: [
      {
        title: "Wallet Transactions",
        path: "/home/logs/walletTransactions",
      },
      {
        title: "Wallet",
        path: "/home/logs/wallet",
      },
      {
        title: "Accounts",
        path: "/account/accounts",
      },
      {
        title: "Agent Manager",
        path: "/account/account-manager",
      },
      {
        title: "Application Users",
        path: "/account/users",
      },
      {
        title: "Agents",
        path: "/account/agents",
      },
    ],
  },

  {
    name: "Settings",
    icon: <AiOutlineSetting size={"1.2em"} />,
    menu: [
      {
        title: "Admin Users",
        path: "/home/users",
      },
    ],
  },
];
