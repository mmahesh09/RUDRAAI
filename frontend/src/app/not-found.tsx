"use client";

import { motion } from "framer-motion";
import { Home, Zap } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";

const ORB_OFFSET = 40;

export default function NotFound() {
  return (
    <div className="w-full relative flex min-h-screen items-center justify-center overflow-hidden bg-[#09090B] text-white">
      {/* Animated orbs */}
      <div aria-hidden className="-z-10 absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            x: [0, ORB_OFFSET, -ORB_OFFSET, 0],
            y: [0, 20, -20, 0],
            rotate: [0, 10, -10, 0],
          }}
          className="absolute top-1/2 left-1/3 h-64 w-64 rounded-full bg-gradient-to-tr from-[rgba(255,107,0,0.12)] to-[rgba(139,92,246,0.08)] blur-3xl"
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
        />
        <motion.div
          animate={{
            x: [0, -ORB_OFFSET, ORB_OFFSET, 0],
            y: [0, -20, 20, 0],
          }}
          className="absolute right-1/4 bottom-1/3 h-72 w-72 rounded-full bg-gradient-to-br from-[rgba(139,92,246,0.08)] to-[rgba(255,107,0,0.06)] blur-3xl"
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
        />
        <div className="absolute inset-0 grid-bg opacity-30" />
      </div>

      <Empty>
        <EmptyHeader>
          <EmptyTitle className="font-heading font-black text-8xl text-gradient-orange">
            404
          </EmptyTitle>
          <EmptyDescription className="text-[#A1A1AA] font-body text-center mt-3">
            The page you&apos;re looking for might have been moved
            <br />
            or doesn&apos;t exist.
          </EmptyDescription>
        </EmptyHeader>

        <EmptyContent>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button asChild size="lg">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Go Home
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/booking">
                <Zap className="mr-2 h-4 w-4 text-[#FF6B00]" />
                Book Free Audit
              </Link>
            </Button>
          </div>
        </EmptyContent>
      </Empty>
    </div>
  );
}
