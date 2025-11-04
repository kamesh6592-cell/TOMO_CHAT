import React from 'react';
import Image from 'next/image';

export const SciraLogoHeader = () => (
  <div className="flex items-center gap-2 my-1.5">
    <Image src="/aj-logo.jpg" alt="AJ STUDIOZ" width={26} height={26} className="rounded" />
    <h2 className="text-xl font-bold font-be-vietnam-pro text-foreground dark:text-foreground">AJ STUDIOZ</h2>
  </div>
);
