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
import { Link, useNavigate } from "react-router-dom";
import useForm from "../../hooks/useForm";
import { RegisterLogicComponent } from "../../components/auth/RegisterLogicComponent";

export const RegisterPage = () => {
  const navigate = useNavigate();

  const { values, handleChange } = useForm({
    name: "",
    email: "",
    password: "",
  });

  const { registerUser } = RegisterLogicComponent();

  const handleSubmit = (e) => {
    e.preventDefault();
    registerUser(values);
    navigate("/login");
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
            <Heading size="lg">Create Account</Heading>
            <Text color="whiteAlpha.800">
              Join the platform and protect yourself from scams.
            </Text>
          </Stack>
          <FormControl isRequired>
            <FormLabel>Name</FormLabel>
            <Input
              type="text"
              name="name"
              value={values.name}
              onChange={handleChange}
              placeholder="Your full name"
              bg="whiteAlpha.100"
              borderColor="whiteAlpha.300"
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              name="email"
              value={values.email}
              onChange={handleChange}
              placeholder="you@example.com"
              bg="whiteAlpha.100"
              borderColor="whiteAlpha.300"
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              name="password"
              value={values.password}
              onChange={handleChange}
              placeholder="Create strong password"
              bg="whiteAlpha.100"
              borderColor="whiteAlpha.300"
            />
          </FormControl>
          <Button type="submit" colorScheme="purple" size="lg" borderRadius="full">
            Register
          </Button>
          <Text textAlign="center" color="whiteAlpha.800">
            Already have an account?{" "}
            <Text as={Link} to="/login" color="purple.300" fontWeight="600">
              Login
            </Text>
          </Text>
        </Stack>
      </Box>
    </Stack>
  );
};
