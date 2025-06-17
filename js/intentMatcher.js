// ✅ INTENT MATCHING START
// File: js/intentMatcher.js

export const intents = [
    
    {
      tags: ['hello'],
      keywords: ['hii', 'hello', 'how', 'namaste'],
      responseTag: 'hello'
    },
    {
      tags: ['ignou_what'],
      keywords: ['IGNOU', 'what', 'tell', 'about','detail'],
      responseTag: 'ignou_what'
    },
    {
      tags: ['ignou_courses'],
      keywords: ['courses', 'course list', 'programmes', 'programs','degree','list', 'what', 'are', 'IGNOU', 'offer', 'name', 'UG', 'PG'],
      responseTag: 'ignou_courses'
    },
    {
      tags: ['ignou_contact'],
      keywords: ['call', 'contact', 'mobile', 'number', 'no.', 'address','adddress','adress','aderss'],
      responseTag: 'ignou_contact'
    },
    {
      tags: ['course_fee'],
      keywords: ['fees', 'fee', 'cost', 'charges', 'course', 'yearly','annum', 'year', 'structure'],
      responseTag: 'course_fee'
    },
    {
        tags: ['admission_fees'],
        keywords: ['fees', 'fee', 'cost', 'charges', 'admission'],
        responseTag: 'admission_fees'
    },
    {
        tags: ['exam_fees'],
        keywords: ['fees', 'fee', 'cost', 'charges', 'exam', 'term', 'end', 'examination', 'TEE', 'tee','what','how'],
        responseTag: 'exam_fees'
    },

    {
        tags: ['exam_date'],
        keywords: ['date', 'when', 'will', 'start', 'exam', 'term', 'end', 'examination', 'TEE', 'tee'],
        responseTag: 'exam_fees'
    },

    {
        tags: ['process'],
        keywords: ['process', 'where', 'apply', 'procedure', 'how', 'to', 'steps', 'admission', 'register'],
        responseTag: 'process'
    },

    {
        tags: ['application_fee'],
        keywords: ['application', 'fee', 'fees', 'apply', 'how', 'much', 'what'],
        responseTag: 'application_fee'
    },

    {
        tags: ['flip_courses'],
        keywords: ['flip', 'courses','fixed', 'intake', 'learning'],
        responseTag: 'application_fee'
    },

    {
        tags: ['start_dates'],
        keywords: ['date', 'when', 'will', 'start', 'open', 'admission', 'registration'],
        responseTag: 'start_dates'
    },
    {
        tags: ['last_dates'],
        keywords: ['when', 'final', 'end', 'ends', 'apply', 'date', 'last', 'deadline', 'admission'],
        responseTag: 'last_dates'
    },
    {
        tags: ['eligibility'],
        keywords: ['who', 'can', 'apply', 'eligiblity','eligible','eligibel', 'admission', 'eligibility'],
        responseTag: 'eligibility'
    },
    {
      tags: ['study_material'],
      keywords: ['study material', 'learning material', 'notes', 'pdf', 'learning pdf', 'books'],
      responseTag: 'study_material'
    },

    {
      tags: ['hall_ticket'],
      keywords: ['admit card', 'admit cards', 'hall ticket', 'hall tickets', 'exam ticket'],
      responseTag: 'hall_ticket'
    },

    {
      tags: ['result'],
      keywords: ['exam result', 'result', '2025 result', 'ignou result', 'term end result', 'TEE result'],
      responseTag: 'result'
    },

    {
      tags: ['contact_class'],
      keywords: ['contact class', 'contact session', 'contact classes','ignou class'],
      responseTag: 'contact_class'
    },

    {
      tags: ['assignment'],
      keywords: ['assignment', 'assignmnent','assignments','assigment', 'assingment', 'submit','assignmnt','assignemnt','when','to','where','submit'],
      responseTag: 'assignment'
    }
  ];
  
  export function detectIntent(userInput) {
    const input = userInput.toLowerCase().replace(/\s+/g, ' ').trim(); // 👈 new: collapse multiple spaces
    const scores = intents.map(intent => {
      let score = 0;
      for (const word of intent.keywords) {
        if (input.includes(word)) score++;
        if (input === word) score += 2; // give extra weight to exact match
      }
      return { tag: intent.responseTag, score };
    });
  
    scores.sort((a, b) => b.score - a.score);
    return scores[0].score > 0 ? scores[0].tag : null;
  }
  