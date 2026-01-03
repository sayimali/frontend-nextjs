"use client";

import { Container, Text, Stack } from "@mantine/core";
import classes from "./Footer.module.css";

export function Footer() {
  return (
    <div className={classes.footer}>
      <Container className={classes.inner} size="xl">
        <Stack align="center" >
          <Text fz="md" fw={700}>
            Mux Tech Private Limited
          </Text>
          <Text fz="sm" color="dimmed">
            Copyright © 2024 Mux Tech Private Limited
          </Text>
          <Text fz="sm" color="dimmed">
            Powered By: IT Department, Mux Tech
          </Text>
        </Stack>
      </Container>
    </div>
  );
}
