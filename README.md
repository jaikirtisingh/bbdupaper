# EduVault — All-in-One B.Tech Academic Resource Platform
> **The Engineer's Academic Operating System**  
> Public Web Portal for B.Tech students across AKTU, BBDU, IPU and engineering universities nationwide.

---

## 🌐 Public Live Website (Accessible Globally)

Your website is live on the internet with public HTTPS:

### 🔗 Public URL: **[https://assignments-separately-centres-desert.trycloudflare.com](https://assignments-separately-centres-desert.trycloudflare.com)**

- **Supported Devices**: Android phones, iPhones, iPads, Windows laptops, MacBooks, Tablets.
- **SSL / Security**: 100% Verified Cloudflare Edge HTTPS.
- **Student Access**: 100% Free & Open — **No Login or Registration Required**.
- **Admin Command Center**: Access via the **Admin Login** button in the top navigation or at `/admin`.

---

## 🔑 Administrator Credentials

| Role | Email | Password | Access |
| :--- | :--- | :--- | :--- |
| **Site Admin** | `admin@eduvault.edu` | `Admin@123` | Upload PDFs, edit metadata, delete papers, manage subjects |

*(The interactive Admin Login modal has a 1-click "Autofill Admin" button for immediate access.)*

---

## 🚀 Key Features

### Student Side (Zero Login Friction)
- **Universal Search**: Search papers by subject name (`Operating Systems`, `Data Structures`) or subject code (`KCS-301`, `KCS-401`).
- **Academic Hierarchy Filters**: Filter by University, College, Course (B.Tech), Branch (CSE, AI & ML, IT, ECE, ME, CE), and Semester (1 to 8).
- **10 Study Pillars**:
  1. Semester-wise Official Syllabi
  2. Subject-wise Handwritten Notes
  3. Previous Year Question Papers (PYQs)
  4. Important Exam Questions
  5. Tutorial Assignments
  6. Certified Practical Files
  7. Lab Manuals & Code
  8. Viva Voce Q&A Prep
  9. Unit-wise Study Material
  10. Night-Before Exam Crunch Packs
- **In-App PDF Viewer**: Read PDFs directly inside your browser without forcing downloads.
- **Direct PDF Download**: Download files straight to mobile or laptop with a single click.
- **Offline Browser Bookmarking**: Save your favorite papers locally in your browser storage.

### Admin Side (Secure & Functional)
- **Upload Academic Papers**: Attach PDF files with university hierarchy, branch, semester, subject code, exam year, module/unit number, title, and description.
- **Instant Live Synchronization**: Newly uploaded papers immediately show up in the public student search results.
- **Edit Papers**: Modify titles, exam years, subject codes, descriptions, or replace the attached PDF.
- **Delete Papers**: Remove outdated or duplicate papers from both the database and file storage.
- **Real-time Telemetry**: Track total downloads and online reads.

---

## 💻 Local Commands (If restarting in the future)

### 1. Start the Full-Stack Unified Server
```powershell
cd "C:\Users\Admin\OneDrive\Desktop\bbd paper\backend"
node src/server.js
```

### 2. Launch the Public HTTPS Tunnel
```powershell
cd "C:\Users\Admin\OneDrive\Desktop\bbd paper"
.\cloudflared.exe tunnel --url http://localhost:5000
```
