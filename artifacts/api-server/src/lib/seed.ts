import bcrypt from "bcryptjs";
import { db, usersTable, propertiesTable, projectsTable, inquiriesTable, testimonialsTable, blogPostsTable } from "@workspace/db";
import { sql } from "drizzle-orm";
import { logger } from "./logger";

export async function seedIfEmpty() {
  const adminHash = await bcrypt.hash("admin123", 10);

  // Always ensure the admin user exists
  const existing = await db.select({ id: usersTable.id }).from(usersTable)
    .where(sql`email = 'admin@housiee.in'`).limit(1);

  if (existing.length === 0) {
    await db.insert(usersTable).values({
      name: "Admin User", email: "admin@housiee.in", phone: "9999999999",
      passwordHash: adminHash, role: "admin", isVerified: true,
    });
    logger.info("Admin user created: admin@housiee.in / admin123");
  }

  // Seed sample data only if DB is otherwise empty
  const [{ count }] = await db.select({ count: sql<number>`count(*)` }).from(propertiesTable);
  if (Number(count) > 0) return;

  logger.info("Empty database detected — running first-time sample data seed...");

  const userHash = await bcrypt.hash("password", 10);

  await db.insert(usersTable).values([
    { name: "Rahul Sharma", email: "rahul@gmail.com", phone: "9876543210", passwordHash: userHash, role: "user", isVerified: true },
    { name: "Priya Patel", email: "priya@gmail.com", phone: "9871234567", passwordHash: userHash, role: "user", isVerified: true },
    { name: "Amit Desai", email: "amit@gmail.com", phone: "9823456789", passwordHash: userHash, role: "user", isVerified: false },
    { name: "Neha Joshi", email: "neha@gmail.com", phone: "9712345678", passwordHash: userHash, role: "user", isVerified: true },
  ]);

  await db.insert(propertiesTable).values([
    {
      title: "Luxurious 3 BHK in Prahlad Nagar",
      description: "Spacious 3 BHK apartment with premium amenities in the heart of Prahlad Nagar. Features modern kitchen, master bedroom with walk-in closet, and a stunning city view.",
      price: 95, priceUnit: "Lac", location: "Prahlad Nagar, Ahmedabad",
      area: 1450, areaUnit: "sq.ft", bedrooms: 3, bathrooms: 2,
      type: "Apartment", category: "Residential", status: "available", featured: true,
      images: ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80", "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80"],
      amenities: ["Gym", "Swimming Pool", "Parking", "Security", "Lift", "Power Backup"],
      builderName: "Shivalay Group", possession: "Ready to Move",
      rera: "PR/GJ/AHMEDABAD/AUDA/MAA01234/090924", userId: 2,
    },
    {
      title: "Premium 4 BHK Villa in Bodakdev",
      description: "Independent villa with private garden, home theatre, and modern architecture. Perfect for families seeking luxury lifestyle in premium Bodakdev area.",
      price: 2.8, priceUnit: "Cr", location: "Bodakdev, Ahmedabad",
      area: 3800, areaUnit: "sq.ft", bedrooms: 4, bathrooms: 4,
      type: "Villa", category: "Residential", status: "available", featured: true,
      images: ["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80", "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80"],
      amenities: ["Private Garden", "Home Theatre", "Modular Kitchen", "2 Car Parking", "Smart Home", "Swimming Pool"],
      builderName: "Godrej Properties", possession: "Ready to Move",
      rera: "PR/GJ/AHMEDABAD/AUDA/MAB05678/120924", userId: 2,
    },
    {
      title: "Modern 2 BHK in Bopal",
      description: "Well-designed 2 BHK apartment with open kitchen concept and balcony. Ideal for young families and professionals. Close to international schools and malls.",
      price: 52, priceUnit: "Lac", location: "Bopal, Ahmedabad",
      area: 1050, areaUnit: "sq.ft", bedrooms: 2, bathrooms: 2,
      type: "Apartment", category: "Residential", status: "available", featured: true,
      images: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80", "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=800&q=80"],
      amenities: ["Gym", "Kids Play Area", "Parking", "Security 24x7", "Intercom", "Lift"],
      builderName: "Safal Group", possession: "Dec 2025",
      rera: "PR/GJ/AHMEDABAD/AUDA/MAC09012/030924", userId: 3,
    },
    {
      title: "Spacious 3 BHK in Satellite",
      description: "Corner flat with 3 sides open and abundant natural light. Premium society with clubhouse and jogging track. Walking distance to SG Highway.",
      price: 88, priceUnit: "Lac", location: "Satellite, Ahmedabad",
      area: 1750, areaUnit: "sq.ft", bedrooms: 3, bathrooms: 3,
      type: "Apartment", category: "Residential", status: "available", featured: true,
      images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80", "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80"],
      amenities: ["Clubhouse", "Jogging Track", "Gym", "Swimming Pool", "Tennis Court", "Security"],
      builderName: "Patel Corporation", possession: "Ready to Move",
      rera: "PR/GJ/AHMEDABAD/AUDA/MAD34567/060924", userId: 3,
    },
    {
      title: "Commercial Office Space in SG Highway",
      description: "Ready-to-move commercial office space on prime SG Highway. IT park infrastructure with 24/7 power backup, high-speed internet, and dedicated parking.",
      price: 1.5, priceUnit: "Cr", location: "SG Highway, Ahmedabad",
      area: 2500, areaUnit: "sq.ft", bedrooms: null, bathrooms: 2,
      type: "Office Space", category: "Commercial", status: "available", featured: true,
      images: ["https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80", "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&q=80"],
      amenities: ["Power Backup", "High Speed Internet", "Conference Room", "Cafeteria", "Parking", "Security"],
      builderName: "GIFT City Group", possession: "Ready to Move",
      rera: "PR/GJ/AHMEDABAD/AUDA/MAE67890/090924", userId: null,
    },
    {
      title: "Residential Plot in Shela",
      description: "Premium residential plot in fast developing Shela area. AUDA approved plot with all utilities. Ideal for building your dream home.",
      price: 65, priceUnit: "Lac", location: "Shela, Ahmedabad",
      area: 1800, areaUnit: "sq.ft", bedrooms: null, bathrooms: null,
      type: "Plot", category: "Residential", status: "available", featured: false,
      images: ["https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80"],
      amenities: ["AUDA Approved", "All Utilities", "Gated Community", "Wide Roads"],
      builderName: null, possession: "Immediate", rera: null, userId: 4,
    },
    {
      title: "1 BHK Studio Apartment in Navrangpura",
      description: "Compact and smart 1 BHK studio apartment near Gujarat University. Perfect for students and working professionals.",
      price: 32, priceUnit: "Lac", location: "Navrangpura, Ahmedabad",
      area: 620, areaUnit: "sq.ft", bedrooms: 1, bathrooms: 1,
      type: "Apartment", category: "Residential", status: "available", featured: false,
      images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80"],
      amenities: ["Furnished", "Lift", "Parking", "Security", "Wi-Fi Ready"],
      builderName: "Urban Spaces", possession: "Ready to Move", rera: null, userId: 4,
    },
    {
      title: "Row House in Science City Road",
      description: "3 BHK independent row house with terrace garden and separate servant quarter. Quiet residential neighborhood with great connectivity.",
      price: 1.2, priceUnit: "Cr", location: "Science City Road, Ahmedabad",
      area: 2200, areaUnit: "sq.ft", bedrooms: 3, bathrooms: 3,
      type: "Row House", category: "Residential", status: "available", featured: true,
      images: ["https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80", "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80"],
      amenities: ["Terrace Garden", "Servant Quarter", "2 Parking", "Modular Kitchen", "Vastu Compliant"],
      builderName: "Rajhans Realty", possession: "Ready to Move",
      rera: "PR/GJ/AHMEDABAD/AUDA/MAF11223/120924", userId: null,
    },
    {
      title: "Retail Shop in CG Road",
      description: "Ground floor retail shop on bustling CG Road with high footfall. Ideal for any retail business, showroom or restaurant.",
      price: 80, priceUnit: "Lac", location: "CG Road, Ahmedabad",
      area: 600, areaUnit: "sq.ft", bedrooms: null, bathrooms: 1,
      type: "Shop", category: "Commercial", status: "available", featured: false,
      images: ["https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800&q=80"],
      amenities: ["Ground Floor", "High Footfall", "Parking Available", "Power Backup"],
      builderName: null, possession: "Immediate", rera: null, userId: null,
    },
    {
      title: "Penthouse in Thaltej",
      description: "Exclusive 4 BHK penthouse with private terrace, jacuzzi, and panoramic city views. Ultra-luxury finishes and smart home automation.",
      price: 3.5, priceUnit: "Cr", location: "Thaltej, Ahmedabad",
      area: 4500, areaUnit: "sq.ft", bedrooms: 4, bathrooms: 5,
      type: "Apartment", category: "Residential", status: "available", featured: true,
      images: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80", "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80"],
      amenities: ["Private Terrace", "Jacuzzi", "Smart Home", "Private Lift", "4 Parking", "Concierge"],
      builderName: "Adani Realty", possession: "Ready to Move",
      rera: "PR/GJ/AHMEDABAD/AUDA/MAG44556/030925", userId: null,
    },
  ]);

  await db.insert(projectsTable).values([
    {
      name: "Shivalay Heights", builderName: "Shivalay Group", location: "Prahlad Nagar, Ahmedabad",
      status: "ongoing", type: "Residential", minPrice: 65, maxPrice: 180, totalUnits: 280,
      description: "A landmark residential project offering 2, 3 and 4 BHK luxury apartments with world-class amenities.",
      images: ["https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80", "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80"],
      amenities: ["Rooftop Garden", "Infinity Pool", "Gym", "Clubhouse", "EV Charging", "Kids Zone", "Jogging Track"],
      rera: "PR/GJ/AHMEDABAD/AUDA/PROJ0001/2024", possession: "Dec 2026", featured: true,
    },
    {
      name: "Bopal Grand", builderName: "Safal Group", location: "Bopal, Ahmedabad",
      status: "ongoing", type: "Residential", minPrice: 50, maxPrice: 95, totalUnits: 480,
      description: "Premium township project in Bopal with 3 residential towers, commercial complex, and landscaped gardens.",
      images: ["https://images.unsplash.com/photo-1464082354059-27db6ce50048?w=800&q=80", "https://images.unsplash.com/photo-1499916078039-922301b0eb9b?w=800&q=80"],
      amenities: ["Township", "Cricket Ground", "Swimming Pool", "School", "Supermarket", "Amphitheatre"],
      rera: "PR/GJ/AHMEDABAD/AUDA/PROJ0002/2024", possession: "Mar 2027", featured: true,
    },
    {
      name: "GIFT City Offices", builderName: "GIFT City Group", location: "GIFT City, Gandhinagar",
      status: "completed", type: "Commercial", minPrice: 120, maxPrice: 500, totalUnits: 150,
      description: "Premium Grade-A office spaces in GIFT City SEZ. Ideal for IT/ITES companies and financial institutions.",
      images: ["https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80", "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800&q=80"],
      amenities: ["SEZ Benefits", "Metro Connectivity", "Data Centre", "Cafeteria", "24x7 Security", "Green Building"],
      rera: "PR/GJ/GANDHINAGAR/GUDA/PROJ0003/2023", possession: "Ready to Move", featured: false,
    },
    {
      name: "Satellite Residency", builderName: "Patel Corporation", location: "Satellite, Ahmedabad",
      status: "ongoing", type: "Residential", minPrice: 95, maxPrice: 180, totalUnits: 40,
      description: "Exclusive boutique project with only 40 units ensuring privacy. 3 & 4 BHK sky residences with spectacular views.",
      images: ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80", "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80"],
      amenities: ["Sky Deck", "Private Pool", "Concierge", "Smart Home", "EV Parking", "Wine Cellar"],
      rera: "PR/GJ/AHMEDABAD/AUDA/PROJ0004/2024", possession: "Jun 2026", featured: true,
    },
    {
      name: "Thaltej Villas", builderName: "Rajhans Realty", location: "Thaltej, Ahmedabad",
      status: "upcoming", type: "Residential", minPrice: 1.2, maxPrice: 3.5, totalUnits: 60,
      description: "Row houses and bungalow plots in a gated community with 24x7 security and landscaped gardens.",
      images: ["https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&q=80", "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80"],
      amenities: ["Gated Community", "Clubhouse", "Tennis Court", "Garden", "24x7 Security", "Wide Roads"],
      rera: "PR/GJ/AHMEDABAD/AUDA/PROJ0005/2024", possession: "Dec 2027", featured: true,
    },
    {
      name: "Navrangpura Commercial Hub", builderName: "Urban Spaces", location: "Navrangpura, Ahmedabad",
      status: "ongoing", type: "Commercial", minPrice: 70, maxPrice: 300, totalUnits: 120,
      description: "Mixed-use commercial development with retail, office and food court on CG Road.",
      images: ["https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800&q=80", "https://images.unsplash.com/photo-1497366835827-2a9d28e61bad?w=800&q=80"],
      amenities: ["High Footfall", "Food Court", "Ample Parking", "Power Backup", "CCTV", "ATM"],
      rera: "PR/GJ/AHMEDABAD/AUDA/PROJ0006/2024", possession: "Sep 2026", featured: false,
    },
  ]);

  await db.insert(inquiriesTable).values([
    { name: "Vikram Mehta", email: "vikram@gmail.com", phone: "9898989898", message: "I am interested in the 3 BHK apartment. Can we schedule a site visit this weekend?", propertyId: 1, inquiryType: "property", status: "new" },
    { name: "Sunita Agrawal", email: "sunita@gmail.com", phone: "9787878787", message: "Looking for 2-3 BHK in Bopal or nearby area within 60 Lac budget. Please share available options.", propertyId: null, inquiryType: "general", status: "new" },
    { name: "Deepak Shah", email: "deepak@gmail.com", phone: "9676767676", message: "Interested in the commercial property on SG Highway. Can you provide more details about lease terms?", propertyId: 5, inquiryType: "property", status: "contacted" },
    { name: "Kavya Trivedi", email: "kavya@gmail.com", phone: "9565656565", message: "The villa looks amazing! What is the final negotiated price? Is vastu compliance confirmed?", propertyId: 2, inquiryType: "property", status: "contacted" },
    { name: "Manish Gupta", email: "manish@gmail.com", phone: "9454545454", message: "I need commercial space for my IT startup. Around 2000 sqft in GIFT City or SG Highway area.", propertyId: null, inquiryType: "general", status: "resolved" },
    { name: "Pooja Bansal", email: "pooja@gmail.com", phone: "9343434343", message: "Interested in the studio apartment for investment. What is the expected rental yield?", propertyId: 7, inquiryType: "property", status: "new" },
    { name: "Ravi Nair", email: "ravi@gmail.com", phone: "9232323232", message: "We are NRI looking to invest in Ahmedabad properties. Please share details about 3-4 BHK apartments.", propertyId: null, inquiryType: "general", status: "new" },
    { name: "Archana Modi", email: "archana@gmail.com", phone: "9121212121", message: "Saw the penthouse listing. Loved it! Can you arrange a private viewing? We are serious buyers.", propertyId: 10, inquiryType: "property", status: "contacted" },
  ]);

  await db.insert(testimonialsTable).values([
    { clientName: "Rajesh & Meena Patel", clientImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80", review: "HOUSIEE made our dream home a reality. The team guided us through every step of buying our first 3 BHK. Transparent process and no hidden charges. Highly recommended!", rating: 5, propertyBought: "3 BHK in Prahlad Nagar", location: "Ahmedabad" },
    { clientName: "Ankit Shah", clientImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80", review: "Excellent service! I was looking for commercial space and the team found me the perfect office in SG Highway within my budget. Professional and responsive.", rating: 5, propertyBought: "Office Space in SG Highway", location: "Ahmedabad" },
    { clientName: "Priyanka & Nitin Desai", clientImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80", review: "We bought our villa through HOUSIEE and the experience was seamless. They helped with legal documentation too. Trust them completely for real estate in Ahmedabad.", rating: 5, propertyBought: "4 BHK Villa in Bodakdev", location: "Ahmedabad" },
    { clientName: "Suresh Kumar", clientImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&q=80", review: "Great platform with genuine listings. No fake photos or misleading prices. Got exactly what was shown. HOUSIEE team is very knowledgeable about Ahmedabad market.", rating: 4, propertyBought: "2 BHK in Bopal", location: "Ahmedabad" },
    { clientName: "Jyoti Acharya", clientImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&q=80", review: "As an NRI buyer, I was worried about the process. HOUSIEE handled everything remotely and I got possession of my apartment without any hassle. Outstanding service!", rating: 5, propertyBought: "3 BHK in Satellite", location: "Ahmedabad" },
  ]);

  await db.insert(blogPostsTable).values([
    { title: "Top 10 Residential Areas to Buy Property in Ahmedabad 2025", slug: "top-10-residential-areas-ahmedabad-2025", excerpt: "Ahmedabad real estate is booming. Here are the top 10 localities offering best value, connectivity, and appreciation potential in 2025.", content: "Ahmedabad has emerged as one of India's most vibrant real estate markets...", category: "Investment", coverImage: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80", author: "HOUSIEE Team", readTime: 6 },
    { title: "RERA in Gujarat: Everything Home Buyers Need to Know", slug: "rera-gujarat-home-buyers-guide", excerpt: "Understanding RERA protection, how to verify a project registration, and your rights as a buyer under the Real Estate Regulation Act in Gujarat.", content: "The Real Estate (Regulation and Development) Act, 2016, commonly known as RERA...", category: "Legal", coverImage: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&q=80", author: "HOUSIEE Legal Team", readTime: 8 },
    { title: "Bopal vs Prahlad Nagar: Which is Better for Investment?", slug: "bopal-vs-prahlad-nagar-investment", excerpt: "A detailed comparison of two of Ahmedabad's most popular residential micro-markets. Price trends, infrastructure, and ROI analysis for 2025.", content: "When it comes to residential investment in Ahmedabad, Bopal and Prahlad Nagar...", category: "Investment", coverImage: "https://images.unsplash.com/photo-1560472355-536de3962603?w=800&q=80", author: "HOUSIEE Team", readTime: 5 },
    { title: "Home Loan Guide 2025: Best Banks and Interest Rates", slug: "home-loan-guide-2025", excerpt: "Compare home loan interest rates from SBI, HDFC, ICICI and other leading banks. Tips to maximize your loan eligibility and reduce EMI burden.", content: "Getting a home loan is now easier than ever with competitive rates...", category: "Finance", coverImage: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80", author: "HOUSIEE Finance Team", readTime: 7 },
    { title: "Commercial Real Estate in Ahmedabad: The GIFT City Opportunity", slug: "commercial-real-estate-gift-city-ahmedabad", excerpt: "GIFT City is transforming Ahmedabad's commercial landscape. Why savvy investors are eyeing office spaces and retail in Gujarat International Finance Tec-City.", content: "Gujarat International Finance Tec-City (GIFT City) is India's first operational...", category: "Commercial", coverImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80", author: "HOUSIEE Commercial Team", readTime: 9 },
    { title: "Vastu Shastra Tips for Your New Home in Ahmedabad", slug: "vastu-shastra-tips-new-home-ahmedabad", excerpt: "Traditional wisdom meets modern living. Key Vastu principles every Ahmedabad home buyer should know before finalizing their property.", content: "Vastu Shastra has been an integral part of Indian home buying decisions...", category: "Lifestyle", coverImage: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80", author: "HOUSIEE Team", readTime: 4 },
  ]);

  logger.info("First-time seed complete: admin, properties, projects, inquiries, testimonials, blog posts added.");
}
