import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import useForm from "../../hooks/useForm";
import { loginLogic } from "../../components/auth/LoginLogicComponent";

export const LoginPage = () => {
  const { values, handleChange } = useForm({
    email: "",
    password: "",
  });

  const { loginUser } = loginLogic();

  const handleSubmit = (e) => {
    e.preventDefault();
    loginUser(values);
    };

  return (
    <Stack align="center" justify="center" minH="70vh" px={4}>
      <Box
        as="form"
        onSubmit={handleSubmit}
        w="full"
        maxW="460px"
        bg="whiteAlpha.120"
        border="1px solid"
        borderColor="whiteAlpha.300"
        borderRadius="3xl"
        p={{ base: 6, md: 8 }}
        boxShadow="0 20px 50px rgba(0, 0, 0, 0.35)"
      >
        <Stack spacing={6}>
          <Stack spacing={1} textAlign="center">
            <Heading size="lg">Welcome Back</Heading>
            <Text color="whiteAlpha.800">Sign in to continue your safety analysis.</Text>
          </Stack>
          <FormControl isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              name="email"
              value={values.email}
              onChange={handleChange}
              type="email"
              placeholder="you@example.com"
              bg="whiteAlpha.100"
              borderColor="whiteAlpha.300"
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Password</FormLabel>
            <Input
              name="password"
              value={values.password}
              onChange={handleChange}
              type="password"
              placeholder="Enter your password"
              bg="whiteAlpha.100"
              borderColor="whiteAlpha.300"
            />
          </FormControl>
          <Button type="submit" colorScheme="cyan" size="lg" borderRadius="base" _hover={{borderRadius:"full"}}>
            Login
          </Button>
          <Text textAlign="center" color="whiteAlpha.800">
            Do not have an account?{" "}
            <Text as={Link} to="/register" color="cyan.300" fontWeight="600">
              Register
            </Text>
          </Text>
        </Stack>
      </Box>
    </Stack>
  );
};