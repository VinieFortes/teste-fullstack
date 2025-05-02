"use client";

import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth';

export default function AuthInit() {
  const { init } = useAuthStore();

  useEffect(() => {
    init();
  }, [init]);

  return null;
}
