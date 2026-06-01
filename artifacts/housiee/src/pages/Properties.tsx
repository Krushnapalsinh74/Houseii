import { useState } from "react";
import { useListProperties } from "@workspace/api-client-react";
import { Link } from "wouter";
import { MapPin, Bed, Bath, Square, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

const FALLBACK_PROPERTIES = [
  { id: '1', title: 'Luxury Villa in Bodakdev', type: 'Villa', price: 4.5, priceUnit: 'Cr', location: 'Bodakdev, Ahmedabad', bedrooms: 4, bathrooms: 5, area: 4500, areaUnit: 'sq.ft', featured: true, images: ['/property-1.png'] },
  { id: '2', title: 'Premium Apartment', type: 'Apartment', price: 1.2, priceUnit: 'Cr', location: 'SG Highway', bedrooms: 3, bathrooms: 3, area: 1800, areaUnit: 'sq.ft', featured: true, images: ['/property-2.png'] },
  { id: '3', title: 'Commercial Office Space', type: 'Office', price: 2.8, priceUnit: 'Cr', location: 'Sindhu Bhavan Road', area: 2200, areaUnit: 'sq.ft', featured: true, images: ['/property-3.png'] },
  { id: '4', title: 'Modern Farmhouse', type: 'Farmhouse', price: 3.5, priceUnit: 'Cr', location: 'Sanand', bedrooms: 3, bathrooms: 4, area: 8500, areaUnit: 'sq.ft', featured: true, images: ['/property-4.png'] },
  { id: '5', title: 'Luxury Penthouse', type: 'Penthouse', price: 5.2, priceUnit: 'Cr', location: 'Vastrapur', bedrooms: 5, bathrooms: 5, area: 6000, areaUnit: 'sq.ft', featured: true, images: ['/property-1.png'] },
  { id: '6', title: 'Compact Apartment', type: 'Apartment', price: 65, priceUnit: 'Lac', location: 'South Bopal', bedrooms: 2, bathrooms: 2, area: 1100, areaUnit: 'sq.ft', featured: false, images: ['/property-2.png'] }
];

export default function Properties() {
  const [type, setType] = useState<string>("all");
  const [location, setLocation] = useState<string>("");
  
  const { data: result, isLoading } = useListProperties(
    type !== "all" ? { type } : {}
  );
  
  const fetchedProperties = Array.isArray(result) ? result : (result as any)?.properties ?? [];
  
  let allProperties = [...fetchedProperties];
  try {
    const stored = localStorage.getItem("mocked_properties");
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        allProperties = [...parsed, ...allProperties];
      }
    }
  } catch {}

  const propertiesToRender = allProperties.length > 0 ? allProperties : FALLBACK_PROPERTIES;

  return (
    <div className="pt-24 pb-20 min-h-screen bg-[#FFFBEB] text-[#451a03]">
      <div className="container mx-auto px-4">
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-8">Exclusive Properties</h1>
        
        {/* Filters */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-[#FDE68A] mb-12 flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 w-full relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input 
              placeholder="Search by location..." 
              className="pl-10 h-12 bg-[#FFFBEB] border-[#FDE68A] text-[#451a03] placeholder:text-[#78350f]/60 focus:border-[#D97706]"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <div className="w-full md:w-64">
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="h-12 border-[#FDE68A] bg-[#FFFBEB] text-[#451a03] focus:ring-[#D97706]">
                <SelectValue placeholder="Property Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Villa">Villa</SelectItem>
                <SelectItem value="Apartment">Apartment</SelectItem>
                <SelectItem value="Penthouse">Penthouse</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button className="w-full md:w-auto h-12 bg-[#D97706] text-white hover:bg-[#B45309] px-8 transition-colors">
            Search
          </Button>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex flex-col gap-3">
                <Skeleton className="h-64 w-full rounded-xl" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-8 w-1/3 mt-2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {propertiesToRender.map((property: any) => (
              <Link key={property.id} href={`/properties/${property.id}`}>
                <div className="group bg-white rounded-xl overflow-hidden shadow-lg border border-[#FDE68A] hover:border-[#D97706] hover:shadow-xl transition-all duration-300">
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={property.images?.[0] || "/property-1.png"} 
                      alt={property.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4 bg-[#D97706] text-white text-xs font-bold px-3 py-1 rounded">
                      {property.type}
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-serif text-xl font-bold line-clamp-1">{property.title}</h3>
                    </div>
                    <div className="flex items-center gap-2 text-[#78350f] text-sm mb-4">
                      <MapPin className="w-4 h-4" />
                      {property.location}
                    </div>
                    <div className="flex items-center gap-4 text-sm mb-6 border-t border-b border-[#FDE68A]/50 py-4 text-[#78350f]">
                      {property.bedrooms && (
                        <div className="flex items-center gap-1.5 font-medium">
                          <Bed className="w-4 h-4 text-secondary" />
                          <span>{property.bedrooms} Beds</span>
                        </div>
                      )}
                      {property.bathrooms && (
                        <div className="flex items-center gap-1.5 font-medium">
                          <Bath className="w-4 h-4 text-secondary" />
                          <span>{property.bathrooms} Baths</span>
                        </div>
                      )}
                      {property.area && (
                        <div className="flex items-center gap-1.5 font-medium">
                          <Square className="w-4 h-4 text-secondary" />
                          <span>{property.area} {property.areaUnit}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-[#F59E0B]">
                        ₹{property.price} {property.priceUnit}
                      </span>
                      <span className="text-sm font-medium text-[#D97706] group-hover:underline">
                        View Details →
                      </span>
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
