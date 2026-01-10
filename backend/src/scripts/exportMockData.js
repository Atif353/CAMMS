import prisma from '../config/prisma.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function exportMockData() {
  try {
    console.log('📊 Starting mock LMS dataset export...');

    const exportsDir = path.join(__dirname, '../../exports');
    if (!fs.existsSync(exportsDir)) {
      fs.mkdirSync(exportsDir, { recursive: true });
    }

    const ADMIN_PASSWORD = 'Admin@2024#Secure';
    const INSTRUCTOR_PASSWORD = 'Instructor@2024#Secure';

    const users = await prisma.user.findMany({
      include: {
        role: true,
      },
    });

    const usersCSV = convertToCSV(users.map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      password: u.role.name === 'ADMIN' ? ADMIN_PASSWORD : INSTRUCTOR_PASSWORD,
      phone: u.phone || '',
      role: u.role.name,
      isActive: u.isActive,
      createdAt: u.createdAt.toISOString(),
    })));

    const usersJSON = JSON.stringify(users.map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      password: u.role.name === 'ADMIN' ? ADMIN_PASSWORD : INSTRUCTOR_PASSWORD,
      phone: u.phone || null,
      role: u.role.name,
      isActive: u.isActive,
      createdAt: u.createdAt.toISOString(),
    })), null, 2);

    fs.writeFileSync(path.join(exportsDir, 'users.csv'), usersCSV);
    fs.writeFileSync(path.join(exportsDir, 'users.json'), usersJSON);
    console.log(`✅ Exported ${users.length} users (with passwords)`);

    const credentials = {
      exportDate: new Date().toISOString(),
      note: 'These are the plain text passwords used during seeding. Passwords in the database are hashed.',
      credentials: users.map(u => ({
        email: u.email,
        password: u.role.name === 'ADMIN' ? ADMIN_PASSWORD : INSTRUCTOR_PASSWORD,
        role: u.role.name,
        name: u.name,
      })),
    };

    fs.writeFileSync(
      path.join(exportsDir, 'credentials.json'),
      JSON.stringify(credentials, null, 2)
    );
    console.log('✅ Created credentials.json with email/password mappings');

    const activities = await prisma.activity.findMany({
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        activityType: {
          select: {
            code: true,
            label: true,
          },
        },
      },
      orderBy: {
        activityDate: 'desc',
      },
    });

    const activitiesCSV = convertToCSV(activities.map(a => ({
      id: a.id,
      instructorId: a.instructorId,
      instructorName: a.instructor.name,
      instructorEmail: a.instructor.email,
      activityType: a.activityType.code,
      activityTypeLabel: a.activityType.label,
      title: a.title,
      description: a.description || '',
      courseCode: a.courseCode || '',
      timeSpentMinutes: a.timeSpentMinutes,
      activityDate: a.activityDate.toISOString().split('T')[0],
      status: a.status,
      meta: JSON.stringify(a.meta),
      createdAt: a.createdAt.toISOString(),
    })));

    const activitiesJSON = JSON.stringify(activities.map(a => ({
      id: a.id,
      instructorId: a.instructorId,
      instructor: {
        id: a.instructor.id,
        name: a.instructor.name,
        email: a.instructor.email,
      },
      activityType: {
        code: a.activityType.code,
        label: a.activityType.label,
      },
      title: a.title,
      description: a.description,
      courseCode: a.courseCode,
      timeSpentMinutes: a.timeSpentMinutes,
      activityDate: a.activityDate.toISOString().split('T')[0],
      status: a.status,
      meta: a.meta,
      createdAt: a.createdAt.toISOString(),
    })), null, 2);

    fs.writeFileSync(path.join(exportsDir, 'activities.csv'), activitiesCSV);
    fs.writeFileSync(path.join(exportsDir, 'activities.json'), activitiesJSON);
    console.log(`✅ Exported ${activities.length} activities`);

    // Export Activity Types
    const activityTypes = await prisma.activityType.findMany();

    const activityTypesCSV = convertToCSV(activityTypes.map(at => ({
      id: at.id,
      code: at.code,
      label: at.label,
      description: at.description || '',
    })));

    const activityTypesJSON = JSON.stringify(activityTypes.map(at => ({
      id: at.id,
      code: at.code,
      label: at.label,
      description: at.description,
    })), null, 2);

    fs.writeFileSync(path.join(exportsDir, 'activity_types.csv'), activityTypesCSV);
    fs.writeFileSync(path.join(exportsDir, 'activity_types.json'), activityTypesJSON);
    console.log(`✅ Exported ${activityTypes.length} activity types`);

    const roles = await prisma.role.findMany();

    const rolesCSV = convertToCSV(roles.map(r => ({
      id: r.id,
      name: r.name,
      description: r.description || '',
      createdAt: r.createdAt.toISOString(),
    })));

    const rolesJSON = JSON.stringify(roles.map(r => ({
      id: r.id,
      name: r.name,
      description: r.description,
      createdAt: r.createdAt.toISOString(),
    })), null, 2);

    fs.writeFileSync(path.join(exportsDir, 'roles.csv'), rolesCSV);
    fs.writeFileSync(path.join(exportsDir, 'roles.json'), rolesJSON);
    console.log(`✅ Exported ${roles.length} roles`);

    // Export System Settings
    const settings = await prisma.setting.findMany();

    const settingsCSV = convertToCSV(settings.map(s => ({
      id: s.id,
      key: s.key,
      value: s.value,
      createdAt: s.createdAt.toISOString(),
      updatedAt: s.updatedAt.toISOString(),
    })));

    const settingsJSON = JSON.stringify(settings.map(s => ({
      id: s.id,
      key: s.key,
      value: s.value,
      createdAt: s.createdAt.toISOString(),
      updatedAt: s.updatedAt.toISOString(),
    })), null, 2);

    fs.writeFileSync(path.join(exportsDir, 'system_settings.csv'), settingsCSV);
    fs.writeFileSync(path.join(exportsDir, 'system_settings.json'), settingsJSON);
    console.log(`✅ Exported ${settings.length} system settings`);

    const notifications = await prisma.notification.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    const notificationsCSV = convertToCSV(notifications.map(n => ({
      id: n.id,
      userId: n.userId,
      userName: n.user.name,
      userEmail: n.user.email,
      title: n.title,
      message: n.message,
      type: n.type,
      priority: n.priority,
      isRead: n.isRead,
      readAt: n.readAt ? n.readAt.toISOString() : '',
      meta: JSON.stringify(n.meta),
      createdAt: n.createdAt.toISOString(),
    })));

    const notificationsJSON = JSON.stringify(notifications.map(n => ({
      id: n.id,
      user: {
        id: n.user.id,
        name: n.user.name,
        email: n.user.email,
      },
      title: n.title,
      message: n.message,
      type: n.type,
      priority: n.priority,
      isRead: n.isRead,
      readAt: n.readAt ? n.readAt.toISOString() : null,
      meta: n.meta,
      createdAt: n.createdAt.toISOString(),
    })), null, 2);

    fs.writeFileSync(path.join(exportsDir, 'notifications.csv'), notificationsCSV);
    fs.writeFileSync(path.join(exportsDir, 'notifications.json'), notificationsJSON);
    console.log(`✅ Exported ${notifications.length} notifications`);

    // Create a combined dataset file
    const combinedDataset = {
      exportDate: new Date().toISOString(),
      summary: {
        totalUsers: users.length,
        totalActivities: activities.length,
        totalActivityTypes: activityTypes.length,
        totalRoles: roles.length,
        totalSettings: settings.length,
        totalNotifications: notifications.length,
      },
      data: {
        users: users.map(u => ({
          id: u.id,
          name: u.name,
          email: u.email,
          password: u.role.name === 'ADMIN' ? ADMIN_PASSWORD : INSTRUCTOR_PASSWORD,
          phone: u.phone,
          role: u.role.name,
          isActive: u.isActive,
          createdAt: u.createdAt.toISOString(),
        })),
        activities: activities.map(a => ({
          id: a.id,
          instructorId: a.instructorId,
          instructorName: a.instructor.name,
          instructorEmail: a.instructor.email,
          activityType: a.activityType.code,
          activityTypeLabel: a.activityType.label,
          title: a.title,
          description: a.description,
          courseCode: a.courseCode,
          timeSpentMinutes: a.timeSpentMinutes,
          activityDate: a.activityDate.toISOString().split('T')[0],
          status: a.status,
          meta: a.meta,
          createdAt: a.createdAt.toISOString(),
        })),
        activityTypes: activityTypes.map(at => ({
          id: at.id,
          code: at.code,
          label: at.label,
          description: at.description,
        })),
        roles: roles.map(r => ({
          id: r.id,
          name: r.name,
          description: r.description,
          createdAt: r.createdAt.toISOString(),
        })),
        settings: settings.map(s => ({
          id: s.id,
          key: s.key,
          value: s.value,
          createdAt: s.createdAt.toISOString(),
          updatedAt: s.updatedAt.toISOString(),
        })),
        notifications: notifications.map(n => ({
          id: n.id,
          userId: n.userId,
          userName: n.user.name,
          userEmail: n.user.email,
          title: n.title,
          message: n.message,
          type: n.type,
          priority: n.priority,
          isRead: n.isRead,
          readAt: n.readAt ? n.readAt.toISOString() : null,
          meta: n.meta,
          createdAt: n.createdAt.toISOString(),
        })),
      },
    };

    fs.writeFileSync(
      path.join(exportsDir, 'mock_lms_dataset.json'),
      JSON.stringify(combinedDataset, null, 2)
    );
    console.log('✅ Created combined mock_lms_dataset.json');

    // Create README for exports
    const readmeContent = `# Mock LMS Dataset Export

This directory contains exported data from the CAMMS database in CSV and JSON formats.

## Files

### Individual Exports
- \`users.csv\` / \`users.json\` - All system users (admin and instructors) **with passwords**
- \`credentials.json\` - Email and password mappings for all users
- \`activities.csv\` / \`activities.json\` - All activity logs
- \`activity_types.csv\` / \`activity_types.json\` - Activity type definitions
- \`roles.csv\` / \`roles.json\` - User roles
- \`system_settings.csv\` / \`system_settings.json\` - System configuration (MAINTENANCE_MODE and REMINDER_DAYS_BEFORE_DEADLINE)
- \`notifications.csv\` / \`notifications.json\` - User notifications

### Combined Export
- \`mock_lms_dataset.json\` - Complete dataset in a single JSON file with summary statistics (includes passwords)

## Export Date
${new Date().toISOString()}

## Summary
- Total Users: ${users.length}
- Total Activities: ${activities.length}
- Total Activity Types: ${activityTypes.length}
- Total Roles: ${roles.length}
- Total Settings: ${settings.length}
- Total Notifications: ${notifications.length}

## Usage

These files can be used to:
1. Import data into other systems
2. Analyze activity patterns
3. Test integrations
4. Create backups
5. Generate reports

## Passwords

**Passwords are included in the export** because the system does not have a forgot password feature.

- **Admin password**: \`Admin@2024#Secure\`
- **Instructor password**: \`Instructor@2024#Secure\`

All passwords are included in:
- \`users.csv\` / \`users.json\` - Password column
- \`credentials.json\` - Email/password mappings
- \`mock_lms_dataset.json\` - In user objects

**Note**: Passwords in the database are hashed using bcrypt. The exported passwords are the plain text versions used during seeding.
`;

    fs.writeFileSync(path.join(exportsDir, 'README.md'), readmeContent);

    console.log('\n🎉 Mock LMS dataset export completed successfully!');
    console.log(`\n📁 Files exported to: ${exportsDir}`);
    console.log('\n📄 Files created:');
    console.log('   - users.csv / users.json (with passwords)');
    console.log('   - credentials.json (email/password mappings)');
    console.log('   - activities.csv / activities.json');
    console.log('   - activity_types.csv / activity_types.json');
    console.log('   - roles.csv / roles.json');
    console.log('   - system_settings.csv / system_settings.json');
    console.log('   - notifications.csv / notifications.json');
    console.log('   - mock_lms_dataset.json (combined, with passwords)');
    console.log('   - README.md');

    await prisma.$disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error exporting mock data:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

function convertToCSV(data) {
  if (data.length === 0) return '';

  const headers = Object.keys(data[0]);
  const csvRows = [];

  csvRows.push(headers.join(','));

  for (const row of data) {
    const values = headers.map(header => {
      const value = row[header];
      if (value === null || value === undefined) return '';
      const stringValue = String(value);
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    });
    csvRows.push(values.join(','));
  }

  return csvRows.join('\n');
}

exportMockData();

