import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export default function Contact() {
  return (
    <div className="pt-24 pb-20 min-h-screen bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-6 text-center">Contact Us</h1>
          <p className="text-center text-muted-foreground mb-16">
            Get in touch with our expert real estate advisors today.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <div className="bg-card p-8 rounded-2xl shadow-xl border border-border h-full">
                <h3 className="text-2xl font-bold mb-8 font-serif">Send a Message</h3>
                <form className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Name</label>
                    <Input placeholder="Your Name" className="h-12" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <Input placeholder="your.email@example.com" type="email" className="h-12" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Phone</label>
                    <Input placeholder="+91 00000 00000" className="h-12" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Message</label>
                    <Textarea placeholder="How can we help you?" className="min-h-[120px]" />
                  </div>
                  <Button className="w-full h-14 bg-secondary hover:bg-secondary/90 text-white font-bold text-lg rounded-xl">
                    Send Inquiry
                  </Button>
                </form>
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-[#EFF6FF] border border-[#2563EB]/20 p-8 rounded-2xl shadow-sm">
                <h3 className="text-2xl font-bold mb-8 font-serif text-[#0F172A]">Contact Information</h3>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm border border-slate-100">
                      <MapPin className="w-5 h-5 text-[#2563EB]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-1 text-[#0F172A]">Office Address</h4>
                      <p className="text-slate-500 leading-relaxed">
                        B-329, Moneyplant Highstreet,<br />
                        Gota, Ahmedabad, Gujarat 382481
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm border border-slate-100">
                      <Phone className="w-5 h-5 text-[#2563EB]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-1 text-[#0F172A]">Phone Number</h4>
                      <p className="text-slate-500">+91 92136 99873</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm border border-slate-100">
                      <Mail className="w-5 h-5 text-[#2563EB]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-1 text-[#0F172A]">Email Address</h4>
                      <p className="text-slate-500">info@housiee.in</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm border border-slate-100">
                      <Clock className="w-5 h-5 text-[#2563EB]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-1 text-[#0F172A]">Office Hours</h4>
                      <p className="text-slate-500">Mon - Sat: 9:00 AM - 7:00 PM<br />Sunday: Closed</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
