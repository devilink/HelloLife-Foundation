import { SignIn } from "@clerk/nextjs";
import Image from "next/image";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">
      {/* Left side: branding/image (This will be the LCP element) */}
      <div className="md:w-1/2 relative bg-slate-900 flex flex-col justify-center items-center p-12 text-white">
        <Image
          src="/herp.png"
          alt="Hello Life Foundation"
          fill
          priority
          className="absolute inset-0 object-cover opacity-40"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <div className="relative z-10 text-center max-w-lg">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">
            Welcome Back
          </h1>
          <p className="text-lg md:text-xl text-slate-300 font-medium">
            Sign in to access your dashboard and manage relief operations.
          </p>
        </div>
      </div>
      
      {/* Right side: Clerk SignIn */}
      <div className="md:w-1/2 flex items-center justify-center p-8 bg-muted/10">
        <div className="w-full max-w-md flex justify-center">
          <SignIn />
        </div>
      </div>
    </div>
  );
}
