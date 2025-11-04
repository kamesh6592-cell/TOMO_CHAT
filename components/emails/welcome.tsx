import * as React from 'react';
import { Html, Head, Body, Container, Section, Img, Text, Button, Tailwind, Hr } from '@react-email/components';

interface WelcomeEmailProps {
  userName: string;
}

const WelcomeEmail = (props: WelcomeEmailProps) => {
  const { userName } = props;

  return (
    <Html lang="en" dir="ltr">
      <Tailwind>
        <Head />
        <Body className="bg-white font-sans">
          <Container className="max-w-[600px] mx-auto px-[20px] py-[40px]">
            {/* Logo */}
            <Section className="text-center mb-[32px]">
              <Img 
                src="https://meowihh.vercel.app/aj-logo.jpg" 
                alt="AJ STUDIOZ" 
                className="w-[64px] h-[64px] mx-auto rounded"
              />
            </Section>

            {/* Title */}
            <Section className="text-center mb-[32px]">
              <Text className="text-[32px] font-bold text-[#020304] m-0 mb-[16px]">
                Welcome to AJ STUDIOZ
              </Text>
              <Text className="text-[18px] text-[#374151] m-0">
                Hi {userName}!
              </Text>
            </Section>

            {/* Welcome Message */}
            <Section className="mb-[32px]">
              <Text className="text-[16px] text-[#374151] leading-[24px] m-0 mb-[16px]">
                Thank you for creating an account with AJ STUDIOZ. We're excited to have you on board!
              </Text>
              <Text className="text-[16px] text-[#374151] leading-[24px] m-0">
                Get started by exploring our AI-powered search and research tools designed to help you find information faster and smarter.
              </Text>
            </Section>

            {/* CTA Button */}
            <Section className="text-center mb-[32px]">
              <Button
                href="https://meowihh.vercel.app"
                className="bg-[#FF0000] text-white px-[32px] py-[14px] rounded-[8px] text-[16px] font-medium no-underline inline-block"
              >
                Start Searching
              </Button>
            </Section>

            {/* Features */}
            <Section className="mb-[32px]">
              <Text className="text-[18px] font-semibold text-[#020304] m-0 mb-[16px]">
                What you can do:
              </Text>
              <Text className="text-[16px] text-[#374151] leading-[24px] m-0 mb-[8px]">
                🔍 <strong>AI-Powered Search</strong> - Get instant, intelligent answers
              </Text>
              <Text className="text-[16px] text-[#374151] leading-[24px] m-0 mb-[8px]">
                📊 <strong>Research Tools</strong> - Deep dive into any topic
              </Text>
              <Text className="text-[16px] text-[#374151] leading-[24px] m-0 mb-[8px]">
                💾 <strong>Save & Share</strong> - Keep track of your findings
              </Text>
              <Text className="text-[16px] text-[#374151] leading-[24px] m-0">
                🔔 <strong>Daily Lookouts</strong> - Stay updated on topics you care about
              </Text>
            </Section>

            <Hr className="border border-solid border-[#E5E7EB] my-[32px]" />

            {/* Footer */}
            <Section className="mb-[16px]">
              <Text className="text-[16px] text-[#374151] m-0">
                Questions? We're here to help!
              </Text>
              <Text className="text-[16px] text-[#020304] font-semibold m-0">
                The AJ STUDIOZ Team
              </Text>
            </Section>

            <Section className="mb-[32px]">
              <Text className="text-[12px] text-[#9CA3AF] m-0">
                © 2025 AJ STUDIOZ
              </Text>
            </Section>

            <Section>
              <Text className="text-[12px] text-[#9CA3AF] m-0">
                For questions contact{' '}
                <a href="mailto:support@ajstudioz.com" className="text-[#9CA3AF] no-underline">
                  support@ajstudioz.com
                </a>
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

WelcomeEmail.PreviewProps = {
  userName: 'TOMO ACADEMY',
};

export default WelcomeEmail;
