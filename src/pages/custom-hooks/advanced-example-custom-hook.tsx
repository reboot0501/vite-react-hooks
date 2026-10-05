// src/pages/custom-hooks/advanced-example-custom-hook.tsx

import useFetch from "./hooks/use-fetch";

const baseUrl = "https://jsonplaceholder.typicode.com";

const AdvancdExampleCustomHook = () => {

  const { data: userData } = useFetch(baseUrl, "users");
  const { data: postData } = useFetch(baseUrl, "posts");
  const { data: commentData } = useFetch(baseUrl, "comments");

  return (
    <div>
      <h1>응용 useFetch Custom Hook</h1>
      <br />
      <h3>User</h3>
      {userData && <pre>{JSON.stringify(userData[0], null, 2)}</pre>}
      <h3>Post</h3>
      {postData && <pre>{JSON.stringify(postData[0], null, 2)}</pre>}
      <h3>Comment</h3>
      {commentData && <pre>{JSON.stringify(commentData[0], null, 2)}</pre>}
    </div>
  )
}

export default AdvancdExampleCustomHook