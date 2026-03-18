import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  useEffect(() => {
    // ── LOADER ──
    let loaderTimeout;
    let fallbackTimeout;
    let loaderCleared = false;

    const hideLoader = () => {
      if (loaderCleared) return;
      loaderCleared = true;
      clearTimeout(loaderTimeout);
      clearTimeout(fallbackTimeout);
      document.getElementById('loader')?.classList.add('done');
    };

    const handleLoad = () => {
      clearTimeout(fallbackTimeout);
      loaderTimeout = window.setTimeout(hideLoader, 1600);
    };

    // If the app mounts after the load event already fired (common on fast mobile devices),
    // hide the loader immediately instead of waiting for another "load" event.
    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
    }

    // Fallback in case the load event never fires (e.g. slow image/network load)
    // so the loader doesn't stay stuck forever.
    fallbackTimeout = window.setTimeout(hideLoader, 5000);

    // ── SMOOTH SCROLL FUNCTION ──
    window.scrollToSection = function(id) {
      const el = document.getElementById(id);
      if (!el) return;
      const navbar = document.getElementById('navbar');
      const navHeight = navbar?.offsetHeight || 0;
      const top = el.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top, behavior: 'smooth' });
    };

    // ── NAV: shadow on scroll + active link highlight ──
    const navbar = document.getElementById('navbar');
    const sectionIds = ['home','about','skills','experience','education','contact'];

    const handleScroll = () => {
      if (!navbar) return;
      navbar.classList.toggle('scrolled', window.scrollY > 20);
      let current = 'home';
      sectionIds.forEach(id => {
        const sec = document.getElementById(id);
        if (sec && window.scrollY >= sec.offsetTop - 100) current = id;
      });
      sectionIds.forEach(id => {
        const link = document.getElementById('nav-' + id);
        if (link) link.classList.toggle('nav-active', id === current);
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // ── SCROLL REVEAL ──
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { 
          e.target.classList.add('vis'); 
          revealObserver.unobserve(e.target); 
        }
      });
    }, { threshold: 0.08 });
    document.querySelectorAll('.sr, .stagger').forEach(el => revealObserver.observe(el));

    // ── SKILL LIST ITEMS: slide in from left on reveal ──
    const skillColObs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.querySelectorAll('.skill-list li').forEach((li, i) => {
          li.style.opacity = '0';
          li.style.transform = 'translateX(-14px)';
          li.style.transition = `opacity .45s ${i * 0.055}s ease, transform .45s ${i * 0.055}s ease`;
          requestAnimationFrame(() => requestAnimationFrame(() => {
            li.style.opacity = '1';
            li.style.transform = 'none';
          }));
        });
        skillColObs.unobserve(entry.target);
      });
    }, { threshold: 0.25 });
    document.querySelectorAll('.skill-col').forEach(col => skillColObs.observe(col));

    // ── PROJECT ROWS: stagger in on scroll ──
    const projTableObs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.querySelectorAll('.project-row').forEach((row, i) => {
          row.style.opacity = '0';
          row.style.transform = 'translateY(18px)';
          row.style.transition = `opacity .55s ${i * 0.09}s ease, transform .55s ${i * 0.09}s ease`;
          requestAnimationFrame(() => requestAnimationFrame(() => {
            row.style.opacity = '1';
            row.style.transform = 'none';
          }));
        });
        projTableObs.unobserve(entry.target);
      });
    }, { threshold: 0.05 });
    const projTable = document.getElementById('projects-table');
    if (projTable) projTableObs.observe(projTable);

    // ── EDU CARDS: scale-in on reveal ──
    const eduObs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.querySelectorAll('.edu-card').forEach((card, i) => {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.97) translateY(12px)';
          card.style.transition = `opacity .5s ${i * 0.1}s ease, transform .5s ${i * 0.1}s ease`;
          requestAnimationFrame(() => requestAnimationFrame(() => {
            card.style.opacity = '1';
            card.style.transform = 'none';
          }));
        });
        eduObs.unobserve(entry.target);
      });
    }, { threshold: 0.15 });
    document.querySelectorAll('.edu-grid').forEach(g => eduObs.observe(g));

    // ── VALUE CARDS: stagger on reveal ──
    const valueObs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.querySelectorAll('.value-card').forEach((card, i) => {
          card.style.opacity = '0';
          card.style.transform = 'translateY(16px)';
          card.style.transition = `opacity .5s ${i * 0.08}s ease, transform .5s ${i * 0.08}s ease`;
          requestAnimationFrame(() => requestAnimationFrame(() => {
            card.style.opacity = '1';
            card.style.transform = 'none';
          }));
        });
        valueObs.unobserve(entry.target);
      });
    }, { threshold: 0.15 });
    document.querySelectorAll('.value-cards').forEach(el => valueObs.observe(el));

    // Cleanup function
    return () => {
      window.removeEventListener('load', handleLoad);
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(loaderTimeout);
      clearTimeout(fallbackTimeout);
      revealObserver.disconnect();
      skillColObs.disconnect();
      projTableObs.disconnect();
      eduObs.disconnect();
      valueObs.disconnect();
    };
  }, []);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      {/* LOADER */}
      <div id="loader">
        <div className="loader-name">Mercy Angelin P</div>
        <div className="loader-bar-wrap"><div className="loader-bar"></div></div>
      </div>

      {/* NAV */}
      <nav id="navbar">
        <div className="nav-brand" onClick={() => window.scrollToSection('home')}>
          <div className="nav-initials">MA</div>
          <div>
            <div className="nav-name-text">Mercy Angelin P</div>
            <div className="nav-sub-text">Software Engineer · React.js · Full Stack</div>
          </div>
        </div>
        <ul className="nav-links">
          <li key="about"><a href="#about" onClick={() => window.scrollToSection('about')} id="nav-about" role="button" tabIndex="0">About</a></li>
          <li key="skills"><a href="#skills" onClick={() => window.scrollToSection('skills')} id="nav-skills" role="button" tabIndex="0">Skills</a></li>
          <li key="experience"><a href="#experience" onClick={() => window.scrollToSection('experience')} id="nav-experience" role="button" tabIndex="0">Experience</a></li>
          <li key="education"><a href="#education" onClick={() => window.scrollToSection('education')} id="nav-education" role="button" tabIndex="0">Education</a></li>
          <li key="contact"><a href="#contact" onClick={() => window.scrollToSection('contact')} className="nav-cta" id="nav-contact" role="button" tabIndex="0">Hire Me</a></li>
        </ul>
      </nav>

      {/* HERO */}
      <section id="home" className="hero">
        <div className="hero-left">
          <div className="hero-eyebrow">Software Engineer &middot; Full Stack Developer</div>
          <h1 className="hero-h1">Mercy<br/><em>Angelin P</em></h1>
          <div className="hero-role-line">
            <span className="hero-role-text">React.js &middot; Python &middot; FastAPI &middot; Frappe</span>
            <span className="hero-role-dot"></span>
            <span className="hero-tenure">June 2022 &ndash; Present</span>
          </div>
          <p className="hero-desc">
            <strong>3 years of production experience</strong> building dynamic, scalable web applications. Expert in React.js frontend development and Python/FastAPI backends &mdash; delivering polished user experiences and robust APIs for real-world platforms.
          </p>
          <div className="hero-actions">
            <a href="#experience" onClick={() => window.scrollToSection('experience')} className="btn-dark">View My Work →</a>
            <a href="mailto:mercyangelin2000@gmail.com" className="btn-ghost">✉&nbsp;Email Me</a>
            <a href="https://www.linkedin.com/in/mercy-angelin-p-a833081b4/" target="_blank" rel="noopener noreferrer" className="btn-ghost">LinkedIn</a>
            <a href="https://github.com/MercyAngelin2000?tab=projects" target="_blank" rel="noopener noreferrer" className="btn-ghost">GitHub</a>
          </div>
        </div>
        <div className="hero-right">
          <div className="profile-section">
            <img src="/Mercy.jpeg" alt="Mercy Angelin P" className="profile-img" onClick={openModal} title="Click to view full image" />
          </div>
          <div>
            <div className="panel-label">At a glance</div>
            <div className="stats-list">
              <div className="stat-item">
                <div className="stat-big" id="stat1">3<sup>+</sup></div>
                <div className="stat-info"><div className="stat-name">Years Experience</div><div className="stat-sub">June 2022 → Now</div></div>
              </div>
              <div className="stat-item">
                <div className="stat-big" id="stat2">5<sup>+</sup></div>
                <div className="stat-info"><div className="stat-name">Projects Shipped</div><div className="stat-sub">Production-grade</div></div>
              </div>
              <div className="stat-item">
                <div className="stat-big">MSc</div>
                <div className="stat-info"><div className="stat-name">Computer Science</div><div className="stat-sub">Thiruvallvar University</div></div>
              </div>
            </div>
          </div>
          <div className="panel-contact">
            <div className="panel-label">Contact</div>
            <div className="c-row"><div className="c-icon">✉</div><div className="c-val"><a href="mailto:mercyangelin2000@gmail.com">mercyangelin2000@gmail.com</a></div></div>
            <div className="c-row"><div className="c-icon">☎</div><div className="c-val">(+91) 8778451528</div></div>
            <div className="c-row"><div className="c-icon">●</div><div className="c-val">Chennai, Tamil Nadu, IN</div></div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="section" style={{background:'var(--white)',borderTop:'1px solid var(--rule)',borderBottom:'1px solid var(--rule)'}}>
        <div className="section-inner">
          <div className="about-grid">
            <div>
              <div className="section-kicker sr">Profile</div>
              <h2 className="section-h2 sr sr-d1" style={{marginBottom:'2rem'}}>Building the web,<br/><em>one component at a time</em></h2>
              <div className="about-text sr sr-d2">
                <p>I'm a <strong>Full Stack Software Engineer</strong> with 3 years of hands-on experience building production web applications. My work spans the full development lifecycle — from crafting pixel-perfect React interfaces to architecting secure FastAPI backends.</p>
                <p>I've shipped real products: a tourism management portal, a Spotify-like streaming platform, a church management system, and a cross-platform field data collection app — each built with care for performance, maintainability, and user experience.</p>
                <p>I thrive in agile, cross-functional teams and bring a detail-oriented mindset to every sprint, every review, and every deployment.</p>
              </div>
            </div>
            <div className="value-cards stagger">
              <div className="value-card" key="val1"><div className="value-num">01</div><div><div className="value-title">Frontend-First Thinking</div><div className="value-desc">Component-driven architecture in React with Redux & Context API. UIs that are fast, accessible, and reusable.</div></div></div>
              <div className="value-card" key="val2"><div className="value-num">02</div><div><div className="value-title">Secure Backend Engineering</div><div className="value-desc">Python FastAPI with JWT, OAuth2, and role-based access control. APIs that are clean and production-hardened.</div></div></div>
              <div className="value-card" key="val3"><div className="value-num">03</div><div><div className="value-title">Agile & Collaborative</div><div className="value-desc">Experienced in Agile/Scrum workflows, Git-based collaboration, and Jira project tracking in cross-functional teams.</div></div></div>
              <div className="value-card" key="val4"><div className="value-num">04</div><div><div className="value-title">End-to-End Ownership</div><div className="value-desc">From design to deployment — I take ownership of features, debug confidently, and ship with care.</div></div></div>
            </div>
          </div>
        </div>
      </section>

      {/* SKILLS */}
      <section id="skills" className="section" style={{background:'var(--cream)'}}>
        <div className="section-inner">
          <div className="section-kicker sr">Technical Expertise</div>
          <h2 className="section-h2 sr sr-d1" style={{marginBottom:'2.5rem'}}>Skills & <em>Technologies</em></h2>
          <div className="skills-layout stagger">
            <div className="skill-col">
              <div className="skill-col-title">Frontend</div>
              <div className="skill-col-sub">UI Development & Design Systems</div>
              <ul className="skill-list">
                <li key="react">React JS</li><li key="next">Next JS</li><li key="js">JavaScript (ES6+)</li><li key="html">HTML5 & CSS3</li>
                <li key="redux">Redux & Context API</li><li key="bootstrap">Bootstrap</li><li key="tailwind">Tailwind CSS</li>
                <li key="mui">Material UI</li><li key="styled">Styled Components</li>
              </ul>
            </div>
            <div className="skill-col">
              <div className="skill-col-title">Backend & Database</div>
              <div className="skill-col-sub">APIs, Auth & Data Persistence</div>
              <ul className="skill-list">
                <li key="python">Python</li><li key="fastapi">FastAPI</li><li key="frappe">Frappe Framework</li><li key="postgres">PostgreSQL</li>
                <li key="maria">MariaDB</li><li key="jwt">JWT Authentication</li><li key="oauth">OAuth2</li>
                <li key="rbac">Role-Based Access Control</li><li key="rest">REST API Design</li>
              </ul>
            </div>
            <div className="skill-col">
              <div className="skill-col-title">Tools & Workflow</div>
              <div className="skill-col-sub">Dev Environment & Process</div>
              <ul className="skill-list">
                <li key="git">Git, GitHub, GitLab</li><li key="agile">Agile / Scrum</li><li key="jira">Jira</li>
                <li key="vscode">Visual Studio Code</li><li key="devtools">Chrome DevTools</li>
                <li key="debug">Debugging & Profiling</li><li key="linux">Linux & Windows</li>
                <li key="perf">Performance Tuning</li><li key="secure">Secure Coding Practices</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* EXPERIENCE */}
      <section id="experience" className="section" style={{background:'var(--white)',borderTop:'1px solid var(--rule)'}}>
        <div className="section-inner">
          <div className="section-kicker sr">Work History</div>
          <h2 className="section-h2 sr sr-d1" style={{marginBottom:'2.5rem'}}>Projects & <em>Experience</em></h2>
          <div className="sr sr-d2">
            <div className="exp-header-bar">
              <div className="exp-company">Software Engineer</div>
              <div className="exp-meta">
                <div className="exp-badge">Full-Time</div>
                <div className="exp-period">June 2022 – Present · 3+ Years</div>
              </div>
            </div>
            <div className="projects-table" id="projects-table">
              <div className="project-row" key="proj1">
                <div className="proj-name-col"><div className="proj-name">Yelagiri Tourism Portal</div><div className="proj-tech-stack"><span className="tech-tag">Python</span><span className="tech-tag">Frappe</span><span className="tech-tag">MariaDB</span><span className="tech-tag">HTML/CSS</span><span className="tech-tag">Vanilla JS</span></div></div>
                <div className="proj-details-col"><div className="proj-tagline">A one-stop tourism management platform for exploring attractions, booking accommodations, and planning hill station getaways.</div><ul className="proj-points"><li key="p1-1">Developed Event & Attraction modules with calendar views, recurrence handling, media management, and SEO optimization</li><li key="p1-2">Implemented backend APIs, custom DocTypes, and client-side validations for dynamic event scheduling</li><li key="p1-3">Built interactive event listings with real-time filters, updates, and media gallery integration</li></ul></div>
                <div className="proj-index-col"><div className="proj-num">01</div></div>
              </div>
              <div className="project-row" key="proj2">
                <div className="proj-name-col"><div className="proj-name">DBMusic Streaming Platform</div><div className="proj-tech-stack"><span className="tech-tag">FastAPI</span><span className="tech-tag">PostgreSQL</span><span className="tech-tag">React JS</span><span className="tech-tag">Bootstrap</span></div></div>
                <div className="proj-details-col"><div className="proj-tagline">A Spotify-like music and video streaming platform with a dedicated Videos tab for exclusive artist content.</div><ul className="proj-points"><li key="p2-1">Implemented RESTful API endpoints using FastAPI for the dashboard and streaming features</li><li key="p2-2">Developed dynamic, responsive UI components using React.js</li><li key="p2-3">Ensured seamless integration between frontend and backend modules</li></ul></div>
                <div className="proj-index-col"><div className="proj-num">02</div></div>
              </div>
              <div className="project-row" key="proj3">
                <div className="proj-name-col"><div className="proj-name">Cristo+ Church Health System</div><div className="proj-tech-stack"><span className="tech-tag">React JS</span><span className="tech-tag">Bootstrap</span></div></div>
                <div className="proj-details-col"><div className="proj-tagline">A software toolkit to organize information, coordinate events, and manage congregation members and communications.</div><ul className="proj-points"><li key="p3-1">Designed and developed responsive UI for Church Health, Survey, and Sermon modules in React.js</li><li key="p3-2">Maintained and enhanced functionality across Member, Group, and Event modules</li></ul></div>
                <div className="proj-index-col"><div className="proj-num">03</div></div>
              </div>
              <div className="project-row" key="proj4">
                <div className="proj-name-col"><div className="proj-name">KapTrack</div><div className="proj-tech-stack"><span className="tech-tag">React JS</span><span className="tech-tag">Bootstrap</span></div></div>
                <div className="proj-details-col"><div className="proj-tagline">A cross-platform remote data capture and tracking application for Android, iPhone, and web enabling in-field data collection.</div><ul className="proj-points"><li key="p4-1">Performed bug fixes and implemented additional features to enhance functionality and user experience</li></ul></div>
                <div className="proj-index-col"><div className="proj-num">04</div></div>
              </div>
              <div className="project-row" key="proj5">
                <div className="proj-name-col"><div className="proj-name">HIGH OCTAVEZ</div><div className="proj-tech-stack"><span className="tech-tag">FastAPI</span><span className="tech-tag">PostgreSQL</span><span className="tech-tag">React JS</span><span className="tech-tag">Bootstrap</span></div></div>
                <div className="proj-details-col"><div className="proj-tagline">An online booking platform for music events with modules for Login, Events, Performers, Gallery, Audition Enquiry, and Contact.</div><ul className="proj-points"><li key="p5-1">Developed backend REST APIs using FastAPI framework with PostgreSQL integration</li><li key="p5-2">Implemented dynamic, responsive UI components using React.js</li><li key="p5-3">Ensured seamless frontend-backend module integration</li></ul></div>
                <div className="proj-index-col"><div className="proj-num">05</div></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* EDUCATION */}
      <section id="education" className="section" style={{background:'var(--cream)',borderTop:'1px solid var(--rule)'}}>
        <div className="section-inner">
          <div className="section-kicker sr">Academic Background</div>
          <h2 className="section-h2 sr sr-d1" style={{marginBottom:'2.5rem'}}>Education & <em>Qualifications</em></h2>
          <div className="edu-grid stagger">
            <div className="edu-card" key="edu2022"><div className="edu-year">2022</div><div className="edu-degree">MSc Computer Science</div><div className="edu-school">Don Bosco College</div><div className="edu-loc">Thiruvallvar University · Yelagiri, TN</div></div>
            <div className="edu-card" key="edu2020"><div className="edu-year">2020</div><div className="edu-degree">BSc Computer Science</div><div className="edu-school">Don Bosco College</div><div className="edu-loc">Thiruvallvar University · Yelagiri, TN</div></div>
            <div className="edu-card" key="edu2017"><div className="edu-year">2017</div><div className="edu-degree">Higher Secondary School</div><div className="edu-school">St. Antony's Higher Secondary School</div><div className="edu-loc">Elathagiri · Krishnagiri, TN</div></div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" style={{background:'var(--ink)',padding:'6rem 4rem'}}>
        <div className="contact-inner">
          <div className="contact-left">
            <div className="section-kicker sr" style={{color:'var(--gold)'}}>Let's Connect</div>
            <h2 className="contact-h2 sr sr-d1">Open to<br/><em>new opportunities</em></h2>
            <p className="contact-body sr sr-d2">I'm actively looking for software engineering roles where I can contribute my React.js and Python skills to a product-focused team. If you're hiring, let's talk.</p>
            <div className="contact-details sr sr-d3">
              <div className="cd-item" key="email"><div className="cd-label">Email</div><div className="cd-val"><a href="mailto:mercyangelin2000@gmail.com">mercyangelin2000@gmail.com</a></div></div>
              <div className="cd-item" key="phone"><div className="cd-label">Phone</div><div className="cd-val">(+91) 8778451528</div></div>
              <div className="cd-item" key="location"><div className="cd-label">Location</div><div className="cd-val">Chennai, Tamil Nadu, India</div></div>
              <div className="cd-item" key="exp"><div className="cd-label">Experience</div><div className="cd-val">3+ Years · Full Stack Development</div></div>
              <div className="cd-item" key="status"><div className="cd-label">Status</div><div className="cd-val" style={{color:'#7fffd4'}}>● Actively seeking roles</div></div>
            </div>
          </div>
          <div className="contact-right sr sr-d2">
            <div className="cta-card">
              <div className="cta-headline">Ready to contribute from Day 1</div>
              <div className="cta-sub">3 years of production experience with React.js, FastAPI, and PostgreSQL. Experienced in Agile workflows and cross-functional collaboration.</div>
              <a href="mailto:mercyangelin2000@gmail.com" className="btn-gold">✉&nbsp;Send Me a Message</a>
            </div>
            <div className="cta-card" style={{padding:'1.8rem 2.5rem'}}>
              <div className="mini-stats">
                <div style={{textAlign:'center'}}><div className="mini-stat-num">React</div><div className="mini-stat-label">Primary Stack</div></div>
                <div className="mini-div"></div>
                <div style={{textAlign:'center'}}><div className="mini-stat-num">FastAPI</div><div className="mini-stat-label">Backend</div></div>
                <div className="mini-div"></div>
                <div style={{textAlign:'center'}}><div className="mini-stat-num">MSc</div><div className="mini-stat-label">Education</div></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-copy">&copy; 2025 Mercy Angelin P · Software Engineer</div>
        <ul className="footer-links">
          <li key="home"><a href="#home" onClick={() => window.scrollToSection('home')} role="button" tabIndex="0">Home</a></li>
          <li key="skills"><a href="#skills" onClick={() => window.scrollToSection('skills')} role="button" tabIndex="0">Skills</a></li>
          <li key="experience"><a href="#experience" onClick={() => window.scrollToSection('experience')} role="button" tabIndex="0">Experience</a></li>
          <li key="contact"><a href="#contact" onClick={() => window.scrollToSection('contact')} role="button" tabIndex="0">Contact</a></li>
        </ul>
      </footer>

      {/* PROFILE IMAGE MODAL */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="modal-close" onClick={closeModal}>&times;</span>
            <img src="/Mercy.jpeg" alt="Mercy Angelin P" className="modal-image" />
          </div>
        </div>
      )}
    </>
  );
}

export default App;
