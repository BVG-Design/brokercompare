import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Check, Search } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Input } from "@/components/ui/input";
import { CrmSystemIcon, DocumentCollectionIcon, VaServicesIcon, AiSoftwareIcon, TroubleshootIcon, AiAutomationsIcon, MarketingLeadGenIcon, BusinessStrategyIcon, LoanStructureIcon, WorkflowOpsIcon } from "@/components/shared/icons";
import { cn } from "@/lib/utils";

export default function Home() {
  const workflowImage = PlaceHolderImages.find(p => p.id === 'services');

  const categories = [
    {
      icon: <CrmSystemIcon className="h-8 w-8 text-primary" />,
      title: "CRM Systems",
      link: "/software",
    },
    {
      icon: <DocumentCollectionIcon className="h-8 w-8 text-primary" />,
      title: "Document Collection",
      link: "/software",
    },
    {
      icon: <VaServicesIcon className="h-8 w-8 text-primary" />,
      title: "VA Services",
      link: "/services",
    },
    {
      icon: <AiSoftwareIcon className="h-8 w-8 text-primary" />,
      title: "AI Software and Services",
      link: "/recommendations",
    },
    {
      icon: <MarketingLeadGenIcon className="h-8 w-8 text-secondary-foreground" />,
      title: "Marketing & Lead Generation",
      link: "/services",
      isNew: true,
    },
    {
      icon: <BusinessStrategyIcon className="h-8 w-8 text-secondary-foreground" />,
      title: "Business Strategy & Coaching",
      link: "/services",
      isNew: true,
    },
    {
      icon: <LoanStructureIcon className="h-8 w-8 text-secondary-foreground" />,
      title: "Loan Structure & Application Processing",
      link: "/software",
      isNew: true,
    },
    {
      icon: <WorkflowOpsIcon className="h-8 w-8 text-secondary-foreground" />,
      title: "Workflow & Operations",
      link: "/software",
      isNew: true,
    },
  ];

  const services = [
    {
        category: "GUIDE",
        title: "Why hire a dedicated IT Support",
        description: "Explore a range of on-demand and dedicated support platforms.",
        imageUrl: "https://picsum.photos/seed/tech-1/600/400",
        imageHint: "tech support",
        linkText: "Explore"
    },
    {
        category: "RECOMMENDED PROVIDER",
        title: "How to leverage Paid Ads",
        description: "In-depth analysis of industry-leading technologies.",
        imageUrl: "https://picsum.photos/seed/ads-1/600/400",
        imageHint: "online advertising",
        linkText: "Listen"
    },
    {
        category: "PARTNER SERVICE",
        title: "Getting your online marketing going",
        description: "Listen to industry-leaders sharing strategies and insights.",
        imageUrl: "https://picsum.photos/seed/marketing-1/600/400",
        imageHint: "digital marketing",
        linkText: "Read"
    }
  ];

  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full bg-primary text-primary-foreground py-24 md:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-primary" />
          <div 
            className="absolute bottom-0 left-0 w-full h-32 bg-background" 
            style={{clipPath: "ellipse(80% 100% at 50% 100%)"}}
          />

          <div className="container mx-auto px-4 md:px-6 relative z-10 text-center pb-24 md:pb-32">
            <div className="max-w-4xl mx-auto">
                <div className="inline-block px-4 py-1.5 bg-gray-700/50 rounded-full text-sm mb-4">
                    <p>+ AI-driven</p>
                </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight font-headline">
                Find the Perfect <span className="text-accent">Solutions</span> for <br/> Your Brokerage
              </h1>
              <p className="mt-6 text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto">
                Discover vetted products, software, and services tailored for Mortgage, Asset, and Commercial finance brokers.
              </p>
              <div className="mt-8 max-w-2xl mx-auto">
                  <div className="relative">
                      <Input placeholder="Search for vendors, products, or services" className="h-14 pl-12 pr-28 rounded-full text-foreground"/>
                      <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground"/>
                      <Button className="absolute right-2 top-1/2 -translate-y-1/2 h-10 rounded-full bg-secondary hover:bg-secondary/90 px-6">Search</Button>
                  </div>
                  <Link href="/recommendations" className="mt-4 inline-flex items-center gap-2 text-sm hover:text-accent transition-colors">
                      Or ask AI for personalized recommendations <ArrowRight className="h-4 w-4"/>
                  </Link>
              </div>
              <div className="mt-8 flex justify-center gap-4">
                  <Button size="lg" className="bg-secondary hover:bg-secondary/90">Browse All Vendors <ArrowRight className="ml-2 h-4 w-4"/></Button>
                  <Button size="lg" variant="outline" className="bg-background/10 border-background/20 hover:bg-background/20">List Your Business</Button>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-16 md:py-24 bg-background">
            <div className="container mx-auto px-4 md:px-6">
                 <div className="text-center space-y-3 mb-12">
                    <p className="text-sm font-semibold text-secondary uppercase tracking-wider">SERVICES</p>
                    <h2 className="text-3xl md:text-4xl font-bold font-headline text-primary">Services that amplify broker success</h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Vetted services that generate leads and support your broker business.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {services.map((service, index) => (
                        <Card key={service.title} className="overflow-hidden group flex flex-col">
                            {index !== 0 && (
                                <div className="aspect-video bg-muted overflow-hidden">
                                    <Image 
                                        src={service.imageUrl}
                                        alt={service.title}
                                        width={600}
                                        height={400}
                                        className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-300"
                                        data-ai-hint={service.imageHint}
                                    />
                                </div>
                            )}
                            <CardContent className="p-6 flex-1 flex flex-col">
                                <p className="text-xs text-muted-foreground mb-2">{service.category}</p>
                                <h3 className="font-bold text-lg mb-2">{service.title}</h3>
                                <p className="text-sm text-muted-foreground mb-4 flex-1">{service.description}</p>
                                <Button variant="link" className="p-0 text-secondary self-start">
                                    {service.linkText} <ArrowRight className="ml-2 h-4 w-4"/>
                                </Button>
                            </CardContent>
                            {index === 0 && (
                                <div className="aspect-video bg-muted overflow-hidden mt-auto">
                                    <Image 
                                        src={service.imageUrl}
                                        alt={service.title}
                                        width={600}
                                        height={400}
                                        className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-300"
                                        data-ai-hint={service.imageHint}
                                    />
                                </div>
                            )}
                        </Card>
                    ))}
                </div>
            </div>
        </section>


        {/* Personalized Support Section */}
        <section className="py-16 md:py-24 bg-background">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
                    <div className="bg-primary rounded-xl p-8 md:p-12 flex flex-col justify-center text-primary-foreground text-center">
                        <p className="text-sm font-semibold text-accent uppercase tracking-wider">ACCELERATE</p>
                        <h2 className="text-3xl md:text-4xl font-bold font-headline mt-2">Streamline your workflow with personalised support</h2>
                        <p className="mt-4 text-primary-foreground/80">Talk with one of our team.</p>
                        <Button className="mt-6 mx-auto">
                            Schedule a Chat <ArrowRight className="ml-2 h-4 w-4"/>
                        </Button>
                    </div>
                    <div className="space-y-8 flex flex-col">
                        <Card className="flex-1 flex flex-col">
                            <CardContent className="p-8 flex flex-col items-center justify-center text-center h-full">
                                <div className="p-3 border-2 border-primary/20 rounded-full mb-4">
                                  <TroubleshootIcon className="h-8 w-8 text-primary"/>
                                </div>
                                <h3 className="text-xl font-bold font-headline">Troubleshoot & VA Support</h3>
                                <p className="text-muted-foreground mt-2 flex-1">A directory of guides helping you or your VA to trouble shoot common integration and website issues.</p>
                                <Button variant="outline" className="mt-4">Explore <ArrowRight className="ml-2 h-4 w-4"/></Button>
                            </CardContent>
                        </Card>
                        <Card className="flex-1 flex flex-col">
                            <CardContent className="p-8 flex flex-col items-center justify-center text-center h-full">
                                <div className="p-3 border-2 border-primary/20 rounded-full mb-4">
                                  <AiAutomationsIcon className="h-8 w-8 text-primary"/>
                                </div>
                                <h3 className="text-xl font-bold font-headline">AI Automations</h3>
                                <p className="text-muted-foreground mt-2 flex-1">Optimise your workflow operations with AI Automations, use tools like n8n, make.com or zapier to auto-update your CRM.</p>
                                <Button variant="outline" className="mt-4">Explore <ArrowRight className="ml-2 h-4 w-4"/></Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </section>

        {/* Explore by Category Section */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center space-y-3 mb-12">
                <h2 className="text-3xl md:text-4xl font-bold font-headline text-primary">Explore by Category</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Browse vendors by the type of solution you need.
                </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {categories.map((category) => (
                <Card key={category.title} className={cn("group hover:shadow-xl transition-shadow", {
                  "bg-secondary text-secondary-foreground": category.isNew,
                })}>
                  <CardContent className="p-6 text-center">
                    <div className={cn("inline-block p-4 rounded-full mb-4 transition-colors", {
                      "bg-muted group-hover:bg-accent/10": !category.isNew,
                      "bg-white/20 group-hover:bg-white/30": category.isNew
                    })}>
                      {category.icon}
                    </div>
                    <h3 className="font-bold text-lg">{category.title}</h3>
                     <Button asChild variant="link" className={cn("mt-2", {
                        "text-secondary": !category.isNew,
                        "text-white hover:text-white/80": category.isNew
                     })}>
                      <Link href={category.link}>
                        Explore <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Optimize Workflow Section */}
        <section className="py-16 md:py-24 bg-card">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold font-headline text-primary">Everything You Need to Optimize Your Workflow</h2>
                        <p className="mt-4 text-lg text-muted-foreground">
                            Whether you're looking for software, services, or products, we've curated the best solutions for brokers in the finance industry.
                        </p>
                        <ul className="mt-6 space-y-4">
                            <li className="flex items-start gap-3">
                                <Check className="h-6 w-6 text-accent flex-shrink-0 mt-1"/>
                                <span>Access to vetted, quality service providers.</span>
                            </li>
                             <li className="flex items-start gap-3">
                                <Check className="h-6 w-6 text-accent flex-shrink-0 mt-1"/>
                                <span>Save time with smart search and filtering.</span>
                            </li>
                             <li className="flex items-start gap-3">
                                <Check className="h-6 w-6 text-accent flex-shrink-0 mt-1"/>
                                <span>Get personalized recommendations via AI chat.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Check className="h-6 w-6 text-accent flex-shrink-0 mt-1"/>
                                <span>Free to browse and explore.</span>
                            </li>
                        </ul>
                    </div>
                     <div className="relative h-80 rounded-xl overflow-hidden shadow-lg">
                        {workflowImage && (
                            <Image
                            src={workflowImage.imageUrl}
                            alt={workflowImage.description}
                            fill
                            style={{ objectFit: 'cover' }}
                            data-ai-hint={workflowImage.imageHint}
                            className="transform hover:scale-105 transition-transform duration-500"
                            />
                        )}
                    </div>
                </div>
            </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-16 md:py-24 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 md:px-6 text-center">
             <h2 className="text-3xl md:text-4xl font-bold font-headline">Ready to Find Your Perfect Match?</h2>
             <p className="mt-4 text-lg text-primary-foreground/80 max-w-xl mx-auto">
              Take the quiz to match with the right software, services and providers.
            </p>
             <div className="mt-8">
                <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground text-lg py-6 px-8">
                  <Link href="/recommendations">
                    Take the Quiz <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
