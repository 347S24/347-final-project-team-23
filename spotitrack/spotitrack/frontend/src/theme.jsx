// theme.js
import { createTheme } from "@mui/material/styles";

export const getTheme = (mode) =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: mode === "dark" ? "#7E5AD8" : "#7b1fa2",
      },
      secondary: {
        main: mode === "dark" ? "#5dda82" : "#1b5e20",
      },
      background: {
        default: mode === "dark" ? "#121212" : "#f5f5f5",
      },
      text: {
        primary: mode === "dark" ? "#ffffff" : "#000000",
      },
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      button: {
        textTransform: "none",
      },
    },

    breakpoints: {
      values: {
        xs: 0,
        sm: 700,
        md: 1000,
        lg: 1200,
        xl: 1400,
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            margin: "8px", // Spacing around buttons
            "&:focus": {
              outline: "none", // Removes outline on focus
            },
            // padding: "15px", // Padding around text in buttons
            minWidth: "100px", // Minimum width of buttons
            size: "large", // Increases the size of buttons
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            "&:focus": {
              outline: "none", // Removes outline on focus
            },
          },
        },
      },
      MuiCardActionArea: {
        styleOverrides: {
          root: {
            "&:focus": {
              outline: "none", // Removes outline on focus
            },
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            margin: "8px", // Spacing around text fields
          },
        },
      },
      // You can add additional components here if needed
      MuiLink: {
        styleOverrides: {
          root: {
            color: "primary",
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            margin: "8px", // Spacing around cards
          },
        },
      },
      MuiCardContent: {
        styleOverrides: {
          root: {
            padding: "8px", // Padding around card content
            backgroundColor: "background.default", // Sets the background color of cards
          },
        },
      },
      MuiCardActions: {
        styleOverrides: {
          root: {
            padding: "8px", // Padding around card actions
            backgroundColor: "background.default", // Sets the background color of card actions
          },
        },
      },

      // BASELINE CSS, AFFECTS ENTIRE APP
      MuiCssBaseline: {
        styleOverrides: {
          ":root": {
            textAlign: "center",
          },
          body: {
            a: {
              color: "inherit", // Ensures links use the inherited text color
              textDecoration: "none", // Removes underline by default
              "&:hover": {
                color: "primaryPallete", // Changes text color to primary on hover
              },
            },
          },
        },
      },
    },
  });
