import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, CheckCircle, Search, Bot } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function Home() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero');
  const servicesImage = PlaceHolderImages.find(p => p.id === 'services');
  const softwareImage = PlaceHolderImages.find(p => p.id === 'software');

  const features = [
    {
      icon: <Search className="h-8 w-8 text-secondary" />,
      title: "Comprehensive Directories",
      description: "Explore detailed listings of service providers and software solutions tailored for Australian brokers.",
      link: "/services",
      linkText: "Browse Services"
    },
    {
      icon: <CheckCircle className="h-8 w-8 text-secondary" />,
      title: "Side-by-Side Comparison",
      description: "Easily compare features, pricing, and user ratings to make informed decisions for your business.",
      link: "/software",
      linkText: "Compare Software"
    },
    {
      icon: <Bot className="h-8 w-8 text-secondary" />,
      title: "AI-Powered Recommendations",
      description: "Let our smart tool analyze your needs and suggest the perfect match from our extensive database.",
      link: "/recommendations",
      linkText: "Get Recommendations"
    },
  ];

  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full py-24 md:py-32 lg:py-40 bg-card">
          <div className="container mx-auto px-4 md:px-6 grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-primary font-headline">
                Find Your Brokerage Edge in Australia
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground">
                BrokerCompare AU is the leading platform for discovering, comparing, and selecting the best marketing, VA, and software partners to grow your business.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                  <Link href="/recommendations">
                    Get AI Recommendations <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/services">Explore Services</Link>
                </Button>
              </div>
            </div>
            <div className="relative h-64 md:h-auto rounded-xl overflow-hidden shadow-2xl">
              {heroImage && (
                <Image
                  src={heroImage.imageUrl}
                  alt={heroImage.description}
                  fill
                  style={{ objectFit: 'cover' }}
                  data-ai-hint={heroImage.imageHint}
                  priority
                  className="transform hover:scale-105 transition-transform duration-500"
                />
              )}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl md:text-4xl font-bold font-headline text-primary">A Powerful Toolkit for Every Broker</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Everything you need to find the right partners and tools, all in one place.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature) => (
                <Card key={feature.title} className="flex flex-col transform hover:-translate-y-2 transition-transform duration-300 shadow-lg hover:shadow-2xl">
                  <CardHeader className="items-center text-center">
                    <div className="p-4 bg-secondary/10 rounded-full mb-4">
                      {feature.icon}
                    </div>
                    <CardTitle className="font-headline">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 text-center">
                    <CardDescription>{feature.description}</CardDescription>
                  </CardContent>
                  <div className="p-6 pt-0">
                    <Button asChild variant="link" className="text-secondary w-full">
                      <Link href={feature.link}>
                        {feature.linkText} <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-16 md:py-24 bg-card">
          <div className="container mx-auto px-4 md:px-6">
            <div className="bg-primary text-primary-foreground rounded-xl p-8 md:p-12 lg:p-16 flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1 space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold font-headline">Ready to Supercharge Your Brokerage?</h2>
                <p className="text-lg text-primary-foreground/80">
                  Start exploring our directories or get a personalized recommendation from our AI assistant today.
                </p>
              </div>
              <div className="flex-shrink-0">
                <Button asChild size="lg" className="bg-secondary hover:bg-secondary/90 text-secondary-foreground text-lg py-6 px-8">
                  <Link href="/recommendations">
                    Find Your Perfect Match
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
