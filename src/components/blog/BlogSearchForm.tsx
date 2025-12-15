'use client';

import { useState, useTransition, type ChangeEvent, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

type BlogSearchFormProps = {
  initialValue?: string;
  className?: string;
};

export function BlogSearchForm({ initialValue = '', className }: BlogSearchFormProps) {
  const [value, setValue] = useState(initialValue);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const submitSearch = (term: string) => {
    const trimmed = term.trim();
    const params = new URLSearchParams(window.location.search); // Preserve existing filters!

    if (trimmed) {
      params.set('q', trimmed);
    } else {
      params.delete('q');
    }

    const queryString = params.toString();
    const target = queryString ? `/blog?${queryString}` : '/blog';

    startTransition(() => {
      router.push(target);
    });
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.target.value;
    setValue(nextValue);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submitSearch(value);
  };

  return (
    <form className={`w-full max-w-3xl mx-auto ${className || ''}`} onSubmit={handleSubmit}>
      <div className="bg-white rounded-lg shadow-sm p-1.5 flex gap-2 items-center max-w-2xl mx-auto">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            name="q"
            value={value}
            onChange={handleChange}
            placeholder="Search articles..."
            className="pl-10 pr-4 h-10 text-base border-0 focus-visible:ring-0 shadow-none bg-transparent text-foreground placeholder:text-muted-foreground"
          />
        </div>
        <Button
          type="submit"
          className="h-10 px-6 rounded-md bg-[#10b981] hover:bg-[#059669] text-white font-medium shadow-sm transition-all" // Using specific green to match image vibe
          disabled={isPending}
        >
          {isPending ? '...' : 'Search'}
        </Button>
      </div>
    </form>
  );
}

