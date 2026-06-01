import { useListProjects } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin } from "lucide-react";

const FALLBACK_PROJECTS = [
  { id: '1', name: 'Godrej Garden City', type: 'Township', builderName: 'Godrej Properties', location: 'SG Highway', status: 'ready_to_move', minPrice: 85, maxPrice: 150, images: ['/project-1.png'] },
  { id: '2', name: 'Shaligram Prime', type: 'Apartments', builderName: 'Shaligram Buildcon', location: 'South Bopal', status: 'ongoing', minPrice: 65, maxPrice: 90, images: ['/project-2.png'] },
];

export default function Projects() {
  const { data, isLoading } = useListProjects();
  
  const fetchedProjects = Array.isArray(data) ? data : (data as any)?.projects ?? [];
  const projectsToRender = fetchedProjects.length > 0 ? fetchedProjects : FALLBACK_PROJECTS;

  return (
    <div className="pt-24 pb-20 min-h-screen bg-[#FFFBEB] text-[#451a03]">
      <div className="container mx-auto px-4">
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-8">Premium Projects</h1>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-96 w-full rounded-2xl bg-[#FDE68A]/30" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projectsToRender.map((project: any) => (
              <Link key={project.id} href={`/projects/${project.id}`}>
                <div className="group bg-white rounded-2xl overflow-hidden shadow-lg border border-[#FDE68A] hover:border-[#D97706] hover:shadow-xl transition-all duration-300">
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={project.images?.[0] || "/project-1.png"} 
                      alt={project.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4 bg-[#D97706] text-white text-xs font-bold px-3 py-1 rounded">
                      {project.status.replace(/_/g, ' ').toUpperCase()}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-serif text-xl font-bold mb-2 text-[#451a03]">{project.name}</h3>
                    <div className="flex items-center gap-2 text-[#78350f] text-sm mb-4">
                      <MapPin className="w-4 h-4" />
                      {project.location}
                    </div>
                    <div className="text-sm font-medium mb-4 text-[#D97706]">
                      By {project.builderName}
                    </div>
                    <div className="flex items-center justify-between border-t border-[#FDE68A]/50 pt-4">
                      <div className="text-lg font-bold text-[#F59E0B]">
                        {project.minPrice && project.maxPrice 
                          ? `₹${project.minPrice}L - ₹${project.maxPrice}L`
                          : "Price on Request"
                        }
                      </div>
                      <span className="text-[#D97706] text-sm font-medium group-hover:underline">View Project →</span>
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
