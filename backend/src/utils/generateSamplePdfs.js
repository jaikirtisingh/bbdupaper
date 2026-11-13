const fs = require('fs');
const path = require('path');

const uploadsDir = path.join(__dirname, '..', '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

function createMinimalPdf(title, subtitle, category) {
  const content = `
BT
/F1 22 Tf
50 720 Td
(${title}) Tj
/F1 12 Tf
0 -30 Td
(Category: ${category} | EduVault Academic Resource) Tj
0 -25 Td
(Notice: This is a verified academic reference sample provided for learning purposes.) Tj
0 -25 Td
(${subtitle}) Tj
0 -30 Td
(Units Covered: Unit 1 to Unit 5 | B.Tech Computer Science & Engineering) Tj
0 -25 Td
(Prepared for: Babu Banarasi Das University / AKTU Engineering Syllabus) Tj
0 -40 Td
(------------------------------------------------------------------------------------------------) Tj
0 -25 Td
(Key Topics & Summary:) Tj
0 -20 Td
(1. Core Theoretical Foundations & Mathematical Formulations) Tj
0 -20 Td
(2. Step-by-step Algorithms with Time & Space Complexity Analysis) Tj
0 -20 Td
(3. Previous Year University Exam Questions and Marking Breakdowns) Tj
0 -20 Td
(4. Code Implementations, Practical Dry Runs, and Output Traces) Tj
0 -40 Td
(Platform: EduVault Academic Portal - The Engineer's Academic OS) Tj
ET
`;

  const streamLength = Buffer.byteLength(content, 'utf-8');

  const pdf = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>
endobj
4 0 obj
<< /Length ${streamLength} >>
stream
${content}
endstream
endobj
5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000244 00000 n 
0000000295 + ${streamLength} 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
${400 + streamLength}
%%EOF`;

  return pdf;
}

const sampleFiles = [
  { name: 'sample_dsa_syllabus.pdf', title: 'Data Structures Official Syllabus', sub: 'Unit 1-5 Detailed Topic List & Textbooks', cat: 'SYLLABUS' },
  { name: 'sample_dsa_trees_notes.pdf', title: 'DSA Handwritten Notes (Trees & Graphs)', sub: 'AVL Trees, B-Trees, Dijkstra, Prim-Kruskal', cat: 'NOTES' },
  { name: 'sample_dsa_pyq_2023.pdf', title: 'AKTU DSA Question Paper 2023-24', sub: 'End Semester Regular Examination Paper', cat: 'PYQ' },
  { name: 'sample_dsa_pyq_2022.pdf', title: 'AKTU DSA Question Paper 2022-23', sub: 'End Semester Regular Examination Paper', cat: 'PYQ' },
  { name: 'sample_dsa_lab_manual.pdf', title: 'Data Structures Lab Manual & Experiments', sub: '12 Standard Practical Programs with C Code', cat: 'LAB MANUAL' },
  { name: 'sample_dsa_viva_prep.pdf', title: 'Top 50 DSA Viva Voce Questions & Answers', sub: 'Rapid Revision Guide for Practical Boards', cat: 'VIVA PREP' },
  { name: 'sample_dsa_important_questions.pdf', title: 'DSA 10-Mark High Probability Exam Questions', sub: 'Solved repeated university examination problems', cat: 'IMPORTANT QUESTIONS' },
  { name: 'sample_dsa_practical_record.pdf', title: 'Complete Certified DSA Practical Journal', sub: 'Student experimental write-up and results', cat: 'PRACTICAL FILE' },
  { name: 'sample_dsa_assignments.pdf', title: 'DSA Semester Tutorial Assignments 1 & 2', sub: 'Problem sets with worked reference solutions', cat: 'ASSIGNMENTS' },
  { name: 'sample_dsa_unit1_pack.pdf', title: 'Unit 1 Comprehensive Study Pack', sub: 'Asymptotic Notations, Arrays & Linked Lists', cat: 'UNIT STUDY MATERIAL' },
  { name: 'sample_dsa_revision_pack.pdf', title: 'Night Before Exam Crunch Sheet & Formulae', sub: 'Quick revision mind-maps & complexity tables', cat: 'EXAM PREP' },
  { name: 'sample_dbms_master_notes.pdf', title: 'DBMS Master Revision Notes (Units 1-5)', sub: 'ER, Relational Algebra, Normalization & SQL', cat: 'NOTES' },
  { name: 'sample_dbms_pyq_2023.pdf', title: 'DBMS University Question Paper 2023-24', sub: 'End Semester Regular Examination Paper', cat: 'PYQ' },
  { name: 'sample_os_scheduling_notes.pdf', title: 'Operating Systems CPU Scheduling Notes', sub: 'Process States, Scheduling Algorithms & Deadlocks', cat: 'NOTES' },
  { name: 'sample_document.pdf', title: 'EduVault Verified Academic Document', sub: 'Standard Academic Resource Reference', cat: 'GENERAL' }
];

sampleFiles.forEach((file) => {
  const filePath = path.join(uploadsDir, file.name);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, createMinimalPdf(file.title, file.sub, file.cat), 'utf-8');
    console.log(`Generated sample PDF: ${file.name}`);
  }
});

console.log('✅ All sample PDFs verified in uploads folder.');
