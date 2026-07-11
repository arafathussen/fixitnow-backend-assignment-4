import "dotenv/config";
import { Role } from "../generated/prisma/client";
import { prisma } from "../src/lib/prisma";

async function main() {
    console.log("🌱 Starting database seeding...");

    // 1. Seed Categories
    const categoriesData = [
        { name: "Plumbing", description: "Pipe installation, leak repair, and bathroom plumbing services." },
        { name: "Electrical", description: "Wiring, lighting installation, circuit breaker repair, and electrical maintenance." },
        { name: "House Cleaning", description: "Deep cleaning, carpet cleaning, window washing, and sanitization." },
        { name: "Painting", description: "Interior and exterior house painting, wall repair, and wallpapering." },
        { name: "Carpentry", description: "Furniture repair, cabinet making, door installation, and woodwork." },
        { name: "Appliance Repair", description: "AC servicing, refrigerator repair, washing machine and microwave fixing." },
        { name: "Pest Control", description: "Termite control, cockroach elimination, rodent removal, and fumigation." }
    ];

    for (const cat of categoriesData) {
        await prisma.category.upsert({
            where: { name: cat.name },
            update: {},
            create: cat,
        });
    }
    console.log("✅ Categories seeded successfully!");

    // 2. Seed Admin User
    const adminEmail = "admin@fixitnow.com";
    
    await prisma.user.upsert({
        where: { email: adminEmail },
        update: {},
        create: {
            email: adminEmail,
            name: "Super Admin",
            password: "$2b$10$TE3g9HKg7u5ufrqkOk6f4.rlyxKu0p2SnJSHjRqf7YkUKj/x8aLMG", // Hash for 'admin1234'
            role: Role.ADMIN,
            phone: "+8801700000000",
            address: "Dhaka, Bangladesh",
        },
    });
    console.log("✅ Admin user seeded successfully! (Email: admin@fixitnow.com)");

    console.log("🌟 Seeding completed successfully!");
}

main()
    .catch((e) => {
        console.error("❌ Error during seeding:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
