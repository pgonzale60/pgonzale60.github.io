document.addEventListener('DOMContentLoaded', () => {
    const chatbot = document.getElementById('chatbot-assistant');
    if (!chatbot) {
        return;
    }

    const toggleBtn = chatbot.querySelector('.chatbot__toggle');
    const closeBtn = chatbot.querySelector('.chatbot__close');
    const windowEl = chatbot.querySelector('.chatbot__window');
    const form = chatbot.querySelector('.chatbot__form');
    const input = chatbot.querySelector('#chatbot-input');
    const messages = chatbot.querySelector('.chatbot__messages');

    const fallbackMessage = "Ask about Pablo's skills, projects/case studies, CV, contact, or availability.";
    const responses = [
        {
            keywords: ['hello', 'hi', 'hey', 'hola', 'hallo'],
            answer: "Hi there! I'm Pablo's assistant. Ask about his skills, recent projects, CV, or how to get in touch."
        },
        {
            keywords: ['skill', 'skills', 'tech', 'stack'],
            answer: 'Core skills: Nextflow DSL2 (schema-driven params, strong debugging), containers (Docker/Singularity), GitLab CI/CD + JIRA traceability; Python & R; Slurm; AWS familiarity (S3/EC2 basics).'
        },
        {
            keywords: ['project', 'projects', 'case study', 'case studies', 'portfolio'],
            answer: 'Recent work includes a research-use pharmacogenomics workflow (wf-pgx, available upon request), a verification workflow suite, and team support on biopharma QC workflows (wf-vax-qc, wf-plasmid-qc, wf-installation-qualification).'
        },
        {
            keywords: ['ai', 'llm', 'automation'],
            answer: 'He prototypes LLM-assisted helpers to speed text-heavy tasks (triage/matching). Practical and ROI-focused; early-stage prototypes.'
        },
        {
            keywords: ['cv', 'resume', 'curriculum'],
            answer: 'View CV online: assets/cv.html — Download PDF: assets/cv.pdf'
        },
        {
            keywords: ['contact', 'email', 'reach', 'linkedin', 'connect'],
            answer: 'Email: pgonzale60@gmail.com • LinkedIn: linkedin.com/in/pablo-gonzález-de-la-rosa-1b663a99'
        },
        {
            keywords: ['experience', 'background', 'bio', 'about'],
            answer: 'ONT (Bioinformatician): targeted sequencing workflows with Nextflow and CI. Doctoral Researcher (Sanger/Cambridge): genome & metagenome analysis, workflow development, training; Winter Genomics (Intern): microarrays and DB tooling.'
        },
        {
            keywords: ['publications', 'papers', 'scholar'],
            answer: 'Full publications: scholar.google.de/citations?hl=en&user=fzwjLYIAAAAJ&view_op=list_works&sortby=pubdate'
        }
    ];

    const isWindowOpen = () => windowEl.classList.contains('chatbot__window--visible');

    const openWindow = () => {
        windowEl.classList.add('chatbot__window--visible');
        windowEl.setAttribute('aria-hidden', 'false');
        toggleBtn.setAttribute('aria-expanded', 'true');
        setTimeout(() => {
            input.focus();
        }, 150);
    };

    const closeWindow = () => {
        windowEl.classList.remove('chatbot__window--visible');
        windowEl.setAttribute('aria-hidden', 'true');
        toggleBtn.setAttribute('aria-expanded', 'false');
        toggleBtn.focus();
    };

    const scrollMessagesToBottom = () => {
        messages.scrollTop = messages.scrollHeight;
    };

    const addMessage = (text, type) => {
        const message = document.createElement('div');
        message.classList.add('chatbot__message');
        message.classList.add(type === 'user' ? 'chatbot__message--user' : 'chatbot__message--bot');
        message.textContent = text;
        messages.appendChild(message);
        scrollMessagesToBottom();
    };

    const findResponse = (message) => {
        const sanitized = message.toLowerCase();
        for (const item of responses) {
            if (item.keywords.some((keyword) => sanitized.includes(keyword))) {
                return item.answer;
            }
        }
        return fallbackMessage;
    };

    toggleBtn.addEventListener('click', () => {
        if (isWindowOpen()) {
            closeWindow();
        } else {
            openWindow();
        }
    });

    closeBtn.addEventListener('click', () => {
        if (isWindowOpen()) {
            closeWindow();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && isWindowOpen()) {
            closeWindow();
        }
    });

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const userInput = input.value.trim();
        if (!userInput) {
            return;
        }

        addMessage(userInput, 'user');
        input.value = '';

        setTimeout(() => {
            const response = findResponse(userInput);
            addMessage(response, 'bot');
        }, 400);
    });

    toggleBtn.setAttribute('aria-expanded', 'false');
    windowEl.setAttribute('aria-hidden', 'true');
});
