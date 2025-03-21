import React from "react";
import Button from "../../ui/Button";
import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";

interface FormRowProps {
  label?: string;
  error?: string;
  children: React.ReactNode;
}

interface InputProps {
  type: string;
  id: string;
}

interface ButtonProps {
  variation?: string;
  type?: "button" | "submit" | "reset";
  children: React.ReactNode;
}

const SignupForm: React.FC = () => {
  return (
    <Form>
      <FormRow label="Full name" error="">
        <Input type="text" id="fullName" />
      </FormRow>

      <FormRow label="Email address" error="">
        <Input type="email" id="email" />
      </FormRow>

      <FormRow label="Password (min 8 characters)" error="">
        <Input type="password" id="password" />
      </FormRow>

      <FormRow label="Repeat password" error="">
        <Input type="password" id="passwordConfirm" />
      </FormRow>

      <FormRow>
        <Button variation="secondary" type="reset">
          Cancel
        </Button>
        <Button>Create new user</Button>
      </FormRow>
    </Form>
  );
};

export default SignupForm;
