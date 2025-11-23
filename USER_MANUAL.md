# CAMMS - User Manual

**Course Activity Management and Monitoring System**

Version 1.0 | Last Updated: 2024

---

## Table of Contents

1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [Admin Guide](#admin-guide)
4. [Instructor Guide](#instructor-guide)
5. [System Features](#system-features)
6. [Troubleshooting](#troubleshooting)
7. [FAQs](#faqs)

---

## 1. Introduction

### What is CAMMS?

CAMMS (Course Activity Management and Monitoring System) is a comprehensive web-based application designed to streamline and automate daily tasks performed by instructors in an LMS-based environment. The system tracks activities such as:

- MDB (Moderated Discussion Board) replies
- Ticket responses
- Assignment uploads and marking
- GDB (Graded Discussion Board) marking
- Weekly sessions
- Email responses

### Key Benefits

- **Automated Tracking**: Automatically track and log all instructor activities
- **Performance Analytics**: View detailed dashboards with charts and statistics
- **Report Generation**: Generate comprehensive reports in PDF and Excel formats
- **Deadline Alerts**: Receive notifications for pending activities
- **User Management**: Admins can manage users and system settings
- **Dark Mode**: Comfortable viewing in both light and dark themes

---

## 2. Getting Started

### System Requirements

- Modern web browser (Chrome, Firefox, Edge, Safari)
- Internet connection
- Valid user account (provided by administrator)

### Accessing the System

1. Open your web browser
2. Navigate to: `http://localhost:3000` (or your server URL)
3. You will see the login page

### Login

1. Enter your email address
2. Enter your password
3. Click "Sign In"

**Default Credentials:**

- **Admin:**
  - Email: `atif.mubashar@vu.edu.pk`
  - Password: `Admin@2024#Secure`

- **Instructor:**
  - Email: Any instructor email (e.g., `ahmed.khan@vu.edu.pk`)
  - Password: `Instructor@2024#Secure`

> **Note**: Change your password after first login for security.

### First Time Setup

1. After logging in, you'll be redirected to your dashboard
2. Click on your profile icon (top-right)
3. Update your profile information
4. Upload a profile picture (optional)
5. Save changes

---

## 3. Admin Guide

### Dashboard Overview

The admin dashboard provides a comprehensive view of system-wide statistics:

- **Total Users**: Number of active users in the system
- **Total Activities**: All activities logged by instructors
- **Pending Activities**: Activities that need attention
- **System Health**: Overall system status

### User Management

#### Viewing All Users

1. Navigate to **"Manage Users"** from the sidebar
2. View the list of all users (admins and instructors)
3. Use search to find specific users
4. Filter by role (Admin/Instructor)

#### Creating a New User

1. Click **"Add New User"** button
2. Fill in the form:
   - Name
   - Email (must be unique)
   - Password (strong password recommended)
   - Role (Admin or Instructor)
   - Phone number (optional)
3. Click **"Create User"**

#### Editing a User

1. Find the user in the list
2. Click the **"Edit"** button (pencil icon)
3. Update the information
4. Click **"Save Changes"**

#### Deleting a User

1. Find the user in the list
2. Click the **"Delete"** button (trash icon)
3. Confirm deletion

> **Warning**: Deleting a user will also delete all their activities and reports.

### Activity Monitoring

1. Navigate to **"All Activities"** from the sidebar
2. View all activities logged by all instructors
3. Filter by:
   - Date range
   - Activity type
   - Instructor
   - Status (Completed/Pending)
4. Click on any activity to view details

### Report Generation

#### Generating Reports

1. Navigate to **"Reports"** from the sidebar
2. Select report type:
   - **Weekly Report**: Activities for the past week
   - **Monthly Report**: Activities for the past month
   - **Five-Month Report**: Activities for the past 5 months
3. Select instructor (or "All Instructors")
4. Click **"Generate Report"**
5. Wait for report generation
6. Download as PDF or Excel

#### Viewing Generated Reports

1. All generated reports are listed in the Reports page
2. Click **"Download"** to get the report file
3. Reports include:
   - Activity summary
   - Time spent analysis
   - Activity type distribution
   - Completion rates

### System Settings

#### Accessing Settings

1. Navigate to **"Settings"** from the sidebar
2. View and modify system configurations

#### Maintenance Mode

- **Purpose**: Temporarily disable system access for maintenance
- **How to Enable**:
  1. Go to Settings
  2. Toggle "Maintenance Mode" to ON
  3. Save changes
- **Effect**: Only admins can login during maintenance mode
- **How to Disable**: Toggle back to OFF

#### Notification Alert Days

- **Purpose**: Configure when instructors receive deadline alerts
- **Range**: 1-30 days before activity deadline
- **Default**: 2 days
- **How to Change**:
  1. Go to Settings
  2. Find "Notification Alert Days"
  3. Enter number of days (1-30)
  4. Click "Save"

#### Email Notifications

- Toggle email notifications ON/OFF
- When enabled, instructors receive email alerts for pending activities

#### In-System Alerts

- Toggle in-system notification alerts ON/OFF
- When enabled, instructors see alerts in the notifications page

---

## 4. Instructor Guide

### Dashboard Overview

Your personal dashboard shows:

- **This Week Stats**: Total activities and time spent this week
- **Time Spent**: Total minutes logged
- **Pending Tasks**: Activities that need completion
- **Alerts**: Unread notifications count

### Activity Logging

#### Logging a New Activity

1. Navigate to **"Log Activity"** from the sidebar
2. Fill in the activity form:
   - **Activity Type**: Select from dropdown
     - MDB Reply
     - Ticket Response
     - Assignment Upload
     - Assignment Marking
     - GDB Marking
     - Weekly Session
     - Email Response
   - **Title**: Brief title for the activity
   - **Description**: Detailed description (optional)
   - **Course Code**: Enter course code (e.g., CS101, ENG101)
   - **Date**: Select the date (defaults to today)
   - **Time Spent**: Enter minutes spent on this activity
3. Click **"Log Activity"**

#### Activity Types Explained

- **MDB Reply**: Responding to student posts on Moderated Discussion Board
- **Ticket Response**: Resolving student support tickets
- **Assignment Upload**: Uploading assignment materials and instructions
- **Assignment Marking**: Grading and marking student assignments
- **GDB Marking**: Marking Graded Discussion Board posts
- **Weekly Session**: Conducting weekly online/offline sessions
- **Email Response**: Responding to student emails

### Viewing Activities

1. Navigate to **"My Activities"** from the sidebar
2. View all your logged activities
3. Filter by:
   - Date range
   - Activity type
   - Status (Completed/Pending)
4. Click on any activity to view/edit details

### Editing Activities

1. Go to **"My Activities"**
2. Find the activity you want to edit
3. Click the **"Edit"** button
4. Update the information
5. Click **"Save Changes"**

### Deleting Activities

1. Go to **"My Activities"**
2. Find the activity you want to delete
3. Click the **"Delete"** button
4. Confirm deletion

> **Note**: Deleted activities cannot be recovered.

### Reports

#### Generating Personal Reports

1. Navigate to **"My Reports"** from the sidebar
2. Select report type:
   - Weekly
   - Monthly
   - Five-Month
3. Click **"Generate Report"**
4. Download as PDF or Excel

#### Viewing Report History

- All your generated reports are listed
- Click **"Download"** to retrieve any report
- Reports are useful for:
  - Performance reviews
  - Time tracking
  - Activity documentation

### Notifications

#### Viewing Notifications

1. Navigate to **"Notifications"** from the sidebar
2. View all your notifications
3. Unread notifications are highlighted
4. Click on a notification to mark as read

#### Notification Types

- **Deadline Alerts**: Reminders for pending activities
- **System Updates**: Important system announcements
- **Activity Reminders**: Notifications about incomplete activities

#### Marking as Read

- Click on a notification to mark it as read
- Or click **"Mark All as Read"** to clear all notifications

### Profile Management

#### Updating Profile

1. Click on your profile icon (top-right)
2. Click **"Profile"**
3. Edit your information:
   - Name
   - Email
   - Phone number
4. Click **"Save Changes"**

#### Uploading Profile Picture

1. Go to Profile page
2. Click **"Upload Image"** or click on the profile picture
3. Select an image file
4. Click **"Save"**

> **Supported formats**: JPG, PNG, WebP
> **Max size**: 5MB

---

## 5. System Features

### Dark Mode

#### Enabling Dark Mode

1. Click the dark mode toggle button (moon/sun icon) in the top-right navbar
2. The theme switches immediately
3. Your preference is saved automatically

#### Benefits

- Reduced eye strain in low-light conditions
- Better battery life on OLED screens
- Personal preference support

### Responsive Design

The system works on:
- **Desktop**: Full-featured experience
- **Tablet**: Optimized layout
- **Mobile**: Touch-friendly interface

### Search and Filters

Most pages include:
- **Search**: Find specific items quickly
- **Filters**: Narrow down results by various criteria
- **Sorting**: Organize data by different columns

### Data Visualization

Dashboards include:
- **Line Charts**: Activity trends over time
- **Pie Charts**: Activity type distribution
- **Bar Charts**: Comparison statistics
- **Progress Bars**: Completion rates

### Export Options

Reports can be exported as:
- **PDF**: For printing and sharing
- **Excel**: For data analysis

---

## 6. Troubleshooting

### Login Issues

**Problem**: Cannot login
- **Solution**: 
  - Verify email and password are correct
  - Check if account is active
  - Contact administrator if locked out

**Problem**: "System under maintenance" message
- **Solution**: 
  - Only admins can login during maintenance
  - Wait for maintenance to complete
  - Contact administrator for more information

### Activity Logging Issues

**Problem**: Cannot log activity
- **Solution**:
  - Check all required fields are filled
  - Verify date is not in the future
  - Ensure time spent is a positive number

**Problem**: Activity not appearing in list
- **Solution**:
  - Refresh the page
  - Check date filters
  - Verify you're viewing the correct page

### Report Generation Issues

**Problem**: Report generation fails
- **Solution**:
  - Wait a few moments and try again
  - Check if you have activities in the selected date range
  - Contact administrator if problem persists

### Dashboard Not Loading

**Problem**: Dashboard shows no data
- **Solution**:
  - Refresh the page
  - Check your internet connection
  - Clear browser cache
  - Try a different browser

### Profile Picture Not Uploading

**Problem**: Image upload fails
- **Solution**:
  - Check file size (max 5MB)
  - Verify file format (JPG, PNG, WebP)
  - Try a different image
  - Check internet connection

---

## 7. FAQs

### General Questions

**Q: Can I use the system on mobile?**
A: Yes, the system is fully responsive and works on mobile devices.

**Q: How do I change my password?**
A: Currently, password changes require administrator assistance. Contact your admin.

**Q: Can I delete my account?**
A: Only administrators can delete accounts. Contact your admin.

**Q: Is my data secure?**
A: Yes, the system uses secure authentication and encrypted data storage.

### Activity Questions

**Q: Can I log activities for past dates?**
A: Yes, you can select any past date when logging activities.

**Q: What if I make a mistake in an activity?**
A: You can edit or delete activities from the "My Activities" page.

**Q: How far back can I generate reports?**
A: Reports can be generated for any date range where you have logged activities.

**Q: Can I export my activities?**
A: Yes, use the report generation feature to export activities as PDF or Excel.

### Notification Questions

**Q: How often do I receive notifications?**
A: Notifications are sent based on the "Notification Alert Days" setting configured by admin.

**Q: Can I disable notifications?**
A: Notification settings are controlled by the administrator. Contact your admin.

**Q: Where do I see notifications?**
A: Click on the "Notifications" menu item or the bell icon in the navbar.

### Report Questions

**Q: What formats are available for reports?**
A: PDF and Excel (XLSX) formats are available.

**Q: How long does report generation take?**
A: Usually a few seconds, but may take longer for large date ranges.

**Q: Can I generate reports for specific courses?**
A: Reports include all activities, but you can filter by course code in the activities list.

### Technical Questions

**Q: Which browsers are supported?**
A: Modern browsers including Chrome, Firefox, Edge, and Safari.

**Q: Do I need to install any software?**
A: No, CAMMS is a web-based application. You only need a web browser.

**Q: Is there an offline mode?**
A: No, CAMMS requires an active internet connection.

---

## Support and Contact

### Getting Help

If you encounter any issues or have questions:

1. **Check this manual** for common solutions
2. **Contact your administrator** for account-related issues
3. **Check system notifications** for important announcements

### System Information

- **System Name**: CAMMS (Course Activity Management and Monitoring System)
- **Version**: 1.0
- **Developer**: BC220202537
- **Supervisor**: Saima Jamil

---

## Appendix

### Keyboard Shortcuts

- **Ctrl/Cmd + K**: Focus search (where available)
- **Esc**: Close modals/dialogs
- **Tab**: Navigate between form fields

### Best Practices

1. **Log activities regularly**: Don't wait until the end of the week
2. **Use descriptive titles**: Make activities easy to identify
3. **Keep descriptions detailed**: Helpful for reports and reviews
4. **Check notifications regularly**: Stay updated on pending tasks
5. **Generate reports periodically**: Track your progress over time

### Security Tips

1. **Never share your password** with anyone
2. **Log out** when using shared computers
3. **Use strong passwords** (if allowed to change)
4. **Report suspicious activity** to administrator immediately

---

**End of User Manual**

For the latest updates and additional resources, please contact your system administrator.

