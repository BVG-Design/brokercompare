import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { RecommendationForm } from "./recommendation-form";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export default function RecommendationsPage() {
    const bgImage = PlaceHolderImages.find(p => p.id === 'recommendation-bg');
    
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 relative flex items-center justify-center py-16 md:py-24">
                {bgImage && (
                    <Image
                        src={bgImage.imageUrl}
                        alt={bgImage.description}
                        fill
                        className="object-cover z-0"
                        data-ai-hint={bgImage.imageHint}
                    />
                )}
                <div className="absolute inset-0 bg-background/80 backdrop-blur-sm"></div>
                
                <div className="relative z-10 container mx-auto px-4 md:px-6">
                    <div className="max-w-3xl mx-auto">
                        <RecommendationForm />
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
