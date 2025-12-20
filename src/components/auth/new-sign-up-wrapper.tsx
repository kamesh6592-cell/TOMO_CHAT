"use client";

import React from "react";
import { AuthPage } from "@/components/auth-page";
import { authClient } from "auth/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { SocialAuthenticationProvider } from "app-types/authentication";
import { signUpAction } from "@/app/api/auth/actions";

interface NewSignUpWrapperProps {
  emailAndPasswordEnabled: boolean;
  socialAuthenticationProviders: SocialAuthenticationProvider[];
  isFirstUser: boolean;
}

export default function NewSignUpWrapper({
  emailAndPasswordEnabled,
  socialAuthenticationProviders,
  isFirstUser,
}: NewSignUpWrapperProps) {
  const router = useRouter();

  const handleSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string || email.split("@")[0]; // Get name from form or extract from email

    try {
      const result = await signUpAction({
        email,
        password,
        name,
      });

      if (result.success) {
        toast.success(result.message);
        router.push("/");
      } else {
        toast.error(result.message);
      }
    } catch (error: any) {
      toast.error(error?.message || "Failed to sign up");
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      await authClient.signIn.social({ provider: "google" });
    } catch (error: any) {
      toast.error(error?.message || "Failed to sign up with Google");
    }
  };

  const testimonials = [
    {
      avatarSrc: "/aj-logo.jpg",
      name: "TOMO Chat",
      handle: "@tomo_chat",
      text: "Join thousands of users experiencing next-gen AI communication."
    }
  ];

  return (
    <AuthPage
      title={
        <span className="font-light text-foreground tracking-tighter">
          {isFirstUser ? "Create Admin Account" : "Join TOMO Chat"}
        </span>
      }
      description={
        isFirstUser 
          ? "Set up your administrator account to get started with TOMO Chat."
          : "Create your account and start conversing with advanced AI."
      }
      heroImageSrc="/toll.jpeg"
      testimonials={testimonials}
      onSubmit={emailAndPasswordEnabled ? handleSignUp : undefined}
      onGoogleSignIn={socialAuthenticationProviders.includes("google") ? handleGoogleSignUp : undefined}
      onToggleMode={() => router.push("/sign-in")}
      submitButtonText={isFirstUser ? "Create Admin Account" : "Create Account"}
      toggleText="Already have an account?"
      toggleLinkText="Sign In"
      showRememberMe={false}
      showResetPassword={false}
      isSignUp={true}
    />
  );
}