import prisma from '../config/prisma.js';
import bcrypt from 'bcryptjs';

const pakistaniInstructors = [
  { firstName: 'Ahmed', lastName: 'Khan', email: 'ahmed.khan@vu.edu.pk' },
  { firstName: 'Fatima', lastName: 'Ali', email: 'fatima.ali@vu.edu.pk' },
  { firstName: 'Muhammad', lastName: 'Hassan', email: 'muhammad.hassan@vu.edu.pk' },
  { firstName: 'Ayesha', lastName: 'Malik', email: 'ayesha.malik@vu.edu.pk' },
  { firstName: 'Usman', lastName: 'Raza', email: 'usman.raza@vu.edu.pk' },
  { firstName: 'Sana', lastName: 'Iqbal', email: 'sana.iqbal@vu.edu.pk' },
  { firstName: 'Bilal', lastName: 'Ahmed', email: 'bilal.ahmed@vu.edu.pk' },
  { firstName: 'Zainab', lastName: 'Shah', email: 'zainab.shah@vu.edu.pk' },
  { firstName: 'Hassan', lastName: 'Butt', email: 'hassan.butt@vu.edu.pk' },
  { firstName: 'Amina', lastName: 'Khan', email: 'amina.khan@vu.edu.pk' },
  { firstName: 'Tariq', lastName: 'Mehmood', email: 'tariq.mehmood@vu.edu.pk' },
  { firstName: 'Rabia', lastName: 'Nawaz', email: 'rabia.nawaz@vu.edu.pk' },
  { firstName: 'Imran', lastName: 'Sheikh', email: 'imran.sheikh@vu.edu.pk' },
  { firstName: 'Hina', lastName: 'Rashid', email: 'hina.rashid@vu.edu.pk' },
  { firstName: 'Kamran', lastName: 'Yousuf', email: 'kamran.yousuf@vu.edu.pk' },
];

const pakistaniAdmin = {
  firstName: 'Atif',
  lastName: 'Mubashar',
  email: 'atif.mubashar@vu.edu.pk',
};

const courseCodes = [
  'CS101', 'ENG101', 'MTH101', 'MTH202', 'BIO101', 'PHY101', 'PHY301', 'MTH100', 'PAK301', 'VU001',
  'CS201', 'CS302', 'ENG201', 'STA301', 'MTH104', 'PAK302', 'ETH202', 'ISL202', 'CS201P',
  'CS301', 'CS304', 'CS601', 'MCM301', 'MTH401', 'CS301P', 'CS304P',
  'CS401', 'CS403', 'CS504', 'MGT602', 'MTH501', 'CS525', 'CS403P',
  'CS306', 'CS402', 'CS502', 'CS604', 'CSI619', 'MTH603', 'CS202', 'CS605', 'CS610',
  'CS411', 'CS501', 'CS602', 'CS607', 'CS314', 'CS405', 'CS603',
  'CS619', 'CS515', 'CS609', 'CS621', 'ECO401', 'MGT502', 'MGT610',
  'CS205', 'CS606', 'CS311', 'CS407', 'CS408', 'CS435', 'CS506', 'CS611', 'CS614',
];

const activityDescriptions = {
  MDB_REPLY: [
    'Replied to student queries on MDB regarding course concepts',
    'Moderated discussion board responses for weekly topics',
    'Answered MDB questions about assignment guidelines',
    'Clarified course material through MDB interactions',
    'Provided feedback on student MDB posts',
  ],
  TICKET_RESPONSE: [
    'Resolved student ticket regarding login issues',
    'Addressed technical support ticket for course access',
    'Responded to ticket about assignment submission problems',
    'Handled ticket related to grade inquiries',
    'Solved ticket for LMS navigation assistance',
  ],
  ASSIGNMENT_UPLOAD: [
    'Uploaded assignment instructions and rubric',
    'Posted assignment materials and resources',
    'Updated assignment guidelines and deadlines',
    'Uploaded sample solutions and examples',
    'Added assignment-related course materials',
  ],
  ASSIGNMENT_MARKING: [
    'Graded student assignments with detailed feedback',
    'Marked assignments and provided constructive comments',
    'Evaluated assignment submissions and calculated grades',
    'Reviewed and marked assignment files',
    'Completed assignment marking with rubrics',
  ],
  GDB_MARKING: [
    'Marked GDB submissions and provided grades',
    'Evaluated GDB responses and feedback',
    'Graded GDB assignments with detailed comments',
    'Completed GDB marking for current week',
    'Reviewed and marked GDB posts',
  ],
  WEEKLY_SESSION: [
    'Conducted weekly online session with students',
    'Held live session covering course topics',
    'Delivered weekly lecture and Q&A session',
    'Completed weekly session with attendance',
    'Conducted interactive weekly class session',
  ],
  EMAIL_RESPONSE: [
    'Responded to student email inquiries',
    'Replied to course-related email questions',
    'Addressed student concerns via email',
    'Provided email support for course matters',
    'Answered student queries through email',
  ],
};

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');
    console.log('🗑️  Clearing existing data...');

    await prisma.activity.deleteMany({});
    await prisma.notification.deleteMany({});
    await prisma.report.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.activityType.deleteMany({});
    await prisma.setting.deleteMany({});

    console.log('✅ All existing data cleared');

    await prisma.role.upsert({
      where: { name: 'ADMIN' },
      update: {},
      create: {
        name: 'ADMIN',
        description: 'System Administrator with full access',
      },
    });

    await prisma.role.upsert({
      where: { name: 'INSTRUCTOR' },
      update: {},
      create: {
        name: 'INSTRUCTOR',
        description: 'Instructor who logs activities',
      },
    });
    console.log('✅ Roles inserted');

    const activityTypes = [
      { code: 'MDB_REPLY', label: 'MDB Reply', description: 'Moderated Discussion Board replies' },
      { code: 'TICKET_RESPONSE', label: 'Ticket Response', description: 'Support ticket responses' },
      { code: 'ASSIGNMENT_UPLOAD', label: 'Assignment Upload', description: 'Uploading assignment materials' },
      { code: 'ASSIGNMENT_MARKING', label: 'Assignment Marking', description: 'Marking student assignments' },
      { code: 'GDB_MARKING', label: 'GDB Marking', description: 'Graded Discussion Board marking' },
      { code: 'WEEKLY_SESSION', label: 'Weekly Session', description: 'Weekly class sessions with attendance' },
      { code: 'EMAIL_RESPONSE', label: 'Email Response', description: 'Responding to student emails' },
    ];

    for (const at of activityTypes) {
      await prisma.activityType.upsert({
        where: { code: at.code },
        update: {},
        create: at,
      });
    }
    console.log('✅ Activity types inserted');

    const adminRole = await prisma.role.findUnique({ where: { name: 'ADMIN' } });
    const instructorRole = await prisma.role.findUnique({ where: { name: 'INSTRUCTOR' } });

    const adminPlainPassword = 'Admin@2024#Secure';
    const instructorPlainPassword = 'Instructor@2024#Secure';
    
    const adminPassword = await bcrypt.hash(adminPlainPassword, 10);
    const instructorPassword = await bcrypt.hash(instructorPlainPassword, 10);

    const admin = await prisma.user.create({
      data: {
        name: `${pakistaniAdmin.firstName} ${pakistaniAdmin.lastName}`,
        email: pakistaniAdmin.email,
        passwordHash: adminPassword,
        roleId: adminRole.id,
        phone: '+92-300-1234567',
      },
    });
    admin.plainPassword = adminPlainPassword;
    console.log(`✅ Admin user created: ${admin.email} / ${adminPlainPassword} (ID: ${admin.id})`);

    const instructorIds = [];
    const instructorsWithPasswords = [];
    for (const instructor of pakistaniInstructors) {
      const phonePrefix = 300 + Math.floor(Math.random() * 700);
      const phoneSuffix = Math.floor(1000000 + Math.random() * 9000000);
      const phoneNumber = `+92-${phonePrefix}-${phoneSuffix}`;
      
      const user = await prisma.user.create({
        data: {
          name: `${instructor.firstName} ${instructor.lastName}`,
          email: instructor.email,
          passwordHash: instructorPassword,
          roleId: instructorRole.id,
          phone: phoneNumber,
        },
      });
      user.plainPassword = instructorPlainPassword;
      instructorIds.push(user.id);
      instructorsWithPasswords.push(user);
      console.log(`✅ Instructor created: ${user.email} / ${instructorPlainPassword} (ID: ${user.id})`);
    }
    console.log(`✅ All ${instructorIds.length} instructors created`);

    const activityTypeMap = {};
    const activityTypesData = await prisma.activityType.findMany();
    activityTypesData.forEach((at) => {
      activityTypeMap[at.code] = at.id;
    });

    const activities = [];
    const today = new Date();
    const targetActivityCount = 1200;
    let activityCount = 0;

    for (let monthOffset = 0; monthOffset < 6; monthOffset++) {
      const monthDate = new Date(today);
      monthDate.setMonth(today.getMonth() - monthOffset);
      
      const daysInMonth = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0).getDate();
      
      for (let day = 1; day <= daysInMonth && activityCount < targetActivityCount; day++) {
        const activityDate = new Date(monthDate.getFullYear(), monthDate.getMonth(), day);
        
        if (activityDate.getDay() === 0 || activityDate.getDay() === 6) {
          if (Math.random() > 0.3) continue;
        }

        const numActivities = Math.floor(Math.random() * 6) + 3;
        
        for (let i = 0; i < numActivities && activityCount < targetActivityCount; i++) {
          const instructorId = instructorIds[Math.floor(Math.random() * instructorIds.length)];
          
          const activityTypeCodes = Object.keys(activityTypeMap);
          const randomType = activityTypeCodes[Math.floor(Math.random() * activityTypeCodes.length)];
          
          const courseCode = courseCodes[Math.floor(Math.random() * courseCodes.length)];
          
          const descriptions = activityDescriptions[randomType];
          const description = descriptions[Math.floor(Math.random() * descriptions.length)];
          
          let timeSpentMinutes;
          switch (randomType) {
            case 'MDB_REPLY':
              timeSpentMinutes = Math.floor(Math.random() * 60) + 20;
              break;
            case 'TICKET_RESPONSE':
              timeSpentMinutes = Math.floor(Math.random() * 45) + 15;
              break;
            case 'ASSIGNMENT_UPLOAD':
              timeSpentMinutes = Math.floor(Math.random() * 30) + 10;
              break;
            case 'ASSIGNMENT_MARKING':
              timeSpentMinutes = Math.floor(Math.random() * 180) + 60;
              break;
            case 'GDB_MARKING':
              timeSpentMinutes = Math.floor(Math.random() * 120) + 45;
              break;
            case 'WEEKLY_SESSION':
              timeSpentMinutes = Math.floor(Math.random() * 60) + 90;
              break;
            case 'EMAIL_RESPONSE':
              timeSpentMinutes = Math.floor(Math.random() * 20) + 5;
              break;
            default:
              timeSpentMinutes = Math.floor(Math.random() * 60) + 15;
          }

          const hour = Math.floor(Math.random() * 12) + 8;
          const minute = Math.floor(Math.random() * 60);
          const activityDateTime = new Date(activityDate);
          activityDateTime.setHours(hour, minute, 0, 0);

          const dateForDb = new Date(activityDate);
          dateForDb.setUTCHours(0, 0, 0, 0);

          activities.push({
            instructorId: instructorId,
            activityTypeId: activityTypeMap[randomType],
            title: `${randomType.replace(/_/g, ' ')} - ${courseCode}`,
            description: description,
            courseCode: courseCode,
            timeSpentMinutes: timeSpentMinutes,
            activityDate: dateForDb,
            meta: {
              topic: `Topic for ${courseCode}`,
              num_posts_replied: randomType === 'MDB_REPLY' ? Math.floor(Math.random() * 50) + 10 : undefined,
              num_assignments_marked: randomType === 'ASSIGNMENT_MARKING' ? Math.floor(Math.random() * 30) + 5 : undefined,
              num_tickets_resolved: randomType === 'TICKET_RESPONSE' ? Math.floor(Math.random() * 10) + 1 : undefined,
              session_duration: randomType === 'WEEKLY_SESSION' ? timeSpentMinutes : undefined,
            },
            status: Math.random() > 0.4 ? 'COMPLETED' : 'PENDING',
          });
          
          activityCount++;
        }
      }
    }

    // Insert activities in batches for better performance
    const batchSize = 100;
    for (let i = 0; i < activities.length; i += batchSize) {
      const batch = activities.slice(i, i + batchSize);
      await prisma.activity.createMany({
        data: batch,
      });
    }
    console.log(`✅ ${activities.length} activities inserted for all instructors`);

    const reminderDays = 2;
    const todayForNotifications = new Date();
    todayForNotifications.setUTCHours(0, 0, 0, 0);
    
    const pendingActivities = await prisma.activity.findMany({
      where: {
        status: 'PENDING',
      },
      include: {
        instructor: true,
      },
    });

    const notifications = [];
    for (const activity of pendingActivities) {
      const activityDate = new Date(activity.activityDate);
      activityDate.setUTCHours(0, 0, 0, 0);
      const daysDiff = Math.ceil((activityDate - todayForNotifications) / (1000 * 60 * 60 * 24));
      
      if (daysDiff >= 0 && daysDiff <= reminderDays) {
        if (Math.random() > 0.3) {
          const priority = daysDiff <= 1 ? 'HIGH' : 'MEDIUM';
          const notificationDate = new Date(activity.activityDate);
          notificationDate.setDate(notificationDate.getDate() - daysDiff);
          
          const isRead = Math.random() > 0.6;
          notifications.push({
            userId: activity.instructorId,
            title: 'Pending Activity Reminder',
            message: `You have a pending activity: ${activity.title}. Deadline: ${activity.activityDate.toISOString().split('T')[0]}`,
            type: 'REMINDER',
            priority: priority,
            isRead: isRead,
            meta: {
              activity_id: activity.id,
            },
            createdAt: notificationDate,
            readAt: isRead ? notificationDate : null,
          });
        }
      }
    }

    if (notifications.length > 0) {
      for (const notification of notifications) {
        await prisma.notification.create({
          data: notification,
        });
      }
      console.log(`✅ ${notifications.length} notifications created for pending activities`);
    } else {
      console.log('ℹ️  No notifications created (no pending activities within reminder window)');
    }

    await prisma.setting.upsert({
      where: { key: 'MAINTENANCE_MODE' },
      update: {},
      create: { key: 'MAINTENANCE_MODE', value: 'false' },
    });

    await prisma.setting.upsert({
      where: { key: 'REMINDER_DAYS_BEFORE_DEADLINE' },
      update: {},
      create: { key: 'REMINDER_DAYS_BEFORE_DEADLINE', value: '2' },
    });
    console.log('✅ System settings inserted (MAINTENANCE_MODE and REMINDER_DAYS_BEFORE_DEADLINE)');

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - 1 Admin user: ${pakistaniAdmin.email}`);
    console.log(`   - ${instructorIds.length} Instructor users`);
    console.log(`   - ${activities.length} Activities distributed across all instructors`);
    console.log(`   - Activity Status: 60% COMPLETED, 40% PENDING`);
    console.log(`   - ${notifications.length} Notifications created for pending activities within reminder window`);
    console.log(`   - All IDs are auto-generated UUIDs`);
    console.log('\n🔑 Login Credentials:');
    console.log(`   Admin: ${pakistaniAdmin.email} / ${adminPlainPassword}`);
    console.log(`   Instructors: [any instructor email] / ${instructorPlainPassword}`);
    console.log('\n⚠️  Security Note: These are strong passwords following best practices.');
    console.log('   Passwords are hashed in the database but exported in plain text for reference.');
    
    await prisma.$disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

seedDatabase();
