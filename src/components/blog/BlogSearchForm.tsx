'use client';

import { useEffect, useState, useTransition, type ChangeEvent, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

type BlogSearchFormProps = {
  initialValue?: string;
  className?: string;
};

type SearchIntentSuggestion = {
  title: string;
  slug: string;
};

export function BlogSearchForm({ initialValue = '', className }: BlogSearchFormProps) {
  const [value, setValue] = useState(initialValue);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [suggestions, setSuggestions] = useState<SearchIntentSuggestion[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const showIntentSuggestions = process.env.NEXT_PUBLIC_INTENT_SUGGESTIONS === 'true';

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

  useEffect(() => {
    if (!showIntentSuggestions) {
      return;
    }

    const trimmed = value.trim();
    if (trimmed.length < 2) {
      setSuggestions([]);
      return;
    }

    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      setIsLoadingSuggestions(true);
      try {
        const response = await fetch(`/api/search-intents?query=${encodeURIComponent(trimmed)}`, {
          signal: controller.signal,
        });
        if (!response.ok) {
          setSuggestions([]);
          return;
        }
        const data = (await response.json()) as { items?: SearchIntentSuggestion[] };
        setSuggestions(data.items ?? []);
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          setSuggestions([]);
        }
      } finally {
        setIsLoadingSuggestions(false);
      }
    }, 200);

    return () => {
      controller.abort();
      window.clearTimeout(timeout);
    };
  }, [showIntentSuggestions, value]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.target.value;
    setValue(nextValue);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submitSearch(value);
  };

  return (
    <form className={`w-full ${className || ''}`} onSubmit={handleSubmit}>
      <div className="relative group">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-primary/40 group-focus-within:text-secondary transition-colors" />
        </div>
        <input
          type="text"
          name="q"
          value={value}
          onChange={handleChange}
          placeholder="Search the expert resource library..."
          className="w-full pl-12 pr-4 h-12 bg-white border-none focus:ring-2 focus:ring-secondary/20 rounded-2xl text-primary font-bold placeholder:text-primary/30 transition-all outline-none text-sm"
        />
        {isPending && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-secondary border-t-transparent" />
          </div>
        )}
      </div>
    </form>
  );
}
