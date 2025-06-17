// js/courseLogic.js

// Declare variables to hold the JSON data
let courseNames = [];
let eligibilityData = [];
let feeData = [];
let dataReady = false;


// Function to load the JSON data
async function loadCourseData() {
  try {
    const [namesResponse, eligibilityResponse, feeResponse] = await Promise.all([
      fetch('../json/course_name.json'),
      fetch('../json/eligibility.json'),
      fetch('../json/fee_data.json')
    ]);
    courseNames = await namesResponse.json();
    eligibilityData = await eligibilityResponse.json();
    feeData = await feeResponse.json();
    dataReady = true;
    console.log("Course data loaded successfully!");
  } catch (error) {
    console.error("Error loading course data:", error);
  }
}

function isDataReady() {
  return dataReady;
}


// Call the data loading function immediately when the module is imported
// This is important so the data is available when handleUserInput is called later
loadCourseData();


function handleCourseQuery(userInput) {
    const cleanedInput = userInput.toLowerCase();
     //console.log("handleCourseQuery: Cleaned user input:", cleanedInput); // NEW DEBUG LOG

    // Ensure data is loaded before trying to access it
    if (courseNames.length === 0) {
        console.warn("Course names data not yet loaded for handleCourseQuery.");
        return null;
    }

    for (const course of courseNames) {
        const courseId = course.course_id; 
        //console.log(`handleCourseQuery: Checking course primary name: "${course['primary name']}" (ID: ${courseId})`); // NEW DEBUG LOG
        for (let i = 1; i <= 5; i++) {
            const nameVariant = course[`name_${i}`]?.toLowerCase();
            if (nameVariant && cleanedInput.includes(nameVariant)) {
                // console.log(`  MATCH FOUND for variant "${nameVariant}". Returning courseId: ${courseId}`); // NEW DEBUG LOG
                return courseId;
            }
        }

        const primaryName = course['primary name'].toLowerCase();
       // console.log(`  Checking primary name: "${primaryName}"`); // NEW DEBUG LOG
        if (cleanedInput.includes(primaryName)) {
       // console.log(`  MATCH FOUND for primary name "${primaryName}". Returning courseId: ${courseId}`); // NEW DEBUG LOG
            return courseId;
        }
    }
  //  console.log("handleCourseQuery: No course match found for input."); // NEW DEBUG LOG 
    return null;
}

function generateCourseResponse(intent, courseId) { 
    //console.log("DEBUG: generateCourseResponse called with intent:", intent, "and courseId:", courseId, " (type:", typeof courseId, ")");
    if (feeData.length === 0 || eligibilityData.length === 0) {
        console.warn("Fee or eligibility data not yet loaded for generateCourseResponse.");
        return "Hmm, data is missing. Read ahead while I fix it.";
    }

    if (intent === 'course_fee') {
        if (courseId === 0) {
         return "IGNOU course fee ranges between Rs. 1,200/- to Rs. 30,000/- per year depending on the course. Do you have a course in mind?👀";
        }

        const feeObj = feeData.find(item => {
          //console.log("DEBUG: Comparing fee item.course_id:", item.course_id, "(type:", typeof item.course_id, ") with search courseId:", courseId, "(type:", typeof courseId, ")");
            return item.course_id === courseId;
             }
        ); // Changed fee_id to course_id
        return feeObj ? `The fee for ${getPrimaryCourseName(courseId)} is ${feeObj.course_fee}.` : "Looks like I can't find fee details for this course. Can you confirm the course name again?";
    }

    if (intent === 'eligibility') {
         if (courseId === 0) {
           return "Eligibility for UG admission is a 12th class. PG admission require bachelor's degree. And, Certificate & Diploma courses accept 10th pass to Graduates students.";
        }
        const eligibilityObj = eligibilityData.find(item => item.course_id === courseId); // Changed fee_id to course_id
        return eligibilityObj ? `Eligibility for ${getPrimaryCourseName(courseId)}: ${eligibilityObj.eligibility}` : "Eligibility details are not available.";
    }

    return "I'm still collecting information🔎. Till then keep reading.";
}

function getPrimaryCourseName(courseId) { // Changed fee_id to courseId
    // Ensure data is loaded before trying to access it
    if (courseNames.length === 0) {
        console.warn("Course names data not yet loaded for getPrimaryCourseName.");
        return "this course";
    }
    const course = courseNames.find(c => c.course_id === courseId); 
    return course ? course["primary name"] : "this course";
}

export { handleCourseQuery, generateCourseResponse, getPrimaryCourseName, loadCourseData, isDataReady };
