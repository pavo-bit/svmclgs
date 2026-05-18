// ═══════════════════════════════════════════
// SSVM College Square — Database Seed Script
// Run: npx ts-node --compiler-options '{"module":"CommonJS"}' prisma/seed.ts
// Or:  npx tsx prisma/seed.ts
// ═══════════════════════════════════════════

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function hash(pw: string) {
  return bcrypt.hash(pw, 12);
}

async function main() {
  console.log("🌱 Seeding SSVM database...\n");

  // ─── Clear existing data ───
  await prisma.$transaction([
    prisma.assignmentSubmission.deleteMany(),
    prisma.attendance.deleteMany(),
    prisma.result.deleteMany(),
    prisma.fee.deleteMany(),
    prisma.assignment.deleteMany(),
    prisma.message.deleteMany(),
    prisma.contribution.deleteMany(),
    prisma.galleryImage.deleteMany(),
    prisma.notice.deleteMany(),
    prisma.event.deleteMany(),
    prisma.faculty.deleteMany(),
    prisma.testimonial.deleteMany(),
    prisma.siteContent.deleteMany(),
    prisma.student.deleteMany(),
    prisma.parent.deleteMany(),
    prisma.alumni.deleteMany(),
    prisma.user.deleteMany(),
  ]);

  // ─── ADMIN USER ───
  const admin = await prisma.user.create({
    data: {
      email: "admin@ssvm-cuttack.org",
      password: await hash("admin123"),
      name: "Shri Ramakanta Mishra",
      role: "ADMIN",
      phone: "+91-9876543210",
    },
  });
  console.log("✅ Admin created: admin@ssvm-cuttack.org / admin123");

  // ─── PARENT USER ───
  const parentUser = await prisma.user.create({
    data: {
      email: "parent@ssvm-cuttack.org",
      password: await hash("parent123"),
      name: "Sujata Kumar",
      role: "PARENT",
      phone: "+91-9876543211",
      parent: { create: { occupation: "Business", address: "College Square, Cuttack" } },
    },
    include: { parent: true },
  });
  console.log("✅ Parent created: parent@ssvm-cuttack.org / parent123");

  // ─── STUDENT USERS ───
  const student1 = await prisma.user.create({
    data: {
      email: "student@ssvm-cuttack.org",
      password: await hash("student123"),
      name: "Priya Mohanty",
      role: "STUDENT",
      student: {
        create: {
          rollNo: "2025-IX-034",
          class: "IX",
          section: "B",
          session: "2025-26",
          guardianName: "Sujata Kumar",
          parentId: parentUser.parent!.id,
        },
      },
    },
    include: { student: true },
  });

  const student2 = await prisma.user.create({
    data: {
      email: "arjun@ssvm-cuttack.org",
      password: await hash("student123"),
      name: "Arjun Kumar",
      role: "STUDENT",
      student: {
        create: {
          rollNo: "2025-VII-021",
          class: "VII",
          section: "A",
          session: "2025-26",
          guardianName: "Sujata Kumar",
          parentId: parentUser.parent!.id,
        },
      },
    },
    include: { student: true },
  });

  // More students
  const studentNames = [
    { name: "Rohit Sahoo", email: "rohit@ssvm-cuttack.org", roll: "2025-X-007", cls: "X", sec: "A" },
    { name: "Sneha Das", email: "sneha@ssvm-cuttack.org", roll: "2025-VII-033", cls: "VII", sec: "C" },
    { name: "Amit Kumar", email: "amit@ssvm-cuttack.org", roll: "2025-VIII-015", cls: "VIII", sec: "A" },
    { name: "Riya Nayak", email: "riya@ssvm-cuttack.org", roll: "2025-V-033", cls: "V", sec: "B" },
    { name: "Vikram Singh", email: "vikram@ssvm-cuttack.org", roll: "2025-XII-002", cls: "XII", sec: "Sci" },
    { name: "Ananya Rath", email: "ananya@ssvm-cuttack.org", roll: "2025-XI-018", cls: "XI", sec: "Com" },
  ];

  for (const s of studentNames) {
    await prisma.user.create({
      data: {
        email: s.email,
        password: await hash("student123"),
        name: s.name,
        role: "STUDENT",
        student: {
          create: { rollNo: s.roll, class: s.cls, section: s.sec, session: "2025-26" },
        },
      },
    });
  }
  console.log("✅ 8 Students created");

  // ─── ALUMNI USER ───
  const alumniUser = await prisma.user.create({
    data: {
      email: "alumni@ssvm-cuttack.org",
      password: await hash("alumni123"),
      name: "Rajat Behera",
      role: "ALUMNI",
      alumni: {
        create: {
          batch: "2018",
          currentRole: "Software Engineer, Google",
          company: "Google",
          achievement: "IIT Bhubaneswar Gold Medalist",
          isFeatured: true,
        },
      },
    },
    include: { alumni: true },
  });

  // More alumni
  const alumniData = [
    { name: "Dr. Sanjay Panda", email: "sanjay@alumni.ssvm.org", batch: "1995", role: "Cardiologist, AIIMS Delhi", achievement: "Padma Shri Nominee 2024", featured: true },
    { name: "Swati Mishra", email: "swati@alumni.ssvm.org", batch: "2005", role: "IAS Officer, Odisha Cadre", achievement: "District Collector, Ganjam", featured: true },
    { name: "Anita Rath", email: "anita@alumni.ssvm.org", batch: "2010", role: "Founder, EduTech Startup", achievement: "Forbes 30 Under 30 India", featured: true },
  ];

  for (const a of alumniData) {
    await prisma.user.create({
      data: {
        email: a.email,
        password: await hash("alumni123"),
        name: a.name,
        role: "ALUMNI",
        alumni: {
          create: { batch: a.batch, currentRole: a.role, achievement: a.achievement, isFeatured: a.featured },
        },
      },
    });
  }
  console.log("✅ 4 Alumni created");

  // ─── NOTICES ───
  const notices = [
    { title: "Admission Open for Session 2025–26", content: "Registrations open for Nursery to Class XI. Forms available at school office and website. Last date: 30 June 2025.", category: "Admission", status: "PUBLISHED" as const },
    { title: "Summer Vacation Schedule", content: "School closed from 20 May to 14 June 2025. Reopens 15 June (Monday). All pending assignments must be submitted by 16 June.", category: "General", status: "PUBLISHED" as const },
    { title: "Class X & XII Board Results 2025", content: "Congratulations! 100% pass rate. 12 students in district merit list. Results available on school portal.", category: "Results", status: "PUBLISHED" as const },
    { title: "Fee Submission Reminder", content: "Annual fees for 2025–26 to be submitted by 30 June 2025. Late fee of ₹500 applicable after deadline.", category: "Finance", status: "PUBLISHED" as const },
    { title: "Annual Day Rehearsal Schedule", content: "All students participating in Annual Day must attend rehearsals from 10–14 July, 3:00–5:00 PM.", category: "Events", status: "DRAFT" as const },
    { title: "PTM for Classes I–V", content: "Parent-Teacher Meeting scheduled for 20 June 2025, 10:00 AM–1:00 PM. All parents are requested to attend.", category: "General", status: "DRAFT" as const },
  ];

  for (const n of notices) {
    await prisma.notice.create({
      data: { ...n, authorId: admin.id, views: Math.floor(Math.random() * 2000) },
    });
  }
  console.log("✅ 6 Notices created");

  // ─── EVENTS ───
  const events = [
    { title: "Annual Sports Day 2025", description: "Inter-house athletics, cultural march-past & medal ceremony on school grounds", date: new Date("2025-06-15"), venue: "School Ground", category: "Sports", status: "UPCOMING" as const, rsvpCount: 320 },
    { title: "Yoga Diwas Celebration", description: "All students and staff — mass yoga session at College Square ground", date: new Date("2025-06-24"), venue: "College Square Ground", category: "Cultural", status: "UPCOMING" as const, rsvpCount: 580 },
    { title: "Parent-Teacher Meeting", description: "Class I–VIII half-yearly performance review with class teachers", date: new Date("2025-07-05"), venue: "Classrooms", category: "Academic", status: "UPCOMING" as const, rsvpCount: 210 },
    { title: "Independence Day Programme", description: "Flag hoisting, patriotic performances and prize distribution", date: new Date("2025-08-15"), venue: "School Ground", category: "National", status: "PLANNING" as const, rsvpCount: 0 },
    { title: "Saraswati Puja 2025", description: "Annual Saraswati Puja celebration with cultural events", date: new Date("2025-02-02"), venue: "School Campus", category: "Cultural", status: "COMPLETED" as const, rsvpCount: 890 },
  ];

  for (const e of events) {
    await prisma.event.create({ data: { ...e, creatorId: admin.id } });
  }
  console.log("✅ 5 Events created");

  // ─── FACULTY ───
  const facultyList = [
    { name: "Shri Ramakanta Mishra", designation: "Principal", department: "Administration", qualification: "M.Ed, M.A.", experience: "28 years" },
    { name: "Shri Bijaya Sahoo", designation: "Senior Teacher", department: "Mathematics", qualification: "M.Sc Mathematics", experience: "15 years" },
    { name: "Smt. Priyadarshini Das", designation: "Teacher", department: "English & Social Science", qualification: "M.A. English", experience: "12 years" },
    { name: "Smt. Sarita Nayak", designation: "Teacher", department: "Science", qualification: "M.Sc Chemistry", experience: "10 years" },
    { name: "Shri Deepak Pattnaik", designation: "Teacher", department: "Computer Science", qualification: "MCA", experience: "8 years" },
    { name: "Smt. Annapurna Jena", designation: "Teacher", department: "Hindi", qualification: "M.A. Hindi", experience: "14 years" },
  ];

  for (const f of facultyList) {
    await prisma.faculty.create({ data: f });
  }
  console.log("✅ 6 Faculty created");

  // ─── RESULTS for student1 ───
  const resultData = [
    { examName: "Unit Test 1", subject: "Mathematics", totalMarks: 100, obtained: 82, grade: "A" },
    { examName: "Unit Test 1", subject: "English", totalMarks: 100, obtained: 88, grade: "A+" },
    { examName: "Unit Test 1", subject: "Science", totalMarks: 100, obtained: 85, grade: "A" },
    { examName: "Half Yearly", subject: "Mathematics", totalMarks: 100, obtained: 87, grade: "A+" },
    { examName: "Half Yearly", subject: "English", totalMarks: 100, obtained: 90, grade: "A+" },
    { examName: "Half Yearly", subject: "Science", totalMarks: 100, obtained: 84, grade: "A" },
    { examName: "Annual Exam", subject: "Mathematics", totalMarks: 100, obtained: 92, grade: "A++" },
    { examName: "Annual Exam", subject: "English", totalMarks: 100, obtained: 94, grade: "A++" },
    { examName: "Annual Exam", subject: "Science", totalMarks: 100, obtained: 91, grade: "A+" },
  ];

  for (const r of resultData) {
    await prisma.result.create({
      data: { ...r, studentId: student1.student!.id, session: "2025-26" },
    });
  }
  console.log("✅ Results seeded");

  // ─── ATTENDANCE for student1 (current month) ───
  const today = new Date();
  for (let i = 1; i <= Math.min(today.getDate(), 28); i++) {
    const date = new Date(today.getFullYear(), today.getMonth(), i);
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0) continue; // Skip Sundays

    await prisma.attendance.create({
      data: {
        studentId: student1.student!.id,
        date,
        status: i === 5 || i === 6 ? "ABSENT" : dayOfWeek === 6 ? "LATE" : "PRESENT",
      },
    });
  }
  console.log("✅ Attendance seeded");

  // ─── FEES ───
  const feeData = [
    { studentId: student1.student!.id, amount: 14200, type: "Tuition Fee (Q1)", status: "PAID" as const, dueDate: new Date("2025-04-01"), paidDate: new Date("2025-04-01") },
    { studentId: student1.student!.id, amount: 2500, type: "Transport Fee", status: "PAID" as const, dueDate: new Date("2025-03-15"), paidDate: new Date("2025-03-15") },
    { studentId: student1.student!.id, amount: 14200, type: "Tuition Fee (Q2)", status: "PENDING" as const, dueDate: new Date("2025-07-01") },
    { studentId: student2.student!.id, amount: 12500, type: "Tuition Fee (Q1)", status: "PAID" as const, dueDate: new Date("2025-04-01"), paidDate: new Date("2025-04-01") },
    { studentId: student2.student!.id, amount: 12500, type: "Tuition Fee (Q2)", status: "PENDING" as const, dueDate: new Date("2025-07-01") },
  ];

  for (const f of feeData) {
    await prisma.fee.create({ data: { ...f, session: "2025-26" } });
  }
  console.log("✅ Fees seeded");

  // ─── ASSIGNMENTS ───
  const assignmentData = [
    { title: "Quadratic Equations Practice Set", subject: "Mathematics", class: "IX", dueDate: new Date("2025-06-12") },
    { title: "Lab Report: Acid-Base Titration", subject: "Science", class: "IX", dueDate: new Date("2025-06-15") },
    { title: "Essay: My Role Model", subject: "English", class: "IX", dueDate: new Date("2025-06-10") },
    { title: "Grammar Exercise Ch. 8", subject: "Hindi", class: "IX", dueDate: new Date("2025-06-08") },
  ];

  for (const a of assignmentData) {
    const assignment = await prisma.assignment.create({ data: a });

    // Create submissions for student1
    const statusMap: Record<string, "PENDING" | "SUBMITTED" | "GRADED"> = {
      "Quadratic Equations Practice Set": "PENDING",
      "Lab Report: Acid-Base Titration": "PENDING",
      "Essay: My Role Model": "SUBMITTED",
      "Grammar Exercise Ch. 8": "GRADED",
    };

    await prisma.assignmentSubmission.create({
      data: {
        assignmentId: assignment.id,
        studentId: student1.student!.id,
        status: statusMap[a.title] || "PENDING",
        submittedAt: statusMap[a.title] !== "PENDING" ? new Date() : null,
        grade: statusMap[a.title] === "GRADED" ? "A" : null,
      },
    });
  }
  console.log("✅ Assignments seeded");

  // ─── MESSAGES ───
  await prisma.message.createMany({
    data: [
      { senderId: admin.id, receiverId: parentUser.id, subject: "PTM scheduled for 05 Jul", content: "Dear Parent, please attend the upcoming PTM on 5th July." },
      { senderId: admin.id, receiverId: student1.student ? student1.id : admin.id, subject: "Board exam preparation tips", content: "All students preparing for board exams should follow the attached schedule." },
    ],
  });
  console.log("✅ Messages seeded");

  // ─── ALUMNI CONTRIBUTIONS ───
  const alumni1 = await prisma.alumni.findFirst({ where: { batch: "1995" } });
  const alumni2 = await prisma.alumni.findFirst({ where: { batch: "2005" } });

  if (alumni1 && alumni2 && alumniUser.alumni) {
    await prisma.contribution.createMany({
      data: [
        { alumniId: alumni1.id, amount: 500000, purpose: "New Computer Lab", date: new Date("2025-05-01") },
        { alumniId: alumni1.id, amount: 250000, purpose: "Scholarship Fund", date: new Date("2025-04-15") },
        { alumniId: alumni2.id, amount: 75000, purpose: "Library Books", date: new Date("2025-02-20") },
        { alumniId: alumniUser.alumni.id, amount: 120000, purpose: "Sports Equipment", date: new Date("2025-03-10") },
      ],
    });
  }
  console.log("✅ Contributions seeded");

  // ─── TESTIMONIALS ───
  await prisma.testimonial.createMany({
    data: [
      { name: "Dr. Sanjay Panda", role: "Alumnus, Batch 1995 — Cardiologist, AIIMS", content: "SSVM instilled in me the discipline and curiosity that shaped my entire medical career. The teachers here go far beyond textbooks.", rating: 5, sortOrder: 1 },
      { name: "Sujata Kumar", role: "Parent of Arjun (Class VII) & Sneha (Class IX)", content: "Both my children have blossomed here. The perfect balance of academic excellence and cultural grounding makes SSVM truly special.", rating: 5, sortOrder: 2 },
      { name: "Priya Mohanty", role: "Student, Class IX-B", content: "I love the morning prayers, the science lab experiments, and especially our computer classes. SSVM feels like a second home!", rating: 5, sortOrder: 3 },
    ],
  });
  console.log("✅ Testimonials seeded");

  // ─── SITE CONTENT (CMS) ───
  const siteContentData = [
    { section: "hero", key: "title", value: "Shaping Young Minds for a Brighter Tomorrow" },
    { section: "hero", key: "subtitle", value: "Saraswati Shishu Vidya Mandir, College Square, Cuttack — rooted in Indian values, driven by excellence since 1952." },
    { section: "stats", key: "students", value: "3200+" },
    { section: "stats", key: "faculty", value: "120+" },
    { section: "stats", key: "passRate", value: "98%" },
    { section: "stats", key: "yearsLegacy", value: "70+" },
    { section: "about", key: "title", value: "About Our Institution" },
    { section: "about", key: "description", value: "Saraswati Shishu Vidya Mandir, College Square, Cuttack, is a premier educational institution under Vidya Bharati — India's largest network of private schools. Since 1952, we have nurtured generations of students with a blend of modern education and Indian cultural values." },
    { section: "admission", key: "ctaTitle", value: "Begin Your Child's Journey With SSVM" },
    { section: "admission", key: "ctaDescription", value: "Admissions are now open for the 2025–26 academic session. Give your child the gift of value-based education rooted in Indian culture." },
  ];

  for (const sc of siteContentData) {
    await prisma.siteContent.create({ data: sc });
  }
  console.log("✅ Site content seeded");

  // ─── GALLERY ───
  // Using Unsplash demo images for professional school gallery
  await prisma.galleryImage.createMany({
    data: [
      { title: "Main School Building", category: "Campus", imageUrl: "https://images.unsplash.com/photo-1562774053-701939374585?w=800&h=600&fit=crop", description: "Our modern campus with state-of-the-art facilities", sortOrder: 1 },
      { title: "Computer Laboratory", category: "Facilities", imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop", description: "Fully equipped computer lab with latest technology", sortOrder: 2 },
      { title: "Science Laboratory", category: "Facilities", imageUrl: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&h=600&fit=crop", description: "Advanced science lab for practical learning", sortOrder: 3 },
      { title: "School Library", category: "Facilities", imageUrl: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&h=600&fit=crop", description: "Extensive collection of books and digital resources", sortOrder: 4 },
      { title: "Annual Sports Day 2024", category: "Events", imageUrl: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=600&fit=crop", description: "Students participating in athletic events", sortOrder: 5 },
      { title: "Cultural Festival", category: "Events", imageUrl: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=600&fit=crop", description: "Annual cultural program showcasing student talents", sortOrder: 6 },
      { title: "Science Exhibition 2024", category: "Academic", imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop", description: "Students presenting innovative science projects", sortOrder: 7 },
      { title: "Mathematics Workshop", category: "Academic", imageUrl: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&h=600&fit=crop", description: "Interactive learning session in mathematics", sortOrder: 8 },
      { title: "Basketball Court", category: "Sports", imageUrl: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&h=600&fit=crop", description: "Modern sports facilities for physical education", sortOrder: 9 },
      { title: "Football Ground", category: "Sports", imageUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=600&fit=crop", description: "Spacious playground for outdoor sports", sortOrder: 10 },
      { title: "Classroom Learning", category: "Campus", imageUrl: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800&h=600&fit=crop", description: "Modern classrooms with smart boards", sortOrder: 11 },
      { title: "Art & Craft Room", category: "Facilities", imageUrl: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&h=600&fit=crop", description: "Creative space for artistic expression", sortOrder: 12 },
      { title: "Independence Day Celebration", category: "Events", imageUrl: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&h=600&fit=crop", description: "Patriotic celebration with flag hoisting ceremony", sortOrder: 13 },
      { title: "Music Room", category: "Facilities", imageUrl: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=800&h=600&fit=crop", description: "Dedicated space for music and performing arts", sortOrder: 14 },
      { title: "Chemistry Lab Experiment", category: "Academic", imageUrl: "https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=800&h=600&fit=crop", description: "Hands-on chemistry experiments", sortOrder: 15 },
      { title: "School Garden", category: "Campus", imageUrl: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&h=600&fit=crop", description: "Green campus with botanical garden", sortOrder: 16 },
    ],
  });
  console.log("✅ Gallery seeded with 16 demo images");

  console.log("\n🎉 Database seeded successfully!");
  console.log("\n📋 Login Credentials:");
  console.log("─────────────────────────────────────");
  console.log("Admin:   admin@ssvm-cuttack.org   / admin123");
  console.log("Student: student@ssvm-cuttack.org / student123");
  console.log("Parent:  parent@ssvm-cuttack.org  / parent123");
  console.log("Alumni:  alumni@ssvm-cuttack.org  / alumni123");
  console.log("─────────────────────────────────────\n");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
