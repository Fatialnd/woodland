import { useState, FormEvent, ChangeEvent } from 'react';

import Button from '../../ui/Button';
import FileInput from '../../ui/FileInput';
import Form from '../../ui/Form';
import FormRow from '../../ui/FormRow';
import Input from '../../ui/Input';

import { useUser } from './useUser';
import { useUpdateUser } from './useUpdateUser';

interface UserMetadata {
  fullName: string;
}

interface User {
  email: string;
  user_metadata: UserMetadata;
}

function UpdateUserDataForm() {
  const { user } = useUser();

  if (!user) {
    throw new Error('User data is not available');
  }

  const {
    email,
    user_metadata: { fullName: currentFullName }
  } = user;

  const { updateUser, isUpdating } = useUpdateUser();

  const [fullName, setFullName] = useState<string>(currentFullName);
  const [avatar, setAvatar] = useState<File | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!fullName) return;
    updateUser(
      { fullName, avatar },
      {
        onSuccess: () => {
          setAvatar(null);
          (e.target as HTMLFormElement).reset();
        }
      }
    );
  }

  function handleCancel() {
    setFullName(currentFullName);
    setAvatar(null);
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
          disabled={isUpdating}
        />
      </FormRow>
      <FormRow label="Avatar image" error="">
        <FileInput
          id="avatar"
          accept="image/*"
          onChange={handleFileChange}
          disabled={isUpdating}
        />
      </FormRow>
      <FormRow label="" error="">
        <Button type="reset" onClick={handleCancel} disabled={isUpdating}>
          Cancel
        </Button>
        <Button disabled={isUpdating}>Update account</Button>
      </FormRow>
    </Form>
  );
}

export default UpdateUserDataForm;
