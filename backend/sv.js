const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const express = require('express');
const bodyParser = require('body-parser')
const knex = require('knex')
const app = express()
const cors = require('cors');

const storage = multer.memoryStorage(); // Store file in memory
const upload = multer({ storage: storage });

const filesDir = path.join(__dirname, 'generated_files');
if (!fs.existsSync(filesDir)) {
    fs.mkdirSync(filesDir);
}

// Serve static files from the generated_files directory
// Function to clean up old files
function cleanupOldFiles() {
  console.log('Running file cleanup check...');
  const now = Date.now();
  const oneWeekInMs = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
  
  fs.readdir(filesDir, (err, files) => {
    if (err) {
      console.error('Error reading generated_files directory:', err);
      return;
    }
    
    files.forEach(file => {
      const filePath = path.join(filesDir, file);
      
      fs.stat(filePath, (err, stats) => {
        if (err) {
          console.error(`Error getting stats for file ${file}:`, err);
          return;
        }
        
        const fileAge = now - stats.mtime.getTime();
        
        if (fileAge > oneWeekInMs) {
          // Delete file if older than one week
          fs.unlink(filePath, err => {
            if (err) {
              console.error(`Error deleting old file ${file}:`, err);
            } else {
              console.log(`Deleted old file: ${file}`);
            }
          });
        }
      });
    });
  });
}

// Run cleanup on server start
cleanupOldFiles();

// Schedule cleanup to run daily
const CLEANUP_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
setInterval(cleanupOldFiles, CLEANUP_INTERVAL);

const db = knex({
    client: 'mysql',
    connection: {
        host: '127.0.0.1',
        port: '3306',
        user: 'root',
        password: '',
        database: 'arrangex'
    }
})

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    console.log('Working')
});

app.post('/adminlogin', async (req, res) =>{
  const { username, password } = req.body;
  console.log('working')
  if(!username || !password){
      res.status(400).json('Please fill all the fields!')
  }else{
      try{
          const user = await db('admins').where({username: username, password: password}).select('*');
          if(user.length){
              res.json({success: true, data: user[0]})
          }else{
              res.json({success: false})
          }
      }catch(error){
          console.log(error)
          res.status(400).json('Internal Server error')
      }
  }
});

app.get('/admins', async (req, res) => {
  try {
    const admins = await db('admins').select('*');
    res.json(admins);
  } catch (error) {
    console.error('Error fetching admins:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/addadmin', async (req, res) => {
  const { username, password, designation, name } = req.body.data;
  console.log(req.body)
  if (!username || !password || !designation || !name) {
    return res.status(400).json({ success: false, error: 'Please fill all the fields!' });
  }
  try {
    // Check if the admin already exists
    const existingAdmin = await db('admins').where({ username }).first();
    console.log(existingAdmin)
    if (existingAdmin) {
      return res.status(400).json({ success: false, error: 'Admin already exists!' });
    }
    // Insert the new admin into the database
    await db('admins').insert({ username, password, designation, name });
    res.status(201).json({ success: true, message: 'Admin added successfully' });
  } catch (error) {
    console.error('Error adding admin:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/addhall', async (req, res) => {
  const { hallName, rows, columns } = req.body.data;
  console.log(req.body)
  if (!hallName || !rows || !columns) {
    return res.status(400).json({ success: false, error: 'Please fill all the fields!' });
  }
  try {
    // Check if the hall already exists
    const existingHall = await db('halls').where({ name: hallName }).first();
    if (existingHall) {
      return res.status(400).json({ success: false, error: 'Hall already exists!' });
    }
    // Insert the new hall into the database
    await db('halls').insert({ name: hallName, rows, columns });
    res.status(201).json({ success: true, message: 'Hall added successfully' });
  } catch (error) {
    console.error('Error adding hall:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/updatehall', async (req, res) => {
  const { hallName, rows, columns } = req.body;
  if (!rows || !columns) {
    return res.status(400).json({ success: false, error: 'Please fill all the fields!' });
  }
  try {
    // Update the hall in the database
    await db('halls').where({ name: hallName }).update({ rows, columns });
    res.status(200).json({ success: true, message: 'Hall updated successfully' });
  } catch (error) {
    console.error('Error updating hall:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/deleteadmin/:id', async (req, res) => {
  const { id } = req.params;
  try {
    // Delete the admin from the database
    await db('admins').where({ username:id }).del();
    res.status(200).json({success: true, message: 'Admin deleted successfully' });
  } catch (error) {
    console.error('Error deleting admin:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/halls', async (req, res) => {
  try {
    const halls = await db('halls').select('*');
    res.json(halls);
  } catch (error) {
    console.error('Error fetching halls:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/generate-seats', upload.single('studentList'), async (req, res) => {
  const { examName, examDate, examHalls } = req.body;
  const studentListFile = req.file; // This contains your file
  
  console.log('Body:', req.body);
  console.log('File:', req.file);
  
  if (!examHalls || !studentListFile) {
    return res.status(400).json({ success: false, error: 'Please fill all the fields!' });
  }
  
  try {
    // Parse the student list CSV from the uploaded file
    const students = [];
    const fileContent = studentListFile.buffer.toString('utf8');
    
    // Create a readable stream from the buffer
    const bufferStream = new require('stream').Readable();
    bufferStream.push(fileContent);
    bufferStream.push(null);
    
    // Process the CSV data
    await new Promise((resolve, reject) => {
      bufferStream
        .pipe(csv({
          headers: false,
          skipLines: 1
        }))
        .on('data', (row) => {
          if(row[0] !== ''){
            students.push(row);
          }
        })
        .on('end', () => {
          resolve();
        })
        .on('error', (error) => {
          reject(error);
        });
    });
    
    // Fetch halls from database
    let selectedHalls;
    let isAll = examHalls.map(hall => hall.toLowerCase()).includes('all');
    if (isAll) {
      // Use all halls from the database
      selectedHalls = await db('halls').select('*');
    } else {
      // Parse the selected hall names
      const hallNames = examHalls;
      // Fetch only the selected halls
      selectedHalls = await db('halls').whereIn('name', hallNames).select('*');
    }
    
    // Group students by course
    const groups = {};
    let studentCount = 0;
    students.forEach(student => {
      const course = student[7]; // Assuming course is in the 7th column
      if (!groups[course]) {
        groups[course] = [];
      }
      groups[course].push(student);
      studentCount+=1;
    });
    
    console.log(`Total students: ${studentCount}`);
    const courseNames = Object.keys(groups).sort((a, b) => groups[b].length - groups[a].length);
    let numCourses = courseNames.length;
    let slots = [];
    let numSlots;

    if (numCourses === 1) {
      // For single course
      slots = [courseNames[0]];
      numSlots = 1;
    } else {
      numSlots = Math.ceil(numCourses / 2);
      for (let i = 0; i < numSlots; i++) {
        const start = i * 2;
        const end = start + 2;
        slots.push(courseNames.slice(start, end));
      }
    }

    // Create queues for each course
    const queues = {};
    courseNames.forEach(course => {
      queues[course] = [...groups[course]];
    });

    // Generate seating arrangements for each hall
    const classrooms = [];

    selectedHalls.forEach(hall => {
      const classroom = generateClassroom(hall.columns, hall.rows, slots, queues, numCourses);
      classroom.name = hall.name;
      
      // Count students per course in this classroom
      const courseCounts = {};
      
      // Track all students in this classroom with their registration numbers
      const allStudents = [];
      
      for (let row = 0; row < hall.rows; row++) {
        for (let col = 0; col < hall.columns; col++) {
          const student = classroom.seating[row][col];
          if (student) {
            const course = student[7];
            const regNo = student[1];
            courseCounts[course] = (courseCounts[course] || 0) + 1;
            allStudents.push({
              regNo: regNo,
              course: course
            });
          }
        }
      }
      classroom.courseCounts = courseCounts;
      classroom.allStudents = allStudents;
      classrooms.push(classroom);
    });
    
    // Check for remaining students
    let remainingStudents = 0;
    Object.keys(queues).forEach(course => {
      remainingStudents += queues[course].length;
    });
    console.log(`Remaining students: ${remainingStudents}`);
    
    // If there are remaining students, calculate how many additional halls needed
    if (remainingStudents > 0) {
      // Create a deep copy of the queues to simulate additional hall allocation
      const tempQueues = {};
      Object.keys(queues).forEach(course => {
        tempQueues[course] = [...queues[course]];
      });
      
      // Use the last hall configuration as a template for additional halls
      // If there are no halls selected, use a default configuration
      const templateHall = selectedHalls.length > 0 ? 
        selectedHalls[selectedHalls.length - 1] : 
        { columns: 6, rows: 5 }; // Default if no halls selected
      
      let additionalHalls = 0;
      
      // Keep generating virtual classrooms until all students are accommodated
      while (true) {
        let allEmpty = true;
        // Check if any queues still have students
        Object.values(tempQueues).forEach(queue => {
          if (queue.length > 0) allEmpty = false;
        });
        
        if (allEmpty) break; // All students placed, exit loop
        
        // Generate a virtual classroom to simulate placing remaining students
        generateClassroom(templateHall.columns, templateHall.rows, slots, tempQueues, numCourses);
        additionalHalls++;
      }
      
      console.log(`Need ${additionalHalls} more hall(s) of ${templateHall.columns}x${templateHall.rows} to seat ${remainingStudents} remaining students`);
      
      return res.status(200).json({ 
        success: false, 
        message: 'Insufficient halls for all students',
        remainingStudents: remainingStudents,
        additionalHallsNeeded: additionalHalls,
        hallConfiguration: {
          rows: templateHall.rows,
          columns: templateHall.columns
        },
        error: `Need ${additionalHalls} more hall(s) of ${templateHall.columns}x${templateHall.rows} to seat ${remainingStudents} remaining students`
      });
    }

    // Create a directory for files if it doesn't exist
    const filesDir = path.join(__dirname, 'generated_files');
    if (!fs.existsSync(filesDir)) {
      fs.mkdirSync(filesDir);
    }
    
    // Generate safe filenames
    const safeName = examName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const timestamp = Date.now();
    const arrangementFilename = `seating_arrangement_${safeName}_${timestamp}.html`;
    const rangesFilename = `registration_ranges_${safeName}_${timestamp}.html`;
    
    // Generate HTML and save files to the directory
    const html = generateHTML(classrooms, examName, examDate, req.body.isFN);
    const filePath = path.join(filesDir, arrangementFilename);
    fs.writeFileSync(filePath, html);
    
    // Generate HTML for registration ranges
    const rangeHTML = generateRegistrationRangeHTML(classrooms, examName, examDate, req.body.isFN);
    const rangeFilePath = path.join(filesDir, rangesFilename);
    fs.writeFileSync(rangeFilePath, rangeHTML);

    // Generate HTML for course counts
    const countFilename = `course_counts_${safeName}_${timestamp}.html`;
    const countHTML = generateCourseCountHTML(classrooms, examName, examDate, req.body.isFN);
    const countFilePath = path.join(filesDir, countFilename);
    fs.writeFileSync(countFilePath, countHTML);
    
    // Return success with download URLs for the files
    res.status(200).json({ 
      success: true, 
      message: 'Seating arrangement generated successfully',
      remainingStudents: 0,
      files: {
        arrangementFile: `/generated_files/${arrangementFilename}`,
        rangesFile: `/generated_files/${rangesFilename}`,
        countFile: `/generated_files/${countFilename}`
      }
    });
    
  } catch (error) {
    console.error('Error generating seating arrangement:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// On your Express server
app.post('/download-proxy', async (req, res) => {
  try {
    const { fileUrl } = req.body;
    // Make sure fileUrl is just a path and doesn't contain full URL to prevent security issues
    const filePath = path.join(__dirname, fileUrl); // Adjust to match your file structure
    
    // Set headers to force download
    res.setHeader('Content-Disposition', 'attachment');
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
    
    // Send the file
    res.sendFile(filePath);
  } catch (error) {
    console.error('Error in download proxy:', error);
    res.status(500).send('Error downloading file');
  }
});

app.listen(3000, ()=>{
  console.log('Server is running on port 3000');
})

const classrooms = [];

// const classroomConfigs = [
//   { columns: 6, rows: 5, name: "EC5" },
//   { columns: 6, rows: 5, name: "EC6" },
//   { columns: 6, rows: 5, name: "EC7" },
//   { columns: 6, rows: 5, name: "EC8" },
//   { columns: 6, rows: 5, name: "EC9" },
//   { columns: 6, rows: 5, name: "EC10" },
//   { columns: 6, rows: 5, name: "EC11" },
//   { columns: 6, rows: 5, name: "EC12" },
//   { columns: 6, rows: 5, name: "EC13" },
//   { columns: 6, rows: 5, name: "CS5" },
//   { columns: 6, rows: 5, name: "CS6" },
//   { columns: 6, rows: 5, name: "CS7" },
//   { columns: 6, rows: 5, name: "CS8" },
//   { columns: 6, rows: 5, name: "CS9" },
//   { columns: 6, rows: 5, name: "CS10" },
//   { columns: 6, rows: 5, name: "CS11" },
//   { columns: 6, rows: 5, name: "CS12" },
//   { columns: 6, rows: 5, name: "CS13" },
//   { columns: 6, rows: 5, name: "CS14" },
//   { columns: 6, rows: 5, name: "CS15" },
// ];

// // Column labels for the seating arrangement (used internally)
const columnLabels = ["AL", "AR", "BL", "BR", "CL", "CR"];

// // Read and parse CSV
// const students = [];
// fs.createReadStream(path.join(__dirname, 'studentList2.csv'))
//   .pipe(csv({
//     headers: false,
//     skipLines: 1
//   }))
//   .on('data', (row) => {
//     students.push(row);
//   })
//   .on('end', () => {
//     // Group students by course (7th column, index 7)
//     const groups = {};
//     students.forEach(student => {
//       const course = student[7];
//       if (!groups[course]) {
//         groups[course] = [];
//       }
//       groups[course].push(student);
//     });
//     console.log(Object.keys(groups))
//     const courseNames = Object.keys(groups).sort((a, b) => groups[b].length - groups[a].length);
//     let numCourses = courseNames.length;
//     let slots = [];
//     let numSlots;

//     if (numCourses === 1) {
//       // For single course, we'll handle this differently in generateClassroom
//       slots = [courseNames[0]];
//       numSlots = 1;
//     } else {
//       numSlots = Math.ceil(numCourses / 2);
//       for (let i = 0; i < numSlots; i++) {
//         const start = i * 2;
//         const end = start + 2;
//         slots.push(courseNames.slice(start, end));
//       }
//     }

//     // Create queues for each course
//     const queues = {};
//     courseNames.forEach(course => {
//       queues[course] = [...groups[course]];
//     });

//     // Generate classrooms
//     classroomConfigs.forEach(config => {
//       const classroom = generateClassroom(config.columns, config.rows, slots, queues, numCourses);
//       classroom.name = config.name;
      
//       // Count students per course in this classroom
//       const courseCounts = {};
      
//       // Track all students in this classroom with their registration numbers
//       const allStudents = [];
      
//       for (let row = 0; row < config.rows; row++) {
//         for (let col = 0; col < config.columns; col++) {
//           const student = classroom.seating[row][col];
//           if (student) {
//             const course = student[7];
//             const regNo = student[1];
            
//             courseCounts[course] = (courseCounts[course] || 0) + 1;
//             allStudents.push({
//               regNo: regNo,
//               course: course
//             });
//           }
//         }
//       }
      
//       classroom.courseCounts = courseCounts;
//       classroom.allStudents = allStudents;
//       classrooms.push(classroom);
//     });
      
//     // Check for remaining students
//     let remainingStudents = 0;
//     const tempQueues = {};
//     Object.keys(queues).forEach(course => {
//       tempQueues[course] = [...queues[course]];
//       remainingStudents += tempQueues[course].length;
//     });

//     if (remainingStudents > 0) {
//       const lastConfig = classroomConfigs[classroomConfigs.length - 1];
//       let additionalClassrooms = 0;

//       while (true) {
//         let allEmpty = true;
//         Object.values(tempQueues).forEach(queue => {
//           if (queue.length > 0) allEmpty = false;
//         });
//         if (allEmpty) break;

//         generateClassroom(lastConfig.columns, lastConfig.rows, slots, tempQueues, numCourses);
//         additionalClassrooms++;
//       }

//       console.log(`\n⚠️ Insufficient classrooms!`);
//       console.log(`▶ Need ${additionalClassrooms} more classroom(s) of ${lastConfig.columns}x${lastConfig.rows}`);
//       console.log(`   to seat ${remainingStudents} remaining student(s) using current distribution logic.`);
//     }

//     // Generate HTML
//     const html = generateHTML(classrooms);
//     fs.writeFileSync('seating_arrangement.html', html);
//     console.log('Seating arrangement generated as seating_arrangement.html');

//     // Generate registration range display
//     const rangeHTML = generateRegistrationRangeHTML(classrooms);
//     fs.writeFileSync('registration_ranges.html', rangeHTML);
//     console.log('Registration ranges generated as registration_ranges.html');
//   });

// Replace the generateClassroom function with this improved version
function generateClassroom(columns, rows, slots, queues, numCourses) {
  const seating = Array.from({ length: rows }, () => Array(columns).fill(null));
  
  // Count how many courses still have students and which ones they are
  const activeCourses = [];
  for (const [course, queue] of Object.entries(queues)) {
    if (queue.length > 0) {
      activeCourses.push(course);
    }
  }
  
  // Check if we're dealing with a single course scenario
  const isSingleCourse = activeCourses.length === 1;
  
  if (isSingleCourse) {
    // For single course, use a zigzag pattern to maximize distance between students
    const courseName = activeCourses[0];
    
    // Fill even-numbered columns first (0, 2, 4...)
    for (let col = 0; col < columns; col += 2) {
      for (let row = 0; row < rows; row++) {
        if (queues[courseName] && queues[courseName].length > 0) {
          seating[row][col] = queues[courseName].shift();
        }
      }
    }
    
    // Then fill odd-numbered columns (1, 3, 5...)
    for (let col = 1; col < columns; col += 2) {
      for (let row = 0; row < rows; row++) {
        if (queues[courseName] && queues[courseName].length > 0) {
          seating[row][col] = queues[courseName].shift();
        }
      }
    }
  } else {
    // Multiple courses - use a completely different allocation strategy
    
    // Create a 2D map to track which course is assigned to each seat
    const seatCourses = Array.from({ length: rows }, () => Array(columns).fill(null));
    
    // Define a function to check if a course can be placed at a specific position
    const canPlaceCourse = (row, col, course) => {
      // Check horizontally adjacent seats
      if (col > 0 && seatCourses[row][col-1] === course) return false;
      if (col < columns-1 && seatCourses[row][col+1] === course) return false;
      
      // Check vertically adjacent seats (optional, less important constraint)
      // if (row > 0 && seatCourses[row-1][col] === course) return false;
      // if (row < rows-1 && seatCourses[row+1][col] === course) return false;
      
      return true;
    };
    
    // Sort courses by number of students (descending)
    const sortedCourses = [...activeCourses].sort((a, b) => 
      queues[b].length - queues[a].length
    );
    
    // First pass: assign courses to columns in a way that avoids adjacency
    // We'll use a strategy where we alternate columns for different courses
    
    // Group columns into odd and even
    const evenColumns = Array.from({ length: Math.ceil(columns/2) }, (_, i) => i * 2)
      .filter(col => col < columns);
    const oddColumns = Array.from({ length: Math.floor(columns/2) }, (_, i) => i * 2 + 1);
    
    // Assign major courses to column groups
    let courseIndex = 0;
    
    // Function to fill a set of columns with students from a specific course
    const fillColumnSet = (columnSet, course) => {
      if (!queues[course] || queues[course].length === 0) return false;
      
      let studentsPlaced = 0;
      
      for (const col of columnSet) {
        for (let row = 0; row < rows; row++) {
          if (seating[row][col] === null && queues[course].length > 0 && canPlaceCourse(row, col, course)) {
            seating[row][col] = queues[course].shift();
            seatCourses[row][col] = course;
            studentsPlaced++;
          }
        }
      }
      
      return studentsPlaced > 0;
    };
    
    // First fill even columns with the course that has the most students
    if (sortedCourses.length > 0) {
      fillColumnSet(evenColumns, sortedCourses[0]);
      courseIndex++;
    }
    
    // Then fill odd columns with the course that has the second most students
    if (sortedCourses.length > 1) {
      fillColumnSet(oddColumns, sortedCourses[1]);
      courseIndex++;
    }
    
    // Then try to assign remaining courses to specific columns
    // but ensure no course appears in adjacent columns
    while (courseIndex < sortedCourses.length) {
      const course = sortedCourses[courseIndex];
      
      // Find columns where this course can be placed without adjacency issues
      const availableColumns = [];
      for (let col = 0; col < columns; col++) {
        let canUseColumn = true;
        
        // Check if this course is already in adjacent columns
        if (col > 0) {
          for (let row = 0; row < rows; row++) {
            if (seatCourses[row][col-1] === course) {
              canUseColumn = false;
              break;
            }
          }
        }
        
        if (col < columns-1) {
          for (let row = 0; row < rows; row++) {
            if (seatCourses[row][col+1] === course) {
              canUseColumn = false;
              break;
            }
          }
        }
        
        if (canUseColumn) {
          availableColumns.push(col);
        }
      }
      
      // Sort available columns to prefer those with more empty seats
      availableColumns.sort((a, b) => {
        const emptySeatsA = seating.filter(row => row[a] === null).length;
        const emptySeatsB = seating.filter(row => row[b] === null).length;
        return emptySeatsB - emptySeatsA;
      });
      
      // Try to place students in available columns
      let studentsPlaced = false;
      for (const col of availableColumns) {
        for (let row = 0; row < rows; row++) {
          if (seating[row][col] === null && queues[course].length > 0 && canPlaceCourse(row, col, course)) {
            seating[row][col] = queues[course].shift();
            seatCourses[row][col] = course;
            studentsPlaced = true;
          }
        }
      }
      
      // Move to next course regardless of whether we placed students
      // This prevents getting stuck on a course with few students
      courseIndex++;
      
      // If we've gone through all courses but still have empty seats and students,
      // start again from the course with the most remaining students
      if (courseIndex >= sortedCourses.length) {
        // Recalculate active courses
        const remainingCourses = [];
        for (const [course, queue] of Object.entries(queues)) {
          if (queue.length > 0) {
            remainingCourses.push(course);
          }
        }
        
        if (remainingCourses.length > 0) {
          // Sort by remaining students
          remainingCourses.sort((a, b) => queues[b].length - queues[a].length);
          sortedCourses.length = 0; // Clear the array
          sortedCourses.push(...remainingCourses);
          courseIndex = 0;
          
          // Check if we've actually placed any students in the last full cycle
          if (!studentsPlaced) {
            // If we couldn't place any students with strict adjacency rules,
            // we need to relax the constraints to fill remaining seats
            break;
          }
        } else {
          break; // No more students to place
        }
      }
    }
    
    // Final pass - fill remaining empty seats, still trying to maintain
    // separation but with relaxed constraints if necessary
    let hasEmptySeats = true;
    while (hasEmptySeats) {
      hasEmptySeats = false;
      
      // Recalculate active courses with remaining students
      const remainingCourses = Object.entries(queues)
        .filter(([_, queue]) => queue.length > 0)
        .map(([course, _]) => course)
        .sort((a, b) => queues[b].length - queues[a].length);
      
      if (remainingCourses.length === 0) break;
      
      // Try to place students with the adjacency constraint
      for (let col = 0; col < columns; col++) {
        for (let row = 0; row < rows; row++) {
          if (seating[row][col] === null) {
            hasEmptySeats = true;
            
            // Try each course, prioritizing those with most students
            let placed = false;
            for (const course of remainingCourses) {
              if (queues[course].length > 0 && canPlaceCourse(row, col, course)) {
                seating[row][col] = queues[course].shift();
                seatCourses[row][col] = course;
                placed = true;
                break;
              }
            }
            
            // If no course could be placed with adjacency constraint,
            // just place the course with the most students
            if (!placed && remainingCourses.length > 0) {
              const course = remainingCourses[0];
              if (queues[course].length > 0) {
                seating[row][col] = queues[course].shift();
                seatCourses[row][col] = course;
              }
            }
          }
        }
      }
      
      // If we've gone through all seats but still couldn't place anyone,
      // we should break to avoid an infinite loop
      if (hasEmptySeats && remainingCourses.every(course => queues[course].length === 0)) {
        break;
      }
    }
  }
  
  return { seating };
}

function generateHTML(classrooms, examName, examDate, isFN) {
  const currentDate = new Date();
  const formattedDate = `${currentDate.getDate()}.${currentDate.getMonth() + 1}.${currentDate.getFullYear()} F.N`;
  let html = `<!DOCTYPE html>
  <html>
  <head>
    <style>
      body { 
        font-family: Arial, sans-serif; 
        margin: 0;
        padding: 0;
      }
      .classroom-container {
        page-break-after: always; 
        padding: 0; 
        width: 100%;
        box-sizing: border-box;
      }
      .classroom-container:last-child {
        page-break-after: auto;
      }
      table { 
        border-collapse: collapse; 
        width: 100%; 
        max-width: 100%; 
        margin-bottom: 20px; 
        page-break-inside: avoid; 
        font-size: 20px; /* Increased overall font size */
      }
      th, td { 
        border: 1px solid black;
        padding: 4px;
        text-align: center;
        white-space: nowrap;
        word-wrap: break-word;
        min-width: 0;
        width: 2%;
      }
      th { 
        background-color: #f2f2f2; 
        font-weight: bold;
      }
      .exam-header {
        background-color: #e6e6e6;
        font-weight: bold;
      }
      .classroom-name {
        font-size: 16px;
        font-weight: bold;
        background-color: #d9d9d9;
      }
      .invigilator {
        text-align: left;
        font-weight: bold;
      }
      .course-summary {
        border-top: 2px solid black;
      }
      .reg-no {
        font-weight: bold;
        width: auto;
      }
      @media print {
        @page {
          size: landscape; 
          margin: 0.5cm; 
        }
        body {
          -webkit-print-color-adjust: exact;
          color-adjust: exact; 
        }
        .classroom-container { 
          page-break-after: always;
          width: 100%;
        }
        table{
          max-width: 99%;
          height: 100vh;
        }
      }
    </style>
  </head>
  <body>`;
  classrooms.forEach((classroom, index) => {
    html += `
    <div class="classroom-container">
      <table>
        <tr class="exam-header">
          <th colspan="12">${examName}</th>
        </tr>
        <tr>
          <th colspan="10">HALL: ${classroom.name}</th>
          <th colspan="2">Date: ${examDate} ${isFN == "" ? 'FN': ""}</th>
        </tr>`;
    html += `<tr>`;
    for (let i = 0; i < columnLabels.length; i++) {
      html += `
        <th class="seat-no">Seat No.</th>
        <th class="reg-no">Reg No.</th>`;
    }
    html += `</tr>`;
    for (let row = 0; row < classroom.seating.length; row++) {
      html += `<tr>`;
      for (let col = 0; col < columnLabels.length; col++) {
        const seatNumber = row + 1;
        const student = classroom.seating[row][col];
        const seatLabel = `${columnLabels[col]}${seatNumber}`;
        html += `
        <td class="seat-no">${seatLabel}</td>
        <td class="reg-no">${student ? student[1] : ""}</td>`;
      }
      html += `</tr>`;
    }
    const activeCourses = Object.entries(classroom.courseCounts)
      .filter(([course, count]) => count > 0)
      .sort(([courseA, countA], [courseB, countB]) => courseA.localeCompare(courseB));
    function extractCourseCode(courseName) {
      const codeMatch = courseName.match(/\(\s*([A-Z]{2,3}\d{3})\s*\)/);
      return codeMatch && codeMatch[1] ? codeMatch[1] : courseName;
    }
    html += `
      <tr class="course-summary">
        <td colspan="2" class="invigilator">INVIGILATOR:</td>
        <td colspan="6"></td>`;
    if (activeCourses.length > 0) {
      const courseCode = extractCourseCode(activeCourses[0][0]);
      html += `
        <td colspan="2">${courseCode}</td>
        <td colspan="2">${activeCourses[0][1]}</td>`;
    } else {
      html += `
        <td colspan="4"></td>`;
    }
    html += `</tr>`;
    for (let i = 1; i < activeCourses.length; i++) {
      const courseCode = extractCourseCode(activeCourses[i][0]);
      html += `
      <tr>
        <td colspan="8"></td>
        <td colspan="2">${courseCode}</td>
        <td colspan="2">${activeCourses[i][1]}</td>
      </tr>`;
    }
    html += `
      <tr>
        <td colspan="12" style="font-weight: bold; text-align: center; font-size: 18px;">
          DEVELOPED BY STUDENTS OF IT DEPARTMENT, (2022-26 BATCH)
        </td>
      </tr>
    `;
    html += `
      </table>
    </div>`;
  });
  html += `
  </body>
  </html>`;
  return html;
}


function generateRegistrationRangeHTML(classrooms, examName, examDate, isFN) {
  const currentDate = new Date("2025-03-30");
  const formattedDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()} FN`;
  
  // Process and group registration numbers for each classroom
  classrooms.forEach(classroom => {
    // Group students by registration number prefix
    const studentsByPrefix = {};
    
    classroom.allStudents.forEach(student => {
      const regNo = student.regNo;
      
      // Extract the prefix part (e.g., "LTLY22CE", "LTLY21IT")
      // Improved regex to better capture the pattern in registration numbers
      const prefixMatch = regNo.match(/^([A-Z]+\d+[A-Z]+)/);
      if (prefixMatch && prefixMatch[1]) {
        const prefix = prefixMatch[1];
        
        if (!studentsByPrefix[prefix]) {
          studentsByPrefix[prefix] = [];
        }
        
        // Extract the numeric part at the end
        const numericPart = regNo.substring(prefix.length);
        studentsByPrefix[prefix].push({
          fullRegNo: regNo,
          numericPart: parseInt(numericPart, 10)
        });
      } else {
        // For registration numbers that don't match the expected pattern
        if (!studentsByPrefix['OTHER']) {
          studentsByPrefix['OTHER'] = [];
        }
        studentsByPrefix['OTHER'].push({
          fullRegNo: regNo,
          numericPart: 0
        });
      }
    });
    
    // Create more consolidated ranges per prefix
    const formattedRanges = [];
    
    Object.keys(studentsByPrefix).forEach(prefix => {
      const students = studentsByPrefix[prefix];
      
      // Sort by numeric part
      students.sort((a, b) => a.numericPart - b.numericPart);
      
      if (students.length === 0) return;
      
      // For each prefix, just take the first and last registration number
      // This ignores small gaps in the sequence
      if (students.length === 1) {
        // Single student with this prefix
        formattedRanges.push(students[0].fullRegNo);
      } else {
        // Multiple students - create a range from first to last
        const first = students[0].fullRegNo;
        const last = students[students.length - 1].fullRegNo;
        formattedRanges.push(`${first}-${last}`);
      }
    });
    
    // Store the formatted ranges with the classroom
    classroom.formattedRanges = formattedRanges;
  });
  
  let html = `<!DOCTYPE html>
  <html>
  <head>
    <style>
      body { 
        font-family: Arial, sans-serif; 
        margin: 0;
        padding: 20px;
        background-color: #f5f5f5;
      }
      .container {
        max-width: 800px;
        margin: 0 auto;
        background-color: white;
        padding: 20px;
        box-shadow: 0 0 10px rgba(0,0,0,0.1);
      }
      .header {
        text-align: center;
        margin-bottom: 20px;
      }
      h2, h3 {
        margin: 10px 0;
      }
      table { 
        border-collapse: collapse; 
        width: 100%; 
        margin-bottom: 30px;
      }
      th, td { 
        border: 1px solid black; 
        padding: 12px; /* Increased padding */
        text-align: center; 
        font-size: 25px;
        font-weight: bold; /* Make all registration ranges bold */
      }
      th { 
        background-color: #333; 
        color: white;
        font-weight: bold;
        font-size: 18px; /* Even larger font for headers */
      }
      .hall-cell {
        font-weight: bold;
        background-color: #f2f2f2;
        vertical-align: middle;
        font-size: 40px; /* Larger font for classroom names */
        letter-spacing: 0.5px; /* Better letter spacing for readability */
      }
      .note {
        font-size: 14px; /* Slightly larger note text */
        border-top: 1px solid #ccc;
        padding-top: 15px;
        margin-top: 30px;
      }
      @media print {
        body {
          background-color: white;
        }
        .container {
          box-shadow: none;
          padding: 0;
        }
        /* Ensure proper printing of the larger fonts */
        th, td {
          font-size: 14pt; /* Print-specific font sizes */
        }
        th {
          font-size: 16pt;
        }
        .hall-cell {
          font-size: 18pt;
        }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h2>COLLEGE OF ENGINEERING THALASSERY</h2>
        <h3>${examName}</h3>
        <p>SEATING ARRANGEMENT FOR: Date: ${examDate} ${isFN == "" ? 'FN': ""}</p>
        <p><b>DEVELOPED BY STUDENTS OF IT DEPARTMENT (2022-2026) BATCH</b></p>
      </div>
      
      <table>
        <tr>
          <th>HALL</th>
          <th>REGISTER NO:</th>
        </tr>`;
  
  // Add classroom data
  classrooms.forEach(classroom => {
    if (!classroom.formattedRanges || classroom.formattedRanges.length === 0) {
      return; // Skip classrooms with no students
    }
    
    html += `
        <tr>
          <td class="hall-cell" rowspan="${classroom.formattedRanges.length || 1}">${classroom.name}</td>
          <td>${classroom.formattedRanges[0] || ""}</td>
        </tr>`;
    
    // Add remaining ranges for this classroom
    for (let i = 1; i < classroom.formattedRanges.length; i++) {
      html += `
        <tr>
          <td>${classroom.formattedRanges[i]}</td>
        </tr>`;
    }
  });
  
  html += `
      </table>
      
      <div class="note">
        <p>NB:- Please enter the examination Hall before 9.30 A.M</p>
        <p>Mobile phones are not permitted in Examination Hall</p>
      </div>
    </div>
  </body>
  </html>`;
  
  return html;
}

function generateCourseCountHTML(classrooms, examName, examDate, isFN) {
  // Get all unique course codes across all classrooms
  const allCourses = new Set();
  classrooms.forEach(classroom => {
    Object.keys(classroom.courseCounts || {}).forEach(course => {
      // Extract course code from course name
      const codeMatch = course.match(/\(\s*([A-Z]{2,3}\d{3})\s*\)/);
      const courseCode = codeMatch && codeMatch[1] ? codeMatch[1] : course;
      allCourses.add(courseCode);
    });
  });
  
  // Convert to array and sort alphabetically
  const coursesList = Array.from(allCourses).sort();
  
  // Function to extract course code from course name
  function extractCourseCode(courseName) {
    const codeMatch = courseName.match(/\(\s*([A-Z]{2,3}\d{3})\s*\)/);
    return codeMatch && codeMatch[1] ? codeMatch[1] : courseName;
  }
  
  // Calculate total student count for each course
  const courseTotals = {};
  coursesList.forEach(course => {
    courseTotals[course] = 0;
  });
  
  // Count total students for each hall
  const hallTotals = {};
  classrooms.forEach(classroom => {
    hallTotals[classroom.name] = 0;
    Object.entries(classroom.courseCounts || {}).forEach(([course, count]) => {
      const courseCode = extractCourseCode(course);
      courseTotals[courseCode] += count;
      hallTotals[classroom.name] += count;
    });
  });
  
  // Calculate grand total
  const grandTotal = Object.values(hallTotals).reduce((sum, count) => sum + count, 0);
  
  let html = `<!DOCTYPE html>
  <html>
  <head>
    <style>
      body { 
        font-family: Arial, sans-serif; 
        margin: 0;
        padding: 20px;
      }
      .container {
        max-width: 1200px;
        margin: 0 auto;
      }
      h2, h3 {
        text-align: center;
        margin: 10px 0;
      }
      table { 
        border-collapse: collapse; 
        width: 100%; 
        margin-bottom: 20px;
      }
      th, td { 
        border: 1px solid black; 
        padding: 8px;
        text-align: center;
      }
      th { 
        background-color: #f2f2f2; 
        font-weight: bold;
      }
      .hall-cell {
        font-weight: bold;
        text-align: left;
      }
      .total-row td, .total-col {
        font-weight: bold;
        background-color: #e6e6e6;
      }
      .total-value {
        font-weight: bold;
      }
      @media print {
        @page {
          size: landscape;
        }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h2>QN PAPER PRINT COUNT</h2>
      <div>Date: ${examDate}</div>
      <div>Exam: ${examName}</div>
      <div>Total count of students: ${grandTotal}</div>
      
      <table>
        <tr>
          <th>Halls</th>`;
  
  // Add course headers
  coursesList.forEach(course => {
    html += `<th>${course}</th>`;
  });
  
  html += `<th>Total</th></tr>`;
  
  // Add classroom rows
  classrooms.forEach((classroom, index) => {
    html += `<tr>
      <td class="hall-cell">${classroom.name}</td>`;
    
    // Add count for each course in this classroom
    coursesList.forEach(courseCode => {
      let count = 0;
      // Find matching course in this classroom
      Object.entries(classroom.courseCounts || {}).forEach(([course, studentCount]) => {
        if (extractCourseCode(course) === courseCode) {
          count = studentCount;
        }
      });
      html += `<td>${count > 0 ? count : ''}</td>`;
    });
    
    // Add row total
    html += `<td class="total-col">${hallTotals[classroom.name]}</td></tr>`;
  });
  
  // Add totals row
  html += `<tr class="total-row">
    <td>Total</td>`;
  
  coursesList.forEach(course => {
    html += `<td>${courseTotals[course]}</td>`;
  });
  
  html += `<td class="total-value">${grandTotal}</td></tr>`;
  
  html += `
      </table>
    </div>
  </body>
  </html>`;
  
  return html;
}