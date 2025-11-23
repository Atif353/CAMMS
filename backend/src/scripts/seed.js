import prisma from '../config/prisma.js';
import bcrypt from 'bcryptjs';

// Pakistani names for instructors
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

// Pakistani admin name
const pakistaniAdmin = {
  firstName: 'Atif',
  lastName: 'Mubashar',
  email: 'atif.mubashar@vu.edu.pk',
};

// Course codes from the study scheme
const courseCodes = [
  // Semester 1
  'CS101', 'ENG101', 'MTH101', 'MTH202', 'BIO101', 'PHY101', 'PHY301', 'MTH100', 'PAK301', 'VU001',
  // Semester 2
  'CS201', 'CS302', 'ENG201', 'STA301', 'MTH104', 'PAK302', 'ETH202', 'ISL202', 'CS201P',
  // Semester 3
  'CS301', 'CS304', 'CS601', 'MCM301', 'MTH401', 'CS301P', 'CS304P',
  // Semester 4
  'CS401', 'CS403', 'CS504', 'MGT602', 'MTH501', 'CS525', 'CS403P',
  // Semester 5
  'CS306', 'CS402', 'CS502', 'CS604', 'CSI619', 'MTH603', 'CS202', 'CS605', 'CS610',
  // Semester 6
  'CS411', 'CS501', 'CS602', 'CS607', 'CS314', 'CS405', 'CS603',
  // Semester 7
  'CS619', 'CS515', 'CS609', 'CS621', 'ECO401', 'MGT502', 'MGT610',
  // Semester 8
  'CS205', 'CS606', 'CS311', 'CS407', 'CS408', 'CS435', 'CS506', 'CS611', 'CS614',
];

// Activity type descriptions for realistic data
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

    // Delete all data in reverse order of dependencies
    await prisma.activity.deleteMany({});
    await prisma.notification.deleteMany({});
    await prisma.report.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.activityType.deleteMany({});
    await prisma.setting.deleteMany({});
    // Note: Roles are kept as they are required for the system

    console.log('✅ All existing data cleared');

    // Create roles if they don't exist
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

    // Create activity types
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

    // Get roles
    const adminRole = await prisma.role.findUnique({ where: { name: 'ADMIN' } });
    const instructorRole = await prisma.role.findUnique({ where: { name: 'INSTRUCTOR' } });

    // Plain text passwords (for export reference - passwords are hashed in database)
    const adminPlainPassword = 'Admin@2024#Secure';
    const instructorPlainPassword = 'Instructor@2024#Secure';
    
    // Hash strong passwords (best practices: min 12 chars, mixed case, numbers, special chars)
    const adminPassword = await bcrypt.hash(adminPlainPassword, 10);
    const instructorPassword = await bcrypt.hash(instructorPlainPassword, 10);

    // Create admin user (let Prisma generate UUID automatically)
    const admin = await prisma.user.create({
      data: {
        name: `${pakistaniAdmin.firstName} ${pakistaniAdmin.lastName}`,
        email: pakistaniAdmin.email,
        passwordHash: adminPassword,
        roleId: adminRole.id,
        phone: '+92-300-1234567',
      },
    });
    // Store plain password for export reference
    admin.plainPassword = adminPlainPassword;
    console.log(`✅ Admin user created: ${admin.email} / ${adminPlainPassword} (ID: ${admin.id})`);

    // Create 15 instructor users
    const instructorIds = [];
    const instructorsWithPasswords = [];
    for (const instructor of pakistaniInstructors) {
      // Generate realistic Pakistani phone number
      const phonePrefix = 300 + Math.floor(Math.random() * 700); // 300-999
      const phoneSuffix = Math.floor(1000000 + Math.random() * 9000000); // 7 digits
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
      // Store plain password for export reference
      user.plainPassword = instructorPlainPassword;
      instructorIds.push(user.id);
      instructorsWithPasswords.push(user);
      console.log(`✅ Instructor created: ${user.email} / ${instructorPlainPassword} (ID: ${user.id})`);
    }
    console.log(`✅ All ${instructorIds.length} instructors created`);

    // Get activity type mappings
    const activityTypeMap = {};
    const activityTypesData = await prisma.activityType.findMany();
    activityTypesData.forEach((at) => {
      activityTypeMap[at.code] = at.id;
    });

    // Generate 1000+ activities distributed across all instructors
    const activities = [];
    const today = new Date();
    const targetActivityCount = 1200; // More than 1000 activities
    let activityCount = 0;

    // Generate activities for the past 6 months
    for (let monthOffset = 0; monthOffset < 6; monthOffset++) {
      const monthDate = new Date(today);
      monthDate.setMonth(today.getMonth() - monthOffset);
      
      // Get days in the month
      const daysInMonth = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0).getDate();
      
      for (let day = 1; day <= daysInMonth && activityCount < targetActivityCount; day++) {
        const activityDate = new Date(monthDate.getFullYear(), monthDate.getMonth(), day);
        
        // Skip weekends occasionally (instructors work less on weekends)
        if (activityDate.getDay() === 0 || activityDate.getDay() === 6) {
          if (Math.random() > 0.3) continue; // 70% chance to skip weekends
        }

        // Generate 3-8 activities per day, distributed across instructors
        const numActivities = Math.floor(Math.random() * 6) + 3;
        
        for (let i = 0; i < numActivities && activityCount < targetActivityCount; i++) {
          // Randomly select an instructor
          const instructorId = instructorIds[Math.floor(Math.random() * instructorIds.length)];
          
          // Randomly select an activity type
          const activityTypeCodes = Object.keys(activityTypeMap);
          const randomType = activityTypeCodes[Math.floor(Math.random() * activityTypeCodes.length)];
          
          // Get random course code
          const courseCode = courseCodes[Math.floor(Math.random() * courseCodes.length)];
          
          // Get random description for this activity type
          const descriptions = activityDescriptions[randomType];
          const description = descriptions[Math.floor(Math.random() * descriptions.length)];
          
          // Generate realistic time spent (varies by activity type)
          let timeSpentMinutes;
          switch (randomType) {
            case 'MDB_REPLY':
              timeSpentMinutes = Math.floor(Math.random() * 60) + 20; // 20-80 minutes
              break;
            case 'TICKET_RESPONSE':
              timeSpentMinutes = Math.floor(Math.random() * 45) + 15; // 15-60 minutes
              break;
            case 'ASSIGNMENT_UPLOAD':
              timeSpentMinutes = Math.floor(Math.random() * 30) + 10; // 10-40 minutes
              break;
            case 'ASSIGNMENT_MARKING':
              timeSpentMinutes = Math.floor(Math.random() * 180) + 60; // 60-240 minutes
              break;
            case 'GDB_MARKING':
              timeSpentMinutes = Math.floor(Math.random() * 120) + 45; // 45-165 minutes
              break;
            case 'WEEKLY_SESSION':
              timeSpentMinutes = Math.floor(Math.random() * 60) + 90; // 90-150 minutes
              break;
            case 'EMAIL_RESPONSE':
              timeSpentMinutes = Math.floor(Math.random() * 20) + 5; // 5-25 minutes
              break;
            default:
              timeSpentMinutes = Math.floor(Math.random() * 60) + 15;
          }

          // Generate random time within the day
          const hour = Math.floor(Math.random() * 12) + 8; // 8 AM to 8 PM
          const minute = Math.floor(Math.random() * 60);
          const activityDateTime = new Date(activityDate);
          activityDateTime.setHours(hour, minute, 0, 0);

          // Create a Date object at midnight UTC for the activity date
          // Prisma will convert this to the database Date type
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
            status: Math.random() > 0.4 ? 'COMPLETED' : 'PENDING', // 60% completed, 40% pending
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

    // Create sample notifications for pending activities within reminder window
    // Get the reminder days setting (default 2)
    const reminderDays = 2;
    // Reuse the 'today' variable from above, but reset it to midnight UTC for notification calculations
    const todayForNotifications = new Date();
    todayForNotifications.setUTCHours(0, 0, 0, 0);
    
    // Get all pending activities that are within the reminder window
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
      
      // Create notification if activity is within reminder window (0 to reminderDays days)
      if (daysDiff >= 0 && daysDiff <= reminderDays) {
        // Randomly create notifications for some pending activities (not all, to make it realistic)
        if (Math.random() > 0.3) { // 70% chance to create notification
          const priority = daysDiff <= 1 ? 'HIGH' : 'MEDIUM';
          const notificationDate = new Date(activity.activityDate);
          notificationDate.setDate(notificationDate.getDate() - daysDiff); // Notification created daysDiff days before deadline
          
          const isRead = Math.random() > 0.6; // 40% are read, 60% unread
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

    // Insert notifications
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

    // Create system settings (only the two settings actually used in the system)
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
