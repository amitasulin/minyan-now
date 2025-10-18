import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database with sample synagogue data...");

  // Create sample synagogues
  const synagogues = [
    {
      name: "Congregation Beth Israel",
      address: "123 Main Street",
      city: "Brooklyn",
      state: "NY",
      country: "USA",
      postalCode: "11201",
      latitude: 40.6782,
      longitude: -73.9442,
      nusach: "ASHKENAZ",
      rabbi: "Rabbi David Cohen",
      phone: "(718) 555-0123",
      email: "info@bethisrael.org",
      website: "https://bethisrael.org",
      description:
        "A warm and welcoming Orthodox synagogue serving the Brooklyn community for over 50 years.",
      wheelchairAccess: true,
      parking: true,
      airConditioning: true,
      womensSection: true,
      mikveh: false,
    },
    {
      name: "Sephardic Center",
      address: "456 Oak Avenue",
      city: "Brooklyn",
      state: "NY",
      country: "USA",
      postalCode: "11202",
      latitude: 40.6892,
      longitude: -73.9342,
      nusach: "SEPHARD",
      rabbi: "Rabbi Moshe Levy",
      phone: "(718) 555-0456",
      email: "contact@sephardiccenter.org",
      website: "https://sephardiccenter.org",
      description:
        "Traditional Sephardic synagogue preserving the rich heritage of Sephardic Judaism.",
      wheelchairAccess: false,
      parking: true,
      airConditioning: true,
      womensSection: true,
      mikveh: true,
    },
    {
      name: "Chabad House of Brooklyn",
      address: "789 Pine Street",
      city: "Brooklyn",
      state: "NY",
      country: "USA",
      postalCode: "11203",
      latitude: 40.6682,
      longitude: -73.9542,
      nusach: "CHABAD",
      rabbi: "Rabbi Yosef Greenberg",
      phone: "(718) 555-0789",
      email: "chabad@brooklynchabad.org",
      website: "https://brooklynchabad.org",
      description:
        "Chabad Lubavitch center providing spiritual guidance and community services.",
      wheelchairAccess: true,
      parking: false,
      airConditioning: false,
      womensSection: true,
      mikveh: false,
    },
    {
      name: "Temple Emanuel",
      address: "321 Elm Street",
      city: "Manhattan",
      state: "NY",
      country: "USA",
      postalCode: "10001",
      latitude: 40.7505,
      longitude: -73.9934,
      nusach: "ASHKENAZ",
      rabbi: "Rabbi Sarah Rosen",
      phone: "(212) 555-0321",
      email: "info@templeemanuel.org",
      website: "https://templeemanuel.org",
      description: "Modern Orthodox synagogue in the heart of Manhattan.",
      wheelchairAccess: true,
      parking: false,
      airConditioning: true,
      womensSection: true,
      mikveh: false,
    },
    {
      name: "Congregation Ohel Moshe",
      address: "654 Maple Drive",
      city: "Queens",
      state: "NY",
      country: "USA",
      postalCode: "11375",
      latitude: 40.7282,
      longitude: -73.7949,
      nusach: "EDOT_MIZRACH",
      rabbi: "Rabbi Avraham Mizrahi",
      phone: "(718) 555-0654",
      email: "ohelmoshe@congregation.org",
      description:
        "Sephardic synagogue serving the Bukharian Jewish community.",
      wheelchairAccess: true,
      parking: true,
      airConditioning: true,
      womensSection: true,
      mikveh: true,
    },
  ];

  for (const synagogueData of synagogues) {
    const synagogue = await prisma.synagogue.create({
      data: synagogueData,
    });

    console.log(`✅ Created synagogue: ${synagogue.name}`);

    // Create prayer schedules for each synagogue
    const prayerSchedules = [
      // Sunday
      { dayOfWeek: 0, prayerType: "SHACHARIT", time: "08:00" },
      { dayOfWeek: 0, prayerType: "MINCHA", time: "17:30" },
      { dayOfWeek: 0, prayerType: "MAARIV", time: "19:00" },

      // Monday-Thursday
      { dayOfWeek: 1, prayerType: "SHACHARIT", time: "07:30" },
      { dayOfWeek: 1, prayerType: "MINCHA", time: "17:30" },
      { dayOfWeek: 1, prayerType: "MAARIV", time: "19:00" },

      { dayOfWeek: 2, prayerType: "SHACHARIT", time: "07:30" },
      { dayOfWeek: 2, prayerType: "MINCHA", time: "17:30" },
      { dayOfWeek: 2, prayerType: "MAARIV", time: "19:00" },

      { dayOfWeek: 3, prayerType: "SHACHARIT", time: "07:30" },
      { dayOfWeek: 3, prayerType: "MINCHA", time: "17:30" },
      { dayOfWeek: 3, prayerType: "MAARIV", time: "19:00" },

      { dayOfWeek: 4, prayerType: "SHACHARIT", time: "07:30" },
      { dayOfWeek: 4, prayerType: "MINCHA", time: "17:30" },
      { dayOfWeek: 4, prayerType: "MAARIV", time: "19:00" },

      // Friday
      { dayOfWeek: 5, prayerType: "SHACHARIT", time: "07:30" },
      { dayOfWeek: 5, prayerType: "MINCHA", time: "17:00" },
      { dayOfWeek: 5, prayerType: "MAARIV", time: "18:30" },

      // Saturday
      { dayOfWeek: 6, prayerType: "SHACHARIT", time: "09:00" },
      { dayOfWeek: 6, prayerType: "MUSAF", time: "10:30" },
      { dayOfWeek: 6, prayerType: "MINCHA", time: "17:00" },
      { dayOfWeek: 6, prayerType: "MAARIV", time: "19:30" },
    ];

    for (const scheduleData of prayerSchedules) {
      await prisma.prayerSchedule.create({
        data: {
          ...scheduleData,
          synagogueId: synagogue.id,
        },
      });
    }

    console.log(`📅 Added prayer schedules for ${synagogue.name}`);
  }

  // Create a demo user
  const demoUser = await prisma.user.create({
    data: {
      email: "demo@minyannow.com",
      name: "Demo User",
      phone: "+1-555-0123",
      trustScore: 100,
      isVerified: true,
    },
  });

  console.log(`👤 Created demo user: ${demoUser.email}`);

  // Create some sample minyan reports
  const sampleReports = [
    {
      synagogueId: synagogues[0].name, // Beth Israel
      userId: demoUser.id,
      prayerType: "SHACHARIT",
      status: "ACTIVE_NOW",
      notes: "Great turnout this morning!",
      minyanCount: 15,
    },
    {
      synagogueId: synagogues[1].name, // Sephardic Center
      userId: demoUser.id,
      prayerType: "MINCHA",
      status: "NEEDS_MORE",
      notes: "Need 2 more people for minyan",
      needsMore: 2,
    },
  ];

  for (const reportData of sampleReports) {
    const synagogue = await prisma.synagogue.findFirst({
      where: { name: reportData.synagogueId },
    });

    if (synagogue) {
      await prisma.minyanReport.create({
        data: {
          synagogueId: synagogue.id,
          userId: reportData.userId,
          prayerType: reportData.prayerType,
          status: reportData.status,
          notes: reportData.notes,
          minyanCount: reportData.minyanCount,
          needsMore: reportData.needsMore,
          latitude: synagogue.latitude,
          longitude: synagogue.longitude,
        },
      });
    }
  }

  console.log(`📊 Created sample minyan reports`);

  console.log("🎉 Database seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
