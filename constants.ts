import { EducationItem, ExperienceItem, PublicationItem, ServiceItem, SkillCategory, TeachingItem, NewsItem } from './types';

export const PERSONAL_INFO = {
  name: "Yiqian Zhang",
  title: "Ph.D. Student in Biostatistics",
  email: "zhang.16383@osu.edu",
  phone: "+1 (217) 200-1608",
  location: "Columbus, OH / Champaign, IL",
  summary: "Aspiring Biostatistician with a strong foundation in Mathematics and Statistics. Specializing in microbiome data analysis, compositional data transformation, and network dynamics. Experienced in developing novel statistical frameworks and computational models.",
  socials: {
    linkedin: "https://www.linkedin.com/in/yiqianzhang1004/",
    googleScholar: "https://scholar.google.com/citations?user=681-YaUAAAAJ&hl=en",
    orcid: "https://orcid.org/0009-0004-0296-912X"
  }
};

export const NEWS: NewsItem[] = [
  {
    date: "March 15, 2026",
    title: "ENAR 2026 Spring Meeting Presentation",
    content: "I will be presenting my latest research at the ENAR 2026 Spring Meeting. Please stop by during the Sunday evening Opening Mixer and Poster Session on March 15. I welcome the opportunity to discuss my work and potential collaborations! Feel free to get in touch beforehand."
  }
];

export const EDUCATION: EducationItem[] = [
  {
    institution: "The Ohio State University",
    degree: "Ph.D. in Biostatistics",
    duration: "Aug 2025 – May 2030",
    details: [
      "Honors & Awards: University Fellowship, ENGIE-Axium Incentive Recruitment Scholarship Award, Gary G. Koch and Family Graduate Student Travel Award."
    ]
  },
  {
    institution: "University of Illinois Urbana-Champaign",
    degree: "B.S. in Statistics and Double Major in Mathematics (Applied Mathematics Concentration)",
    duration: "Sep 2021 – May 2025",
    gpa: "3.91/4.00",
    details: [
      "Honors & Awards: Highest Distinction in Statistics; High Distinction in Mathematics",
      "Dean’s List: Spring 2022, Spring 2023, Spring 2024, Fall 2024",
      "Hoover Mathematical Scholar Award"
    ]
  }
];

export const PUBLICATIONS: PublicationItem[] = [
  {
    authors: "Z. Zhu, Y. Zhang, W. Li, M. Greenacre, S. Saha, Y. Shi, and L. Zhang",
    title: "Mathematical Foundations of Beta Diversity: Why Common Metrics Fail in Microbiome Analysis",
    journal: "Journal of Statistical Theory and Applications, vol. 25, issue 1, pp. 9",
    year: "2026",
    doi: "10.1007/s44199-025-00154-7",
    status: "published"
  },
  {
    authors: "Z. Zhu, Y. Zhang, S. Lin, and L. Zhang",
    title: "DeSHAPE: Decomposing Ecological Structure through Heterogeneity, Asymmetry and Pattern Evaluation of α-Diversity",
    journal: "Bioinformatics",
    year: "2026",
    status: "submitted"
  },
  {
    authors: "Z. Zhu, Y. Zhang, R. Liu, W. Li, Z. Huang, X. Chen, Y. Duan, and L. Zhang*",
    title: "Koinetic: A Graph-based Distance as a New Ecological Metric for Microbial Community Differential Analysis",
    journal: "Briefings in Bioinformatics",
    year: "2025",
    status: "under revision"
  },
  {
    authors: "Y. Zhang, J. Schluter, L. Zhang, X. Cao, R. R. Jenq, H. Feng, J. Haines, and L. Zhang",
    title: "Review and Revamp of Compositional Data Transformation: A New Framework Combining Proportion Conversion and Contrast Transformation",
    journal: "Computational and Structural Biotechnology Journal, vol. 23, pp. 4088–4107",
    year: "2024",
    doi: "10.1016/j.csbj.2024.11.003",
    status: "published"
  }
];

export const RESEARCH_EXPERIENCE: ExperienceItem[] = [
  {
    title: "Comprehensive Review and Methodological Advancement in Beta Diversity Measures",
    institution: "Case Western Reserve University",
    advisors: "Dr. Zihan Zhu",
    duration: "Sep 2024 – Sep 2025",
    description: [
      { label: "Project Focus", content: "Conducted a comprehensive review of dissimilarity measures and their mathematical properties (e.g., conditional negative definiteness) and evaluated their empirical performance across diverse real-world datasets." },
      { label: "Methodology", content: "Systematically evaluated existing dissimilarity measures to determine which ones truly satisfy conditional negative definiteness. Employed PCoA, PERMANOVA, miRKat and rigorous simulation frameworks for thorough method validation." },
      { label: "Innovation", content: "First systematically reviewed the mathematical properties of dissimilarity measures and evaluated their consequence in downstream analysis. Proposed remedial strategies for dissimilarity measures without ideal mathematical properties." },
      { label: "Outcome", content: "Currently preparing a manuscript for submission to a peer-reviewed journal aimed at providing practitioners with methodological insights and enhanced tools for beta diversity analysis." }
    ]
  },
  {
    title: "Microbiome Analysis for Alzheimer’s Disease Pilot Study",
    institution: "Case Western Reserve University",
    advisors: "Prof. Liangliang Zhang and Prof. Lijun Zhang",
    duration: "May 2024 – Oct 2024",
    link: "https://yiqianzhang.com/hpc_tutorial/",
    description: [
      { label: "Project Focus", content: "Investigated the role of the microbiome in Alzheimer’s Disease-like phenotypes as part of the Jax.IU.Pitt Microbiome Pilot Study to identify microbiome-related factors contributing to Late Onset Alzheimer’s Disease." },
      { label: "Methodology", content: "Utilized QIIME 2 for microbiome data analysis, including quality control, taxonomic classification, and diversity analysis. Implemented advanced data transformation techniques to improve differential testing accuracy." },
      { label: "Analysis", content: "Conducted alpha and beta diversity analyses, creating interactive visualizations to present microbial community structures. Used statistical methods to evaluate changes in diversity metrics and the impact of metadata features." }
    ]
  },
  {
    title: "Review and Revamp of Microbiome Compositional Data Transformation",
    institution: "Case Western Reserve University",
    advisors: "Prof. Liangliang Zhang",
    duration: "Nov 2023 – Dec 2024",
    description: [
      { label: "Overview", content: "Conducted a systematic review on compositional data transformations focusing on strengths and limitations of existing techniques in microbiome data analysis." },
      { label: "Innovation", content: "Developed a novel framework combining proportion conversion with contrast transformations (CCT Framework) to enhance data handling in high zero-inflation microbiome datasets." },
      { label: "Methods Proposed", content: "Proposed two new transformation methods, Centered Arcsine Contrast and Additive Arcsine Contrast, demonstrating improved performance in stabilizing variance and mitigating outlier influence." },
      { label: "Dual-Group Framework", content: "Proposed a dual-group conversion framework for proportional data, specifically beneficial for two-sample testing, enhancing the power to detect differential abundance." }
    ]
  },
  {
    title: "Build Computational Models of MDD and Bipolar Disorder",
    institution: "Carle Health / UIUC",
    advisors: "Dr. Brandon Brown and Prof. Xinzhu Yu",
    duration: "Jan 2024 – Aug 2024",
    description: [
      { label: "Modeling", content: "Created computational models that mimic mood fluctuations, specifically simulating Major Depressive Disorder (MDD) and Bipolar Disorder (BD)." },
      { label: "Techniques", content: "Utilized Markov chain and Hidden Markov Models to portray mood states (normal, depressive, manic) and transitions influenced by internal/external factors." },
      { label: "Analysis", content: "Conducted in-depth statistical examination to assess prevalence and trends, mirroring actual epidemiological data." }
    ]
  },
  {
    title: "Develop Network Dynamics Analysis Using Preferential Attachment Models",
    institution: "UIUC",
    advisors: "Prof. Yuguo Chen and Prof. Yuexi Wang",
    duration: "Jan 2024 – May 2024",
    description: [
      { label: "Development", content: "Developed and simulated Preferential Attachment models to study network evolution, focusing on the “rich-get-richer” dynamic." },
      { label: "Implementation", content: "Implemented simulations in Python using NetworkX for network generation and Matplotlib for visualization." },
      { label: "Inference", content: "Applied Bayesian inference and Markov Chain Monte Carlo methods to estimate model parameters." }
    ]
  },
  {
    title: "Rail Transportation and Engineering Center (RailTEC)",
    institution: "UIUC",
    advisors: "Prof. Christopher P. L. Barkan",
    duration: "Oct 2023 – Aug 2024",
    description: [
      { label: "Optimization", content: "Developed and implemented a Python script to automate the weekly Tank Car Report, enhancing team efficiency by 96%." },
      { label: "Data Analysis", content: "Utilized Python for data management and analysis of the 25GB+ “CarList2022” dataset integrated with the “FRA” dataset." }
    ]
  },
  {
    title: "Analyze War Data in Ukraine",
    institution: "UIUC",
    advisors: "Prof. Richard B. Sowers",
    duration: "May 2023 – Jul 2023",
    link: "https://gitlab.engr.illinois.edu/r-sowers/ukraine-data",
    description: [
      { label: "Pipeline", content: "Created a data analysis pipeline in Jupyter Notebooks (Python, pandas, folium, MongoDB) to process and visualize Armed Conflict Location and Event Data." },
      { label: "Visualization", content: "Constructed choropleth maps, heatmaps, and time series animations to identify patterns and spatial-temporal dynamics." }
    ]
  }
];

export const SERVICE: ServiceItem[] = [
  {
    role: "Peer Reviewer",
    organization: "Heliyon (Cell Press)",
    duration: "2024 – 2025",
    details: ["Completed four manuscript reviews in biostatistics/microbiome methods."]
  },
  {
    role: "Treasurer",
    organization: "Statistics & Biostatistics Graduate Student Association (BSGSA), OSU",
    duration: "Aug 2025 – Present",
    details: ["Manage organization finances, reimbursements, and event budgets; serve as banking liaison; coordinate student programming."]
  }
];

export const TEACHING: TeachingItem[] = [
  { role: "Teaching Assistant", course: "Applied Bayesian Analysis (STAT 431)", period: "Jan 2025 – May 2025", institution: "UIUC" },
  { role: "Teaching Assistant", course: "Statistical Modeling I (STAT 425)", period: "Aug 2024 – May 2025", institution: "UIUC" },
  { role: "Teaching Assistant", course: "Statistics Programming Methods (STAT 385)", period: "Aug 2024 – Dec 2024", institution: "UIUC" },
  { role: "Teaching Assistant", course: "College Algebra (MATH 112)", period: "Aug 2023 – May 2025", institution: "UIUC" },
  { role: "Tutor", course: "Calculus & Calculus I (MATH 220 & 221)", period: "Aug 2023 – Dec 2023", institution: "UIUC" }
];

export const SKILLS: SkillCategory[] = [
  { category: "Languages", skills: ["English (Advanced)", "Mandarin Chinese (Native)"] },
  { category: "Technical Skills", skills: ["Python", "R", "SQL", "Java", "C++", "SAS", "Tableau", "DESeq2", "Kraken 2", "QIIME 2", "Git", "Docker", "MongoDB", "HPC", "LaTeX"] },
  { category: "Professional Competence", skills: ["Machine Learning", "Data Mining", "Data Visualization", "Linear Algebra", "Calculus", "Probability", "Statistics", "Web Scraping", "GIS", "Database Management"] }
];

export const CHART_DATA = [
  { subject: 'Machine Learning', A: 90, fullMark: 100 },
  { subject: 'Statistics', A: 98, fullMark: 100 },
  { subject: 'Data Mining', A: 85, fullMark: 100 },
  { subject: 'Visualization', A: 90, fullMark: 100 },
  { subject: 'Algorithms', A: 80, fullMark: 100 },
  { subject: 'Biostatistics', A: 95, fullMark: 100 },
];