import { Truck, Shield, CreditCard, Headphones } from "lucide-react";

const features = [
    {
        icon: Truck,
        title: "Free Home Delivery",
        description: "Delivered anywhere in India, fully insured and door-to-door.",
    },
    {
        icon: Shield,
        title: "Verified Luxury",
        description: "Every car is inspected and certified by our experts.",
    },
    {
        icon: CreditCard,
        title: "Flexible Payments",
        description: "EMI, bank transfer, crypto — pay your way.",
    },
    {
        icon: Headphones,
        title: "24/7 Support",
        description: "Dedicated concierge for every customer, always available.",
    },
];

export function Features() {
    return (
        <section className="py-20 bg-slate-900 border-y border-slate-800">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <p className="text-sm font-medium text-gold mb-2 tracking-widest uppercase">
                        Why Carstore
                    </p>
                    <h2 className="font-playfair text-4xl md:text-5xl font-bold text-white">
                        The Carstore Promise
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, i) => {
                        const Icon = feature.icon;
                        return (
                            <div
                                key={i}
                                className="p-6 rounded-lg border border-slate-800 bg-slate-950 hover:border-gold transition-all duration-300"
                            >
                                <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center mb-4">
                                    <Icon className="h-6 w-6 text-gold" />
                                </div>
                                <h3 className="font-semibold text-white mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-sm text-slate-400">{feature.description}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}