import axios, { Method } from 'axios';
import React, { useState } from 'react';

const UsePostData = () => {
  let currentSource = null;
  const [data, setData] = useState(null);
  const [isInProgress, setIsInProgress] = useState(true);
  const [error, setError] = useState(null);

  const cancelRequest = () => {
    currentSource && currentSource.cancel('Axios: put request cancelled');
  };

  const POST = async ({ url = null, headers = null, content = null }) => {
    console.log('POST to API');
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
    await axios(config)
      .then((response) => setData(response))
      .catch((error) => {
        if (axios.isCancel(error)) {
          console.log('Request canceled', error.message);
        } else {
          setError({
            error: 'It was not possible to post the content',
          });
        }
      })
      .finally(() => setIsInProgress(false));
  };

  const DELETE = async ({ url = null, headers = null, content = null }) => {
    console.log(`(UsePostData) Delete element ${content} in API`);
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

export default UsePostData;
