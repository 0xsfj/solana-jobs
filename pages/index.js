import Head from 'next/head';
import { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css';
import { Flex, Spacer, Button, Icon, Text, SimpleGrid, Box, Image, Badge, Stack, Progress, useToast, Container, Heading, Grid, Field, FormControl, Form, FormLabel, Input, FormErrorMessage } from '@chakra-ui/react';
// import { Formik } from 'formik';
import { useForm } from 'react-hook-form';
import idl from '../target/idl/solana_jobs.json';
import { Program, Provider, web3 } from '@project-serum/anchor';
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import kp from '../keypair/keypair.json';

const { SystemProgram, Keypair } = web3;

// Keypair
// https://app.buildspace.so/courses/CObd6d35ce-3394-4bd8-977e-cbee82ae07a3/lessons/LE442a50e1-1c57-471f-a3ae-c6ca7cbbe33b

// Create a keypair for the account
// let baseAccount = Keypair.generate();

const arr = Object.values(kp._keypair.secretKey);
const secret = new Uint8Array(arr);
const baseAccount = web3.Keypair.fromSecretKey(secret);

// End Keypair

// Get the program id from the idl
const programID = new PublicKey(idl.metadata.address);

const network = clusterApiUrl('testnet');

const opts = {
  preflightCommitment: 'processed',
};

const Home = () => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [jobs, setJobs] = useState([]);

  // const toast = useToast();

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

  const getProvider = () => {
    const connection = new Connection(network, opts.preflightCommitment);
    const provider = new Provider(connection, window.solana, opts.preflightCommitment);
    return provider;
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

  const createJobAccount = async () => {
    try {
      const provider = getProvider();
      const program = new Program(idl, programID, provider);
      console.log('ping');
      await program.rpc.initialize({
        accounts: {
          baseAccount: baseAccount.publicKey,
          user: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        },
        signers: [baseAccount],
      });
      console.log('Create a new BaseAccount w/ address:', baseAccount.publicKey.toString());
      // await getJobList();
    } catch (error) {
      console.log('Error creating BaseAccount', error);
    }
  };

  useEffect(() => {
    window.addEventListener('load', async (event) => {
      await checkIfWalletIsConnected();
    });
  }, []);

  const getJobList = async () => {
    try {
      const provider = getProvider();
      const program = new Program(idl, programID, provider);
      const account = await program.account.baseAccount.fetch(baseAccount.publicKey);

      console.log(`Account`, account);
      console.log(account.jobList);
      await setJobs(account.jobList);
    } catch (error) {
      console.log(error);
      setJobs([]);
    }
  };

  useEffect(() => {
    if (walletAddress) {
      console.log(`Fetch Job List`);

      getJobList();
    }
  }, [walletAddress]);

  const sendJob = async (values) => {
    console.log(`values`);
    console.log(values);
    // if (inputValue.length === 0) {
    //   console.log('No Job Given');
    //   return;
    // }
    // console.log(`Send Job`, inputValue);
    console.log(values.title);

    try {
      const provider = getProvider();
      const program = new Program(idl, programID, provider);

      await program.rpc.addJob(values.title, {
        accounts: {
          baseAccount: baseAccount.publicKey,
          user: provider.wallet.publicKey,
        },
      });
      console.log(`Job was sent to program:`, values.title);

      await getJobList();
    } catch (error) {
      console.log(error);
    }
  };

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
    const onSubmit = (values) => {
      console.log(values);
      sendJob(values);
    };

    return (
      <>
        <Box mb={4}>
          <Heading size={'md'}>Your Solana Address:</Heading>
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

  const ListOfJobs = () => {
    console.log({ jobs });
    if (jobs.length === 0) {
      return (
        <Box>
          <Heading size={'md'} mb="4">
            No Jobs Found
          </Heading>
          <Button onClick={createJobAccount} colorScheme="blue">
            Create Job Account
          </Button>
        </Box>
      );
    }

    return (
      <Box>
        {jobs.map((job, key) => {
          const jobTitle = job.jobLink;

          const companyPlacehlder = 'Burnt Finance';

          const tagsPlaceholders = ['Software', 'Engineer'];
          return (
            <Box key={key} mb="4">
              <Heading size={'md'}>{jobTitle}</Heading>
              <Text>{companyPlacehlder}</Text>
              <Stack isInline spacing={4}>
                {tagsPlaceholders.map((tag) => (
                  <Badge key={tag} colorScheme="blue" variant="solid">
                    {tag}
                  </Badge>
                ))}
              </Stack>
            </Box>
          );
        })}
      </Box>
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

        <Box mb={8} textAlign="center">
          <Text>New opportunities to work on Solana hosted on the Solana Blockchain</Text>
          <Text>To submit a you will need a Solana wallet and some Solana. One of te best is Phantom Wallet.</Text>
          <Text>Connect your wallet and fill in the job fields</Text>
          <Text>Job posting is 1 SOL per month</Text>
          <Text color="red.500" fontWeight="bold">
            Current Jobs are placeholders
          </Text>
        </Box>

        {!walletAddress && <ConnectWalletContent />}

        <Container>
          <SimpleGrid columns={[1, 1, 2]} spacing={8}>
            <ListOfJobs />
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
