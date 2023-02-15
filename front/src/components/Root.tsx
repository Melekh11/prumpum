import React, { useState, useCallback } from "react";
import {
  Box,
  Button,
  IconButton,
  Toolbar,
  Typography,
  Drawer,
  CssBaseline,
  Divider,
  List,
  Backdrop,
  CircularProgress,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  InputBase,
} from "@mui/material";
import {
  Menu as MenuIcon,
  ChevronLeft,
  type SvgIconComponent,
  Settings,
  ExitToApp,
  AddBox,
  NoteAdd,
  Search as SearchIcon,
} from "@mui/icons-material";
import { Outlet, useNavigate } from "react-router-dom";
import MuiAppBar, {
  type AppBarProps as MuiAppBarProps,
} from "@mui/material/AppBar";
import { alpha, styled } from "@mui/material/styles";
import { ROUTES } from "../router/routerList";
import { loaderSelector } from "../redux/slices/loading";
import { useDispatch, useSelector } from "../hooks/useRedux";
import { makeStyles } from "@mui/styles";
import {
  deleteUser,
  loggedInSelector,
  type UserPosition,
  userSelector,
} from "../redux/slices/user";
import { orgController } from "../controllers/org";
import { OrgFromServer } from "../models/org";

export const drawerOpenWidth = "240px";
type IsOpen = {
  open: boolean;
};

type AppBarProps = MuiAppBarProps & IsOpen;
type MainProps = IsOpen;

interface LinkProps {
  title: string;
  icon: SvgIconComponent;
  urlFor?: ROUTES;
  isSearch?: boolean;
}

type Links = LinkProps[];

const useStyles = makeStyles({
  iconRoot: {
    transition: "all 0.3s !important",
    marginLeft: "10px !important",
    "&:hover": {
      marginLeft: "20px !important",
    },
  },
});
const links: Links = [
  {
    title: "Настройки",
    icon: (<Settings htmlColor="white" />) as unknown as SvgIconComponent,
    urlFor: ROUTES.PROFILE_SETTINGS,
  },
  {
    title: "Новый проект",
    icon: (<AddBox htmlColor="white" />) as unknown as SvgIconComponent,
    urlFor: ROUTES.CREATE_ORG,
  },
  {
    title: "Найти проект",
    icon: (<SearchIcon htmlColor="white" />) as unknown as SvgIconComponent,
    isSearch: true,
  },
];

const Search = styled("div")<IsOpen>(({ theme, open }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.35),
  opacity: 1,
  transition: theme.transitions.create(["opacity", "margin-top"], {
    easing: theme.transitions.easing.easeOut,
    duration: "200ms",
  }),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.45),
  },
  ...(!open && {
    transition: theme.transitions.create(["opacity", "margin-top"], {
      easing: theme.transitions.easing.easeOut,
      duration: "200ms",
    }),
    marginTop: "-30px",
    opacity: 0,
  }),
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "14ch",
      },
    },
  },
}));

const AppBar = styled(MuiAppBar)<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerOpenWidth})`,
    marginLeft: drawerOpenWidth,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled("div")<{ bgColor?: string }>(
  ({ theme, bgColor = "black" }) => ({
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: "flex-end",
    backgroundColor: bgColor,
  })
);

const Main = styled("main")<MainProps>(({ theme, open }) => ({
  padding: theme.spacing(3),
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerOpenWidth}`,
  ...(open && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

export const Root = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOrgs, setSelectedOrgs] = useState([] as OrgFromServer[]);
  const [isSearchOpen, setSearchOpen] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoading = useSelector(loaderSelector);

  const logged = useSelector(loggedInSelector);
  const user = useSelector(userSelector);

  const canCreatePosts = user.positions.filter((val: UserPosition) => {
    return val.status === "moder";
  });

  let linkList: Links = !logged
    ? [
        {
          title: "Войти",
          icon: (
            <ExitToApp htmlColor="white" />
          ) as unknown as SvgIconComponent,
          urlFor: ROUTES.LOGIN,
        },
      ]
    : links;

  if (canCreatePosts.length > 0) {
    linkList = [
      ...linkList,
      {
        title: "Создать Пост",
        icon: (<NoteAdd htmlColor="white" />) as unknown as SvgIconComponent,
        urlFor: ROUTES.CREATE_POST,
      },
    ];
  }

  const handleChangeSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.value)
        orgController
          .getSelectedOrgs(e.target.value)
          .then((orgs) => setSelectedOrgs(orgs));
    },
    []
  );

  const handleClickDrawer = () => {
    setIsOpen(!isOpen);
  };

  const handleClickSearch = () => setSearchOpen((open) => !open);

  const navigateToLogin = () => {
    navigate(ROUTES.LOGIN);
  };
  const navigateHome = () => {
    navigate(ROUTES.HOME);
  };

  const handleAppBarBtnClick = () => {
    if (logged) {
      dispatch(deleteUser());
      navigateHome();
    } else {
      navigateToLogin();
    }
  };

  const classes = useStyles();

  return (
    <Box minHeight={"100vh"} display={"flex"}>
      <CssBaseline />
      <AppBar
        open={isOpen}
        position="fixed"
        sx={{ backgroundColor: "#FFD643" }}
      >
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleClickDrawer}
            sx={{ mr: 2, ...(isOpen && { display: "none" }) }}
          >
            <MenuIcon htmlColor="black" />
          </IconButton>
          <Typography
            noWrap
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, color: "black", cursor: "pointer" }}
            onClick={navigateHome}
          >
            Our Lyceum
          </Typography>

          <Button sx={{ color: "black" }} onClick={handleAppBarBtnClick}>
            {logged ? "Выйти" : "Войти"}
          </Button>
        </Toolbar>
      </AppBar>

      <Drawer
        sx={{
          width: drawerOpenWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            backgroundColor: "black",
            width: drawerOpenWidth,
            boxSizing: "border-box",
          },
        }}
        variant="persistent"
        anchor="left"
        open={isOpen}
      >
        <DrawerHeader>
          <IconButton onClick={handleClickDrawer}>
            <ChevronLeft htmlColor="white" />
          </IconButton>
        </DrawerHeader>

        <Divider sx={{ width: "90%", margin: "0 auto" }} color="white" />

        <List>
          {linkList.map(({ title, icon, urlFor, isSearch }, index) => (
            <ListItem key={index} disablePadding>
              <ListItemButton
                className={classes.iconRoot}
                onClick={() => {
                  if (urlFor) {
                    navigate(urlFor);
                    handleClickDrawer();
                  }
                  if (isSearch) handleClickSearch();
                }}
              >
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText
                  sx={{
                    "& .MuiTypography-root": {
                      color: "white",
                      fontWeight: 600,
                      fontSize: "1.2rem",
                      mr: 5,
                    },
                  }}
                  primary={title}
                />
              </ListItemButton>
            </ListItem>
          ))}

          <ListItem key={linkList.length + 10}>
            <Search open={isSearchOpen}>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                onChange={handleChangeSearch}
                disabled={!isSearchOpen}
                placeholder="Search…"
                inputProps={{ "aria-label": "search" }}
              />
            </Search>
          </ListItem>
        </List>

        {selectedOrgs.map(({ name, id }) => (
          <Typography
            sx={{
              m: '0 2px',
              cursor: 'pointer',
              color: "#fff",
              "&:hover": {
                color: "white",
              },
            }}
            variant="overline"
            onClick={() => {
              navigate(`${ROUTES.ORG}/${id}`);
            }}
          >
            {name}
          </Typography>
        ))}

      </Drawer>

      <Main sx={{ display: "flex", width: "100%" }} open={isOpen}>
        <DrawerHeader bgColor="white" />
        <Outlet />
      </Main>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
};
