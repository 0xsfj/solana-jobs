import { Box, Stack, Text, ButtonGroup, IconButton, chakra, useColorModeValue, useToken } from '@chakra-ui/react';
import * as React from 'react';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';

const Footer = () => {
  const [white, black] = useToken('colors', ['white', 'gray.800']);

  return (
    <Box
      as="footer"
      role="contentinfo"
      mx="auto"
      maxW="7xl"
      py="12"
      px={{
        base: '4',
        md: '8',
      }}
    >
      <Stack>
        <Stack direction="row" spacing="4" align="center" justify="space-between">
          <Box display="flex">
            <chakra.svg color={useColorModeValue('blue.500', 'blue.300')} aria-hidden viewBox="0 0 100 80" fill="none" h="6" flexShrink={0}>
              <path
                d="M45.254 69.777H9.125C4.0859 69.777 0 65.6989 0 60.6715V24.2495C0 19.2222 4.0859 15.144 9.125 15.144H13.6875V9.687C13.6875 4.6597 17.7695 0.581501 22.8086 0.581501H50.1836C55.2227 0.581501 59.3047 4.6596 59.3047 9.687V15.144H63.8672C68.9063 15.144 72.9922 19.2221 72.9922 24.2495V36.3975C76.4922 39.8936 78.8281 44.5928 79.293 49.8935C79.4844 52.1162 79.3399 54.3232 78.8594 56.4833L96.6364 66.7453C99.8512 68.6047 100.957 72.718 99.0973 75.9367C97.2379 79.1554 93.1246 80.2609 89.9059 78.4015L72.0389 68.0855C68.5428 71.1949 64.1405 73.1089 59.4689 73.5152C54.2423 73.9761 49.2739 72.5386 45.2539 69.7769L45.254 69.777ZM19.672 15.144H53.32V11.1128C53.32 8.605 51.2731 6.5581 48.7575 6.5581H24.2345C21.7228 6.5581 19.672 8.605 19.672 11.1128V15.144ZM75.434 57.878C76.2934 55.3702 76.6137 52.7725 76.3832 50.1475C75.477 39.7805 66.2972 32.0815 55.9262 32.9875C45.5512 33.8977 37.8522 43.0695 38.7582 53.4405C39.6684 63.8155 48.8442 71.5145 59.2152 70.6085C63.7777 70.2101 68.0433 68.1515 71.2272 64.8155C71.4342 64.5928 71.7741 64.5616 72.0241 64.7413C72.0475 64.7569 72.0788 64.7647 72.1139 64.7569L91.3679 75.8739C93.1882 76.9247 95.5202 76.2997 96.571 74.4794C97.6218 72.6552 96.9968 70.3271 95.1765 69.2763L75.434 57.878ZM58.653 63.7647C52.0788 64.3389 46.258 59.4561 45.68 52.8737C45.1058 46.2956 49.9886 40.4787 56.567 39.9047C63.149 39.3266 68.969 44.2094 69.544 50.7877C70.1221 57.3658 65.2354 63.1897 58.653 63.7647Z"
                fill={useColorModeValue(black, white)}
              />
            </chakra.svg>
            <Text textTransform="uppercase" fontWeight="bold">
              Solana Jobs
            </Text>
          </Box>
          <ButtonGroup variant="ghost" color="gray.600">
            <IconButton as="a" href="https://github.com/0xsfj/solana-jobs" aria-label="GitHub" icon={<FaGithub fontSize="20px" />} />
            <IconButton as="a" href="https://twitter.com/0xsfj" aria-label="Twitter" icon={<FaTwitter fontSize="20px" />} />
          </ButtonGroup>
        </Stack>
      </Stack>
    </Box>
  );
};

export default Footer;
