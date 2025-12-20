"use client";

import React from "react";
import { AuthPage } from "@/components/auth-page";
import { authClient } from "auth/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { SocialAuthenticationProvider } from "app-types/authentication";

interface NewSignInWrapperProps {
  emailAndPasswordEnabled: boolean;
  signUpEnabled: boolean;
  socialAuthenticationProviders: SocialAuthenticationProvider[];
  isFirstUser: boolean;
}

export default function NewSignInWrapper({
  emailAndPasswordEnabled,
  signUpEnabled,
  socialAuthenticationProviders,
  isFirstUser,
}: NewSignInWrapperProps) {
  const router = useRouter();

  const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      await authClient.signIn.email({
        email,
        password,
        callbackURL: "/",
      });
      toast.success("Successfully signed in!");
    } catch (error: any) {
      toast.error(error?.message || "Failed to sign in");
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await authClient.signIn.social({ provider: "google" });
    } catch (error: any) {
      toast.error(error?.message || "Failed to sign in with Google");
    }
  };

  const handleResetPassword = () => {
    toast.info("Password reset functionality coming soon!");
  };

  const handleCreateAccount = () => {
    router.push("/sign-up");
  };

  const testimonials = [
    {
      avatarSrc: "/openai.png",
      name: "GPT Models",
      handle: "@openai",
      text: "Experience the power of GPT-4 and other advanced OpenAI models for intelligent conversations."
    },
    {
      avatarSrc: "/gemini.png", 
      name: "Gemini AI",
      handle: "@google",
      text: "Google's most capable AI with advanced reasoning and multimodal capabilities."
    },
    {
      avatarSrc: "/claude-color.png",
      name: "Claude",
      handle: "@anthropic", 
      text: "Anthropic's Claude models for thoughtful, nuanced AI conversations and analysis."
    },
    {
      avatarSrc: "/grok.png",
      name: "Grok",
      handle: "@xai",
      text: "X.AI's Grok models with real-time information and unique personality."
    },
    {
      avatarSrc: "/deepseek-color.png",
      name: "DeepSeek",
      handle: "@deepseek",
      text: "Advanced reasoning models with exceptional performance in complex tasks."
    },
    {
      avatarSrc: "/qwen.png",
      name: "Qwen",
      handle: "@alibaba",
      text: "Alibaba's Qwen models offering multilingual capabilities and efficiency."
    },
    {
      avatarSrc: "/kimi.png",
      name: "Kimi",
      handle: "@moonshot",
      text: "Moonshot's Kimi with long-context understanding and powerful reasoning."
    }
  ];

  return (
    <AuthPage
      title={
        <div className="flex items-center gap-4">
          <img 
            src="/aj-logo.jpg" 
            alt="Tomo Chat" 
            className="w-12 h-12 rounded-full object-cover"
          />
          <span className="font-light text-foreground tracking-tighter">Welcome Back To Tomo Chat</span>
        </div>
      }
      description="Sign in to continue your conversations and unlock powerful AI features."
      heroImageSrc="/login-page.png"
      testimonials={testimonials}
      onSubmit={emailAndPasswordEnabled ? handleSignIn : undefined}
      onGoogleSignIn={socialAuthenticationProviders.includes("google") ? handleGoogleSignIn : undefined}
      onResetPassword={handleResetPassword}
      onToggleMode={signUpEnabled ? handleCreateAccount : undefined}
      submitButtonText="Sign In"
      toggleText="New to TOMO Chat?"
      toggleLinkText="Create Account"
      showRememberMe={true}
      showResetPassword={true}
      isSignUp={false}
    />
  );
}