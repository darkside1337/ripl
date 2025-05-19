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

interface PasswordResetEmailProps {
  username?: string;
  email?: string;
  resetLink?: string;
  expiryTime?: string;
}

const PasswordResetEmailTemplate = ({
  username = "User",
  email = "user@example.com",
  resetLink = "https://example.com/reset-password?token=123456789",
  expiryTime = "1 hour",
}: PasswordResetEmailProps) => {
  return (
    <Html>
      <Tailwind>
        <Head />
        <Preview>Reset your password for your account</Preview>
        <Body className="bg-gray-50 font-sans">
          <Container className="mx-auto my-10 max-w-[600px] rounded-lg bg-white p-8 shadow-md">
            {/* Header with Logo */}
            <Section className="text-center">
              <Heading className="text-2xl font-bold">
                <span className="text-blue-600">Ri</span>
                <span className="text-gray-800">pl</span>
              </Heading>
            </Section>

            {/* Main Content */}
            <Heading className="text-center text-2xl font-bold text-gray-800">
              Password Reset Request
            </Heading>
            <Text className="mt-4 text-gray-600">Hello {username},</Text>
            <Text className="mt-4 text-gray-600">
              We received a request to reset the password for your account
              associated with {email}. If you didn't make this request, you can
              safely ignore this email.
            </Text>
            <Text className="mt-4 text-gray-600">
              To reset your password, click the button below. This link will
              expire in {expiryTime}.
            </Text>

            {/* CTA Button */}
            <Section className="my-8 text-center">
              <Button
                href={resetLink}
                className="rounded-md bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
              >
                Reset Password
              </Button>
            </Section>

            {/* Fallback URL */}
            <Text className="text-sm text-gray-600">
              If the button above doesn't work, copy and paste this URL into
              your browser:
            </Text>
            <Text className="mt-2 rounded-md bg-gray-100 p-3 text-xs text-blue-600 break-all">
              {resetLink}
            </Text>

            <Text className="mt-4 text-gray-600">
              For security reasons, this password reset link will expire in{" "}
              {expiryTime}. If you need a new password reset link, please visit
              our website and request another one.
            </Text>

            {/* Footer */}
            <Hr className="my-6 border-gray-200" />
            <Text className="text-center text-xs text-gray-500">
              © {new Date().getFullYear()} Ripl. All rights reserved.
            </Text>
            <Text className="text-center text-xs text-gray-500">
              If you did not request a password reset, please contact our
              support team immediately.
            </Text>
            <Text className="mt-2 text-center text-xs text-gray-500">
              Ripl, Inc. • 123 Security Street • San Francisco, CA 94107
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default PasswordResetEmailTemplate;
