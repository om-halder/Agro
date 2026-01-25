import API from "./api";

// Get posts
export const getPosts = async () => {
  const res = await API.get("/posts");
  return res.data;
};

// Create a new post
export const createPost = async (data) => {
  const res = await API.post("/posts", data);
  return res.data;
};
