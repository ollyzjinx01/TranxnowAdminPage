/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck

import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { defaultUrl } from "../redux/constant";
import { toast } from "react-toastify";
import { decrypt } from "decrypt-core";
import { DECRYPTIONKEY } from "../redux/constant";

const url = defaultUrl;

type Config = {
  url: string;
  body: any;
  header?: Record<string, string>;
  message?: boolean;
  defaultResponse?: boolean;
};

export const postData = async ({
  url,
  body,
  header,
  message,
  defaultResponse = false,
}: Config) => {
  try {
    const request = await axios.post(`${defaultUrl}/${url}`, body, {
      headers: {
        ...header,
        "Access-control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      proxy: {
        host: "104.236.174.88",
        port: 3128,
      },
    });

    const responseFromApi = request;

    const response = request?.data?.data;
    const decrypted = defaultResponse
      ? decrypt(response, DECRYPTIONKEY)
      : response;
    return { response, decrypted };
  } catch (error: AxiosError) {
    const errorMessage = error?.response?.data?.message;
    const errorStatusCode = error?.response?.status;

    if (errorStatusCode === 401) {
      return;
    } else {
      message === false ? "" : toast.error(errorMessage, {});
    }

    throw error;
  }
};

type TgetData = {
  endpoint: string;
  body?: any;
  nextPrev?: any;
  page?: boolean;
  responseAction?: boolean;
};

export const useFetch = ({
  endpoint,
  body,
  nextPrev,
  page,
  responseAction,
}: TgetData) => {
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [err, setErr] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const requestData = { ...body };
        if (!page) {
          requestData._page = nextPrev;
        }

        const { response, decrypted } = await postData({
          url: endpoint,
          body: requestData,
          defaultResponse: responseAction,
          header: {
            Authorization: `Bearer ${localStorage.getItem("_authToken")}`,
          },
        });

        setData(decrypted);
      } catch (err) {
        setErr(err?.response);
        return;
      }

      setIsLoading(false);
    };

    fetchData();
  }, [nextPrev, page]);

  return { data, isLoading, err };
};
