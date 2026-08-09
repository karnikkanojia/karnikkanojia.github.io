import { BrainIcon, DatabaseIcon, HospitalIcon } from "lucide-react"

import type { ExperienceItemType } from "@/components/work-experience"

export const WORK_EXPERIENCES: ExperienceItemType[] = [
  {
    id: "oracle",
    companyName: "Oracle Financial Services Software",
    companyLogo: "/logos/work/oracle.jpg",
    companyWebsite: "https://www.oracle.com/financial-services/",
    isCurrentEmployer: true,
    positions: [
      {
        id: "oracle-site-reliability-engineer",
        title: "Site Reliability Engineer",
        icon: <DatabaseIcon />,
        employmentType: "Full-time",
        employmentPeriod: { start: "08.2024" },
        isExpanded: true,
        description: `- Engineered a centralized monitoring and logging system for multi-tenant banking platforms, reducing incident resolution time by approximately 25% and improving uptime reliability to 99.9%.
- Implemented an automated custom change data capture system that synchronized every environment, cutting data-sync errors by approximately 40% and eliminating roughly 10 hours of weekly intervention.
- Integrated proactive alerting mechanisms for SaaSOps, enhancing operational awareness and incident response.
- Contributed to interactive dashboards that correlated customer incidents with key metrics and enhanced observability.`,
        skills: ["Python", "SQL", "CDC", "SaaSOps", "Observability"],
      },
    ],
  },
  {
    id: "mi4people",
    companyName: "Mi4People",
    companyLogo: "/logos/work/mi4people.jpg",
    companyWebsite: "https://www.mi4people.org/",
    positions: [
      {
        id: "mi4people-data-scientist",
        title: "Data Scientist",
        icon: <HospitalIcon />,
        employmentPeriod: { start: "12.2022", end: "06.2024" },
        isExpanded: true,
        description: `- Spearheaded development of an open-source computer-vision system for disease detection from diverse medical images, improving access to AI-based diagnostic tools for healthcare professionals globally.
- Built and optimized DenseNet121-based CNN pipelines with transfer learning, data augmentation, and systematic error analysis, achieving a 0.88 AUC and reducing false positives.
- Containerized training workflows, automated experiments, and deployed inference services through Azure ML to support reproducible, scalable research.`,
        skills: ["Python", "DenseNet121", "CNNs", "Azure ML", "Docker"],
      },
    ],
  },
  {
    id: "samsung-rd-institute-india",
    companyName: "Samsung Research Institute of India",
    companyLogo: "/logos/work/samsung-rd-india.jpg",
    companyWebsite: "https://research.samsung.com/",
    positions: [
      {
        id: "samsung-research-intern",
        title: "Research Intern",
        icon: <BrainIcon />,
        employmentType: "Full-time",
        employmentPeriod: { start: "12.2022", end: "08.2023" },
        description: `- Built a CTC-based predictive-modeling pipeline with contextual feature alignment for accurate character-sequence decoding in Indic handwritten scripts.
- Applied affine and elastic transformations plus contrast-brightness augmentation to improve model robustness and reduce error rates by approximately 12 to 15%.
- Evaluated on the IIIT-INDIC-HW-WORDS dataset across 872k samples and eight scripts, achieving approximately 85% sequence accuracy and presenting results to the research team.`,
        skills: ["CTC", "Deep Learning", "OCR", "Data Augmentation"],
      },
    ],
  },
  {
    id: "national-university-of-singapore",
    companyName: "National University of Singapore",
    companyLogo: "/logos/work/nus.jpg",
    companyWebsite: "https://www.nus.edu.sg/",
    positions: [
      {
        id: "nus-research-intern",
        title: "Research Intern",
        icon: <BrainIcon />,
        employmentType: "Internship",
        employmentPeriod: { start: "12.2022", end: "05.2023" },
        description: `- Conducted research on stock-market manipulation detection using deep-learning techniques, including LSTM with Dynamic Thresholding and TadGAN, across multiple stock datasets.
- Achieved the highest F1 score of 0.76 on selected datasets, providing insights on model selection and precision-recall trade-offs.
- Collaborated with a remote, faculty-supervised research team; authored and defended a research paper while maintaining rigorous documentation and reproducible experiments.`,
        skills: ["LSTM", "TadGAN", "Deep Learning", "Research"],
      },
    ],
  },
]
