import { createTheme } from "@mui/material/styles";

const GOLD        = "#C9A84C";
const GOLD_LIGHT  = "#E8C96B";
const GOLD_DARK   = "#A07830";
const DARK        = "#1A1A2E";
const DARK_LIGHT  = "#16213E";
const CREAM       = "#FAF7F2";
const BLUSH       = "#F5E6E8";
const BURGUNDY    = "#722F37";

const muiTheme = createTheme({
  palette: {
    primary: {
      main: GOLD,
      contrastText: DARK,
    },
    secondary: {
      main: DARK,
      contrastText: "#ffffff",
    },
    error: {
      main: "#ef4444",
    },
    success: {
      main: "#16a34a",
    },
    warning: {
      main: "#f59e0b",
    },
    background: {
      default: CREAM,
      paper: "#ffffff",
    },
    text: {
      primary: DARK,
      secondary: `${DARK}99`,
    },
    divider: `${DARK}1A`,
  },

  shape: {
    borderRadius: 0, // Sharp corners — luxury aesthetic
  },

  typography: {
    fontFamily: '"Inter", "Helvetica Neue", Arial, sans-serif',
    button: {
      textTransform: "none",
      letterSpacing: "0.06em",
      fontWeight: 600,
    },
  },

  components: {
    // ── TextField ───────────────────────────────────────────────────────────
    MuiTextField: {
      defaultProps: {
        variant: "outlined",
        size: "small",
        fullWidth: true,
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          backgroundColor: "#ffffff",
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: `${DARK}26`,
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: GOLD,
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: GOLD,
            borderWidth: 1,
          },
          "&.Mui-error .MuiOutlinedInput-notchedOutline": {
            borderColor: "#ef4444",
          },
        },
        input: {
          fontSize: "0.875rem",
          color: DARK,
          "&::placeholder": {
            color: `${DARK}59`,
            opacity: 1,
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: "0.75rem",
          fontWeight: 600,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: `${DARK}80`,
          "&.Mui-focused": {
            color: GOLD,
          },
          "&.Mui-error": {
            color: "#ef4444",
          },
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          fontSize: "0.72rem",
          marginLeft: 0,
        },
      },
    },

    // ── Button ───────────────────────────────────────────────────────────────
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          boxShadow: "none",
          padding: "10px 20px",
          fontSize: "0.75rem",
          fontWeight: 700,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          "&:hover": {
            boxShadow: "none",
          },
          "&:focus-visible": {
            outline: `2px solid ${GOLD}`,
            outlineOffset: 2,
          },
        },
        containedPrimary: {
          background: `linear-gradient(135deg, ${GOLD} 0%, ${GOLD_DARK} 100%)`,
          color: DARK,
          "&:hover": {
            background: `linear-gradient(135deg, ${GOLD_LIGHT} 0%, ${GOLD} 100%)`,
          },
          "&.Mui-disabled": {
            background: `${GOLD}4D`,
            color: `${DARK}66`,
          },
        },
        containedSecondary: {
          backgroundColor: DARK,
          color: "#ffffff",
          "&:hover": {
            backgroundColor: DARK_LIGHT,
          },
        },
        outlinedPrimary: {
          borderColor: GOLD,
          color: DARK,
          "&:hover": {
            backgroundColor: `${GOLD}14`,
            borderColor: GOLD,
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          "&:focus-visible": {
            outline: `2px solid ${GOLD}`,
            outlineOffset: 2,
          },
        },
      },
    },

    // ── Select ───────────────────────────────────────────────────────────────
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: 0,
        },
        icon: {
          color: `${DARK}66`,
        },
      },
    },

    // ── Chip ─────────────────────────────────────────────────────────────────
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          fontWeight: 600,
          fontSize: "0.7rem",
          letterSpacing: "0.06em",
          height: 22,
        },
      },
    },

    // ── Dialog ───────────────────────────────────────────────────────────────
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 0,
          backgroundImage: "none",
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          padding: "16px 24px",
          fontWeight: 700,
          fontSize: "1.1rem",
        },
      },
    },

    // ── Drawer ───────────────────────────────────────────────────────────────
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRadius: 0,
        },
      },
    },

    // ── Tabs ─────────────────────────────────────────────────────────────────
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          fontSize: "0.875rem",
          letterSpacing: "0.03em",
          minWidth: 0,
          padding: "12px 16px",
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          backgroundColor: GOLD,
          height: 2,
        },
      },
    },

    // ── Circular progress ────────────────────────────────────────────────────
    MuiCircularProgress: {
      defaultProps: {
        size: 18,
        thickness: 4,
      },
      styleOverrides: {
        root: {
          color: DARK,
        },
      },
    },

    // ── Accordion ────────────────────────────────────────────────────────────
    MuiAccordion: {
      styleOverrides: {
        root: {
          borderRadius: "0 !important",
          boxShadow: "none",
          "&:before": { display: "none" },
        },
      },
    },

    // ── Card ─────────────────────────────────────────────────────────────────
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          boxShadow: "none",
          border: `1px solid ${DARK}14`,
        },
      },
    },

    // ── Table ────────────────────────────────────────────────────────────────
    MuiTableHead: {
      styleOverrides: {
        root: {
          "& .MuiTableCell-root": {
            fontWeight: 700,
            fontSize: "0.7rem",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: `${DARK}80`,
            borderBottom: `2px solid ${DARK}14`,
            backgroundColor: CREAM,
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: `1px solid ${DARK}0F`,
          fontSize: "0.875rem",
          padding: "12px 16px",
        },
      },
    },

    // ── Toggle Button ────────────────────────────────────────────────────────
    MuiToggleButton: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          textTransform: "none",
          fontWeight: 600,
          fontSize: "0.75rem",
          letterSpacing: "0.06em",
          color: `${DARK}99`,
          border: `1.5px solid ${DARK}33`,
          padding: "6px 16px",
          "&.Mui-selected": {
            backgroundColor: DARK,
            color: GOLD,
            borderColor: DARK,
            "&:hover": {
              backgroundColor: DARK_LIGHT,
            },
          },
          "&:hover": {
            borderColor: DARK,
            backgroundColor: "transparent",
          },
        },
      },
    },

    // ── Divider ──────────────────────────────────────────────────────────────
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: `${DARK}14`,
        },
      },
    },
  },
});

export default muiTheme;
