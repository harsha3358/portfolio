export const personal = {
  name: "Nakkala Harshavardhan Reddy",
  shortName: "Harshavardhan",
  displayName: "Harshavardhan Reddy",
  role: "AI Engineer & Full-Stack Developer",
  tagline: "I build systems that learn, reason, and ship.",
  location: "India",
  email: "harshavardhan414212@gmail.com",
  phone: "+91-9908234531",
  github: "https://github.com/harsha3358",
  linkedin: "https://linkedin.com/in/harsha3358",
  bio: "Perpetual learner who believes in staying ahead of the curve. I work across the AI/ML stack — from LSTM and BERT pipelines to LangChain agents and RAG systems — and pair that with backend engineering (FastAPI, Kafka, AWS) to take models from notebook to production. Currently building Truxlo, an AI-powered logistics platform, and exploring generative AI for healthcare.",
};

export const profileCode = `class HarshavardhanaReddy:
    def __init__(self):
        self.username = "harsha3358"
        self.role = "AI Engineer | Data Specialist | UI Developer"
        self.education = "B.Tech CSE AI&DE @ Lovely Professional University"
        self.location = "India 🇮🇳"
        self.certifications = ["Microsoft Azure Data Fundamentals", "Software Engineering"]

    def current_focus(self):
        return {
            "learning": ["Generative AI", "Advanced Data Visualization", "Flutter"],
            "working_on": ["Truxlo SaaS", "Hospital AI Systems", "Interactive Dashboards"],
            "collaborating": "Open to innovative AI/Data projects",
            "fun_fact": "I automate everything... except my coffee breaks ☕"
        }

    def tech_stack(self):
        return {
            "languages": ["Python", "Java", "Dart", "SQL"],
            "ai_ml": ["TensorFlow", "scikit-learn", "NLP", "Generative AI"],
            "frontend": ["HTML5", "CSS3", "JavaScript", "Flutter"],
            "databases": ["MySQL", "Supabase"],
            "cloud": ["Azure", "AWS"],
            "tools": ["Power BI", "Pandas", "Matplotlib", "GitHub Actions"]
        }`;

export const profileOutput = `>>> me = HarshavardhanaReddy()
>>> me.current_focus()
{
    "learning": ["Generative AI", "Advanced Data Visualization", "Flutter"],
    "working_on": ["Truxlo SaaS", "Hospital AI Systems", "Interactive Dashboards"],
    "collaborating": "Open to innovative AI/Data projects",
    "fun_fact": "I automate everything... except my coffee breaks ☕"
}
>>> me.tech_stack()
{
    "languages": ["Python", "Java", "Dart", "SQL"],
    "ai_ml": ["TensorFlow", "scikit-learn", "NLP", "Generative AI"],
    "frontend": ["HTML5", "CSS3", "JavaScript", "Flutter"],
    "databases": ["MySQL", "Supabase"],
    "cloud": ["Azure", "AWS"],
    "tools": ["Power BI", "Pandas", "Matplotlib", "GitHub Actions"]
}`;

export const profileForHumans = [
  "I'm Harshavardhan Reddy — online as harsha3358 — an AI Engineer, Data Specialist, and UI Developer from India.",
  "Studying Computer Science (AI & Data Engineering) at Lovely Professional University, with certifications in Azure Data Fundamentals and Software Engineering.",
  "Right now: learning Generative AI, advanced data visualization, and Flutter — while building Truxlo (a logistics platform), AI tools for hospitals, and interactive dashboards.",
  "Open to interesting AI or data collaborations. And yes — I automate almost everything, except my coffee breaks ☕",
];

export const skills = [
  {
    category: "Languages",
    items: ["Python", "Java", "SQL"],
  },
  {
    category: "Machine Learning & AI",
    items: [
      "Machine Learning",
      "Deep Learning",
      "NLP",
      "LSTM",
      "BERT",
      "Seq2Seq",
      "XGBoost",
      "Scikit-Learn",
      "Predictive Analytics",
    ],
  },
  {
    category: "Generative AI",
    items: ["LLMs", "RAG", "Prompt Engineering", "LangChain", "Hugging Face", "AI Agents"],
  },
  {
    category: "Backend & APIs",
    items: ["FastAPI", "REST APIs", "Microservices", "API Development"],
  },
  {
    category: "Cloud & Data Engineering",
    items: ["AWS (EC2, Lambda, S3)", "PySpark", "Kafka", "ETL Pipelines"],
  },
  {
    category: "Databases",
    items: ["PostgreSQL", "MongoDB", "MySQL", "Supabase"],
  },
  {
    category: "Tools & Platforms",
    items: ["Git/GitHub", "Docker", "Power BI", "Jupyter", "Linux", "Postman"],
  },
];

export const experience = [
  {
    company: "Futurense Technologies",
    role: "AI & Data Engineering Intern",
    period: "Jun 2025 — Aug 2025",
    points: [
      "Worked on AI and machine learning workflows involving preprocessing, predictive analytics, and model evaluation using Python.",
      "Built scalable data pipelines and automation workflows, improving processing efficiency by 30%.",
      "Developed analytical dashboards, backend integrations, and visualization systems for real-time insights.",
    ],
  },
];

export const projects = [
  {
    title: "Truxlo — AI Logistics Platform",
    period: "Mar 2026",
    tags: ["FastAPI", "LLMs", "Kafka", "AWS", "Flutter", "Supabase"],
    description:
      "Architected scalable backend infrastructure for real-time logistics management and intelligent route optimization, with a live vehicle-tracking mobile app on top.",
    points: [
      "Built AI-powered demand forecasting workflows, cutting transit inefficiencies and improving operational efficiency by 30%.",
      "Developed REST APIs and backend services for load matching, route allocation, and logistics automation.",
      "Shipped secure live GPS tracking with encrypted data and interactive fleet dashboards, improving fleet management efficiency by 40%.",
    ],
    link: "https://github.com/harsha3358",
    featured: true,
  },
  {
    title: "Medical Report Summarization & Clinical NER",
    period: "Nov 2025",
    tags: ["BERT", "NLP", "Seq2Seq LSTM", "FastAPI"],
    description:
      "An NLP pipeline that reads raw medical reports and returns structured summaries plus extracted clinical entities.",
    points: [
      "Engineered a Seq2Seq LSTM + BERT pipeline for medical text summarization and clinical entity extraction.",
      "Achieved a ROUGE-L score of 0.41 while improving contextual understanding of healthcare reports.",
      "Exposed the pipeline through API-driven workflows for scalable, real-time report processing.",
    ],
    link: "https://github.com/harsha3358/Medical_Report_Summarizer_with_Clinical_NER",
    featured: true,
  },
  {
    title: "GenAI for Hospitals",
    period: "2025",
    tags: ["Python", "NLP", "Generative AI"],
    description:
      "Privacy-first, NLP-powered medical report automation system for hospital documentation workflows.",
    points: [
      "Automated hospital report generation and structuring, reducing documentation time by 60%.",
      "Designed the pipeline around privacy-first handling of sensitive clinical data.",
    ],
    link: "https://github.com/harsha3358/Hospital_gen_ai",
    featured: true,
  },
  {
    title: "Brain Tumor MRI Classification",
    period: "Sep 2025",
    tags: ["CNN", "Deep Learning", "TensorFlow"],
    description:
      "A CNN-based deep learning model for multi-class MRI image classification.",
    points: [
      "Built a CNN model for multi-class brain tumor MRI classification using TensorFlow and Python.",
      "Applied image preprocessing, augmentation, and feature extraction to improve generalization and accuracy.",
      "Evaluated performance using accuracy, precision, recall, F1-score, and confusion matrices.",
    ],
    link: "https://github.com/harsha3358",
    featured: false,
  },
  {
    title: "Aura — Personal OS for Builders",
    period: "2025",
    tags: ["Python", "AI Agents", "Reasoning"],
    description:
      "A personal operating system for builders, built around contextual decision intelligence and an adaptive reasoning architecture.",
    points: [
      "Designed an adaptive understanding and reasoning layer to support contextual day-to-day decisions.",
      "Explored agentic patterns for a system that reasons over personal context rather than static rules.",
    ],
    link: "https://github.com/harsha3358/Aura",
    featured: false,
  },
  {
    title: "AutoRubric",
    period: "2025",
    tags: ["LLMs", "Prompt Engineering"],
    description:
      "Prompt → Score → Feedback → Insights: an LLM pipeline that grades submissions against a rubric and surfaces actionable feedback.",
    points: [
      "Built a scoring pipeline that turns a prompt and rubric into structured feedback and insights.",
    ],
    link: "https://github.com/harsha3358/autorubric_aii",
    featured: false,
  },
  {
    title: "Image/Video Generation Pipeline",
    period: "2025",
    tags: ["Python", "Generative AI"],
    description:
      "Image/Video → Prompt → Generate → Animate → Deliver — an end-to-end generative media pipeline.",
    points: [
      "Chained prompt-driven generation and animation steps into a single deliverable pipeline.",
    ],
    link: "https://github.com/harsha3358/Image-Video-generation-",
    featured: false,
  },
];

export const certifications = [
  { name: "Microsoft Certified: Azure Data Fundamentals", issuer: "Microsoft", date: "Dec 2024" },
  { name: "Supervised Machine Learning: Regression and Classification", issuer: "Coursera", date: "Aug 2024" },
  { name: "Generative AI and LLMs", issuer: "Course", date: "Aug 2025" },
];

export const education = [
  {
    school: "Lovely Professional University",
    location: "Phagwara, Punjab",
    degree: "B.Tech, Computer Science & Engineering (AI & DE) — CGPA 7.47",
    period: "Aug 2023 — Present",
  },
  {
    school: "Sri Chaitanya Junior College",
    location: "Tirupati, Andhra Pradesh",
    degree: "Intermediate, MPC — 90%",
    period: "Apr 2021 — Mar 2023",
  },
  {
    school: "Narayana School",
    location: "Tirupati, Andhra Pradesh",
    degree: "Matriculation — 99%",
    period: "Apr 2020 — Mar 2021",
  },
];

export const stats = [
  { label: "GitHub Repositories", value: "42" },
  { label: "Stars Earned", value: "41" },
  { label: "Contributions This Year", value: "368" },
  { label: "Efficiency Gains Delivered", value: "30%+" },
];
