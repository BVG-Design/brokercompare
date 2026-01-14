"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  ExternalLink,
  Filter,
  Loader2,
  RefreshCcw,
  Search,
  Star,
  X
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { ComparisonFeatureGroup, ComparisonProduct } from "@/types/comparison";
import ComparisonMatrix from "./ComparisonMatrix";
import StillNotSure from "./StillNotSure";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/use-auth";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface DetailedComparisonClientProps {
  listingSlug: string;
  listingName: string;
  listingCategory?: string | null;
  listingWebsite?: string | null;
  allProducts: ComparisonProduct[];
  suggestedProducts: ComparisonProduct[];
  featureGroups: ComparisonFeatureGroup[];
  initialSelection: string[];
}

interface AskQuestionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  listingName: string;
  listingCategory?: string | null;
  listingSlug: string;
  products: ComparisonProduct[];
}

const AskQuestionModal: React.FC<AskQuestionModalProps> = ({
  open,
  onOpenChange,
  listingName,
  listingCategory,
  listingSlug,
  products
}) => {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [question, setQuestion] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [postAs, setPostAs] = useState<"public" | "private">("public");

  const options = useMemo(() => {
    const productOptions = products.map((product) => ({
      value: `product:${product.slug}`,
      label: product.name,
      hint: 'Question about this specific software/service'
    }));

    const categoryLabel = (() => {
      if (listingCategory) return listingCategory;
      const words = listingSlug.split('-').filter(Boolean).map((word) => word.charAt(0).toUpperCase() + word.slice(1));
      return words.length ? words.join(' ') : listingName;
    })();

    const categoryOption = {
      value: `category:${listingSlug}`,
      label: categoryLabel,
      hint: 'General question about this category'
    };

    const seen = new Set<string>();
    return [categoryOption, ...productOptions].filter((opt) => {
      if (seen.has(opt.value)) return false;
      seen.add(opt.value);
      return true;
    });
  }, [listingName, listingSlug, products]);

  const [selectedOption, setSelectedOption] = useState<string>(options[0]?.value || '');

  useEffect(() => {
    if (open) {
      setQuestion('');
      setSubmitted(false);
      setSelectedOption(options[0]?.value || '');
      setPostAs("public");
    }
  }, [open, options]);

  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !question.trim()) return;

    // Simple basic loading state via 'submitted' flag isn't enough, but for this modal, 
    // we can just set submitted=true ONLY on success.
    // However, we need a loading state potentially. 
    // The current UI sets submitted=true immediately to show success message.
    // We should await the insert.

    try {
      const { error } = await supabase
        .from('faq')
        .insert({
          question: question.trim(),
          category: selectedOption,
          // Omitting user_id and other fields not strictly in the requested schema list, 
          // but relying on the schema: id, question, category, helpful_count, view_count.
        });

      if (error) {
        console.error('Error submitting question:', error);
        // Maybe show an error toast here if we had toast imported in this component context? 
        // This component doesn't import useToast.
        // I will just return or alert.
        // Actually, let's just log it and fallback to success UI to not block user, 
        // or better, alert.
        alert('Failed to submit question. Please try again.');
        return;
      }

      setSubmitted(true);
    } catch (err) {
      console.error('Submission exception:', err);
      alert('An error occurred.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-white border-4 border-brand-blue shadow-xl text-gray-800">
        {authLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="h-6 w-6 animate-spin text-brand-blue" />
          </div>
        ) : submitted ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-center">Thanks for your question!</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-gray-700 text-center">
              We'll route this to the right team based on the topic you picked.
            </p>
            <div className="pt-4">
              <Button className="w-full" onClick={() => onOpenChange(false)}>
                Close
              </Button>
            </div>
          </>
        ) : !user ? (
          <>
            <DialogHeader>
              <div className="flex items-center gap-3">
                <img
                  src="https://izjekecdocekznhwqivo.supabase.co/storage/v1/object/public/Media/Simba%20Profile.png"
                  alt="Simba profile"
                  className="w-14 h-14 rounded-full object-cover border-2 border-brand-blue bg-white"
                />
                <div className="space-y-1">
                  <DialogTitle>Ask a question</DialogTitle>
                  <DialogDescription className="text-gray-800">
                    Hi, Simba here, let me know how I or the humans can help...
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
              You need to be logged in to ask a question. Please sign in to continue.
            </div>
            <div className="flex justify-end pt-4">
              <Button variant="outline" onClick={() => router.push('/login')}>
                Go to login
              </Button>
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <div className="flex items-center gap-3">
                <img
                  src="https://izjekecdocekznhwqivo.supabase.co/storage/v1/object/public/Media/Simba%20Profile.png"
                  alt="Simba profile"
                  className="w-14 h-14 rounded-full object-cover border-2 border-brand-blue bg-white"
                />
                <div className="space-y-1">
                  <DialogTitle>Ask a question</DialogTitle>
                  <DialogDescription className="text-gray-800">
                    Hi, Simba here, let me know how I or the humans can help...
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label htmlFor="question-about" className="text-sm font-medium">
                  This is about
                </Label>
                <Select value={selectedOption} onValueChange={setSelectedOption}>
                  <SelectTrigger id="question-about" className="border-gray-600 text-gray-800">
                    <SelectValue placeholder="Choose a topic" />
                  </SelectTrigger>
                  <SelectContent>
                    {options.map((opt) => (
                      <SelectItem
                        key={opt.value}
                        value={opt.value}
                        className="py-2 data-[highlighted]:bg-gray-100 hover:bg-gray-100"
                      >
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900">{opt.label}</span>
                          <span className="text-[11px] text-gray-500">{opt.hint}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="question-body">Your question</Label>
                <Textarea
                  id="question-body"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Share as much detail as you can..."
                  rows={4}
                  className="border-gray-600 text-gray-800 placeholder:text-gray-600 bg-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Post as</Label>
                <RadioGroup value={postAs} onValueChange={(val) => setPostAs(val as "public" | "private")}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="public" id="post-public" />
                    <Label htmlFor="post-public" className="font-normal cursor-pointer">
                      Publically, as {user?.user_metadata?.first_name || "your account name"}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="private" id="post-private" />
                    <Label htmlFor="post-private" className="font-normal cursor-pointer">
                      Privately, support team question.
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <Button
                type="submit"
                className="w-full bg-brand-orange hover:bg-brand-orange/90 text-white font-semibold"
                disabled={!question.trim()}
              >
                Send question
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

interface SelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  options: ComparisonProduct[];
  suggested: ComparisonProduct[];
  onSelect: (slug: string) => void;
  selectedSlugs: string[];
}

const SelectionModal: React.FC<SelectionModalProps> = ({
  isOpen,
  onClose,
  options,
  suggested,
  onSelect,
  selectedSlugs
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const dedupeBySlug = (items: ComparisonProduct[]) => {
    const seen = new Set<string>();
    return items.filter((item) => {
      if (seen.has(item.slug)) return false;
      seen.add(item.slug);
      return true;
    });
  };

  const uniqueOptions = dedupeBySlug(options);
  const uniqueSuggested = dedupeBySlug(suggested);
  const filtered = uniqueOptions.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase())
  );
  const suggestedSlugs = new Set(uniqueSuggested.map((product) => product.slug));
  const filteredAllListings = query
    ? filtered
    : filtered.filter((product) => !suggestedSlugs.has(product.slug));
  const suggestionResults = query ? filtered.slice(0, 5) : [];

  const renderCard = (product: ComparisonProduct) => (
    <div
      key={product.slug}
      className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:border-gray-300 transition-colors"
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 flex items-center justify-center bg-gray-50 rounded-lg border border-gray-100 overflow-hidden">
          {product.logoUrl ? (
            <img src={product.logoUrl} alt={product.name} className="w-10 h-10 object-contain" />
          ) : (
            <span className="font-bold text-gray-700">{product.name.charAt(0)}</span>
          )}
        </div>
        <div>
          <div className="font-semibold text-gray-900">{product.name}</div>
          <div className="text-xs text-gray-500 flex items-center gap-2">
            {product.rating ? (
              <>
                <span className="flex text-orange-400">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      size={12}
                      className={i <= Math.round(product.rating!) ? 'fill-orange-400' : 'text-gray-300'}
                    />
                  ))}
                </span>
                <span>{product.rating.toFixed(1)} / 5</span>
              </>
            ) : (
              <span>No rating yet</span>
            )}
          </div>
        </div>
      </div>
      <Button
        onClick={() => onSelect(product.slug)}
        className={`px-5 py-2 text-sm font-semibold rounded-lg shadow-sm ${selectedSlugs.includes(product.slug) ? 'bg-gray-200 text-gray-700' : 'bg-[#F45E24] hover:bg-[#e45621] text-white'}`}
      >
        {selectedSlugs.includes(product.slug) ? 'Selected' : 'Add'}
      </Button>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Select a product</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={22} />
          </button>
        </div>

        <div className="p-6 pb-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for software or services"
              className="w-full pl-10 pr-3 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
            {suggestionResults.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-20 max-h-64 overflow-y-auto">
                {suggestionResults.map((product) => (
                  <div
                    key={product.slug}
                    className="flex items-center justify-between px-3 py-2 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 flex items-center justify-center bg-gray-50 rounded-md border border-gray-100 overflow-hidden">
                        {product.logoUrl ? (
                          <img src={product.logoUrl} alt={product.name} className="w-7 h-7 object-contain" />
                        ) : (
                          <span className="text-sm font-semibold text-gray-700">{product.name.charAt(0)}</span>
                        )}
                      </div>
                      <span className="text-sm font-medium text-gray-900">{product.name}</span>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => onSelect(product.slug)}
                      className={`text-xs font-semibold rounded-md px-3 py-1.5 ${selectedSlugs.includes(product.slug) ? 'bg-gray-200 text-gray-700' : 'bg-[#F45E24] hover:bg-[#e45621] text-white'}`}
                    >
                      {selectedSlugs.includes(product.slug) ? 'Selected' : 'Add'}
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="p-6 pt-2 max-h-[420px] overflow-y-auto space-y-3">
          {!query && suggested.length > 0 && (
            <>
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Suggested (Similar To)</h4>
              {uniqueSuggested.map(renderCard)}
              <div className="border-t border-dashed border-gray-200 my-2"></div>
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">All Listings</h4>
            </>
          )}
          {filteredAllListings.map(renderCard)}
          {filteredAllListings.length === 0 && (
            <div className="text-sm text-gray-500 text-center py-6">No matches found.</div>
          )}
        </div>
      </div>
    </div>
  );
};

interface DetailedComparisonClientProps {
  listingSlug: string;
  listingName: string;
  listingCategory: string;
  listingWebsite?: string | null;
  allProducts: ComparisonProduct[];
  suggestedProducts: ComparisonProduct[];
  featureGroups: ComparisonFeatureGroup[];
  initialSelection: string[];
  hideHeader?: boolean;
}

const DetailedComparisonClient: React.FC<DetailedComparisonClientProps> = ({
  listingSlug,
  listingName,
  listingCategory,
  listingWebsite,
  allProducts,
  suggestedProducts,
  featureGroups,
  initialSelection,
  hideHeader
}) => {
  const initial = initialSelection.length
    ? Array.from(new Set(initialSelection)).slice(0, 3)
    : allProducts.slice(0, 3).map((p) => p.slug);

  const [selectedSlugs, setSelectedSlugs] = useState<string[]>(initial);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeSlot, setActiveSlot] = useState<number | null>(null);
  const [questionModalOpen, setQuestionModalOpen] = useState(false);

  const selectedProducts = useMemo(
    () =>
      selectedSlugs
        .map((slug) => allProducts.find((p) => p.slug === slug))
        .filter(Boolean) as ComparisonProduct[],
    [selectedSlugs, allProducts]
  );

  const openModalForSlot = (idx: number) => {
    setActiveSlot(idx);
    setModalOpen(true);
  };

  const handleSelect = (slug: string) => {
    if (activeSlot === null) return;
    setSelectedSlugs((prev) => {
      const next = [...prev];
      next[activeSlot] = slug;
      return Array.from(new Set(next)).slice(0, 3);
    });
    setModalOpen(false);
    setActiveSlot(null);
  };

  const getTopFeatures = (slug: string) => {
    const rows: string[] = [];
    featureGroups.forEach((group) => {
      group.features.forEach((feature) => {
        const availability = feature.availability[slug];
        if ((availability === 'yes' || availability === 'partial') && rows.length < 3) {
          rows.push(feature.title);
        }
      });
    });
    return rows;
  };

  const renderStars = (value?: number | null) => {
    const rating = value || 0;
    return (
      <div className="flex items-center gap-2 justify-center">
        <div className="flex text-orange-400 gap-0.5">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star
              key={i}
              size={14}
              className={i <= Math.round(rating) ? 'fill-orange-400 text-orange-400' : 'text-gray-300'}
            />
          ))}
        </div>
        <span className="text-sm font-bold text-gray-900">
          {rating.toFixed(1)} <span className="text-xs font-normal text-gray-500">/ 5</span>
        </span>
      </div>
    );
  };

  const withUtm = (url?: string | null) => {
    if (!url) return null;
    try {
      const target = new URL(url.startsWith('http') ? url : `https://${url}`);
      target.searchParams.set('utm_source', 'BrokerTools');
      target.searchParams.set('utm_medium', 'comparison');
      return target.toString();
    } catch {
      return url;
    }
  };

  const visitCta = (url?: string | null) => {
    const href = withUtm(url);
    return (
      <Button
        asChild
        className="bg-[#F45E24] hover:bg-[#e45621] text-white text-sm px-5 py-2.5 rounded-lg shadow-sm font-semibold flex items-center gap-2"
        disabled={!href}
      >
        <a href={href || '#'} target="_blank" rel="noreferrer">
          Visit Website <ExternalLink size={14} />
        </a>
      </Button>
    );
  };

  const availableOptions = allProducts;

  return (
    <>
      {!hideHeader && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <Link
            href={`/listings/${listingSlug}`}
            className="text-gray-600 hover:text-gray-900 flex items-center gap-2 text-sm font-medium"
          >
            <ArrowLeft size={16} /> Back to {listingName} Review
          </Link>
          <div className="flex items-center gap-2 flex-wrap justify-center">
            {selectedProducts.map((p, idx) => (
              <React.Fragment key={p.slug}>
                <button
                  onClick={() => openModalForSlot(idx)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium bg-white transition-all hover:shadow-sm ${p.isCurrent ? 'border-gray-900 text-gray-900' : 'border-gray-200 text-gray-700'
                    }`}
                >
                  <div
                    className={`w-8 h-8 rounded-md flex items-center justify-center font-bold text-xs overflow-hidden ${p.logoUrl ? 'bg-white' : 'bg-gray-900 text-white'
                      }`}
                  >
                    {p.logoUrl ? (
                      <img src={p.logoUrl} alt={p.name} className="w-8 h-8 object-contain rounded" />
                    ) : (
                      p.name.charAt(0)
                    )}
                  </div>
                  <span>{p.name}</span>
                  <ChevronDown size={14} className="text-gray-400" />
                </button>
                {idx < selectedProducts.length - 1 && (
                  <span className="text-gray-400 text-sm font-semibold px-1">vs</span>
                )}
              </React.Fragment>
            ))}
          </div>
          <div className="flex gap-2 text-gray-400">
            <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
              <Filter size={18} />
            </button>
            <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
              <RefreshCcw size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Overview */}
      <section className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
          <span className="w-6 h-6 rounded-md bg-purple-100 text-purple-600 flex items-center justify-center">🎁</span>
          <h2 className="text-lg font-bold text-gray-900">Overview</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="p-4 w-1/4"></th>
                {selectedProducts.map((p, idx) => (
                  <th key={p.slug} className="p-4 align-top w-1/4">
                    <div className="flex flex-col items-center gap-2">
                      {p.logoUrl ? (
                        <img src={p.logoUrl} alt={p.name} className="w-10 h-10 rounded shadow-sm object-contain" />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-gray-900 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                          {p.name.charAt(0)}
                        </div>
                      )}
                      <span className="font-bold text-gray-900 text-base">{p.name}</span>
                      <button
                        onClick={() => openModalForSlot(idx)}
                        className="text-[10px] bg-orange-50 text-orange-700 px-2 py-0.5 rounded-full border border-orange-100"
                      >
                        Change
                      </button>
                      {p.isCurrent && (
                        <span className="text-[10px] bg-gray-900 text-white px-2 py-0.5 rounded-full">Your Selection</span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="p-4 text-sm font-medium text-gray-600 bg-gray-50/30">Ratings</td>
                {selectedProducts.map((p) => (
                  <td key={p.slug} className="p-4 text-center">
                    {renderStars(p.rating)}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 text-sm font-medium text-gray-600 bg-gray-50/30">Top Features</td>
                {selectedProducts.map((p) => {
                  const features = getTopFeatures(p.slug);
                  return (
                    <td key={p.slug} className="p-4">
                      <div className="flex flex-col gap-2 items-center">
                        {features.length === 0 && (
                          <span className="text-xs text-gray-400">No feature data yet</span>
                        )}
                        {features.map((f) => (
                          <div key={f} className="flex items-center gap-1.5 text-xs text-gray-700 bg-gray-50 px-2 py-1 rounded border border-gray-100 w-full justify-center">
                            <Check size={12} className="text-green-500" /> {f}
                          </div>
                        ))}
                      </div>
                    </td>
                  );
                })}
              </tr>
              <tr>
                <td className="p-4 text-sm font-medium text-gray-600 bg-gray-50/30">Pricing (Entry)</td>
                {selectedProducts.map((p) => (
                  <td key={p.slug} className="p-4 text-center text-sm font-semibold text-gray-900">
                    {p.priceText || 'Contact sales'}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 text-sm font-medium text-gray-600 bg-gray-50/30">Alternatives</td>
                {selectedProducts.map((p) => (
                  <td key={p.slug} className="p-4 text-center">
                    {p.alternativesCount ? (
                      <span className="text-xs font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                        View {p.alternativesCount} Alternatives
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400">No data</span>
                    )}
                  </td>
                ))}
              </tr>
            </tbody>
            <tfoot className="bg-gray-50/60">
              <tr>
                <td className="p-4"></td>
                {selectedProducts.map((p) => (
                  <td key={p.slug} className="p-4 text-center">
                    {visitCta(p.websiteUrl || listingWebsite)}
                  </td>
                ))}
              </tr>
            </tfoot>
          </table>
        </div>
      </section>

      {/* Integrations */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-blue-100 text-blue-600 flex items-center justify-center">
            <ArrowRight size={16} className="rotate-180" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Integrates With</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {selectedProducts.map((p) => (
            <div key={p.slug} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 text-center">
                {p.name} Integrations
              </h4>
              <div className="flex flex-wrap justify-center gap-3">
                {p.worksWith?.length ? (
                  p.worksWith.map((integration) => {
                    const href = integration.slug ? `/listings/${integration.slug}` : '#';
                    return (
                      <Link
                        key={integration.slug || integration.title}
                        href={href}
                        className="w-10 h-10 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center p-2 hover:shadow-md hover:border-gray-300 transition-all"
                        title={integration.title}
                      >
                        {integration.logoUrl ? (
                          <img src={integration.logoUrl} alt={integration.title} className="w-6 h-6 object-contain" />
                        ) : (
                          <span className="text-xs font-semibold text-gray-700">
                            {integration.title?.charAt(0)}
                          </span>
                        )}
                      </Link>
                    );
                  })
                ) : (
                  <span className="text-xs text-gray-400">No integrations listed</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Service Areas */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-green-100 text-green-600 flex items-center justify-center">
            <ArrowRight size={16} />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Service Areas</h3>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-gray-100">
            <div className="p-4 bg-gray-50/50 flex items-center text-sm font-medium text-gray-600">
              Best suited for...
            </div>
            {selectedProducts.map((p) => (
              <div key={p.slug} className="p-6">
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  {p.serviceAreas?.length ? (
                    p.serviceAreas.map((area) => (
                      <span key={area} className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs rounded border border-gray-200 font-medium">
                        {area}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-gray-400">No data</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed matrix with scoring badges */}
      <ComparisonMatrix products={selectedProducts} featureGroups={featureGroups} />

      {/* Loved By */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">Loved By</h3>
          <span className="text-xs text-gray-400">Audience insights</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {selectedProducts.map((p) => (
            <div key={p.slug} className="border border-gray-100 rounded-lg p-4 flex flex-col gap-2">
              <div className="text-sm font-semibold text-gray-900">{p.name}</div>
              <div className="text-xs text-gray-500">Audience data coming soon.</div>
            </div>
          ))}
        </div>
      </section>

      {/* Editor Notes */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">Editor Notes</h3>
          <span className="text-xs text-gray-400">Curated commentary</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {selectedProducts.map((p) => (
            <div key={p.slug} className="bg-gray-50 border border-dashed border-gray-200 rounded-lg p-4 text-sm text-gray-600">
              Notes for {p.name} will appear here once available.
            </div>
          ))}
        </div>
      </section>

      {/* FAQs */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">FAQs</h3>
          <span className="text-xs text-gray-400">Common questions</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {selectedProducts.map((p) => (
            <div key={p.slug} className="border border-gray-100 rounded-lg p-4">
              <div className="text-sm font-semibold text-gray-900 mb-2">{p.name} Questions</div>
              <p className="text-xs text-gray-500">FAQ content not yet published.</p>
            </div>
          ))}
        </div>
        <div className="flex justify-center pt-4">
          <Button
            variant="outline"
            className="border-gray-400 text-gray-800 bg-transparent hover:bg-gray-50"
            onClick={() => setQuestionModalOpen(true)}
          >
            Ask a Question
          </Button>
        </div>
      </section>

      <div className="max-w-5xl mx-auto w-full">
        <StillNotSure />
      </div>

      <SelectionModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setActiveSlot(null);
        }}
        options={availableOptions}
        suggested={suggestedProducts}
        onSelect={handleSelect}
        selectedSlugs={selectedSlugs}
      />
      <AskQuestionModal
        open={questionModalOpen}
        onOpenChange={setQuestionModalOpen}
        listingName={listingName}
        listingCategory={listingCategory}
        listingSlug={listingSlug}
        products={selectedProducts}
      />
    </>
  );
};

export default DetailedComparisonClient;
