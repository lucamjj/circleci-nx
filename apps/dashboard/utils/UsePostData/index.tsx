import axios, { Method } from 'axios';
import React, { useState } from 'react';

const UsePostData = ({ url = null, headers = null }) => {
  let currentSource = null;
  const [data, setData] = useState(null);
  const [isInProgress, setIsInProgress] = useState(true);
  const [error, setError] = useState(null);

  const cancelRequest = () => {
    currentSource && currentSource.cancel('Axios: put request cancelled');
  };

  const POST = async (content) => {
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

  return { data, isInProgress, error, API: { POST }, cancelRequest };
};

export default UsePostData;
