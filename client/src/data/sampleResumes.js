/**
 * Comprehensive collection of ready-made profession resumes across diverse industries.
 */

export const SAMPLE_RESUMES = [
  // 1. HEALTHCARE & MEDICAL
  {
    id: 'registered-nurse',
    category: 'Healthcare & Medical',
    role: 'Registered Nurse (RN)',
    templateId: 'contemporary',
    themeColor: '#0d9488',
    data: {
      title: 'Registered Nurse Resume Example',
      personalInfo: {
        fullName: 'Jessica Long, RN',
        email: 'jessica.long@nursingnet.org',
        phone: '+1 (555) 345-6789',
        location: 'Philadelphia, PA',
        linkedin: 'linkedin.com/in/jessicalong-rn',
        website: '',
      },
      summary: 'Compassionate and detail-oriented Registered Nurse with 5+ years of clinical experience in acute care, emergency medicine, and patient advocacy. Adept at coordinating multi-disciplinary care teams and maintaining high patient satisfaction scores.',
      experience: [
        {
          company: 'Hospital of University of Pennsylvania',
          title: 'Registered Nurse — Medical Surgical Unit',
          location: 'Philadelphia, PA',
          startDate: '2021-06',
          endDate: 'Present',
          current: true,
          bullets: [
            'Administered medications, IV therapies, and diagnostic tests for 6-8 acute care patients per shift.',
            'Collaborated with attending physicians and physical therapists to formulate individualized care plans.',
            'Maintained 100% compliance with HIPAA regulations and EHR documentation standards.'
          ]
        },
        {
          company: 'Mercy Health System',
          title: 'Staff Nurse',
          location: 'Philadelphia, PA',
          startDate: '2019-06',
          endDate: '2021-05',
          current: false,
          bullets: [
            'Provided direct patient care, triage, and post-operative monitoring in a 30-bed surgical unit.',
            'Educated patients and family members on post-discharge medication management and wound care.'
          ]
        }
      ],
      education: [
        {
          institution: 'Penn State University School of Nursing',
          degree: 'B.S. in Nursing (BSN)',
          startDate: '2015-09',
          endDate: '2019-05',
          gpa: '3.82'
        }
      ],
      skills: ['Acute Patient Care', 'EHR & Epic Systems', 'IV Therapy & Phlebotomy', 'Triage & Assessment', 'Patient Advocacy', 'BLS / ACLS Certified', 'Medication Administration'],
      projects: [
        {
          name: 'Patient Fall Reduction Protocol',
          description: 'Co-developed unit safety protocol that reduced inpatient fall rates by 25% over 12 months.',
          technologies: ['Clinical Quality', 'Patient Safety'],
          link: ''
        }
      ]
    }
  },

  // 2. EDUCATION & TEACHING
  {
    id: 'teacher-education',
    category: 'Education',
    role: 'High School Educator',
    templateId: 'oxford_serif',
    themeColor: '#7c3aed',
    data: {
      title: 'High School Teacher Resume Example',
      personalInfo: {
        fullName: 'Robert Sterling',
        email: 'r.sterling@edudistrict.org',
        phone: '+1 (555) 456-1234',
        location: 'Chicago, IL',
        linkedin: 'linkedin.com/in/robertsterling-edu',
        website: '',
      },
      summary: 'Dedicated High School English & Literature Educator with 7+ years of experience fostering student engagement, differentiated instruction, and standardized test preparation. Certified in AP Literature and Gifted Education.',
      experience: [
        {
          company: 'Lincoln Park High School',
          title: 'Lead English Department Educator',
          location: 'Chicago, IL',
          startDate: '2019-08',
          endDate: 'Present',
          current: true,
          bullets: [
            'Designed and implemented interactive AP Literature curriculum for 120+ students, achieving an 88% AP exam pass rate.',
            'Integrated digital learning tools (Google Classroom, Kahoot) to increase student classroom participation by 30%.',
            'Chaired the student debate club and led the team to state-level championship finals.'
          ]
        }
      ],
      education: [
        {
          institution: 'Northwestern University',
          degree: 'M.Ed. in Secondary Education',
          startDate: '2017-09',
          endDate: '2019-06',
          gpa: '3.90'
        }
      ],
      skills: ['Curriculum Design', 'Differentiated Instruction', 'AP Literature Certified', 'Classroom Management', 'Student Mentorship', 'Educational Technology', 'Parent Communication'],
      projects: [
        {
          name: 'Digital Literacy Initiative',
          description: 'Organized school-wide media literacy workshop series reaching 800+ students.',
          technologies: ['Pedagogy', 'EdTech'],
          link: ''
        }
      ]
    }
  },

  // 3. FINANCE & ACCOUNTING
  {
    id: 'financial-analyst',
    category: 'Finance & Accounting',
    role: 'Senior Financial Analyst',
    templateId: 'harvard_ats',
    themeColor: '#1e3a8a',
    data: {
      title: 'Financial Analyst Resume Example',
      personalInfo: {
        fullName: 'Hiroto Nakamura',
        email: 'hiroto.nakamura@finadvisors.com',
        phone: '+1 (555) 890-1234',
        location: 'New York, NY',
        linkedin: 'linkedin.com/in/hiroto-nakamura',
        website: '',
      },
      summary: 'Analytically rigorous Financial Analyst with 6+ years of corporate FP&A, financial modeling, variance analysis, and M&A valuation experience. Adept at turning complex financial datasets into actionable executive insights.',
      experience: [
        {
          company: 'JPMorgan Chase & Co.',
          title: 'Senior Financial Analyst — Corporate FP&A',
          location: 'New York, NY',
          startDate: '2021-02',
          endDate: 'Present',
          current: true,
          bullets: [
            'Constructed 3-statement dynamic financial models forecasting $450M annual operating budget across 5 business units.',
            'Streamlined quarterly variance reporting using SQL and Tableau, cutting reporting turnaround time from 5 days to 6 hours.',
            'Evaluated strategic acquisition targets and presented DCF valuation models directly to C-suite executives.'
          ]
        }
      ],
      education: [
        {
          institution: 'NYU Stern School of Business',
          degree: 'B.S. in Finance & Economics',
          startDate: '2014-09',
          endDate: '2018-05',
          gpa: '3.86'
        }
      ],
      skills: ['Financial Modeling (DCF, LBO)', 'FP&A & Budgeting', 'SQL & Tableau', 'Excel (VBA / Macros)', 'Variance Analysis', 'Corporate Valuation', 'Bloomberg Terminal'],
      projects: [
        {
          name: 'Automated Budget Forecasting Engine',
          description: 'Developed Python-based forecasting pipeline integrating SAP ERP data.',
          technologies: ['Python', 'SQL', 'Financial Modeling'],
          link: ''
        }
      ]
    }
  },

  // 4. SALES & BUSINESS DEVELOPMENT
  {
    id: 'b2b-sales-exec',
    category: 'Sales & Marketing',
    role: 'B2B Account Executive',
    templateId: 'contemporary',
    themeColor: '#2563eb',
    data: {
      title: 'Account Executive Resume Example',
      personalInfo: {
        fullName: 'Amanda Rodriguez',
        email: 'amanda.r@salesforce-rep.com',
        phone: '+1 (555) 678-9012',
        location: 'Atlanta, GA',
        linkedin: 'linkedin.com/in/amandarodriguez-sales',
        website: '',
      },
      summary: 'High-performing Enterprise B2B Sales Executive with 6+ years exceeding quota in SaaS solutions, account management, and strategic contract negotiations. Track record of generating over $4.2M in annual pipeline.',
      experience: [
        {
          company: 'CloudForce Systems',
          title: 'Senior Enterprise Account Executive',
          location: 'Atlanta, GA',
          startDate: '2021-04',
          endDate: 'Present',
          current: true,
          bullets: [
            'Achieved 134% of annual quota in FY2024, closing $2.1M ARR across mid-market enterprise accounts.',
            'Prospect, qualified, and managed end-to-end sales cycles for 40+ simultaneous opportunities using Salesforce CRM.',
            'Negotiated multi-year SLA contracts with Fortune 500 procurement teams, increasing average deal size by 28%.'
          ]
        }
      ],
      education: [
        {
          institution: 'University of Georgia',
          degree: 'B.B.A. in Marketing & Sales',
          startDate: '2014-09',
          endDate: '2018-05',
          gpa: '3.75'
        }
      ],
      skills: ['B2B SaaS Sales', 'Enterprise Account Management', 'Salesforce CRM', 'MEDDPICC Qualification', 'Contract Negotiation', 'Pipeline Management', 'Cold Outreach'],
      projects: [
        {
          name: 'Partner Channel Expansion',
          description: 'Built reseller partnership network resulting in $650k net-new ARR.',
          technologies: ['Partner Sales', 'GTM'],
          link: ''
        }
      ]
    }
  },

  // 5. MARKETING & CONTENT
  {
    id: 'marketing-manager',
    category: 'Sales & Marketing',
    role: 'Digital Marketing Manager',
    templateId: 'vanguard',
    themeColor: '#e11d48',
    data: {
      title: 'Digital Marketing Manager Resume Example',
      personalInfo: {
        fullName: 'Allison Rosenberg',
        email: 'allison.r@marketinggrowth.io',
        phone: '+1 (555) 234-8901',
        location: 'Miami, FL',
        linkedin: 'linkedin.com/in/allisonrosenberg-mktg',
        website: 'allisongrowth.com',
      },
      summary: 'Data-driven Digital Marketing Manager with 6+ years driving paid acquisition, SEO content strategy, and multi-channel campaign ROI. Managed $1.5M annual ad spend across Google, Meta, and LinkedIn Ads.',
      experience: [
        {
          company: 'GrowthScale Agency',
          title: 'Digital Marketing Lead',
          location: 'Miami, FL',
          startDate: '2020-09',
          endDate: 'Present',
          current: true,
          bullets: [
            'Managed $120k monthly performance ad spend, lowering customer acquisition cost (CAC) by 22% while scaling leads by 45%.',
            'Executed technical SEO audit and organic content strategy, boosting domain traffic from 50k to 300k monthly sessions.',
            'Built Hubspot email automation workflows nurturing 80,000+ subscriber leads with a 28% open rate.'
          ]
        }
      ],
      education: [
        {
          institution: 'University of Miami',
          degree: 'B.S. in Communications & Marketing',
          startDate: '2014-09',
          endDate: '2018-05',
          gpa: '3.78'
        }
      ],
      skills: ['Performance Marketing (Google/Meta Ads)', 'SEO & Ahrefs', 'Hubspot & Email Automation', 'Google Analytics 4', 'Conversion Rate Optimization (CRO)', 'Copywriting', 'Content Strategy'],
      projects: [
        {
          name: 'Viral SaaS Launch Campaign',
          description: 'Coordinated Product Hunt and social ad campaign generating 12,000 user signups in 48 hours.',
          technologies: ['Growth Marketing', 'Meta Ads'],
          link: ''
        }
      ]
    }
  },

  // 6. HUMAN RESOURCES & TALENT
  {
    id: 'hr-manager',
    category: 'HR & Operations',
    role: 'Human Resources Manager',
    templateId: 'metropolitan',
    themeColor: '#334155',
    data: {
      title: 'HR Manager Resume Example',
      personalInfo: {
        fullName: 'Rachel Sterling, SHRM-CP',
        email: 'rachel.sterling@hrpeople.com',
        phone: '+1 (555) 789-4561',
        location: 'Denver, CO',
        linkedin: 'linkedin.com/in/rachelsterling-hr',
        website: '',
      },
      summary: 'Strategic HR Business Partner and Talent Leader with 7+ years overseeing employee relations, talent acquisition, compensation/benefits, and DE&I initiatives. SHRM-CP certified with expertise in Workday and BambooHR.',
      experience: [
        {
          company: 'Peak Innovation Group',
          title: 'Human Resources Manager',
          location: 'Denver, CO',
          startDate: '2020-03',
          endDate: 'Present',
          current: true,
          bullets: [
            'Oversaw end-to-end HR operations for 350+ multi-state remote and hybrid employees.',
            'Redesigned employee onboarding program, reducing 90-day new hire turnover from 18% to 6%.',
            'Administered annual open enrollment, negotiating health benefits plans to save $140,000 in premium costs.'
          ]
        }
      ],
      education: [
        {
          institution: 'University of Colorado Boulder',
          degree: 'B.A. in Human Resources Management',
          startDate: '2013-09',
          endDate: '2017-05',
          gpa: '3.80'
        }
      ],
      skills: ['Employee Relations', 'Talent Acquisition', 'SHRM-CP Certified', 'Workday & BambooHR', 'Benefits Administration', 'Performance Reviews', 'HR Compliance'],
      projects: [
        {
          name: 'Remote Work Policy & Compensation Framework',
          description: 'Authored company-wide remote work guidelines and geographic pay scale benchmarking.',
          technologies: ['HR Policy', 'Comp & Benefits'],
          link: ''
        }
      ]
    }
  },

  // 7. OPERATIONS & LOGISTICS
  {
    id: 'operations-manager',
    category: 'HR & Operations',
    role: 'Supply Chain & Operations Manager',
    templateId: 'apex_leader',
    themeColor: '#1e3a8a',
    data: {
      title: 'Operations Manager Resume Example',
      personalInfo: {
        fullName: 'Mario Enfinger',
        email: 'mario.enfinger@logistics.net',
        phone: '+1 (555) 890-5678',
        location: 'Dallas, TX',
        linkedin: 'linkedin.com/in/mario-enfinger',
        website: '',
      },
      summary: 'Results-driven Operations & Supply Chain Leader with 8+ years optimizing warehouse logistics, inventory control, vendor management, and Lean Six Sigma process improvements across North American distribution hubs.',
      experience: [
        {
          company: 'Pinnacle Logistics Corp',
          title: 'Senior Operations Manager',
          location: 'Dallas, TX',
          startDate: '2019-10',
          endDate: 'Present',
          current: true,
          bullets: [
            'Directed daily operations of 150,000 sq ft distribution facility with a team of 60 warehouse staff.',
            'Implemented WMS automation system, increasing order fulfillment accuracy to 99.8% and throughput by 30%.',
            'Renegotiated regional freight carrier contracts, delivering $320,000 in annual transportation savings.'
          ]
        }
      ],
      education: [
        {
          institution: 'Texas A&M University',
          degree: 'B.S. in Supply Chain Management',
          startDate: '2011-09',
          endDate: '2015-05',
          gpa: '3.72'
        }
      ],
      skills: ['Supply Chain Optimization', 'Warehouse Management Systems (WMS)', 'Lean Six Sigma Green Belt', 'Inventory Control', 'Vendor Relations', 'Freight & Fleet Management', 'Safety (OSHA)'],
      projects: [
        {
          name: 'Zero-Waste Packaging Initiative',
          description: 'Led eco-friendly packaging transition reducing material costs by 15%.',
          technologies: ['Lean Manufacturing', 'Sustainability'],
          link: ''
        }
      ]
    }
  },

  // 8. HOSPITALITY & CULINARY
  {
    id: 'executive-chef',
    category: 'Hospitality & Trades',
    role: 'Executive Chef & Culinary Director',
    templateId: 'elegance',
    themeColor: '#d97706',
    data: {
      title: 'Executive Chef Resume Example',
      personalInfo: {
        fullName: 'Mike Kruse',
        email: 'mike.kruse@culinaryart.com',
        phone: '+1 (555) 432-1098',
        location: 'Indianapolis, IN',
        linkedin: 'linkedin.com/in/mikekruse-chef',
        website: '',
      },
      summary: 'Acclaimed Executive Chef with 10+ years leading high-volume fine dining kitchens, menu development, food cost controls, and staff mentorship. Dedicated to farm-to-table culinary excellence and ServSafe compliance.',
      experience: [
        {
          company: 'The Capital Grill',
          title: 'Executive Chef',
          location: 'Indianapolis, IN',
          startDate: '2018-05',
          endDate: 'Present',
          current: true,
          bullets: [
            'Oversaw kitchen operations generating $4.5M in annual food sales with a 24-person culinary brigade.',
            'Engineered seasonal farm-to-table menus maintaining food cost percentage at a strict 28%.',
            'Enforced stringent ServSafe hygiene standards, maintaining a 100% health inspection rating for 6 consecutive years.'
          ]
        }
      ],
      education: [
        {
          institution: 'Culinary Institute of America (CIA)',
          degree: 'A.O.S. in Culinary Arts',
          startDate: '2012-09',
          endDate: '2014-05',
          gpa: '3.90'
        }
      ],
      skills: ['Culinary Leadership', 'Menu Development', 'Food Cost Control', 'ServSafe Certified Manager', 'Kitchen Operations', 'Vendor Negotiations', 'Fine Dining & Catering'],
      projects: [
        {
          name: 'Seasonal Farm-to-Table Launch',
          description: 'Partnered with 12 local Midwest farms to establish direct supply chain for organic produce.',
          technologies: ['Culinary Management', 'Sourcing'],
          link: ''
        }
      ]
    }
  },

  // 9. ENGINEERING & TRADES
  {
    id: 'mechanical-engineer',
    category: 'Hospitality & Trades',
    role: 'Senior Mechanical Engineer',
    templateId: 'stanford_modern',
    themeColor: '#4f46e5',
    data: {
      title: 'Mechanical Engineer Resume Example',
      personalInfo: {
        fullName: 'Jacob Kent, PE',
        email: 'jacob.kent@engineering-pe.com',
        phone: '+1 (555) 654-3210',
        location: 'Philadelphia, PA',
        linkedin: 'linkedin.com/in/jacobkent-pe',
        website: '',
      },
      summary: 'Licensed Professional Engineer (PE) with 7+ years of experience in CAD product design, FEA stress analysis, thermal systems, and manufacturing execution. Proficient in SolidWorks, ANSYS, and GD&T standards.',
      experience: [
        {
          company: 'Vanguard Industrial Automation',
          title: 'Senior Mechanical Engineer',
          location: 'Philadelphia, PA',
          startDate: '2020-01',
          endDate: 'Present',
          current: true,
          bullets: [
            'Designed automated robotics tooling equipment using SolidWorks, shortening assembly line cycle time by 22%.',
            'Performed FEA static and dynamic stress analysis in ANSYS to optimize structural cast components.',
            'Coordinated prototype fabrication with CNC machine shops and vendors, meeting tight DFMA guidelines.'
          ]
        }
      ],
      education: [
        {
          institution: 'Drexel University',
          degree: 'B.S. in Mechanical Engineering',
          startDate: '2013-09',
          endDate: '2017-06',
          gpa: '3.85'
        }
      ],
      skills: ['SolidWorks & CAD', 'FEA (ANSYS)', 'GD&T (ASME Y14.5)', 'Licensed PE', 'DFMA & Prototyping', 'Thermal Systems', 'CNC Machining'],
      projects: [
        {
          name: 'Robotic Arm Gripper Redesign',
          description: 'Lightweighted end-effector aluminum housing by 35% without sacrificing load rating.',
          technologies: ['SolidWorks', 'ANSYS'],
          link: ''
        }
      ]
    }
  },

  // 10. CREATIVE & UI/UX DESIGN
  {
    id: 'ui-ux-designer',
    category: 'Design & Creative',
    role: 'Senior UI/UX Designer',
    templateId: 'creative',
    themeColor: '#7c3aed',
    data: {
      title: 'UI/UX Designer Resume Example',
      personalInfo: {
        fullName: 'Elena Rostova',
        email: 'elena@rostovadesign.io',
        phone: '+1 (555) 789-0123',
        location: 'Austin, TX',
        linkedin: 'linkedin.com/in/elena-rostova-design',
        website: 'rostovadesign.io',
      },
      summary: 'Passionate Senior UI/UX Designer with 5+ years crafting human-centered digital experiences, complex design systems, and interactive SaaS interfaces. Skilled in Figma, Design Systems, and Motion Design.',
      experience: [
        {
          company: 'Aura Studio',
          title: 'Senior Product Designer',
          location: 'Austin, TX',
          startDate: '2020-04',
          endDate: 'Present',
          current: true,
          bullets: [
            'Created multi-brand Figma design system used across 12 product teams, cutting UI build times by 50%.',
            'Conducted 40+ usability testing sessions and wireframed end-to-end mobile app flow resulting in 4.9/5 rating.'
          ]
        }
      ],
      education: [
        {
          institution: 'Rhode Island School of Design (RISD)',
          degree: 'B.F.A. in Graphic & Interaction Design',
          startDate: '2015-09',
          endDate: '2019-05',
          gpa: '3.90'
        }
      ],
      skills: ['Figma & Design Systems', 'User Research & Wireframing', 'Prototyping & Framer', 'HTML5 / CSS3 / Tailwind', 'WCAG Accessibility'],
      projects: [
        {
          name: 'Horizon Mobile Banking Redesign',
          description: 'Complete UX overhaul of mobile banking app for 500k+ retail users.',
          technologies: ['Figma', 'Framer'],
          link: 'behance.net/elena-horizon'
        }
      ]
    }
  },

  // 11. SOFTWARE & TECH
  {
    id: 'software-engineer',
    category: 'Software & Tech',
    role: 'Senior Software Engineer',
    templateId: 'tech',
    themeColor: '#059669',
    data: {
      title: 'Software Engineer Resume Example',
      personalInfo: {
        fullName: 'Alex Chen',
        email: 'alex.chen@devmail.io',
        phone: '+1 (555) 234-5678',
        location: 'San Francisco, CA',
        linkedin: 'linkedin.com/in/alexchen-dev',
        website: 'github.com/alexchen-dev',
      },
      summary: 'Results-driven Senior Full-Stack Engineer with 6+ years of experience architecting microservices, distributed RAG pipelines, and cloud applications. Expert in TypeScript, Python, Node.js, React, and Kubernetes.',
      experience: [
        {
          company: 'CloudScale Technologies',
          title: 'Senior Software Engineer',
          location: 'San Francisco, CA',
          startDate: '2022-03',
          endDate: 'Present',
          current: true,
          bullets: [
            'Architected event-driven microservices using Node.js and Kafka, processing 15M+ daily requests with 99.99% uptime.',
            'Led migration to Docker/Kubernetes on AWS EKS, reducing cloud infrastructure costs by 28%.'
          ]
        }
      ],
      education: [
        {
          institution: 'University of California, Berkeley',
          degree: 'B.S. in Computer Science',
          startDate: '2015-08',
          endDate: '2019-05',
          gpa: '3.85'
        }
      ],
      skills: ['JavaScript / TypeScript', 'Python', 'React / Next.js', 'Node.js / Express', 'PostgreSQL / Supabase', 'Docker & Kubernetes', 'AWS'],
      projects: [
        {
          name: 'AI Code Assistant CLI',
          description: 'Open-source CLI tool leveraging LLMs for automated code reviews and unit testing.',
          technologies: ['TypeScript', 'Node.js', 'OpenAI API'],
          link: 'github.com/alexchen-dev/ai-cli'
        }
      ]
    }
  },

  // 12. AI & DATA SCIENCE
  {
    id: 'ai-data-scientist',
    category: 'AI & Data Science',
    role: 'AI & ML Engineer',
    templateId: 'classic',
    themeColor: '#2563eb',
    data: {
      title: 'AI & Data Scientist Resume Example',
      personalInfo: {
        fullName: 'Sarah Jenkins',
        email: 'sarah.jenkins@ai-research.org',
        phone: '+1 (555) 987-6543',
        location: 'Seattle, WA',
        linkedin: 'linkedin.com/in/sarahjenkins-ai',
        website: 'sarahjenkins.ai',
      },
      summary: 'AI & Machine Learning Specialist with 5+ years building production LLM applications, RAG systems, and computer vision models. Specialized in PyTorch, Gemini API fine-tuning, and Vector DBs.',
      experience: [
        {
          company: 'Cognitive Dynamics Lab',
          title: 'Senior AI Engineer',
          location: 'Seattle, WA',
          startDate: '2021-09',
          endDate: 'Present',
          current: true,
          bullets: [
            'Designed scalable hybrid search RAG pipeline with Supabase Vector, increasing search relevance by 34%.',
            'Fine-tuned open-weight LLaMA 3 models on 500k documents, lowering API expenses by $12,000 monthly.'
          ]
        }
      ],
      education: [
        {
          institution: 'University of Washington',
          degree: 'M.S. in Artificial Intelligence',
          startDate: '2019-09',
          endDate: '2021-06',
          gpa: '3.92'
        }
      ],
      skills: ['Python', 'PyTorch', 'TensorFlow', 'LLM Fine-tuning', 'Vector DBs (Qdrant, Pinecone)', 'RAG Pipelines', 'MLOps'],
      projects: [
        {
          name: 'Medical Q&A Knowledge Graph',
          description: 'Biomedical entity extraction & Q&A assistant built over PubMed abstracts using Knowledge Graphs.',
          technologies: ['Python', 'PyTorch', 'Neo4j'],
          link: 'github.com/sjenkins/med-graph'
        }
      ]
    }
  },

  // 13. STUDENTS & FRESH GRADS
  {
    id: 'cs-student',
    category: 'Students & Interns',
    role: 'Computer Science Graduate',
    templateId: 'minimalist',
    themeColor: '#334155',
    data: {
      title: 'CS Graduate Resume Example',
      personalInfo: {
        fullName: 'Amar Singh',
        email: 'amar.singh@cs.edu',
        phone: '+1 (555) 321-6549',
        location: 'Boston, MA',
        linkedin: 'linkedin.com/in/amarsingh-cs',
        website: 'amarsingh.dev',
      },
      summary: 'Enthusiastic Computer Science graduate (B.S. Expected May 2026) with strong foundation in Data Structures, Algorithms, Full-Stack Web Development, and AI APIs.',
      experience: [
        {
          company: 'TechCorp Internship Program',
          title: 'Software Engineer Intern',
          location: 'Boston, MA',
          startDate: '2025-06',
          endDate: '2025-08',
          current: false,
          bullets: [
            'Developed RESTful microservice API in Python Flask for internal reporting, saving 10 hours weekly.',
            'Wrote automated unit test suites achieving 92% code coverage with PyTest.'
          ]
        }
      ],
      education: [
        {
          institution: 'Northeastern University',
          degree: 'B.S. in Computer Science',
          startDate: '2022-09',
          endDate: '2026-05',
          gpa: '3.82'
        }
      ],
      skills: ['Python', 'Java', 'C++', 'JavaScript / React', 'Git & GitHub', 'SQL', 'Algorithms'],
      projects: [
        {
          name: 'AI Document Summarizer',
          description: 'Web app extracting text from PDFs and generating summaries using Gemini API.',
          technologies: ['React', 'Python', 'Flask'],
          link: 'github.com/asingh/ai-summarizer'
        }
      ]
    }
  },

  // 14. EXECUTIVE & C-SUITE
  {
    id: 'ceo-executive',
    category: 'Executive',
    role: 'Chief Executive Officer (CEO)',
    templateId: 'executive',
    themeColor: '#1e3a8a',
    data: {
      title: 'CEO Resume Example',
      personalInfo: {
        fullName: 'Hazel Reid',
        email: 'hazel.reid@exec-board.com',
        phone: '+1 (555) 999-0000',
        location: 'New York, NY',
        linkedin: 'linkedin.com/in/hazelreid-ceo',
        website: '',
      },
      summary: 'Visionary Chief Executive Officer with 15+ years driving international enterprise growth, venture capital fundraising, M&A integrations, and organizational scaling across technology and financial sectors.',
      experience: [
        {
          company: 'Vanguard Global Systems',
          title: 'Chief Executive Officer',
          location: 'New York, NY',
          startDate: '2018-01',
          endDate: 'Present',
          current: true,
          bullets: [
            'Grew annual company revenue from $12M to $85M ARR over a 6-year period.',
            'Secured $45M Series C growth funding from top-tier institutional venture partners.',
            'Directed corporate strategy across 4 global regional offices with 500+ headcount.'
          ]
        }
      ],
      education: [
        {
          institution: 'Harvard Business School',
          degree: 'Master of Business Administration (MBA)',
          startDate: '2007-09',
          endDate: '2009-05',
          gpa: '3.95'
        }
      ],
      skills: ['Corporate Governance', 'P&L Management ($100M+)', 'Venture Capital & M&A', 'Board Relations', 'Strategic Vision', 'Global Scaling'],
      projects: [
        {
          name: 'International Expansion Initiative',
          description: 'Established EMEA subsidiary generating $18M in year-two ARR.',
          technologies: ['GTM', 'Corporate Strategy'],
          link: ''
        }
      ]
    }
  }
];
