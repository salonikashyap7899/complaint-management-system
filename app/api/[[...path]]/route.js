import { MongoClient, ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

const uri = process.env.MONGO_URL;
let client;
let db;

async function connectDB() {
  if (db) return db;
  try {
    client = new MongoClient(uri);
    await client.connect();
    db = client.db('complaint_management');
    console.log('Connected to MongoDB');
    return db;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

// Helper function to hash password (simple for MVP)
function hashPassword(password) {
  return Buffer.from(password).toString('base64');
}

function verifyPassword(password, hashedPassword) {
  return hashPassword(password) === hashedPassword;
}

// Helper to verify auth token
function verifyAuth(request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.split(' ')[1];
  try {
    const payload = JSON.parse(Buffer.from(token, 'base64').toString());
    return payload;
  } catch {
    return null;
  }
}

// Helper to create auth token
function createAuthToken(user) {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
    departmentId: user.departmentId || null
  };
  return Buffer.from(JSON.stringify(payload)).toString('base64');
}

export async function POST(request) {
  const db = await connectDB();
  const url = new URL(request.url);
  const path = url.pathname.replace('/api/', '');

  try {
    // Auth Routes
    if (path === 'auth/register') {
      const body = await request.json();
      const { name, email, password, role, departmentId } = body;

      // Check if user exists
      const existingUser = await db.collection('users').findOne({ email });
      if (existingUser) {
        return NextResponse.json({ error: 'User already exists' }, { status: 400 });
      }

      const user = {
        id: uuidv4(),
        name,
        email,
        password: hashPassword(password),
        role: role || 'complainant',
        departmentId: departmentId || null,
        createdAt: new Date().toISOString()
      };

      await db.collection('users').insertOne(user);
      const token = createAuthToken(user);

      return NextResponse.json({
        success: true,
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          departmentId: user.departmentId
        }
      });
    }

    if (path === 'auth/login') {
      const body = await request.json();
      const { email, password } = body;

      const user = await db.collection('users').findOne({ email });
      if (!user || !verifyPassword(password, user.password)) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
      }

      const token = createAuthToken(user);

      return NextResponse.json({
        success: true,
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          departmentId: user.departmentId
        }
      });
    }

    // Seed initial data
    if (path === 'seed') {
      // Create default admin - check by email and update role if needed
      const adminUser = await db.collection('users').findOne({ email: 'admin@college.edu' });
      if (!adminUser) {
        await db.collection('users').insertOne({
          id: uuidv4(),
          name: 'Admin User',
          email: 'admin@college.edu',
          password: hashPassword('admin123'),
          role: 'admin',
          departmentId: null,
          createdAt: new Date().toISOString()
        });
      } else if (adminUser.role !== 'admin') {
        // Update existing user to admin role
        await db.collection('users').updateOne(
          { email: 'admin@college.edu' },
          { $set: { role: 'admin', name: 'Admin User' } }
        );
      }

      // Create departments
      const deptCount = await db.collection('departments').countDocuments();
      if (deptCount === 0) {
        const departments = [
          { id: uuidv4(), name: 'Computer Science', description: 'CS Department', createdAt: new Date().toISOString() },
          { id: uuidv4(), name: 'Electronics', description: 'ECE Department', createdAt: new Date().toISOString() },
          { id: uuidv4(), name: 'Administration', description: 'Admin Department', createdAt: new Date().toISOString() },
          { id: uuidv4(), name: 'Infrastructure', description: 'Facilities Management', createdAt: new Date().toISOString() }
        ];
        await db.collection('departments').insertMany(departments);

        // Create categories for each department
        const categories = [];
        departments.forEach(dept => {
          if (dept.name === 'Computer Science' || dept.name === 'Electronics') {
            categories.push(
              { id: uuidv4(), name: 'Faculty Issues', departmentId: dept.id, createdAt: new Date().toISOString() },
              { id: uuidv4(), name: 'Lab Equipment', departmentId: dept.id, createdAt: new Date().toISOString() },
              { id: uuidv4(), name: 'Course Content', departmentId: dept.id, createdAt: new Date().toISOString() }
            );
          } else if (dept.name === 'Administration') {
            categories.push(
              { id: uuidv4(), name: 'Documentation', departmentId: dept.id, createdAt: new Date().toISOString() },
              { id: uuidv4(), name: 'Fee Related', departmentId: dept.id, createdAt: new Date().toISOString() },
              { id: uuidv4(), name: 'Examination', departmentId: dept.id, createdAt: new Date().toISOString() }
            );
          } else {
            categories.push(
              { id: uuidv4(), name: 'Classroom Issues', departmentId: dept.id, createdAt: new Date().toISOString() },
              { id: uuidv4(), name: 'Hostel Facilities', departmentId: dept.id, createdAt: new Date().toISOString() },
              { id: uuidv4(), name: 'Campus Maintenance', departmentId: dept.id, createdAt: new Date().toISOString() }
            );
          }
        });
        await db.collection('categories').insertMany(categories);
      }

      return NextResponse.json({ success: true, message: 'Database seeded' });
    }

    // Protected routes - require auth
    const user = verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // User Routes
    if (path === 'users' && user.role === 'admin') {
      const body = await request.json();
      const { name, email, password, role, departmentId } = body;

      const newUser = {
        id: uuidv4(),
        name,
        email,
        password: hashPassword(password),
        role,
        departmentId: departmentId || null,
        createdAt: new Date().toISOString()
      };

      await db.collection('users').insertOne(newUser);
      return NextResponse.json({ success: true, user: newUser });
    }

    // Department Routes
    if (path === 'departments' && user.role === 'admin') {
      const body = await request.json();
      const { name, description, hodId } = body;

      const department = {
        id: uuidv4(),
        name,
        description,
        hodId: hodId || null,
        createdAt: new Date().toISOString()
      };

      await db.collection('departments').insertOne(department);
      return NextResponse.json({ success: true, department });
    }

    // Category Routes
    if (path === 'categories' && user.role === 'admin') {
      const body = await request.json();
      const { name, departmentId } = body;

      const category = {
        id: uuidv4(),
        name,
        departmentId,
        createdAt: new Date().toISOString()
      };

      await db.collection('categories').insertOne(category);
      return NextResponse.json({ success: true, category });
    }

    // Complaint Routes
    if (path === 'complaints') {
      const body = await request.json();
      const { title, description, categoryId, priority, attachments } = body;

      // Get category to find department
      const category = await db.collection('categories').findOne({ id: categoryId });
      if (!category) {
        return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
      }

      // Get department to find HOD
      const department = await db.collection('departments').findOne({ id: category.departmentId });
      
      const complaint = {
        id: uuidv4(),
        title,
        description,
        categoryId,
        categoryName: category.name,
        departmentId: category.departmentId,
        departmentName: department?.name || 'Unknown',
        priority: priority || 'medium',
        status: 'pending',
        complainantId: user.id,
        complainantName: user.name,
        assignedToHodId: department?.hodId || null,
        assignedToStaffId: null,
        attachments: attachments || [],
        submittedAt: new Date().toISOString(),
        assignedAt: null,
        resolvedAt: null,
        resolutionNote: null,
        feedbackRating: null,
        feedbackComment: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await db.collection('complaints').insertOne(complaint);

      // Create notification for HOD
      if (department?.hodId) {
        await db.collection('notifications').insertOne({
          id: uuidv4(),
          userId: department.hodId,
          complaintId: complaint.id,
          type: 'new_complaint',
          message: `New complaint assigned: ${title}`,
          read: false,
          createdAt: new Date().toISOString()
        });
      }

      return NextResponse.json({ success: true, complaint });
    }

    // Assign complaint to staff (HOD only)
    if (path.startsWith('complaints/') && path.includes('/assign')) {
      const complaintId = path.split('/')[1];
      const body = await request.json();
      const { staffId } = body;

      if (user.role !== 'hod' && user.role !== 'admin') {
        return NextResponse.json({ error: 'Only HOD can assign complaints' }, { status: 403 });
      }

      await db.collection('complaints').updateOne(
        { id: complaintId },
        {
          $set: {
            assignedToStaffId: staffId,
            status: 'assigned',
            assignedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        }
      );

      // Create notification for staff
      const complaint = await db.collection('complaints').findOne({ id: complaintId });
      await db.collection('notifications').insertOne({
        id: uuidv4(),
        userId: staffId,
        complaintId: complaintId,
        type: 'assigned',
        message: `You have been assigned a complaint: ${complaint?.title}`,
        read: false,
        createdAt: new Date().toISOString()
      });

      // Log action
      await db.collection('resolutionLogs').insertOne({
        id: uuidv4(),
        complaintId: complaintId,
        userId: user.id,
        action: 'assigned',
        note: `Assigned to staff`,
        timestamp: new Date().toISOString()
      });

      return NextResponse.json({ success: true });
    }

    // Update complaint status
    if (path.startsWith('complaints/') && path.includes('/status')) {
      const complaintId = path.split('/')[1];
      const body = await request.json();
      const { status, note } = body;

      if (user.role !== 'staff' && user.role !== 'hod' && user.role !== 'admin') {
        return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
      }

      const updateData = {
        status,
        updatedAt: new Date().toISOString()
      };

      if (status === 'in-progress') {
        updateData.status = 'in-progress';
      }

      await db.collection('complaints').updateOne(
        { id: complaintId },
        { $set: updateData }
      );

      // Log action
      await db.collection('resolutionLogs').insertOne({
        id: uuidv4(),
        complaintId: complaintId,
        userId: user.id,
        action: 'status_update',
        note: note || `Status updated to ${status}`,
        timestamp: new Date().toISOString()
      });

      return NextResponse.json({ success: true });
    }

    // Resolve complaint
    if (path.startsWith('complaints/') && path.includes('/resolve')) {
      const complaintId = path.split('/')[1];
      const body = await request.json();
      const { resolutionNote } = body;

      if (user.role !== 'staff' && user.role !== 'hod' && user.role !== 'admin') {
        return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
      }

      await db.collection('complaints').updateOne(
        { id: complaintId },
        {
          $set: {
            status: 'resolved',
            resolutionNote,
            resolvedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        }
      );

      // Create notification for complainant
      const complaint = await db.collection('complaints').findOne({ id: complaintId });
      await db.collection('notifications').insertOne({
        id: uuidv4(),
        userId: complaint.complainantId,
        complaintId: complaintId,
        type: 'resolved',
        message: `Your complaint has been resolved: ${complaint?.title}`,
        read: false,
        createdAt: new Date().toISOString()
      });

      // Log action
      await db.collection('resolutionLogs').insertOne({
        id: uuidv4(),
        complaintId: complaintId,
        userId: user.id,
        action: 'resolved',
        note: resolutionNote,
        timestamp: new Date().toISOString()
      });

      return NextResponse.json({ success: true });
    }

    // Add feedback
    if (path.startsWith('complaints/') && path.includes('/feedback')) {
      const complaintId = path.split('/')[1];
      const body = await request.json();
      const { rating, comment } = body;

      const complaint = await db.collection('complaints').findOne({ id: complaintId });
      if (complaint.complainantId !== user.id) {
        return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
      }

      await db.collection('complaints').updateOne(
        { id: complaintId },
        {
          $set: {
            feedbackRating: rating,
            feedbackComment: comment,
            updatedAt: new Date().toISOString()
          }
        }
      );

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid endpoint' }, { status: 404 });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request) {
  const db = await connectDB();
  const url = new URL(request.url);
  const path = url.pathname.replace('/api/', '');

  try {
    // Public route for health check
    if (path === 'health') {
      return NextResponse.json({ status: 'ok' });
    }

    // Protected routes
    const user = verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get current user
    if (path === 'auth/me') {
      const userData = await db.collection('users').findOne({ id: user.id });
      return NextResponse.json({
        id: userData.id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        departmentId: userData.departmentId
      });
    }

    // Get all users (admin only)
    if (path === 'users') {
      if (user.role !== 'admin') {
        return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
      }
      const users = await db.collection('users').find({}).project({ password: 0 }).toArray();
      return NextResponse.json({ users });
    }

    // Get departments
    if (path === 'departments') {
      const departments = await db.collection('departments').find({}).toArray();
      return NextResponse.json({ departments });
    }

    // Get categories
    if (path === 'categories') {
      const departmentId = url.searchParams.get('departmentId');
      const query = departmentId ? { departmentId } : {};
      const categories = await db.collection('categories').find(query).toArray();
      return NextResponse.json({ categories });
    }

    // Get complaints (role-based filtering)
    if (path === 'complaints') {
      let query = {};
      
      if (user.role === 'complainant') {
        query = { complainantId: user.id };
      } else if (user.role === 'staff') {
        query = { assignedToStaffId: user.id };
      } else if (user.role === 'hod') {
        query = { departmentId: user.departmentId };
      }
      // admin can see all complaints

      const complaints = await db.collection('complaints').find(query).sort({ createdAt: -1 }).toArray();
      return NextResponse.json({ complaints });
    }

    // Get single complaint
    if (path.startsWith('complaints/') && !path.includes('/')) {
      const complaintId = path.split('/')[1];
      const complaint = await db.collection('complaints').findOne({ id: complaintId });
      
      if (!complaint) {
        return NextResponse.json({ error: 'Complaint not found' }, { status: 404 });
      }

      // Get resolution logs
      const logs = await db.collection('resolutionLogs').find({ complaintId }).sort({ timestamp: 1 }).toArray();
      
      return NextResponse.json({ complaint, logs });
    }

    // Get notifications
    if (path === 'notifications') {
      const notifications = await db.collection('notifications')
        .find({ userId: user.id })
        .sort({ createdAt: -1 })
        .limit(20)
        .toArray();
      return NextResponse.json({ notifications });
    }

    // Analytics dashboard
    if (path === 'analytics/dashboard') {
      const stats = {};

      if (user.role === 'admin') {
        // System-wide stats
        const totalComplaints = await db.collection('complaints').countDocuments();
        const pendingComplaints = await db.collection('complaints').countDocuments({ status: { $in: ['pending', 'assigned', 'in-progress'] } });
        const resolvedComplaints = await db.collection('complaints').countDocuments({ status: 'resolved' });
        
        // Category distribution
        const categoryStats = await db.collection('complaints').aggregate([
          { $group: { _id: '$categoryName', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 5 }
        ]).toArray();

        // Priority distribution
        const priorityStats = await db.collection('complaints').aggregate([
          { $group: { _id: '$priority', count: { $sum: 1 } } }
        ]).toArray();

        // Recent complaints
        const recentComplaints = await db.collection('complaints')
          .find({})
          .sort({ createdAt: -1 })
          .limit(10)
          .toArray();

        stats.total = totalComplaints;
        stats.pending = pendingComplaints;
        stats.resolved = resolvedComplaints;
        stats.resolutionRate = totalComplaints > 0 ? ((resolvedComplaints / totalComplaints) * 100).toFixed(1) : 0;
        stats.categoryStats = categoryStats;
        stats.priorityStats = priorityStats;
        stats.recentComplaints = recentComplaints;

      } else if (user.role === 'hod') {
        // Department stats
        const query = { departmentId: user.departmentId };
        const totalComplaints = await db.collection('complaints').countDocuments(query);
        const pendingComplaints = await db.collection('complaints').countDocuments({ ...query, status: { $in: ['pending', 'assigned', 'in-progress'] } });
        const resolvedComplaints = await db.collection('complaints').countDocuments({ ...query, status: 'resolved' });
        
        // Staff performance
        const staffPerformance = await db.collection('complaints').aggregate([
          { $match: { departmentId: user.departmentId, assignedToStaffId: { $ne: null } } },
          { $group: { _id: '$assignedToStaffId', total: { $sum: 1 }, resolved: { $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] } } } }
        ]).toArray();

        stats.total = totalComplaints;
        stats.pending = pendingComplaints;
        stats.resolved = resolvedComplaints;
        stats.resolutionRate = totalComplaints > 0 ? ((resolvedComplaints / totalComplaints) * 100).toFixed(1) : 0;
        stats.staffPerformance = staffPerformance;

      } else if (user.role === 'staff') {
        // Personal workload
        const query = { assignedToStaffId: user.id };
        const totalComplaints = await db.collection('complaints').countDocuments(query);
        const pendingComplaints = await db.collection('complaints').countDocuments({ ...query, status: { $in: ['assigned', 'in-progress'] } });
        const resolvedComplaints = await db.collection('complaints').countDocuments({ ...query, status: 'resolved' });

        stats.total = totalComplaints;
        stats.pending = pendingComplaints;
        stats.resolved = resolvedComplaints;

      } else if (user.role === 'complainant') {
        // Personal complaint history
        const query = { complainantId: user.id };
        const totalComplaints = await db.collection('complaints').countDocuments(query);
        const pendingComplaints = await db.collection('complaints').countDocuments({ ...query, status: { $in: ['pending', 'assigned', 'in-progress'] } });
        const resolvedComplaints = await db.collection('complaints').countDocuments({ ...query, status: 'resolved' });

        stats.total = totalComplaints;
        stats.pending = pendingComplaints;
        stats.resolved = resolvedComplaints;
      }

      return NextResponse.json({ stats });
    }

    return NextResponse.json({ error: 'Invalid endpoint' }, { status: 404 });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  const db = await connectDB();
  const url = new URL(request.url);
  const path = url.pathname.replace('/api/', '');

  try {
    const user = verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Update department (admin only)
    if (path.startsWith('departments/')) {
      if (user.role !== 'admin') {
        return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
      }

      const departmentId = path.split('/')[1];
      const body = await request.json();
      const { name, description, hodId } = body;

      await db.collection('departments').updateOne(
        { id: departmentId },
        { $set: { name, description, hodId, updatedAt: new Date().toISOString() } }
      );

      return NextResponse.json({ success: true });
    }

    // Update user (admin only)
    if (path.startsWith('users/')) {
      if (user.role !== 'admin') {
        return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
      }

      const userId = path.split('/')[1];
      const body = await request.json();
      const { name, email, role, departmentId } = body;

      await db.collection('users').updateOne(
        { id: userId },
        { $set: { name, email, role, departmentId, updatedAt: new Date().toISOString() } }
      );

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid endpoint' }, { status: 404 });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
