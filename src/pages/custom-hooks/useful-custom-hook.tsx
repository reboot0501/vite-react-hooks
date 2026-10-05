// src/pages/custom-hooks/useful-custom-hook.tsx

import useFetch from "./hooks/use-fetch";

const baseUrl = "https://jsonplaceholder.typicode.com";

const UsefullCustomHook = () => {
  // custom hook useFetch 사용
  const { data, fetchUrl } = useFetch(baseUrl, "users");

  return (
    <div>
      <h2>useFetch</h2>
      <button onClick={() => fetchUrl("users")}>Users</button>
      <button onClick={() => fetchUrl("posts")}>Posts</button>
      <button onClick={() => fetchUrl("comments")}>Comments</button>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}

export default UsefullCustomHook