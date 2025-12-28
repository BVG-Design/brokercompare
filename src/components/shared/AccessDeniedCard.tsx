'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

type AccessDeniedCardProps = {
  firstName?: string | null;
  email?: string | null;
  page?: string;
  backHref?: string;
};

const avatarUrl =
  'https://izjekecdocekznhwqivo.supabase.co/storage/v1/object/public/Media/Simba%20Profile.png';

export function AccessDeniedCard({
  firstName,
  email,
  page = '/',
  backHref = '/dashboard',
}: AccessDeniedCardProps) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');

  return (
    <>
      <Card className="max-w-lg w-full shadow-md">
        <CardContent className="pt-8 pb-10 space-y-4 text-center">
          <div className="flex justify-center">
            <img
              src={avatarUrl}
              alt="Access locked"
              className="w-32 h-32 rounded-full object-cover border-4 border-white shadow"
            />
          </div>
          <p className="text-xl font-semibold text-primary">
            Hey {firstName || 'there'} - it seems you are locked out of this page.
          </p>
          <p className="text-sm text-muted-foreground">
            If you should have access, contact our support team and we will see what's happening.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <Button onClick={() => setOpen(true)} className="bg-primary text-white">
              Contact Support
            </Button>
            <Button variant="outline" asChild>
              <Link href={backHref}>Back to dashboard</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Contact Support</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">User</p>
              <p className="text-sm font-semibold">{firstName || 'Unknown user'}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Email</p>
              <p className="text-sm font-semibold">{email || 'Not available'}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Page</p>
              <p className="text-sm font-semibold">{page}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Message</p>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us what you were trying to do..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setOpen(false)}>Send</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
