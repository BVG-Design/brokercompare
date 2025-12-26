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
            className="pl-10 pr-4 h-10 text-base border-0 focus-visible:ring-0 shadow-none bg-transparent text-gray-700 caret-blue-600 placeholder:text-muted-foreground"
          />
          {showIntentSuggestions && (isLoadingSuggestions || suggestions.length > 0) && (
            <div className="absolute left-0 right-0 top-full mt-2 rounded-md border border-border bg-white shadow-lg z-20 overflow-hidden">
              {isLoadingSuggestions && (
                <div className="px-3 py-2 text-xs text-muted-foreground">Searching intents...</div>
              )}
              {suggestions.length > 0 && (
                <ul className="py-1">
                  {suggestions.map((intent) => (
                    <li key={intent.slug}>
                      <Link
                        href={`/search/${intent.slug}`}
                        className="block px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                      >
                        {intent.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
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
