// src/pages/custom-hooks/hooks/use-fetch.tsx

import { useEffect, useState } from "react";

const useFetch = (baseUrl: string, initialType: string) => {

  const [data, setData] = useState<any>(null);

  const fetchUrl = (type: string) => {
    fetch(`${baseUrl}/${type}`)
      .then((response) => response.json())
      .then((result) => setData(result));
  };

  useEffect(() => {
    fetchUrl(initialType);
  }, []);

  // 반환값이 많아질 때 뛰어난 확장성 -> 객체로 리턴
  return {
    data,
    fetchUrl
  };
}

export default useFetch