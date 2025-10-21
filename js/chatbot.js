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

    const fallbackMessage = "I didn't catch that just yet. Try asking about Pablo's skills, projects, CV, contact details, or availability.";
    const responses = [
        {
            keywords: ['hello', 'hi', 'hey', 'hola', 'hallo'],
            answer: "Hi there! I'm Pablo's assistant. Ask me about his skills, recent projects, or how to get in touch."
        },
        {
            keywords: ['skill', 'skills', 'tech', 'stack'],
            answer: 'Pablo works daily with Python (pandas, NumPy, FastAPI), R (Shiny, ggplot2), React, SQL, Nextflow, AWS, and GenAI tools such as Gemini AI.'
        },
        {
            keywords: ['project', 'projects', 'portfolio', 'notion', 'explorer'],
            answer: "His Notion Theme Explorer showcases how he combines Python, React, and Gemini AI. You can explore more work in the Projects section or on GitHub."
        },
        {
            keywords: ['cv', 'resume', 'curriculum'],
            answer: 'Grab the latest CV via the "Download My CV" button or by opening assets/cv.pdf.'
        },
        {
            keywords: ['contact', 'email', 'reach', 'linkedin', 'connect'],
            answer: 'Reach him at pgonzale60@gmail.com or connect on LinkedIn at linkedin.com/in/pablo-gonzalez-de-la-rosa-1b663a99.'
        },
        {
            keywords: ['experience', 'background', 'bio', 'about'],
            answer: 'Pablo is a bioinformatician with 10+ years working in genomics, data analysis, and AI-driven tooling across academia and startups.'
        },
        {
            keywords: ['availability', 'hire', 'work with', 'collaborate', 'collaboration', 'open roles', 'opportunity'],
            answer: 'He is exploring roles where he can blend data analytics, bioinformatics, and GenAI. Drop a note if you have something in mind!'
        },
        {
            keywords: ['ai', 'genai', 'gemini', 'chatgpt', 'automation'],
            answer: 'Pablo prototypes GenAI workflows that surface insights faster - think automated research summaries, Notion knowledge helpers, and more.'
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
