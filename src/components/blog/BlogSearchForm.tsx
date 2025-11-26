'use client';

import { useState, useTransition, type ChangeEvent, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

type BlogSearchFormProps = {
  initialValue?: string;
};

export function BlogSearchForm({ initialValue = '' }: BlogSearchFormProps) {
  const [value, setValue] = useState(initialValue);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const submitSearch = (term: string) => {
    const trimmed = term.trim();
    const target = trimmed ? `/blog?q=${encodeURIComponent(trimmed)}` : '/blog';

    startTransition(() => {
      router.push(target);
    });
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.target.value;
    setValue(nextValue);

    if (nextValue.trim() === '') {
      startTransition(() => {
        router.replace('/blog');
      });
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submitSearch(value);
  };

  return (
    <form className="max-w-2xl mx-auto" onSubmit={handleSubmit}>
      <div className="flex flex-col sm:flex-row gap-3 items-center">
        <Input
          type="text"
          name="q"
          value={value}
          onChange={handleChange}
          placeholder="Search articles, tags, or categories"
          className="flex-1"
        />
        <Button type="submit" className="w-full sm:w-auto" disabled={isPending}>
          {isPending ? 'Searching...' : 'Search'}
        </Button>
      </div>
    </form>
  );
}

