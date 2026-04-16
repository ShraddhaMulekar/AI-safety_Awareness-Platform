import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  fonts: {
    heading: "'Poppins', sans-serif",
    body: "'Inter', sans-serif",
  },
  colors: {
    brand: {
      50: "#eef4ff",
      100: "#d9e5ff",
      200: "#b3caff",
      300: "#88acff",
      400: "#5c8eff",
      500: "#3c73fa",
      600: "#2f5bd2",
      700: "#2647a4",
      800: "#20387e",
      900: "#1a2d65",
    },
  },
  styles: {
    global: {
      body: {
        bg: "#070b1a",
        color: "whiteAlpha.900",
      },
    },
  },
});

export default theme;
