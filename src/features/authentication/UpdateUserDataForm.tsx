import { useState, FormEvent, ChangeEvent } from "react";

import Button from "../../ui/Button";
import FileInput from "../../ui/FileInput";
import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";

import { useUser } from "./useUser";

interface UserMetadata {
  fullName: string;
}

interface User {
  email: string;
  user_metadata: UserMetadata;
}

function UpdateUserDataForm() {
  // We don't need the loading state, and can immediately use the user data, because we know that it has already been loaded at this point
  const {
    user: {
      email,
      user_metadata: { fullName: currentFullName },
    },
  }: { user: User } = useUser();

  const [fullName, setFullName] = useState<string>(currentFullName);
  const [avatar, setAvatar] = useState<File | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      setAvatar(e.target.files[0]);
    }
  }

  return (
    <Form onSubmit={handleSubmit}>
      <FormRow label="Email address" error="">
        <Input value={email} disabled />
      </FormRow>
      <FormRow label="Full name" error="">
        <Input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          id="fullName"
        />
      </FormRow>
      <FormRow label="Avatar image" error="">
        <FileInput id="avatar" accept="image/*" onChange={handleFileChange} />
      </FormRow>
      <FormRow label="" error="">
        <Button type="reset">Cancel</Button>
        <Button>Update account</Button>
      </FormRow>
    </Form>
  );
}

export default UpdateUserDataForm;
