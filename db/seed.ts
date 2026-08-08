/**
 * Seed database dengan data awal dari CV.
 * Jalankan: npm run db:seed
 */
import { Pool } from "pg";
import "dotenv/config";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function seed() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    await client.query("DELETE FROM experiences");
    await client.query("DELETE FROM skills");
    await client.query("DELETE FROM education");
    await client.query("DELETE FROM projects");
    await client.query("DELETE FROM certificates");
    await client.query("DELETE FROM profile");

    await client.query(
      `INSERT INTO profile (name, title, description, status, email, phone, linkedin, instagram, location)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
      [
        "Muhammad Rafii",
        "IT Developer — Risk Analytics & Enterprise Automation",
        "IT Developer with proven experience in developing credit risk models, integrated analytics dashboards, and enterprise automation solutions across banking and corporate environments. Experienced in building end-to-end data and system workflows, including Early Warning and risk analytics platforms, automated termination and recruitment forms, and web-based monitoring systems. Strong capability in applying AI and machine learning techniques to enhance decision-making, operational efficiency, and risk mitigation.",
        "open",
        "rafii.dev23@gmail.com",
        "+62 815 1027 3784",
        "Muhammad Rafii",
        "Kirztyle_",
        "Jakarta, Indonesia",
      ]
    );

    const experiences = [
      {
        company: "Panin Dubai Syariah Bank",
        role: "Early Warning Monitoring Officer — Quality Assurance, Financing Risk Department",
        location: "Jakarta, Indonesia",
        period_start: "Aug 2025",
        period_end: "Present",
        description:
          "Designed and developed a web-based Early Warning System using monthly Customer Data Warehouse (DWH Nasabah) as the primary analytical source.\nDeveloped a risk analytics pipeline integrating SLIK OJK, DHN, AML/APUPPT, SIPP, financial statements, customer visit reports, and negative sentiment data from news portals and social media.\nImplemented a scoring and weighting mechanism to calculate aggregated risk scores and classify customers into Critical, Warning, Medium Risk, and Low Risk categories.\nDeveloped analytics dashboards using Next.js (frontend), FastAPI (backend), and PostgreSQL (database) to visualize risk indicators and monitoring results.\nEnsured data accuracy, traceability, and audit readiness through QA validation of datasets, APIs, and system workflows.",
      },
      {
        company: "Husky CNOOC Madura Limited",
        role: "Fullstack Developer & Data Analyst — Human Resource & GA",
        location: "Jakarta, Indonesia",
        period_start: "Feb 2025",
        period_end: "Present",
        description:
          "Designed and implemented the Knowledge Management System, from Figma mockups to PowerApps and SharePoint.\nDeveloped automated termination forms, reducing manual calculation errors and improving processing efficiency.\nDesigned Power BI dashboards: Training Record, New Hiring Report, Application Utilization, Office Space Mapping, Budget Reporting.\nLed Power BI adoption, enhancing data-driven decision-making and reporting efficiency.",
      },
      {
        company: "PT. Pertamina Hulu Energi",
        role: "Data Analyst — Human Capital Information System",
        location: "Jakarta, Indonesia",
        period_start: "Nov 2023",
        period_end: "Oct 2024",
        description:
          "Developed Power BI visualizations to analyze contract worker data, improving workforce insights.\nConducted QA testing for internal applications, identifying and resolving performance bottlenecks.\nAutomated HR document processing using Excel Macro VBA, reducing manual workload.\nManaged HR data using SAP 100 & 180, ensuring accuracy in employee records and payroll tracking.",
      },
      {
        company: "PT. Lintas Media Danawa",
        role: "AI Engineer Intern",
        location: "Jakarta, Indonesia",
        period_start: "Sep 2023",
        period_end: "Oct 2023",
        description:
          "Developed an auto-learning chatbot using Python, enhancing customer support efficiency.\nImplemented machine learning models to improve chatbot accuracy and responsiveness.",
      },
    ];
    for (let i = 0; i < experiences.length; i++) {
      const e = experiences[i];
      await client.query(
        `INSERT INTO experiences (company, role, location, period_start, period_end, description, sort_order)
         VALUES ($1,$2,$3,$4,$5,$6,$7)`,
        [e.company, e.role, e.location, e.period_start, e.period_end, e.description, i]
      );
    }

    const skills = [
      { category: "Programming & Development", items: "C#, HTML, CSS, JavaScript, Python, React, Vue.js, Angular, Next.js, Node.js, Laravel, Django, Flask, Express.js, PowerApps, Power Automate, SharePoint" },
      { category: "Databases", items: "MySQL, PostgreSQL, SQL Server, SQLite, MongoDB" },
      { category: "Data Analysis & Automation", items: "Power BI, Power Query, Excel, Looker, Metabase, Plotly, Matplotlib, Altair, Excel VBA, API Integration" },
      { category: "Machine Learning & Data Science", items: "Pandas, NumPy, Scikit-learn, XGBoost, LightGBM, CatBoost, TensorFlow, Keras, PyTorch, Transformers, SpaCy, NLTK, Streamlit, FastAPI, MLflow" },
      { category: "UI/UX & Business Process", items: "Figma, Microsoft Visio, Canva, SOPs, Functional Specifications, User Manuals" },
      { category: "Accounting & Financial Analytics", items: "Financial Statement Analysis, Financial Ratio Analysis, Credit Risk & Banking Context" },
    ];
    for (let i = 0; i < skills.length; i++) {
      const s = skills[i];
      await client.query(
        `INSERT INTO skills (category, items, sort_order) VALUES ($1,$2,$3)`,
        [s.category, s.items, i]
      );
    }

    await client.query(
      `INSERT INTO education (school, degree, location, period_start, period_end, meta, sort_order)
       VALUES ($1,$2,$3,$4,$5,$6,$7)`,
      ["Gunadarma University", "Bachelor of Computer Science", "Indonesia", "", "", "GPA 3.37 / 4.00", 0]
    );
    await client.query(
      `INSERT INTO education (school, degree, location, period_start, period_end, meta, sort_order)
       VALUES ($1,$2,$3,$4,$5,$6,$7)`,
      ["SMA Negeri 9 Kota Bogor", "Mathematics and Natural Sciences (MIPA)", "Bogor City, Indonesia", "Jul 2016", "Jul 2019", "", 1]
    );

    const projects = [
      { title: "Early Warning IT System & Risk Analytics Platform", description: "End-to-end banking risk monitoring platform: scoring, weighting, and classification of customers into Critical/Warning/Medium/Low risk.", tags: "Next.js, FastAPI, PostgreSQL" },
      { title: "CIF-based Customer & Related Party Data Integration System", description: "Integration system unifying customer and related-party data around a single CIF identifier.", tags: "Data Integration, Banking" },
      { title: "Web-based Analytics Dashboard", description: "Analytics dashboard visualizing risk indicators and monitoring results in real time.", tags: "Next.js, FastAPI, PostgreSQL" },
      { title: "Enterprise Knowledge Management System", description: "Platform built from Figma mockups to PowerApps and SharePoint for company-wide document and training access.", tags: "PowerApps, SharePoint, Figma" },
      { title: "HR Analytics & Process Automation Systems", description: "Suite of Power BI dashboards and automated forms for training, hiring, budget, and office-space tracking.", tags: "Power BI, Automation" },
    ];
    for (let i = 0; i < projects.length; i++) {
      const p = projects[i];
      await client.query(
        `INSERT INTO projects (title, description, tags, sort_order) VALUES ($1,$2,$3,$4)`,
        [p.title, p.description, p.tags, i]
      );
    }

    const certificates = [
      { title: "Desktop-Based Programming Fundamentals", category: "Programming & Software Development" },
      { title: "Building Websites Using HTML5", category: "Programming & Software Development" },
      { title: "Visual Basic.NET for Beginners", category: "Programming & Software Development" },
      { title: "Visual Basic.NET for Intermediate", category: "Programming & Software Development" },
      { title: "Introduction to C/SIDE", category: "Programming & Software Development" },
      { title: "Programming in Microsoft Dynamics NAV", category: "Programming & Software Development" },
      { title: "Data Science Course", category: "Data Science & Machine Learning" },
      { title: "Microsoft Dynamics NAV for Beginners", category: "Data Science & Machine Learning" },
      { title: "Data Analytics for HR", category: "Data Science & Machine Learning" },
    ];
    for (let i = 0; i < certificates.length; i++) {
      const c = certificates[i];
      await client.query(
        `INSERT INTO certificates (title, category, sort_order) VALUES ($1,$2,$3)`,
        [c.title, c.category, i]
      );
    }

    await client.query("COMMIT");
    console.log("Seed selesai ✅");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Seed gagal:", err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
