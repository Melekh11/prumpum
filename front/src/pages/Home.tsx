import React, { useEffect } from "react";
import { useDispatch, useSelector } from "../hooks/useRedux";
import { allPostsSelector, type PostData } from "../redux/slices/post";
import { Alert, Box, Divider, List, Paper, Typography } from "@mui/material";
import { CardShortDesc } from "../components/CardShortDesc";
import { postModel } from "../models/post";
import { postController } from "../controllers/post";
import { FormPaper } from "../components/FormPaper";
import { userSelector } from "../redux/slices/user";
import { PostValues } from "./CreatePost";
import { styled } from '@mui/material/styles';

const ContentBlock = styled(Box)( ({theme}) => ({
  width: '100%',
  padding: theme.spacing(1),
  margin: 'auto',
  display: "flex",
  justifyContent: "center",
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column-reverse',
  },
  [theme.breakpoints.up('md')]: {
    flexDirection: 'row',
  },
}));

export const HomePage = () => {
  const posts = useSelector(allPostsSelector);
  const dispatch = useDispatch();

  const user = useSelector(userSelector);
  const isModer = !(user.positions.filter((pos) => pos.status === "moder")
    .length === 0);

  const newPosts: PostData[] = [];
  const selfPost: PostData[] = [];
  const userOrgNames = user.positions.map((pos) => {
    return pos.org;
  });

  posts.forEach((post: PostData) => {
    if (userOrgNames.includes(post.orgName)) {
      selfPost.push(post);
    } else {
      newPosts.push(post);
    }
  });

  useEffect(() => {
    postController.getAllPosts(dispatch);
  }, []);

  return (
    <ContentBlock>
      <Box
        sx={{
          alignSelf: "center",
          marginTop: "0 auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          "& .MuiCardContent-root": { m: "10px 0" },
          "& .MuiCardShortDesc-root": { m: "10px 0" },
          p: 5,
          borderRadius: 6
        }}
      >
        <Typography mt={5} variant="h6">
          Возможно, вам будут интересны эти заявки
        </Typography>
        <List>
          {newPosts.map((post) => (
            <Paper sx={{ margin: "0 10px" }}>
              <CardShortDesc
                key={post.id}
                postId={post.id}
                name={post.name}
                orgName={post.orgName}
                canSelect={isModer}
                desc={post.desc}
                btnText="Отозваться"
              />
            </Paper>
          ))}
        </List>
      </Box>

      <Box
        sx={{
          alignSelf: "auto",
          marginTop: "0 auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "auto",
          "& .MuiCardContent-root": { m: "10px 0" },
          "& .MuiCardShortDesc-root": { m: "10px 0" },
          p: 5,
          borderRadius: 6
        }}
      >
        <Typography mt={5} variant="h6">
          Заявки ваших проектов
        </Typography>
        <List>
          {(selfPost.length > 0)
            ? (
                selfPost.map((post, index) => (
              <Paper sx={{ margin: "0 10px" }}>
                <CardShortDesc
                  postId={post.id}
                  key={index}
                  name={post.name}
                  orgName={post.orgName}
                  canSelect={isModer}
                  desc={post.desc}
                  btnText="Редактировать"
                />
              </Paper>
                ))
              )
            : (
            <Alert severity="info">у ваших организаций ещё нет постов</Alert>
              )}
        </List>
      </Box>
    </ContentBlock>
  );
};
