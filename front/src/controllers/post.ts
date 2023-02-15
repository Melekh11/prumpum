import { type Dayjs } from "dayjs";
import { type PostFromServer, postModel } from "../models/post";
import { type PostValues } from "../pages/CreatePost";
import { closeLoading, setLoading } from "../redux/slices/loading";
import { type PostData, setPosts } from "../redux/slices/post";
import { type AppDispatch } from "../redux/store";

function createPost (
  postValues: PostValues & { startData: Dayjs },
  orgName: string,
  dispatch: AppDispatch
) {
  dispatch(setLoading());

  return postModel
    .createPost(postValues, orgName)
    .then(() => {
      dispatch(closeLoading());
    })
    .catch(async (err) => {
      dispatch(closeLoading());
      return Promise.reject(err);
    });
}

function getAllPosts (dispatch: AppDispatch) {
  dispatch(setLoading());

  return postModel.getAllPosts().then((posts: PostFromServer[]) => {
    const prettyPosts: PostData[] = posts.map((post) => {
      const prettyPost: PostData = {
        id: post.id,
        name: post.name,
        audience: 0,
        saveTime: 0,
        desc: post.short_desc,
        orgName: post.org_name,
        dateStart: post.date_start
      };
      return prettyPost;
    });

    dispatch(setPosts(prettyPosts));
    dispatch(closeLoading());
  });
}


function getPostsByOrgId(id: number, dispatch: AppDispatch) {
  dispatch(setLoading());

  return postModel.getAllPosts().then((posts: PostFromServer[]) => {
    dispatch(closeLoading());
    return posts.filter(post => post.id_org === id);
  })
}

export const postController = { createPost, getAllPosts, getPostsByOrgId };
