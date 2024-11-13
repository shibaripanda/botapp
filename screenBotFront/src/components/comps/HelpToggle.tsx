import { useDisclosure } from '@mantine/hooks';
import { Dialog, Group, Button, TextInput, Text } from '@mantine/core';
import React from 'react';

export function HelpToggle() {
  const [opened, { toggle, close }] = useDisclosure(false);

  return (
    <>
      <Group justify="center">
        <Button onClick={toggle}>Help</Button>
      </Group>

      <Dialog opened={opened} withCloseButton onClose={close} size="lg" radius="md">
        <Text size="sm" mb="xs" fw={500}>
          Make help request
        </Text>

        <Group align="flex-end">
          <TextInput placeholder="Your problem" style={{ flex: 1 }} />
          <Button onClick={close}>Send</Button>
        </Group>
      </Dialog>
    </>
  );
}