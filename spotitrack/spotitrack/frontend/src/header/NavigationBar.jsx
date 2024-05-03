import * as React from "react";
import { useCallback } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useNavigate, useLocation, Link } from "react-router-dom";

import PropTypes from "prop-types";
import { ThemeProvider } from "@mui/system";

NavigationBar.propTypes = {
  theme: PropTypes.object.isRequired,
};
// These will decide whats placed in the nav bar
let pages = [];
let settings = [];

function NavigationBar(props) {
  // Grabs user (null if logged out)
  const location = useLocation();
  const user = location.state ? location.state.user : null;
  const theme = props.theme;

  console.log("user in the nav bar: ", user);

  const logout = useCallback(async () => {
    try {
      const response = await fetch("users/api/logout", { method: "GET" });
      const text = await response.text();
      console.log("Response text:", text);
      if (response.ok) {
        const data = JSON.parse(text);
        console.log("Logged out successfully", data);
        navigate("/");
      } else {
        throw new Error("Failed to log out");
      }
    } catch (error) {
      console.error("Failed to log out", error);
    }
  }, []);

  if (user) {
    settings = ["Logout"];
    pages = [];
  } else {
    settings = ["Login"];
    pages = [];
  }

  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const navigate = useNavigate();

  const handleLoginSignupClick = (route) => {
    if (route === "logout") {
      // For now, just navigate to the home page
      // navigate("/");
      logout();

      handleCloseUserMenu();
      return;
    } else {
      navigate(`/${route}`); // Navigate to the sign-in/sign-up page
      handleCloseUserMenu(); // Assuming you have this function to close the menu
    }
  };

  // component
  return (
    // Small (mobile) nav bar
    <AppBar position="static">
      <ThemeProvider theme={theme}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <AdbIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
            <MenuItem onClick={() => navigate("/")}>
              <Typography
                variant="h6"
                noWrap
                component="a"
                href="/"
                sx={{
                  mr: 2,
                  display: { xs: "none", md: "flex" },
                  fontFamily: "monospace",
                  fontWeight: 700,
                  letterSpacing: ".3rem",
                  color: "primary",
                  textDecoration: "none",
                }}
              >
                SPOTITRACK
              </Typography>
            </MenuItem>

            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: "block", md: "none" },
                }}
              >
                {pages.map((page) => (
                  <MenuItem key={page.anchor} onClick={handleCloseNavMenu}>
                    <Link
                      to={page.to}
                      onClick={() => navigate(`/${page.anchor.toLowerCase()}`)}
                    >
                      <Typography textAlign="center">{page.label}</Typography>
                    </Link>
                  </MenuItem>
                ))}
              </Menu>
            </Box>

            {/* Large (desktop) nav bar */}
            <AdbIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
            <Typography
              variant="h5"
              noWrap
              component="a"
              href="/"
              sx={{
                mr: 2,
                display: { xs: "flex", md: "none" },
                flexGrow: 1,
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              SPOTITRACK
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
              {pages.map((page) => (
                <MenuItem key={page.anchor}>
                  <Link to={page.to} onClick={() => page.anchor}>
                    <Typography textAlign="center">{page.label}</Typography>
                  </Link>
                </MenuItem>
              ))}
            </Box>

            {/* For later, responsive to be profile icon, a picture, or letter after logging in. */}

            {user && (
              <Box sx={{ flexGrow: 0 }}>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar alt={user.username} src={AccountCircleIcon} />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: "45px" }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {settings.map((setting) => (
                    <MenuItem
                      key={setting}
                      onClick={() =>
                        handleLoginSignupClick(setting.toLowerCase())
                      }
                    >
                      <Typography textAlign="center">{setting}</Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
            )}
          </Toolbar>
        </Container>
      </ThemeProvider>
    </AppBar>
  );
}
export default NavigationBar;
