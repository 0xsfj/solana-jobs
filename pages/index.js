import Head from 'next/head';
import { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css';
import { Flex, Spacer, Button, Icon, Text, SimpleGrid, Box, Image, Badge, Stack, Progress, useToast, Container, Heading, Grid, Field, FormControl, Form, FormLabel, Input, FormErrorMessage } from '@chakra-ui/react';
// import { Formik } from 'formik';
import { useForm } from 'react-hook-form';

const JOB_LISTINGS = [
  {
    title: 'Software Engineer',
    company: 'Burnt Finance',
    tags: ['Software', 'Engineer'],
  },
  {
    title: 'Frontend Developer',
    company: 'Bancambios DeFi',
    tags: ['Frontend', 'Developer', 'React'],
  },
  {
    title: 'Sr, Frontend Developer',
    company: '8Pay',
    tags: ['Frontend', 'Developer', 'React'],
  },
  {
    title: 'Frontend Engineer',
    company: 'CropperFinance',
    tags: ['Frontend', 'Developer', 'React'],
  },
  {
    title: 'Frontend Developer',
    company: 'Jungle Finance',
    tags: ['Frontend', 'Developer'],
  },
];

const Home = () => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [jobs, setJobs] = useState([]);

  const toast = useToast();

  const checkIfWalletIsConnected = async () => {
    try {
      const { solana } = window;
      console.log(solana);

      if (solana) {
        if (solana.isPhantom) {
          console.log('Phantom Wallet Found');

          const response = await solana.connect({ onlyIfTrusted: true });
          console.log(response);
          console.log(`Connected with public key: ${response.publicKey.toString()}`);
          setWalletAddress(response.publicKey.toString());
        }
      } else {
        console.log('No Wallet Found, Get a Phantom Wallet 👻');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const connectWallet = async () => {
    try {
      const { solana } = window;
      if (solana) {
        const response = await solana.connect();
        console.log('Connected with Public Key:', response.publicKey.toString());
        setWalletAddress(response.publicKey.toString());
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    window.addEventListener('load', async (event) => {
      await checkIfWalletIsConnected();
    });
  }, []);

  useEffect(() => {
    if (walletAddress) {
      console.log(`Fetch Job List`);

      setJobs(JOB_LISTINGS);
    }
  }, [walletAddress]);

  const ConnectWalletContent = () => {
    return (
      <>
        <p>To add a new job listing connect your account with Phantom Wallet 👻</p>
        <button onClick={connectWallet}>Connect Wallet</button>
      </>
    );
  };

  const ConnectedWalletContent = () => {
    const {
      register,
      handleSubmit,
      watch,
      formState: { errors },
    } = useForm();
    const onSubmit = (data) => {
      console.log(data);
    };

    console.log(watch('title'));

    return (
      <>
        <Box mb={4}>
          <Text>Your Solana Address:</Text>
          <Text>{walletAddress.slice(0, 8)}...</Text>
        </Box>

        <form onSubmit={handleSubmit(onSubmit)}>
          <FormLabel htmlFor="title">Title</FormLabel>
          <Input placeholder="Frontend Engineer" {...register('title', { required: true })} />
          {errors.title && <FormErrorMessage>This field is required</FormErrorMessage>}

          <FormLabel htmlFor="company">Company</FormLabel>
          <Input placeholder="Fun Finance" {...register('company', { required: true })} />
          {errors.company && <FormErrorMessage>This field is required</FormErrorMessage>}

          <FormLabel htmlFor="link">Link</FormLabel>
          <Input placeholder="https://solana.com/" {...register('link', { required: true })} />
          {errors.company && <FormErrorMessage>This field is required</FormErrorMessage>}

          <Button mt={4} colorScheme="blue" type="submit">
            Submit Job
          </Button>
        </form>
      </>
    );
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Solana Jobs</title>
        <meta name="description" content="New opportunities to work on Solana hosted on Solana" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Heading size={'4xl'} mb={4}>
          Solana Jobs
        </Heading>

        <Box mb={4} textAlign="center">
          <Text>New opportunities to work on Solana hosted on the Solana Blockchain</Text>
          <Text color="red.500" fontWeight="bold">
            Current Jobs are placeholders
          </Text>
        </Box>

        {!walletAddress && <ConnectWalletContent />}

        <Container>
          <SimpleGrid columns={[1, 1, 2]} spacing={8}>
            <Box>
              {JOB_LISTINGS.map((job, key) => (
                <Box key={key} mb="4">
                  <Heading size={'md'}>{job.title}</Heading>
                  <Text>{job.company}</Text>
                  <Stack isInline spacing={4}>
                    {job.tags.map((tag) => (
                      <Badge key={tag} colorScheme="blue" variant="solid">
                        {tag}
                      </Badge>
                    ))}
                  </Stack>
                </Box>
              ))}
            </Box>
            <Box>{walletAddress && <ConnectedWalletContent />}</Box>
          </SimpleGrid>
        </Container>
      </main>

      <footer className={styles.footer}>
        <a href="https://sfj.dev" target="_blank" rel="noopener noreferrer">
          Built By sfj.eth
        </a>
      </footer>
    </div>
  );
};

export default Home;
