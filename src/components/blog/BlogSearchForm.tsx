"use client";

import { useState, useTransition, type ChangeEvent, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type BlogSearchFormProps = {
  initialValue?: string;
  initialCategory?: string;
  categories?: string[];
};

export function BlogSearchForm({ initialValue = '', initialCategory = 'all', categories = [] }: BlogSearchFormProps) {
  const [value, setValue] = useState(initialValue);
  const [category, setCategory] = useState(initialCategory);

  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const submitSearch = (term: string, cat: string) => {
    const trimmed = term.trim();
    const params = new URLSearchParams();

    if (trimmed) params.set('q', trimmed);
    if (cat && cat !== 'all') params.set('category', cat);

    const queryString = params.toString();
    const target = queryString ? `/blog?${queryString}` : '/blog';

    startTransition(() => {
      router.push(target);
    });
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.target.value;
    setValue(nextValue);

    // Optional: auto-search on clear
    if (nextValue.trim() === '' && category === 'all') {
      startTransition(() => {
        router.replace('/blog');
      });
    }
  };

  const handleCategoryChange = (val: string) => {
    setCategory(val);
    submitSearch(value, val); // Trigger search immediately on category change
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submitSearch(value, category);
  };

  return (
    <form className="max-w-3xl mx-auto" onSubmit={handleSubmit}>
      <div className="flex flex-col sm:flex-row gap-3 items-center">
        {categories.length > 0 && (
          <div className="w-full sm:w-48">
            <Select value={category} onValueChange={handleCategoryChange}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
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

