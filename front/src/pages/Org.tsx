import { Box, Card, CardContent, Chip, Divider, List, Paper, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CardShortDesc } from "../components/CardShortDesc";
import { orgController } from "../controllers/org";
import { postController } from "../controllers/post";
import { useDispatch } from "../hooks/useRedux";
import { OrgFromServer } from "../models/org";
import { PostFromServer } from "../models/post";

export const OrgPage = () => {
  const { orgId } = useParams();
  const numOrgId = parseInt(orgId as string);
  const [org, setOrg] = useState<OrgFromServer | null>(null);
  const [posts, setPosts] = useState<PostFromServer[] | null>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    orgController
      .getOrgById(numOrgId)
      .then((org) => setOrg(org))
      .then(() => {
        postController
          .getPostsByOrgId(numOrgId, dispatch)
          .then((posts) => setPosts(posts));
      });
  }, [orgId]);

  return (
    <Box sx={{margin: '60px auto 0 auto',
    // display: 'flex', alignItems: 'center', flexDirection: 'column'
    }}>
      <Card sx={{ width: 275, mb: 5 }}>
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            страница организации
          </Typography>
          <Typography variant="h4" component="div">
            {org?.name}
          </Typography>
          <Typography sx={{ mt: 0.5 }} color="text.secondary">
            контакты
          </Typography>
          <Typography variant="body2">
            {org?.contacts}
          </Typography>
        </CardContent>
      </Card>

      <Divider sx={{width: '100%'}} orientation='horizontal'>
        <Chip label="Посты" />
      </Divider>

      <List
        sx={{
          "& .MuiPaper-root": {
            mt: 3,
          },
        }}
      >
        {posts?.map((post, index) => (
          <Paper sx={{ mt: 5 }}>
            <CardShortDesc
              postId={post.id}
              key={index}
              name={post.name}
              orgName={post["org_name"]}
              canSelect={false}
              desc={post["short_desc"]}
              btnText="---"
            />
          </Paper>
        ))}
      </List>
    </Box>
  );
};
