import axios, { AxiosResponse, CancelTokenSource, Method } from 'axios';
import React, { useState } from 'react';

type ErrorFromApi = {
  error: string;
};

export const UsePostData = () => {
  let currentSource: CancelTokenSource | null = null;
  const [data, setData] = useState<AxiosResponse | null>(null);
  const [isInProgress, setIsInProgress] = useState(true);
  const [error, setError] = useState<ErrorFromApi | null>(null);

  const cancelRequest = () => {
    currentSource && currentSource.cancel('Axios: put request cancelled');
  };

  const POST = async ({ url = '', headers = null, content = null }) => {
    console.log('POST to API, url:', url);
    const cancelToken = axios.CancelToken;
    currentSource = cancelToken.source();
    const config = {
      url,
      method: 'post' as Method,
      data: content,
      headers: headers || {
        headers: {
          'Content-Type': 'application/json',
        },
        cancelToken: currentSource.token,
      },
    };

    try {
      const response = await axios(config).then((response) =>
        setData(response)
      );
      return response;
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log('Request canceled', error.message);
        return;
      } else {
        const errorMsg = {
          error: 'It was not possible to post the content',
        };
        setError(errorMsg);
        setIsInProgress(false);
        return errorMsg;
      }
    }
  };

  const DELETE = async ({ url = '', headers = null, content = null }) => {
    console.log('DELETE to API, url:', url);
    const cancelToken = axios.CancelToken;
    currentSource = cancelToken.source();
    const config = {
      url,
      method: 'delete' as Method,
      data: content,
      headers: headers || {
        headers: {
          'Content-Type': 'application/json',
        },
        cancelToken: currentSource.token,
      },
    };
    try {
      const res = await axios(config);
      setData(res);
      return res;
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log('Request canceled', error.message);
        return;
      } else {
        const errorMsg = {
          error: 'It was not possible to delete the content',
        };
        setError(errorMsg);
        return errorMsg;
      }
    }
  };

  return { data, isInProgress, error, API: { POST, DELETE }, cancelRequest };
};
