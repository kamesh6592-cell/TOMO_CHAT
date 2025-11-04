import * as React from 'react';
import { Html, Head, Body, Container, Section, Img, Text, Button, Tailwind, Hr } from '@react-email/components';

interface NewLoginEmailProps {
  userName: string;
  loginTime: string;
  ipAddress: string;
  location: string;
  browser: string;
}

const NewLoginEmail = (props: NewLoginEmailProps) => {
  const { userName, loginTime, ipAddress, location, browser } = props;

  return (
    <Html lang="en" dir="ltr">
      <Tailwind>
        <Head />
        <Body className="bg-white font-sans">
          <Container className="max-w-[600px] mx-auto px-[20px] py-[40px]">
            {/* Logo */}
            <Section className="mb-[32px]">
              <Img 
                src="https://meowihh.vercel.app/aj-logo.jpg" 
                alt="AJ STUDIOZ" 
                className="w-[48px] h-[48px] rounded"
              />
            </Section>

            {/* Title */}
            <Section className="mb-[32px]">
              <Text className="text-[24px] font-semibold text-[#020304] m-0 mb-[16px]">
                We've noticed a new login
              </Text>
              <Text className="text-[16px] text-[#374151] m-0">
                Hi {userName},
              </Text>
            </Section>

            {/* Alert Message */}
            <Section className="mb-[32px]">
              <Text className="text-[16px] text-[#374151] leading-[24px] m-0 mb-[16px]">
                This is a routine security alert. Someone logged into your AJ STUDIOZ account from a new IP address:
              </Text>
            </Section>

            {/* Login Details */}
            <Section className="bg-[#F9FAFB] border border-solid border-[#E5E7EB] rounded-[8px] p-[24px] mb-[32px]">
              <Text className="text-[14px] text-[#020304] font-semibold m-0 mb-[8px]">
                Time: <span className="font-normal text-[#374151]">{loginTime}</span>
              </Text>
              <Text className="text-[14px] text-[#020304] font-semibold m-0 mb-[8px]">
                IP address: <span className="font-normal text-[#374151]">{ipAddress}</span>
              </Text>
              <Text className="text-[14px] text-[#020304] font-semibold m-0 mb-[8px]">
                Location: <span className="font-normal text-[#374151]">{location}</span>
              </Text>
              <Text className="text-[14px] text-[#020304] font-semibold m-0">
                Browser: <span className="font-normal text-[#374151]">{browser}</span>
              </Text>
            </Section>

            {/* Security Message */}
            <Section className="mb-[32px]">
              <Text className="text-[16px] text-[#374151] leading-[24px] m-0">
                If this was you, you can ignore this alert. If you noticed any suspicious activity on your account, please{' '}
                <a href="https://meowihh.vercel.app/settings" className="text-[#FF0000] no-underline font-medium">
                  change your password
                </a>
                {' '}and{' '}
                <a href="https://meowihh.vercel.app/settings" className="text-[#FF0000] no-underline font-medium">
                  enable two-factor authentication
                </a>
                {' '}on your{' '}
                <a href="https://meowihh.vercel.app/settings" className="text-[#FF0000] no-underline font-medium">
                  account page
                </a>
                .
              </Text>
            </Section>

            <Hr className="border border-solid border-[#E5E7EB] my-[32px]" />

            {/* Footer */}
            <Section className="mb-[16px]">
              <Text className="text-[16px] text-[#374151] m-0">
                So long, and thanks for all the fish,
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

NewLoginEmail.PreviewProps = {
  userName: 'TOMO ACADEMY',
  loginTime: 'Sun, 2 Nov 2025 04:06:55 +0000',
  ipAddress: '2409:40f4:3110:8187:8000::',
  location: 'Unknown city, IN',
  browser: 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36',
};

export default NewLoginEmail;
