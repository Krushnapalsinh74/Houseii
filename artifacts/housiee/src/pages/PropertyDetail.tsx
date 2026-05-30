import { useRoute } from "wouter";
import { useGetProperty } from "@workspace/api-client-react";
import { MapPin, Bed, Bath, Square, CheckCircle, FileText } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export default function PropertyDetail() {
  const [, params] = useRoute("/properties/:id");
  const propertyId = params?.id ? parseInt(params.id, 10) : 0;

  const { data: property, isLoading } = useGetProperty(propertyId, {
    query: { enabled: !!propertyId }
  });

  if (isLoading) {
    return (
      <div className="pt-24 pb-20 container mx-auto px-4">
        <Skeleton className="h-[60vh] w-full rounded-2xl mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-32 w-full" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!property) return <div className="pt-24 min-h-screen text-center">Property not found</div>;

  return (
    <div className="pt-24 pb-20 bg-background min-h-screen">
      <div className="container mx-auto px-4">
        {/* Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12 h-[50vh] md:h-[60vh] rounded-2xl overflow-hidden">
          <div className="md:col-span-2 h-full">
            <img src={property.images?.[0] || "/property-1.png"} alt={property.title} className="w-full h-full object-cover" />
          </div>
          <div className="hidden md:grid grid-rows-2 gap-4 h-full">
            <img src={property.images?.[1] || "/property-2.png"} alt="Gallery 2" className="w-full h-full object-cover rounded-tr-2xl" />
            <img src={property.images?.[2] || "/property-3.png"} alt="Gallery 3" className="w-full h-full object-cover rounded-br-2xl" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-primary text-primary-foreground px-3 py-1 rounded text-xs font-bold uppercase tracking-wider">{property.type}</span>
                <span className="bg-secondary/10 text-secondary px-3 py-1 rounded text-xs font-bold uppercase tracking-wider">{property.status}</span>
              </div>
              <h1 className="font-serif text-3xl md:text-5xl font-bold mb-4">{property.title}</h1>
              <div className="flex items-center gap-2 text-muted-foreground text-lg">
                <MapPin className="w-5 h-5 text-secondary" />
                {property.location}
              </div>
            </div>

            <div className="flex flex-wrap gap-6 py-6 border-y border-border mb-8">
              {property.bedrooms && (
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-muted-foreground">Bedrooms</span>
                  <div className="flex items-center gap-2 font-bold text-xl"><Bed className="text-secondary" /> {property.bedrooms}</div>
                </div>
              )}
              {property.bathrooms && (
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-muted-foreground">Bathrooms</span>
                  <div className="flex items-center gap-2 font-bold text-xl"><Bath className="text-secondary" /> {property.bathrooms}</div>
                </div>
              )}
              {property.area && (
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-muted-foreground">Area</span>
                  <div className="flex items-center gap-2 font-bold text-xl"><Square className="text-secondary" /> {property.area} {property.areaUnit}</div>
                </div>
              )}
            </div>

            <div className="mb-10">
              <h3 className="font-serif text-2xl font-bold mb-4">Description</h3>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                {property.description || "A beautiful property located in a prime area. Perfect for those seeking luxury and comfort. Contact us for more details."}
              </p>
            </div>

            {property.amenities && property.amenities.length > 0 && (
              <div className="mb-10">
                <h3 className="font-serif text-2xl font-bold mb-4">Amenities</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {property.amenities.map(amenity => (
                    <div key={amenity} className="flex items-center gap-2 bg-card p-3 rounded-lg border border-border">
                      <CheckCircle className="w-5 h-5 text-accent" />
                      <span className="font-medium text-sm">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-card rounded-2xl p-6 border border-border shadow-lg sticky top-32">
              <div className="mb-6">
                <p className="text-sm text-muted-foreground uppercase tracking-wider mb-1">Asking Price</p>
                <div className="text-4xl font-bold text-highlight">
                  ₹{property.price} <span className="text-2xl">{property.priceUnit}</span>
                </div>
              </div>

              {property.builderName && (
                <div className="mb-6 p-4 bg-muted/50 rounded-xl">
                  <p className="text-sm text-muted-foreground mb-1">Developer</p>
                  <p className="font-bold">{property.builderName}</p>
                </div>
              )}

              <div className="space-y-4 mb-8">
                {property.possession && (
                  <div className="flex justify-between items-center py-2 border-b border-border">
                    <span className="text-muted-foreground">Possession</span>
                    <span className="font-medium">{property.possession}</span>
                  </div>
                )}
                {property.rera && (
                  <div className="flex justify-between items-center py-2 border-b border-border">
                    <span className="text-muted-foreground">RERA ID</span>
                    <span className="font-medium flex items-center gap-1"><FileText className="w-4 h-4"/> {property.rera}</span>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <Button className="w-full h-12 bg-secondary hover:bg-secondary/90 text-white font-bold text-lg">
                  Schedule Site Visit
                </Button>
                <Button variant="outline" className="w-full h-12 font-bold">
                  Download Brochure
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
