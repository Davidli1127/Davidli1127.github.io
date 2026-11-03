/* Content follows the supplied Chinese résumé; original PDFs are preserved. */
'use strict';
const translations = {
  "zh": {
    "skip": "跳到履历",
    "navHome": "你好",
    "navJourney": "履历",
    "navWork": "作品",
    "navLife": "生活",
    "navContact": "联系",
    "heroSubtitle": "把好奇心，写进代码里。",
    "heroLocation": "此刻，在新加坡创造一点新东西。",
    "badgeHint": "拖动工牌 · 点击认识我",
    "sceneCaption": "我的一小片宇宙",
    "scroll": "向下探索",
    "reset": "重置视角",
    "sceneHint": "拖动场景旋转 · 点击机器人",
    "fallback": "当前设备无法启用 3D，所有履历和作品仍可正常浏览。",
    "journeyTitle": "在实践中<br><em>不断生长。</em>",
    "journeyIntro": "学习、实践，再向前一步。<br>点击一段经历，了解我做了什么。",
    "resumeLink": "中英文简历",
    "workTitle": "想法的<br><em>另一种形状。</em>",
    "workIntro": "先看一个想法，<br>再展开它背后的工作。",
    "filterAll": "全部 / 04",
    "filterWeb": "产品与 Web",
    "filterRobot": "机器人",
    "githubMore": "更多代码，在 GitHub",
    "lifeTitle": "代码之外，<br><em>也有热爱。</em>",
    "snookerTitle": "下一杆，也值得认真。",
    "snookerBody": "作为 NTU Hall 3 斯诺克队队长，带领队伍赢得校内宿舍运动会冠军。球桌上的耐心、判断与团队协作，也伴随我走进每个项目。",
    "toolkitTitle": "工具会变，好奇心不会。",
    "toolkitBody": "根据问题选择工具，把想法变成可以使用的东西。",
    "contactTitle": "下一件有趣的事，<br><em>一起做吧。</em>",
    "contactIntro": "一个项目，一次合作，或者只是打个招呼。",
    "resumeShort": "简历",
    "copyEmail": "复制邮箱",
    "backTop": "回到首页",
    "copied": "已复制",
    "copyFallback": "已选中，请手动复制",
    "robotHello": "Beep! 你好，好奇的人类。",
    "viewSite": "打开项目网站",
    "viewResume": "查看简历",
    "demoNote": "截图来自所提供的演示文稿，使用虚构演示数据。点击可查看原图。",
    "readProject": "查看项目",
    "profileTitle": "你好，我是李中元。",
    "profileBio": "李中元 / David Li。南洋理工大学计算机科学荣誉学士在读，专攻数据科学与人工智能，预计 2027 年毕业。",
    "profileBody": "我喜欢在软件、AI 和产品之间寻找连接。这里展示的，是我的项目、工作经历，以及一点代码之外的生活。",
    "paused": "继续场景动画",
    "playing": "暂停场景动画",
    "matchPhoto": "比赛现场",
    "practicePhoto": "日常练习",
    "viewPhoto": "放大照片",
    "expand": "展开详情",
    "collapse": "收起详情",
    "projectDetail": "展开项目",
    "resumeTitle": "我的简历",
    "resumeIntro": "选择你习惯的语言，查看或保存完整简历。",
    "resumeZh": "中文版",
    "resumeEn": "English",
    "selectedWork": "当前作品",
    "toolkitToggle": "查看我的工具箱",
    "workRole": "我的贡献",
    "workMethod": "实现与思考",
    "projectsHint": "选择一个项目",
    "photoCaption": "NTU Hall 3 · Snooker",
    "resumePdf": "PDF · 新标签页打开",
    "homeChapter": "00 / MY LITTLE WORLD",
    "journeyChapter": "01 / LEARNING BY DOING",
    "workChapter": "02 / IDEAS INTO PRODUCTS",
    "lifeChapter": "03 / A DIFFERENT PRECISION",
    "contactChapter": "04 / WHAT’S NEXT"
  },
  "en": {
    "skip": "Skip to experience",
    "navHome": "Hello",
    "navJourney": "Journey",
    "navWork": "Work",
    "navLife": "Life",
    "navContact": "Contact",
    "heroSubtitle": "A curious mind. A world to build.",
    "heroLocation": "Making something new, here in Singapore.",
    "badgeHint": "Drag the badge · Click to meet me",
    "sceneCaption": "My little universe",
    "scroll": "SCROLL TO EXPLORE",
    "reset": "Reset view",
    "sceneHint": "Drag to rotate · Click the robot",
    "fallback": "3D is unavailable on this device. All experience and projects are still accessible below.",
    "journeyTitle": "Learning.<br><em>By doing.</em>",
    "journeyIntro": "Learn. Build. Take the next step.<br>Open an experience to see the work.",
    "resumeLink": "My résumé",
    "workTitle": "Ideas,<br><em>made tangible.</em>",
    "workIntro": "One idea at a time.<br>Open a project to look a little closer.",
    "filterAll": "All work / 04",
    "filterWeb": "Product & web",
    "filterRobot": "Robotics",
    "githubMore": "More code on GitHub",
    "lifeTitle": "Away from<br><em>the keyboard.</em>",
    "snookerTitle": "A different kind of precision.",
    "snookerBody": "As captain of NTU Hall 3’s Snooker Team, I led the team to the Inter-Hall Games Championship. A lesson in patience, judgment, and playing together.",
    "toolkitTitle": "Tools change. Curiosity stays.",
    "toolkitBody": "Moving between models, interfaces, and the people who use them. Turning an open-ended problem into something practical.",
    "contactTitle": "Let’s make<br><em>something good.</em>",
    "contactIntro": "A project, an opportunity, or just a good conversation.",
    "resumeShort": "Résumé",
    "copyEmail": "Copy email",
    "backTop": "Back to the top",
    "copied": "Copied!",
    "copyFallback": "Selected — copy manually",
    "robotHello": "Beep! Hello, curious human.",
    "viewSite": "Visit the live project",
    "viewResume": "View résumé",
    "demoNote": "Screenshots from the supplied demonstration, using fictional demo data. Click to view the full image.",
    "readProject": "Explore project",
    "profileTitle": "Hi, I’m David.",
    "profileBio": "Li Zhongyuan. Computer Science undergraduate at Nanyang Technological University, specializing in Data Science and AI. Expected graduation: 2027.",
    "profileBody": "I like finding connections between software, AI, and product. This is a collection of my projects, experience, and a little life beyond the screen.",
    "paused": "Resume scene animation",
    "playing": "Pause scene animation",
    "matchPhoto": "Match day",
    "practicePhoto": "In practice",
    "viewPhoto": "Enlarge photo",
    "expand": "Read more",
    "collapse": "Read less",
    "projectDetail": "Explore this project",
    "resumeTitle": "My résumé",
    "resumeIntro": "Choose a language to read or save my full résumé.",
    "resumeZh": "中文",
    "resumeEn": "English",
    "selectedWork": "SELECTED PROJECT",
    "toolkitToggle": "Open my toolbox",
    "workRole": "My contribution",
    "workMethod": "How it works",
    "projectsHint": "Choose a project",
    "photoCaption": "NTU Hall 3 · Snooker",
    "resumePdf": "PDF · Opens in a new tab",
    "homeChapter": "00 / MY LITTLE WORLD",
    "journeyChapter": "01 / LEARNING BY DOING",
    "workChapter": "02 / IDEAS INTO PRODUCTS",
    "lifeChapter": "03 / A DIFFERENT PRECISION",
    "contactChapter": "04 / WHAT’S NEXT"
  }
};
const journey = [
  {
    "date": "2023 — 2027",
    "title": {
      "zh": "南洋理工大学",
      "en": "Nanyang Technological University"
    },
    "role": {
      "zh": "计算机科学荣誉学士 · 数据科学与人工智能",
      "en": "Computer Science (Honours) · Data Science & AI"
    },
    "body": {
      "zh": "专攻数据科学与人工智能。在算法、机器学习和软件开发之间，逐渐找到自己的方向。",
      "en": "Specializing in Data Science and AI. Building a foundation in algorithms, machine learning, and software development."
    },
    "tags": [
      "Computer Science",
      "Data Science & AI"
    ]
  },
  {
    "date": "JAN – JUN 2026",
    "title": {
      "zh": "Absolute Kinetics Consultancy",
      "en": "Absolute Kinetics Consultancy"
    },
    "role": {
      "zh": "技术产品开发",
      "en": "Technical Product Development"
    },
    "body": {
      "zh": "从需求拆解到公司服务器部署，独立交付培训反馈分析平台。实现动态表单、评价看板与低分预警，并参与在线考试系统的风险识别、追踪阈值调整和生产调试。",
      "en": "Independently delivered a training-feedback platform, from requirements to company-server deployment. Built dynamic forms, analytics and low-rating alerts, and improved examination workflows through risk analysis, tracking-threshold tuning and production debugging."
    },
    "tags": [
      "Python",
      "Full-stack",
      "Analytics"
    ]
  },
  {
    "date": "DEC 2025 — JAN 2026",
    "title": {
      "zh": "鹰腾信息科技 · Inteagle Vision",
      "en": "Inteagle Vision"
    },
    "role": {
      "zh": "市场与产品助理",
      "en": "Market & Product Assistant"
    },
    "body": {
      "zh": "开展香港市场与监管分析，并使用 Blender 支持 3D 展览模型的快速原型制作。",
      "en": "Conducted Hong Kong market and regulatory analysis, and supported rapid prototyping of 3D exhibition models in Blender."
    },
    "tags": [
      "Blender",
      "3D Prototyping",
      "Research"
    ]
  },
  {
    "date": "MAY — NOV 2025",
    "title": {
      "zh": "SG Noah’s Ark EduTec",
      "en": "SG Noah’s Ark EduTec"
    },
    "role": {
      "zh": "软件工程实习生",
      "en": "Software Engineering Intern"
    },
    "body": {
      "zh": "使用 Python 与 Airtable API 清洗 700+ 条院校数据，构建检索与排序原型，并用 150+ 个典型学生案例验证结果。负责消息、申请追踪与 RBAC 权限模块的需求、PRD 和 UAT，整理业务与系统操作 SOP。",
      "en": "Built a Python/Airtable retrieval and ranking prototype using 700+ school records and validated it with 150+ student cases. Clarified requirements, wrote PRDs and ran UAT for messaging, application tracking and RBAC; documented workflows in standard operating procedures."
    },
    "tags": [
      "Python",
      "Airtable",
      "Product"
    ]
  }
];
const projects = [
  {
    "id": "feedback",
    "category": "web",
    "type": "PRODUCT / FULL-STACK",
    "date": "JAN – JUN 2026",
    "title": {
      "zh": "让反馈，真正产生改变。",
      "en": "Feedback that goes somewhere."
    },
    "name": "AKC Feedback System",
    "summary": {
      "zh": "从问卷配置、扫码填写，到数据分析与跟进，一套完整的培训反馈工作流。",
      "en": "A complete training-feedback workflow, from QR surveys to analytics and follow-up."
    },
    "tags": [
      "Flask",
      "SQL Server",
      "Chart.js"
    ],
    "intro": {
      "zh": "独立开发并部署的培训反馈与管理平台。管理员可以在系统中维护问卷、生成班级二维码、查看提交情况、分析评分，并记录后续处理。",
      "en": "An independently developed and deployed training-feedback platform. Administrators configure evaluations, generate class QR codes, monitor submissions, analyze responses, and record follow-up actions."
    },
    "stats": {
      "zh": [
        [
          "端到端",
          "配置 → 收集 → 分析 → 跟进"
        ],
        [
          "Flask + SQL Server",
          "后端与数据库"
        ]
      ],
      "en": [
        [
          "End to end",
          "Configure, collect, analyze, follow up"
        ],
        [
          "Flask + SQL Server",
          "Backend and database"
        ]
      ]
    },
    "points": {
      "zh": [
        "动态表单支持评分、讲师评价、开放问题等题型，并支持多语言版本。",
        "按班级生成反馈链接和二维码，跟踪参与状态，并控制提交窗口。",
        "Chart.js 可视化支持按月份、问题和班级筛选，以及饼图和柱状图分析。",
        "自动标记低评分和命中负面关键词的评论；管理员可以记录状态和跟进行动。"
      ],
      "en": [
        "Dynamic forms support rating scales, instructor evaluations, free-text responses, and language variants.",
        "Class-specific links and QR codes connect feedback to a session, with participation tracking and submission-window controls.",
        "Chart.js visualizations filter by month, question, and class, with pie and bar views.",
        "Low ratings and comments matching negative keywords are flagged for review, with status and follow-up records."
      ]
    },
    "art": "feedback"
  },
  {
    "id": "planner",
    "category": "web",
    "type": "WEB / STUDENT TOOLS",
    "date": "JAN – JUN 2025",
    "title": {
      "zh": "让选课，少一点混乱。",
      "en": "Make room for what’s next."
    },
    "name": "NTU Planner",
    "summary": {
      "zh": "为 NTU 学生设计更清晰的选课体验，连接课程规划与日历。",
      "en": "A clearer course-planning experience for NTU students, connected to their calendar."
    },
    "tags": [
      "UI Design",
      "Google Calendar",
      "Canlah AI"
    ],
    "link": "https://ntu-planner.com/",
    "intro": {
      "zh": "参与学生团队自主发起的选课平台项目，围绕校内选课体验问题负责 UI 设计，并协助 Canlah AI 部署，实现自动化 Google Calendar 更新。",
      "en": "Contributed to a student-led course-planning platform, owning UI design around the NTU course-selection experience. Assisted with Canlah AI deployment to automate Google Calendar updates."
    },
    "stats": {
      "zh": [
        [
          "UI 设计",
          "我的主要职责"
        ],
        [
          "1,000+",
          "Telegram 反馈社群成员"
        ]
      ],
      "en": [
        [
          "UI design",
          "My primary contribution"
        ],
        [
          "1,000+",
          "Telegram feedback community"
        ]
      ]
    },
    "points": {
      "zh": [
        "将学生选课中的实际问题转化为清晰的界面与交互。",
        "项目建立了超过 1,000 人的 Telegram 反馈社群，用来收集使用问题和改进建议。",
        "协助 Canlah AI 部署，实现自动化 Google Calendar 更新。"
      ],
      "en": [
        "Designed interfaces and interactions around students’ course-selection needs.",
        "The project built a Telegram feedback community of over 1,000 people to collect issues and suggestions.",
        "Assisted with Canlah AI deployment for automated Google Calendar updates."
      ]
    },
    "art": "planner"
  },
  {
    "id": "massive",
    "category": "ai",
    "type": "AI / LANGUAGE UNDERSTANDING",
    "date": "AUG 2026 – PRESENT",
    "title": {
      "zh": "让机器，听懂言外之意。",
      "en": "Teaching machines to listen."
    },
    "name": "MASSIVE · Intent & Slots",
    "summary": {
      "zh": "基于注意力机制的序列模型，理解意图并提取关键信息。",
      "en": "An attention-based sequence model for intent classification and slot filling."
    },
    "tags": [
      "Python",
      "PyTorch",
      "Attention"
    ],
    "intro": {
      "zh": "在 MASSIVE 英语数据集上开发并训练 attention-based seq2seq 模型，用于意图分类与槽位填充，同时将参数量控制在 2,000 万以内。",
      "en": "Developed and trained an attention-based seq2seq model with word embeddings for intent classification and slot filling, keeping the total parameter count within 20 million."
    },
    "stats": {
      "zh": [
        [
          "16,521",
          "MASSIVE 英语语句"
        ],
        [
          "≤ 20M",
          "模型总参数量"
        ]
      ],
      "en": [
        [
          "16,521",
          "MASSIVE English utterances"
        ],
        [
          "≤ 20M",
          "Total model parameters"
        ]
      ]
    },
    "points": {
      "zh": [
        "构建预处理与评估流水线，保留官方训练、验证和测试集划分。",
        "跟踪训练指标，选择最佳验证集 checkpoint。",
        "在验证集与独立测试集上评估意图准确率和 exact-match slot micro-F1。"
      ],
      "en": [
        "Built preprocessing and evaluation pipelines while preserving the official data splits.",
        "Tracked training metrics and selected the best validation checkpoint.",
        "Evaluated intent accuracy and exact-match slot micro-F1 on validation and held-out test sets."
      ]
    },
    "art": "nlp"
  },
  {
    "id": "robot",
    "category": "robotics",
    "type": "ROBOTICS / ANDROID",
    "date": "AUG – OCT 2026",
    "title": {
      "zh": "把代码，带进现实。",
      "en": "Code that moves."
    },
    "name": "Autonomous Robot Controller",
    "summary": {
      "zh": "Android 控制、蓝牙通信，与考虑真实运动约束的路径规划。",
      "en": "Android control, Bluetooth communication, and planning around real motion constraints."
    },
    "tags": [
      "Kotlin",
      "Jetpack Compose",
      "Bluetooth",
      "Dijkstra"
    ],
    "intro": {
      "zh": "为自主机器人开发 Android 控制应用，配置地图与障碍物，交换蓝牙指令，并参与基于 Dijkstra 算法的路径规划。",
      "en": "An Android control application for an autonomous robot, with map and obstacle configuration, Bluetooth commands, and Dijkstra-based path planning."
    },
    "stats": {
      "zh": [
        [
          "Android",
          "真实设备控制与集成测试"
        ],
        [
          "Dijkstra",
          "考虑运动约束的路径规划"
        ]
      ],
      "en": [
        [
          "Android",
          "Physical-device integration"
        ],
        [
          "Dijkstra",
          "Motion-aware route planning"
        ]
      ]
    },
    "points": {
      "zh": [
        "用 Kotlin 与 Jetpack Compose 实现地图和障碍配置、实时状态更新与蓝牙指令交换。",
        "通过物理设备测试和端到端机器人集成验证控制流程。",
        "参与路径规划算法设计，结合障碍物访问顺序优化、转向与倒车代价，以及碰撞检测，减少无效移动。"
      ],
      "en": [
        "Built map and obstacle configuration in Kotlin and Jetpack Compose, with real-time status updates and Bluetooth commands.",
        "Validated workflows through physical-device testing and end-to-end robot integration.",
        "Contributed to route planning with obstacle visit-order optimization, steering and reversing costs, and collision checks to reduce unnecessary travel."
      ]
    },
    "art": "robot"
  }
];

translations.zh.championLabel = '冠军 · 队长';
translations.en.championLabel = 'CHAMPIONS · TEAM CAPTAIN';
const paths = {
 file:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6M8 13h8M8 17h6"/>',
 mail:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 6 9 7 9-7"/>',
 copy:'<rect x="8" y="8" width="12" height="13" rx="2"/><path d="M16 8V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h4"/>',
 close:'<path d="m6 6 12 12M6 18 18 6"/>',
 plus:'<path d="M12 5v14M5 12h14"/>',
 sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.4 1.4M17.6 17.6 19 19M5 19l1.4-1.4M17.6 6.4 19 5"/>',
 moon:'<path d="M20.8 13.3A9 9 0 0 1 10.7 3.2 9 9 0 1 0 20.8 13.3Z"/>',
 pause:'<path d="M9 5v14M15 5v14"/>',
 play:'<path d="m7 4 14 8-14 8Z"/>',
 reset:'<path d="M3 10a9 9 0 1 1 2 8M3 4v6h6"/>',
 expand:'<path d="M8 3H3v5M16 3h5v5M21 16v5h-5M8 21H3v-5"/>',
 trophy:'<path d="M8 3h8v6a4 4 0 0 1-8 0ZM8 5H4v2a4 4 0 0 0 4 4M16 5h4v2a4 4 0 0 1-4 4M12 13v7M8 21h8"/>',
 up:'<path d="m7 10 5-5 5 5M12 5v14"/>',
 globe:'<circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18"/>',
 cube:'<path d="m12 3 9 5v8l-9 5-9-5V8Zm0 10 9-5M12 13 3 8m9 5v8"/>'
};
function icon(name) {
 if(name==='github') return '<span class="brand-github"><img class="on-dark" src="assets/icons/github-white.svg" alt=""><img class="on-light" src="assets/icons/github-black.svg" alt=""></span>';
 if(name==='linkedin') return '<img class="brand-linkedin" src="assets/icons/linkedin.png" alt="">';
 return `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]||paths.file}</svg>`;
}
function paintIcons(root=document){root.querySelectorAll('[data-icon]').forEach(el=>{el.innerHTML=icon(el.dataset.icon);el.setAttribute('aria-hidden','true');});}
const safe=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let lang='zh', selectedProject='feedback', activeDialog=null, lastFocus=null, selectedPhoto='match', copyTimer, toastTimer;
try {lang=localStorage.getItem('david-language')==='en'?'en':'zh';const t=localStorage.getItem('david-theme');if(t==='light'||t==='dark'){document.documentElement.dataset.theme=t;window.portfolioScene?.setTheme(t);}} catch{}
const tr=key=>translations[lang][key]||key;
const dialog=document.querySelector('#detail-dialog');
const socialLinks=()=>`<a href="https://github.com/Davidli1127" target="_blank" rel="noopener noreferrer">${icon('github')}GitHub</a><a href="https://www.linkedin.com/in/zhongyuan-li-28904b352" target="_blank" rel="noopener noreferrer">${icon('linkedin')}LinkedIn</a>`;
const photos={match:{src:'assets/snooker-match.jpg',alt:{zh:'李中元在斯诺克比赛中击球',en:'David lining up a shot at a snooker match'}},practice:{src:'assets/snooker-practice.jpg',alt:{zh:'李中元练习斯诺克',en:'David practising snooker'}}};
function artwork(p){
 if(p.art==='feedback')return `<div class="project-art feedback-art"><img src="assets/feedback-analytics.jpg" alt="${lang==='zh'?'反馈系统数据看板演示':'Feedback analytics demo'}"><span class="art-note">${lang==='zh'?'演示截图 · 虚构数据':'DEMO SCREENSHOT · FICTIONAL DATA'}</span></div>`;
 if(p.art==='planner')return `<div class="project-art planner-art" aria-hidden="true"><div class="mini-browser"><div class="browser-chrome"><span class="window-dots"><i></i><i></i><i></i></span><span>ntu-planner.com</span>${icon('globe')}</div><h4>Your semester.<br><em>Sorted.</em></h4><div class="calendar"><span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><i>Algorithms</i><i>Data science</i><i>Lab time</i></div></div><span class="art-note">${lang==='zh'?'界面示意 · 实际项目可访问':'INTERFACE CONCEPT · LIVE PROJECT AVAILABLE'}</span></div>`;
 if(p.art==='nlp')return `<div class="project-art nlp-art" aria-hidden="true"><div class="language-input">“Play some <em>jazz.</em>”</div><span class="model-line"></span><div class="nlp-results"><span><small>INTENT</small>play_music</span><span><small>SLOT</small>genre: jazz</span></div><span class="art-note">${lang==='zh'?'模型流程示意':'ILLUSTRATIVE MODEL FLOW'}</span></div>`;
 return `<div class="project-art robot-art" aria-hidden="true"><div class="robot-map"><span class="robot-path"></span><span class="map-bot"></span><span class="map-obstacle"></span><span class="map-obstacle second"></span></div><span class="art-note">ANDROID · BLUETOOTH · PATH PLANNING</span></div>`;
}
function renderJourney(){
 const openId=document.querySelector('.experience[open]')?.dataset.experience;
 document.querySelector('#timeline').innerHTML=journey.map((j,i)=>`<details class="experience" data-experience="${i}" ${String(i)===openId?'open':''}><summary><span class="experience-number">0${i+1}</span><span class="experience-summary"><span class="date">${j.date}</span><h3>${safe(j.title[lang])}</h3><span class="role">${safe(j.role[lang])}</span><span class="disclosure-label"><span class="when-closed">${tr('expand')}</span><span class="when-open">${tr('collapse')}</span></span></span><span class="plus" aria-hidden="true"></span></summary><div class="experience-body"><p>${safe(j.body[lang])}</p><div class="timeline-tags">${j.tags.map(t=>`<span>${safe(t)}</span>`).join('')}</div></div></details>`).join('');
 document.querySelectorAll('.experience').forEach(el=>el.addEventListener('toggle',()=>{if(el.open)document.querySelectorAll('.experience').forEach(other=>{if(other!==el)other.open=false;});window.dispatchEvent(new Event('portfolio-layout'));}));
}
function renderProjects(){
 document.querySelector('#project-tabs').innerHTML=projects.map((p,i)=>`<button type="button" id="tab-${p.id}" class="project-tab${selectedProject===p.id?' active':''}" role="tab" aria-selected="${selectedProject===p.id}" aria-controls="project-panel" tabindex="${selectedProject===p.id?0:-1}" data-project-tab="${p.id}"><span class="project-number">0${i+1}</span><span><strong>${safe(p.name)}</strong><small>${p.category==='web'?'PRODUCT & WEB':p.category==='ai'?'AI & LANGUAGE':'ROBOTICS'}</small></span><span class="tab-indicator" aria-hidden="true"></span></button>`).join('');
 document.querySelectorAll('[data-project-tab]').forEach((b,i)=>{b.addEventListener('click',()=>selectProject(b.dataset.projectTab));b.addEventListener('keydown',e=>{let n=i;if(e.key==='ArrowDown'||e.key==='ArrowRight')n=(i+1)%projects.length;else if(e.key==='ArrowUp'||e.key==='ArrowLeft')n=(i+projects.length-1)%projects.length;else if(e.key==='Home')n=0;else if(e.key==='End')n=projects.length-1;else return;e.preventDefault();selectProject(projects[n].id);document.querySelector('#tab-'+projects[n].id).focus();});});
 renderFeatured();
}
function selectProject(id){selectedProject=id;document.querySelectorAll('[data-project-tab]').forEach(b=>{const a=b.dataset.projectTab===id;b.classList.toggle('active',a);b.setAttribute('aria-selected',String(a));b.tabIndex=a?0:-1;});renderFeatured();window.portfolioScene?.focusProject(id);}
function renderFeatured(){
 const p=projects.find(p=>p.id===selectedProject),n=projects.indexOf(p)+1;
 const stage=document.querySelector('#project-stage');
 stage.dataset.project=p.id;
 stage.innerHTML=`<article id="project-panel" class="featured-project" role="tabpanel" aria-labelledby="tab-${p.id}" aria-description="${lang==='zh'?'点击卡片或按回车键查看项目详情。':'Click the card or press Enter to explore this project.'}" tabindex="0"><div class="project-kicker"><span>${tr('selectedWork')} / 0${n}</span><span>${p.date}</span></div>${artwork(p)}<div class="project-info"><h3>${safe(p.title[lang])}</h3><p>${safe(p.summary[lang])}</p><div class="project-footer"><div class="tags">${p.tags.map(t=>`<span>${safe(t)}</span>`).join('')}</div><button class="primary-button" type="button" id="project-detail">${icon('plus')}<span>${tr('projectDetail')}</span></button></div></div></article>`;
 const panel=document.querySelector('#project-panel');
 const openProject=focus=>{activeDialog=selectedProject;renderDialog();showDialog(focus);};
 document.querySelector('#project-detail').addEventListener('click',e=>openProject(e.currentTarget));
 panel.addEventListener('click',e=>{
  if(e.target.closest('a,button') || window.getSelection()?.toString().trim())return;
  openProject(panel);
 });
 panel.addEventListener('keydown',e=>{
  if(e.target!==panel || !['Enter',' '].includes(e.key))return;
  e.preventDefault();openProject(panel);
 });
 window.dispatchEvent(new Event('portfolio-layout'));
}
function showDialog(focus){lastFocus=focus;dialog.showModal();dialog.scrollTop=0;document.body.classList.add('modal-open');dialog.querySelector('.dialog-close').focus();}
function openResume(button){activeDialog='resume';renderDialog();if(!dialog.open)showDialog(button);}
function resumeLinks(){return `<div class="resume-options"><a href="assets/david-li-resume-zh.pdf" target="_blank" rel="noopener">${icon('file')}<span><strong>${tr('resumeZh')}</strong><small>${tr('resumePdf')}</small></span><b>ZH</b></a><a href="assets/david-li-resume.pdf" target="_blank" rel="noopener">${icon('file')}<span><strong>${tr('resumeEn')}</strong><small>${tr('resumePdf')}</small></span><b>EN</b></a></div>`;}
function renderDialog(){
 const out=document.querySelector('#dialog-content');dialog.classList.toggle('photo-dialog',activeDialog==='photo');
 if(activeDialog==='resume'){out.innerHTML=`<p class="dialog-eyebrow">DAVID LI / 李中元</p><h2 id="dialog-title">${tr('resumeTitle')}</h2><p class="dialog-intro">${tr('resumeIntro')}</p>${resumeLinks()}`;return;}
 if(activeDialog==='profile'){out.innerHTML=`<div class="profile-dialog"><img src="assets/david-li.jpg" alt="David Li Zhongyuan"><div><p class="dialog-eyebrow">THE HUMAN BEHIND THE SCREEN</p><h2 id="dialog-title">${tr('profileTitle')}</h2><p>${tr('profileBio')}</p><p>${tr('profileBody')}</p><div class="contact-links">${socialLinks()}</div></div></div>${resumeLinks()}`;return;}
 if(activeDialog==='photo'){const p=photos[selectedPhoto];out.innerHTML=`<p class="dialog-eyebrow">BEYOND THE SCREEN</p><h2 id="dialog-title">${tr(selectedPhoto==='match'?'matchPhoto':'practicePhoto')}</h2><img class="full-photo" src="${p.src}" alt="${safe(p.alt[lang])}">`;return;}
 const p=projects.find(p=>p.id===activeDialog);if(!p)return;
 out.innerHTML=`<p class="dialog-eyebrow">${p.type}</p><h2 id="dialog-title">${safe(p.name)}</h2><p class="dialog-date">${p.date}</p><p class="dialog-intro">${safe(p.intro[lang])}</p><div class="dialog-stats">${p.stats[lang].map(([a,b])=>`<div class="dialog-stat"><strong>${safe(a)}</strong><span>${safe(b)}</span></div>`).join('')}</div><h3 class="dialog-subtitle">${tr('workMethod')}</h3><ul class="dialog-points">${p.points[lang].map(x=>`<li>${safe(x)}</li>`).join('')}</ul>${p.link?`<a class="primary-button" href="${p.link}" target="_blank" rel="noopener noreferrer">${icon('globe')}${tr('viewSite')}</a>`:''}${p.id==='feedback'?`<div class="demo-gallery"><a href="assets/feedback-analytics.jpg" target="_blank" rel="noopener"><img src="assets/feedback-analytics.jpg" alt="${lang==='zh'?'反馈系统数据分析演示':'Feedback analytics demonstration'}"></a><a href="assets/feedback-followup.jpg" target="_blank" rel="noopener"><img src="assets/feedback-followup.jpg" alt="${lang==='zh'?'低评分跟进演示':'Low-rating follow-up demonstration'}"></a></div><p class="demo-caption">${tr('demoNote')}</p>`:''}`;
}
function renderContent(){
 document.documentElement.lang=lang==='zh'?'zh-CN':'en';document.querySelectorAll('[data-i18n]').forEach(el=>{el.innerHTML=tr(el.dataset.i18n);});
 const l=document.querySelector('#lang-toggle');l.textContent=lang==='zh'?'EN':'中文';l.setAttribute('aria-label',lang==='zh'?'Switch to English':'切换到中文');
 document.querySelector('#id-card').setAttribute('aria-label',lang==='zh'?'拖动工牌；点击查看个人简介，方向键晃动工牌':'Drag my badge; click for my profile; arrow keys move it');
 document.querySelector('#theme-toggle').setAttribute('aria-label',lang==='zh'?'切换明暗主题':'Switch colour theme');
 renderJourney();renderProjects();paintIcons();updateMotionLabel();updateThemeIcon();updatePhoto();updateScroll();if(dialog.open)renderDialog();
}
function updatePhoto(){const p=photos[selectedPhoto],img=document.querySelector('#snooker-photo');img.src=p.src;img.alt=p.alt[lang];img.dataset.photo=selectedPhoto;document.querySelector('#photo-open').setAttribute('aria-label',tr('viewPhoto'));document.querySelectorAll('.photo-options [data-photo]').forEach(b=>{const active=b.dataset.photo===selectedPhoto;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});}
document.querySelectorAll('.photo-options [data-photo]').forEach(b=>b.addEventListener('click',()=>{selectedPhoto=b.dataset.photo;updatePhoto();}));
document.querySelector('#photo-open').addEventListener('click',e=>{activeDialog='photo';renderDialog();showDialog(e.currentTarget);});
document.querySelectorAll('[data-resume]').forEach(b=>b.addEventListener('click',()=>openResume(b)));
dialog.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{const r=dialog.getBoundingClientRect();if(e.target===dialog&&(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom))dialog.close();});
dialog.addEventListener('close',()=>{document.body.classList.remove('modal-open');activeDialog=null;lastFocus?.focus({preventScroll:true});});
document.querySelector('#lang-toggle').addEventListener('click',()=>{lang=lang==='zh'?'en':'zh';try{localStorage.setItem('david-language',lang);}catch{}renderContent();});
function updateThemeIcon(){document.querySelector('#theme-toggle').innerHTML=icon(document.documentElement.dataset.theme==='dark'?'sun':'moon');}
document.querySelector('#theme-toggle').addEventListener('click',()=>{const t=document.documentElement.dataset.theme==='dark'?'light':'dark';document.documentElement.dataset.theme=t;window.portfolioScene?.setTheme(t);updateThemeIcon();document.querySelector('meta[name=theme-color]').content=t==='dark'?'#0b1017':'#f3f1eb';try{localStorage.setItem('david-theme',t);}catch{}});
function updateMotionLabel(){const paused=window.portfolioScene?.paused??false,b=document.querySelector('#motion-toggle');b.innerHTML=icon(paused?'play':'pause');b.setAttribute('aria-pressed',String(paused));b.setAttribute('aria-label',paused?tr('paused'):tr('playing'));b.title=paused?tr('paused'):tr('playing');document.documentElement.dataset.motion=paused?'paused':'playing';}
document.querySelector('#motion-toggle').addEventListener('click',()=>{window.portfolioScene?.setPaused(!window.portfolioScene.paused);updateMotionLabel();});window.addEventListener('scene-motion',updateMotionLabel);
document.querySelector('#reset-scene').addEventListener('click',()=>window.portfolioScene?.reset());
window.addEventListener('robot-hello',()=>{const toast=document.querySelector('#scene-toast');toast.textContent=tr('robotHello');toast.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('show'),2600);});

// A spring-driven badge. Pointer capture prevents losing the card mid-drag.
const badge=document.querySelector('#badge-position'),card=document.querySelector('#id-card'),lanyard=document.querySelector('.lanyard');
let bx=0,by=0,bvx=0,bvy=0,drag=null,didDrag=false,lastTime=performance.now(),badgeBounds;
function measureBadge(){const b=badge.getBoundingClientRect(),l=lanyard.getBoundingClientRect();badgeBounds={x:badge.offsetLeft+badge.offsetWidth/2,y:badge.offsetTop-15,width:badge.offsetWidth,svgX:l.left,svgY:l.top,svgW:l.width,svgH:l.height};}
function badgePath(){if(!badgeBounds)return;const b=badgeBounds;const x=(b.x+bx-b.svgX)*400/b.svgW,y=(b.y+by)*600/b.svgH,anchor=(Math.max(18,b.x-190)-b.svgX)*400/b.svgW;const path=`M ${anchor} -15 C ${anchor-50} ${y*.38}, ${x-150} ${y*.85}, ${x} ${y}`;for(const id of ['lanyard-path','lanyard-shadow','lanyard-stripe'])document.getElementById(id).setAttribute('d',path);}
card.addEventListener('pointerdown',e=>{drag={x:e.clientX-bx,y:e.clientY-by,startX:e.clientX,startY:e.clientY};didDrag=false;card.setPointerCapture(e.pointerId);bvx=bvy=0;});
card.addEventListener('pointermove',e=>{if(!drag)return;bx=Math.max(-90,Math.min(150,e.clientX-drag.x));by=Math.max(-60,Math.min(110,e.clientY-drag.y));if(Math.abs(e.clientX-drag.startX)+Math.abs(e.clientY-drag.startY)>7)didDrag=true;});
card.addEventListener('pointerup',()=>{drag=null;});card.addEventListener('pointercancel',()=>{drag=null;didDrag=true;});
card.addEventListener('click',()=>{if(didDrag){didDrag=false;return;}activeDialog='profile';renderDialog();showDialog(card);});
card.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)){e.preventDefault();if(e.key==='ArrowLeft')bvx-=8;if(e.key==='ArrowRight')bvx+=8;if(e.key==='ArrowUp')bvy-=8;if(e.key==='ArrowDown')bvy+=8;}});
function animateBadge(now){const dt=Math.min((now-lastTime)/16.667,2);lastTime=now;const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;if(!drag){if(reduced){bx=by=bvx=bvy=0;}else{bvx+=-bx*.035*dt;bvy+=-by*.035*dt;bvx*=Math.pow(.87,dt);bvy*=Math.pow(.87,dt);bx+=bvx*dt;by+=bvy*dt;}}const idle=reduced||window.portfolioScene?.paused?0:Math.sin(now*.00065)*1.3;badge.style.transform=`translate(${bx}px,${by}px) rotate(${-8+bx*.055+idle}deg)`;badgePath();requestAnimationFrame(animateBadge);}
window.addEventListener('resize',measureBadge);measureBadge();requestAnimationFrame(animateBadge);
const sections=[...document.querySelectorAll('main>section')],navLinks=[...document.querySelectorAll('.chapter-nav a')];
function updateScroll(){
 const sy=window.scrollY;document.querySelector('.site-header').classList.toggle('scrolled',sy>100);
 let active='home';sections.forEach(s=>{if(s.offsetTop<=sy+innerHeight*.4)active=s.id;});document.documentElement.dataset.chapter=active;
 navLinks.forEach(a=>{const current=a.getAttribute('href')==='#'+active;a.classList.toggle('active',current);if(current)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});
 const total=document.documentElement.scrollHeight-innerHeight;document.querySelector('#progress').style.width=`${total?sy/total*100:0}%`;
 const label=document.querySelector('#scene-chapter');label.textContent=tr((active==='offscreen'?'life':active)+'Chapter');
}
window.addEventListener('scroll',updateScroll,{passive:true});window.addEventListener('resize',updateScroll);window.addEventListener('portfolio-layout',updateScroll);
document.querySelector('#copy-email').addEventListener('click',async()=>{const status=document.querySelector('#copy-status');clearTimeout(copyTimer);try{if(!navigator.clipboard||!window.isSecureContext)throw new Error('Clipboard unavailable');await navigator.clipboard.writeText('LIZH0084@e.ntu.edu.sg');status.textContent=tr('copied');}catch{const selection=window.getSelection(),range=document.createRange();range.selectNodeContents(document.querySelector('.email-link>span:last-child'));selection.removeAllRanges();selection.addRange(range);status.textContent=tr('copyFallback');}copyTimer=setTimeout(()=>{status.textContent='';},4000);});
const clockFormat=new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Singapore',hour:'2-digit',minute:'2-digit',hour12:false});
function updateClock(){const now=new Date(),c=document.querySelector('#singapore-time');c.textContent=clockFormat.format(now)+' SGT';c.dateTime=now.toISOString();document.querySelector('#year').textContent=new Intl.DateTimeFormat('en',{timeZone:'Asia/Singapore',year:'numeric'}).format(now);}
renderContent();updateClock();setInterval(updateClock,30000);
