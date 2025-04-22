import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Section,
  Text,
  Preview,
} from "@react-email/components";
import { Tailwind } from "@react-email/tailwind";
import * as React from "react";

interface VerificationEmailProps {
  username?: string;
  email?: string;
  verificationLink?: string;
}

const VerificationEmailTemplate = ({
  username = "User",
  email = "user@example.com",
  verificationLink = "https://ripl.com/verify?token=123456789",
}: VerificationEmailProps) => {
  return (
    <Html>
      <Tailwind>
        <Preview>Verify your email address for Ripl</Preview>
        <Body className="bg-white font-sans">
          <Container className="mx-auto my-10 max-w-[600px] rounded-lg bg-white p-8 shadow-md">
            {/* Header with Logo */}
            <Section className="text-center">
              <Heading className="text-2xl font-bold">
                Welcome to{" "}
                <span className="underline underline-offset-8 decoration-8 decoration-blue-400">
                  ripL
                </span>
              </Heading>
            </Section>

            {/* Main Content */}
            <Heading className="text-center text-2xl font-bold text-gray-800">
              Verify your email address
            </Heading>
            <Text className="mt-4 text-gray-600">Hi {username},</Text>
            <Text className="mt-4 text-gray-600">
              Thanks for signing up for Ripl! We're excited to have you join our
              community. To complete your registration and start connecting with
              others, please verify your email address ({email}).
            </Text>
            <Text className="mt-4 text-gray-600">
              This link will expire in 1 hour.
            </Text>

            {/* CTA Button */}
            <Section className="my-8 text-center">
              <Button
                style={{
                  backgroundImage:
                    "linear-gradient(to right, #7A46F6, #5B21B6)",
                }}
                href={verificationLink}
                className=" hover:bg-indigo-600 inline-block rounded-md bg-gbg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-3 font-medium text-white"
              >
                Verify Email Address
              </Button>
            </Section>

            {/* Fallback URL */}
            <Text className="text-sm text-gray-600">
              If the button above doesn't work, copy and paste this URL into
              your browser:
            </Text>
            <Text className="mt-2 rounded-md bg-gray-100 p-3 text-xs text-purple-600 break-all">
              {verificationLink}
            </Text>

            <Text className="mt-4 text-gray-600">
              If you didn't create an account on Ripl, you can safely ignore
              this email.
            </Text>

            {/* Footer */}
            <Hr className="my-6 border-gray-300" />
            <Text className="text-center text-xs text-gray-500">
              © {new Date().getFullYear()} Ripl. All rights reserved.
            </Text>
            <Text className="text-center text-xs text-gray-500">
              Ripl Social Media, Inc. 123 Connect Street, San Francisco, CA
              94107
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default VerificationEmailTemplate;
