import { useListProperties } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Briefcase } from "lucide-react";

export default function Commercial() {
  const { data: result, isLoading } = useListProperties({ category: "Commercial" });

  return (
    <div className="pt-24 pb-20 min-h-screen bg-background">
      <div className="container mx-auto px-4">
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-8">Premium Commercial Spaces</h1>
        <p className="text-lg text-muted-foreground mb-12 max-w-3xl">
          Discover high-end offices, showrooms, and retail spaces in prime business districts of Ahmedabad.
        </p>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-80 rounded-2xl" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {result?.properties.map((property) => (
              <Link key={property.id} href={`/properties/${property.id}`}>
                <div className="group bg-card rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-xl transition-all">
                  <div className="relative h-56">
                    <img 
                      src={property.images?.[0] || "/property-3.png"} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      alt={property.title} 
                    />
                    <div className="absolute top-4 right-4 bg-primary text-white text-xs font-bold px-3 py-1 rounded shadow-lg">
                      Commercial
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-xl mb-2 line-clamp-1">{property.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                      <MapPin className="w-4 h-4" /> {property.location}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4 font-medium">
                      <Briefcase className="w-4 h-4" /> {property.type}
                    </div>
                    <div className="text-xl font-bold text-highlight pt-4 border-t border-border">
                      ₹{property.price} {property.priceUnit}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
