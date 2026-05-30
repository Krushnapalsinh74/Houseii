import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Sell() {
  return (
    <div className="pt-24 pb-20 min-h-screen bg-background">
      <div className="container mx-auto px-4 max-w-2xl">
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-6 text-center">Sell Your Property</h1>
        <p className="text-center text-muted-foreground mb-12">List your property on Ahmedabad's premium real estate platform and get maximum visibility among high-intent buyers.</p>
        
        <div className="bg-card p-8 rounded-2xl border border-border shadow-xl">
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Your Name</label>
                <Input placeholder="John Doe" className="h-12" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Phone Number</label>
                <Input placeholder="+91 00000 00000" className="h-12" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Property Type</label>
              <Input placeholder="e.g. 3 BHK Apartment, Villa, Office" className="h-12" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Location</label>
              <Input placeholder="e.g. S.G. Highway, Bodakdev" className="h-12" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Expected Price</label>
              <Input placeholder="e.g. ₹ 1.5 Cr" className="h-12" />
            </div>
            <Button className="w-full h-14 bg-highlight hover:bg-highlight/90 text-primary font-bold text-lg rounded-xl mt-4">
              Submit Property Details
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
