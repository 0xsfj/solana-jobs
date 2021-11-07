import '../styles/globals.css';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import '@fontsource/dela-gothic-one';

const theme = extendTheme({
  fonts: {
    heading: 'Dela Gothic One',
    // body: 'Syne',
  },
  colors: {
    transparent: 'transparent',
    black: '#000',
    // white: '#FAE9D1',
    // whiteAlpha: {
    //   900: '#FAE9D1',
    // },
    gray: {
      800: '#000',
    },
  },
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: true,
  },
});

// const theme = extendTheme({ colors, config })

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}
export default MyApp;
