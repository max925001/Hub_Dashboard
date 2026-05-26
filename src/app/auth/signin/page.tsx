'use client';

import React, { useState, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, Mail, ShieldAlert, Sparkles, ArrowRight } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const errorParam = searchParams.get('error');

  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'admin@example.com',
      password: 'password',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      const res = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
        callbackUrl,
      });

      if (res?.error) {
        toast.error('Invalid email or password. Hint: admin@example.com / password');
      } else {
        toast.success('Successfully logged in!');
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err) {
      toast.error('An error occurred during sign-in.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#090d16] text-slate-100 p-4 relative overflow-hidden select-none">
      
      {/* Background visual graphics */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-indigo-600/10 blur-[150px]" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-sky-500/10 blur-[150px]" />

      <div className="w-full max-w-md bg-slate-900/60 border border-slate-800 p-8 rounded-3xl backdrop-blur-xl shadow-2xl flex flex-col space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 border border-indigo-500/25 text-indigo-400">
            <Sparkles className="h-6 w-6 fill-indigo-400/20" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">
            Access Dashboard
          </h1>
          <p className="text-xs text-slate-400">
            Login using test account: <code className="text-indigo-400">admin@example.com</code> / <code className="text-indigo-400">password</code>
          </p>
        </div>

        {errorParam && (
          <div className="flex items-center gap-2 p-3.5 bg-red-500/10 border border-red-500/25 rounded-2xl text-xs text-red-400">
            <ShieldAlert className="h-4.5 w-4.5 flex-shrink-0" />
            <span>Authentication failed. Please verify your credentials.</span>
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3.5 top-[38px] h-4.5 w-4.5 text-slate-400" />
            <Input
              type="email"
              label="Email Address"
              className="pl-11 bg-slate-950/40 border-slate-800 text-white placeholder-slate-500"
              placeholder="name@company.com"
              error={errors.email?.message}
              {...register('email')}
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3.5 top-[38px] h-4.5 w-4.5 text-slate-400" />
            <Input
              type="password"
              label="Password"
              className="pl-11 bg-slate-950/40 border-slate-800 text-white placeholder-slate-500"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register('password')}
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full py-3 mt-2 flex items-center justify-center gap-2 font-bold"
            disabled={isLoading}
          >
            {isLoading ? 'Authenticating...' : 'Sign In'}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </form>

        {/* Divider */}
        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-slate-800"></div>
          <span className="flex-shrink mx-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Or continue with
          </span>
          <div className="flex-grow border-t border-slate-800"></div>
        </div>

        {/* OAuth Buttons */}
        <Button
          variant="glass"
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center gap-2 border-slate-850 hover:bg-slate-800/40 text-slate-200 py-3"
        >
          <svg className="h-4 w-4 mr-1 text-slate-200" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12.24 10.285V13.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.859-3.578-7.859-8s3.529-8 7.859-8c2.46 0 4.105 1.025 5.047 1.926l2.427-2.334C17.955 2.192 15.34 1 12.24 1 6.12 1 1.16 5.93 1.16 12s4.96 11 11.08 11c6.39 0 10.63-4.5 10.63-10.84 0-.73-.08-1.285-.18-1.875H12.24z"/>
          </svg>
          Google Account
        </Button>

      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen w-full flex items-center justify-center bg-[#090d16] text-slate-100">
        <div className="text-sm font-semibold tracking-wider text-indigo-400 animate-pulse-slow">Loading Auth Panel...</div>
      </div>
    }>
      <SignInContent />
    </Suspense>
  );
}
