import { Button } from "@/components/ui/button";

export default function Buy() {
  return (
    <div className="pt-24 pb-20 min-h-screen bg-background flex flex-col items-center">
      <div className="container mx-auto px-4 max-w-4xl text-center">
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-6">Buy Property in Ahmedabad</h1>
        <p className="text-lg text-muted-foreground mb-12">
          Discover your dream home with HOUSIEE.IN. We guide you through every step of the buying process.
        </p>
        
        <div className="bg-card p-8 rounded-2xl border border-border shadow-xl mb-12">
          <h2 className="text-2xl font-bold mb-6">Need expert consultation?</h2>
          <p className="text-muted-foreground mb-8">Our luxury property experts are ready to assist you in finding the perfect match for your lifestyle and budget.</p>
          <Button className="h-14 px-8 bg-secondary hover:bg-secondary/90 text-white font-bold text-lg rounded-xl">
            Schedule a Free Consultation
          </Button>
        </div>
      </div>
    </div>
  );
}
