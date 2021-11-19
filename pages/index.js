import Head from 'next/head';
import { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css';
import {
  Flex,
  Spacer,
  Button,
  Icon,
  Text,
  SimpleGrid,
  Box,
  Image,
  HStack,
  Badge,
  Stack,
  Progress,
  useToast,
  Container,
  Heading,
  Grid,
  Field,
  FormControl,
  Form,
  FormLabel,
  Input,
  FormErrorMessage,
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react';
import { BellIcon } from '@chakra-ui/icons';
import Footer from '../components/Footer';

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

  const { isOpen, onOpen, onClose } = useDisclosure();

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
      onClose();
    };

    return (
      <>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl mb="4">
            <FormLabel htmlFor="title">Title</FormLabel>
            <Input placeholder="Frontend Engineer" {...register('title', { required: true })} />
            {errors.title && <FormErrorMessage>This field is required</FormErrorMessage>}
          </FormControl>

          <FormControl mb="4">
            <FormLabel htmlFor="company">Company</FormLabel>
            <Input placeholder="Fun Finance" {...register('company', { required: true })} />
            {errors.company && <FormErrorMessage>This field is required</FormErrorMessage>}
          </FormControl>

          <FormControl mb="4">
            <FormLabel htmlFor="link">Link</FormLabel>
            <Input placeholder="https://solana.com/" {...register('link', { required: true })} />
            {errors.company && <FormErrorMessage>This field is required</FormErrorMessage>}
          </FormControl>

          <Button mt={4} mb={4} colorScheme="blue" type="submit">
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
    <>
      <Head>
        <title>Solana Jobs</title>
        <meta name="description" content="New opportunities to work on Solana hosted on Solana" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Box as="section" pb="12">
        <Stack
          direction={{
            base: 'column',
            sm: 'row',
          }}
          justifyContent="center"
          alignItems="center"
          py="3"
          px={{
            base: '3',
            md: '6',
            lg: '8',
          }}
          color="white"
          bg={useColorModeValue('red.600', 'red.400')}
        >
          <HStack spacing="3">
            <Icon as={BellIcon} fontSize="2xl" h="10" />
            <Text fontWeight="medium" marginEnd="2">
              Currently in testing on Solana Testnet
            </Text>
          </HStack>
        </Stack>
      </Box>
      <Box
        as="main"
        mx="auto"
        maxW="7xl"
        py="12"
        px={{
          base: '4',
          md: '8',
        }}
      >
        <Heading size={'4xl'} mb={4} textAlign="center">
          Solana Jobs
        </Heading>

        <Box mb={8} textAlign="center">
          <Text fontSize="3xl">New opportunities to work on Solana hosted on the Solana Blockchain</Text>
          <Text>To submit a you will need a Solana wallet and some Solana. One of te best is Phantom Wallet.</Text>
          <Text mb="4">Job posting is 1 SOL per month</Text>
          <Button onClick={onOpen} colorScheme="blue">
            Add New Job
          </Button>
        </Box>

        {!walletAddress && <ConnectWalletContent />}

        <Container>
          <ListOfJobs />
        </Container>
      </Box>

      <Footer />
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add a New Job</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box>{walletAddress && <ConnectedWalletContent />}</Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Home;
