import { useState, useEffect } from 'react';
import { Layout, Button, Row, Col, Card, Typography, Space, Avatar, Timeline, Form, Input, Select, message } from 'antd';
import { 
  UserOutlined, 
  CheckCircleOutlined,
  RocketOutlined,
  TrophyOutlined,
  TeamOutlined,
  BookOutlined,
  LineChartOutlined,
  SafetyCertificateOutlined,
  BellOutlined,
  CalendarOutlined,
  StarFilled,
  ArrowRightOutlined,
  FacebookFilled,
  TwitterOutlined,
  InstagramFilled,
  LinkedinFilled,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  AimOutlined,
  EyeOutlined,
  HeartOutlined,
  FireOutlined,
  ThunderboltOutlined,
  MenuOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

const { Header, Content, Footer } = Layout;
const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

export default function LandingPage() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  const handleInquirySubmit = (values) => {
    console.log('Inquiry submitted:', values);
    message.success('Thank you for your inquiry! We will contact you soon.');
  };

  const programs = [
    {
      icon: <BookOutlined />,
      title: "Primary Education",
      description: "Grades 1-5: Foundation building with engaging learning experiences. Focus on literacy, numeracy, and social skills development.",
      color: "#667eea"
    },
    {
      icon: <TeamOutlined />,
      title: "Middle School",
      description: "Grades 6-8: Comprehensive curriculum with emphasis on critical thinking, analytical skills, and character building.",
      color: "#f5576c"
    },
    {
      icon: <TrophyOutlined />,
      title: "High School",
      description: "Grades 9-10: Advanced academics preparing students for board examinations with personalized learning paths.",
      color: "#00f2fe"
    },
    {
      icon: <RocketOutlined />,
      title: "Senior Secondary",
      description: "Grades 11-12: Specialized streams (Science, Commerce, Arts) with college preparation and career guidance.",
      color: "#38f9d7"
    }
  ];

  const achievements = [
    {
      icon: "🏆",
      title: "100% Board Results",
      description: "Consistent 100% pass rate in board examinations for past 5 years with 95% distinction.",
      stat: "100%"
    },
    {
      icon: "🥇",
      title: "State Champions",
      description: "State level champions in basketball, athletics, and debate competitions.",
      stat: "15+"
    },
    {
      icon: "🎖️",
      title: "Awards Won",
      description: "Recognized as 'Best School' by Education Board with multiple excellence awards.",
      stat: "25+"
    },
    {
      icon: "👨‍🎓",
      title: "Alumni Success",
      description: "Students placed in top universities and leading companies worldwide.",
      stat: "2000+"
    }
  ];

  const news = [
    {
      date: "March 15, 2026",
      title: "Annual Sports Day 2026",
      description: "Grand sports event featuring athletics, cultural performances, and award ceremonies. All students and parents welcome!",
      type: "Event"
    },
    {
      date: "March 10, 2026",
      title: "Science Exhibition Opens",
      description: "Students showcase innovative projects in annual science fair. Open to public March 25-26. Don't miss!",
      type: "News"
    },
    {
      date: "March 5, 2026",
      title: "Parent-Teacher Meeting",
      description: "Scheduled parent-teacher interactions to discuss student progress and academic planning for next term.",
      type: "Event"
    },
    {
      date: "February 28, 2026",
      title: "Admissions Open 2026-27",
      description: "Applications now being accepted for all grades. Limited seats available. Apply before April 30, 2026.",
      type: "Admission"
    }
  ];

  const features = [
    {
      icon: <UserOutlined />,
      title: "Smart Student Management",
      description: "Complete student lifecycle management from admission to graduation with digital records."
    },
    {
      icon: <BookOutlined />,
      title: "Modern Curriculum",
      description: "Updated curriculum aligned with NEP 2020 and international standards for holistic development."
    },
    {
      icon: <TeamOutlined />,
      title: "Experienced Faculty",
      description: "150+ qualified teachers with average 10+ years experience and continuous professional development."
    },
    {
      icon: <SafetyCertificateOutlined />,
      title: "Safe Environment",
      description: "24/7 CCTV surveillance, trained security, and strict safety protocols ensuring student wellbeing."
    },
    {
      icon: <LineChartOutlined />,
      title: "Performance Tracking",
      description: "Real-time progress monitoring with detailed analytics and personalized learning recommendations."
    },
    {
      icon: <CalendarOutlined />,
      title: "Smart Scheduling",
      description: "Efficient timetable management with automated attendance and integrated digital learning platform."
    }
  ];

  return (
    <Layout className="landing-page">
      {/* Navigation Header */}
      <Header className={`modern-header ${scrolled ? 'scrolled' : ''}`}>
        <div className="header-content">
          <div className="logo-wrapper" onClick={() => scrollToSection('hero')}>
            <div className="logo-gradient">
              <span className="logo-icon">🎓</span>
            </div>
            <span className="brand-name">SchoolERP</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="nav-menu desktop-nav">
            <a onClick={() => scrollToSection('about')}>About</a>
            <a onClick={() => scrollToSection('programs')}>Programs</a>
            <a onClick={() => scrollToSection('achievements')}>Achievements</a>
            <a onClick={() => scrollToSection('admissions')}>Admissions</a>
            <a onClick={() => scrollToSection('news')}>News</a>
            <a onClick={() => scrollToSection('contact')}>Contact</a>
          </nav>

          {/* Mobile Menu Toggle */}
          <Button 
            className="mobile-menu-btn"
            icon={<MenuOutlined />}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          />

          <Space className="header-actions desktop-actions">
            <Button 
              type="text" 
              size="large"
              className="header-btn signin-btn"
              onClick={() => navigate('/login')}
            >
              Portal Login
            </Button>
            <Button 
              type="primary" 
              size="large"
              className="header-btn register-btn"
              onClick={() => scrollToSection('admissions')}
            >
              Apply Now
            </Button>
          </Space>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <nav className="mobile-nav-menu">
            <a onClick={() => scrollToSection('about')}>About</a>
            <a onClick={() => scrollToSection('programs')}>Programs</a>
            <a onClick={() => scrollToSection('achievements')}>Achievements</a>
            <a onClick={() => scrollToSection('admissions')}>Admissions</a>
            <a onClick={() => scrollToSection('news')}>News</a>
            <a onClick={() => scrollToSection('contact')}>Contact</a>
            <Button 
              type="primary" 
              block
              onClick={() => navigate('/login')}
            >
              Portal Login
            </Button>
          </nav>
        )}
      </Header>

      <Content>
        {/* Hero Section */}
        <section id="hero" className="hero-section">
          <div className="hero-background">
            <div className="gradient-orb orb-1"></div>
            <div className="gradient-orb orb-2"></div>
            <div className="gradient-orb orb-3"></div>
          </div>
          
          <div className="hero-content">
            <Row gutter={[60, 60]} align="middle">
              <Col xs={24} lg={12}>
                <div className="hero-text">
                  <div className="hero-badge">
                    <RocketOutlined className="badge-icon" />
                    <span>25+ Years of Educational Excellence</span>
                  </div>
                  
                  <h1 className="hero-title">
                    Shaping Future
                    <span className="gradient-text"> Leaders </span>
                    Through Quality Education
                  </h1>
                  
                  <p className="hero-subtitle">
                    Empowering 2000+ students with world-class education, modern facilities, 
                    and a nurturing environment that fosters academic excellence and character development.
                  </p>
                  
                  <div className="hero-buttons">
                    <Button 
                      type="primary" 
                      size="large" 
                      className="cta-button primary"
                      onClick={() => scrollToSection('admissions')}
                      icon={<ArrowRightOutlined />}
                    >
                      Apply for Admission
                    </Button>
                    <Button 
                      size="large" 
                      className="cta-button secondary"
                      onClick={() => scrollToSection('about')}
                    >
                      Learn More
                    </Button>
                  </div>

                  <div className="trust-badges">
                    <div className="badge-item">
                      <CheckCircleOutlined className="check-icon" />
                      <span>CBSE Affiliated</span>
                    </div>
                    <div className="badge-item">
                      <CheckCircleOutlined className="check-icon" />
                      <span>100% Board Pass Rate</span>
                    </div>
                  </div>
                </div>
              </Col>

              <Col xs={24} lg={12}>
                <div className="hero-visual">
                  <div className="floating-card card-1">
                    <div className="card-icon">
                      <UserOutlined />
                    </div>
                    <div className="card-content">
                      <div className="card-number">2,000+</div>
                      <div className="card-label">Active Students</div>
                    </div>
                  </div>
                  
                  <div className="floating-card card-2">
                    <div className="card-icon success">
                      <TrophyOutlined />
                    </div>
                    <div className="card-content">
                      <div className="card-number">100%</div>
                      <div className="card-label">Board Pass Rate</div>
                    </div>
                  </div>

                  <div className="hero-image-wrapper">
                    <div className="image-glow"></div>
                    <img 
                      src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=900&fit=crop" 
                      alt="Students learning"
                      className="hero-main-image"
                    />
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </section>

        {/* Stats Section */}
        <section className="stats-section">
          <div className="container">
            <Row gutter={[30, 30]}>
              <Col xs={12} md={6}>
                <div className="stat-card">
                  <div className="stat-icon"><UserOutlined /></div>
                  <div className="stat-number">2,000+</div>
                  <div className="stat-label">Students Enrolled</div>
                </div>
              </Col>
              <Col xs={12} md={6}>
                <div className="stat-card">
                  <div className="stat-icon"><TeamOutlined /></div>
                  <div className="stat-number">150+</div>
                  <div className="stat-label">Expert Faculty</div>
                </div>
              </Col>
              <Col xs={12} md={6}>
                <div className="stat-card">
                  <div className="stat-icon"><StarFilled /></div>
                  <div className="stat-number">100%</div>
                  <div className="stat-label">Board Pass Rate</div>
                </div>
              </Col>
              <Col xs={12} md={6}>
                <div className="stat-card">
                  <div className="stat-icon"><TrophyOutlined /></div>
                  <div className="stat-number">25+</div>
                  <div className="stat-label">Years Experience</div>
                </div>
              </Col>
            </Row>
          </div>
        </section>

        {/* About Section - Mission & Vision */}
        <section id="about" className="about-section">
          <div className="container">
            <div className="section-header">
              <span className="section-tag">About Our School</span>
              <h2 className="section-title">
                Building Tomorrow's
                <span className="gradient-text"> Leaders Today</span>
              </h2>
              <p className="section-description">
                For over 25 years, we've been committed to providing quality education 
                that nurtures young minds and prepares them for global success.
              </p>
            </div>

            <Row gutter={[60, 60]} align="middle">
              <Col xs={24} lg={12}>
                <div className="about-image-grid">
                  <div className="grid-item item-1">
                    <img src="https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=400&h=500&fit=crop" alt="Students in classroom" />
                  </div>
                  <div className="grid-item item-2">
                    <img src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=300&fit=crop" alt="School campus" />
                  </div>
                  <div className="experience-badge">
                    <div className="badge-number">25+</div>
                    <div className="badge-text">Years of Excellence</div>
                  </div>
                </div>
              </Col>

              <Col xs={24} lg={12}>
                <div className="about-content">
                  <div className="mission-vision-card">
                    <div className="mv-item">
                      <div className="mv-icon">
                        <AimOutlined style={{ fontSize: 32, color: '#667eea' }} />
                      </div>
                      <div className="mv-content">
                        <h3>Our Mission</h3>
                        <p>
                          To provide quality education that nurtures young minds, builds character, 
                          and prepares students for success in an ever-changing world. We believe 
                          in holistic development combining academic excellence with moral values.
                        </p>
                      </div>
                    </div>

                    <div className="mv-item">
                      <div className="mv-icon">
                        <EyeOutlined style={{ fontSize: 32, color: '#f5576c' }} />
                      </div>
                      <div className="mv-content">
                        <h3>Our Vision</h3>
                        <p>
                          To be a leading educational institution recognized for innovation, 
                          excellence, and inclusive learning. We aim to create global citizens 
                          who contribute positively to society and lead with integrity.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="check-list">
                    <div className="check-item">
                      <CheckCircleOutlined className="check-icon" />
                      <span>State-of-the-art infrastructure and smart classrooms</span>
                    </div>
                    <div className="check-item">
                      <CheckCircleOutlined className="check-icon" />
                      <span>Experienced faculty with continuous training</span>
                    </div>
                    <div className="check-item">
                      <CheckCircleOutlined className="check-icon" />
                      <span>Comprehensive sports and co-curricular programs</span>
                    </div>
                    <div className="check-item">
                      <CheckCircleOutlined className="check-icon" />
                      <span>Individual attention with optimal student-teacher ratio</span>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </section>

        {/* Programs Section */}
        <section id="programs" className="features-section programs-section">
          <div className="container">
            <div className="section-header">
              <span className="section-tag">Academic Programs</span>
              <h2 className="section-title">
                Comprehensive Education for
                <span className="gradient-text"> Every Stage</span>
              </h2>
              <p className="section-description">
                From foundational learning to advanced academics, we offer programs 
                tailored to each developmental stage of your child's educational journey.
              </p>
            </div>

            <Row gutter={[30, 30]}>
              {programs.map((program, index) => (
                <Col xs={24} sm={12} lg={6} key={index}>
                  <Card className="feature-card program-card">
                    <div className="feature-icon-wrapper" style={{ background: program.color }}>
                      {program.icon}
                    </div>
                    <h3 className="feature-title">{program.title}</h3>
                    <p className="feature-description">{program.description}</p>
                  </Card>
                </Col>
              ))}
            </Row>

            {/* Extra-Curricular Activities */}
            <div className="extracurricular-section">
              <Title level={3} style={{ textAlign: 'center', marginBottom: 32 }}>
                Beyond Academics
              </Title>
              <Row gutter={[16, 16]} justify="center">
                {['🎨 Arts & Crafts', '⚽ Sports', '🎭 Drama', '🎵 Music', '🔬 Science Club', '💻 Coding', '📚 Debate', '🌍 Social Service'].map((activity, i) => (
                  <Col xs={12} sm={8} md={6} key={i}>
                    <div className="activity-badge">{activity}</div>
                  </Col>
                ))}
              </Row>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="features-grid-section">
          <div className="container">
            <div className="section-header">
              <span className="section-tag">Why Choose Us</span>
              <h2 className="section-title">
                What Makes Us
                <span className="gradient-text"> Different</span>
              </h2>
            </div>

            <Row gutter={[30, 30]}>
              {features.map((feature, index) => (
                <Col xs={24} md={8} key={index}>
                  <Card className="feature-card">
                    <div className="feature-icon-wrapper">
                      {feature.icon}
                    </div>
                    <h3 className="feature-title">{feature.title}</h3>
                    <p className="feature-description">{feature.description}</p>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        </section>

        {/* Achievements Section */}
        <section id="achievements" className="achievements-section">
          <div className="container">
            <div className="section-header">
              <span className="section-tag">Our Achievements</span>
              <h2 className="section-title">
                Celebrating Excellence
                <span className="gradient-text"> & Success</span>
              </h2>
              <p className="section-description">
                Our students' achievements and institutional recognition speak volumes 
                about our commitment to quality education.
              </p>
            </div>

            <Row gutter={[30, 30]}>
              {achievements.map((achievement, index) => (
                <Col xs={24} sm={12} lg={6} key={index}>
                  <Card className="achievement-card">
                    <div className="achievement-icon">{achievement.icon}</div>
                    <div className="achievement-stat">{achievement.stat}</div>
                    <Title level={4}>{achievement.title}</Title>
                    <Paragraph>{achievement.description}</Paragraph>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        </section>

        {/* Admissions Section */}
        <section id="admissions" className="admissions-section">
          <div className="container">
            <div className="section-header">
              <span className="section-tag">Admissions 2026-27</span>
              <h2 className="section-title">
                Join Our Learning
                <span className="gradient-text"> Community</span>
              </h2>
              <p className="section-description">
                Applications are now open for academic year 2026-27. 
                Limited seats available across all grades.
              </p>
            </div>

            <Row gutter={[60, 60]} align="middle">
              <Col xs={24} lg={12}>
                <Card className="admission-process-card">
                  <Title level={3}>Admission Process</Title>
                  <Timeline
                    items={[
                      {
                        dot: <div className="timeline-dot">1</div>,
                        children: (
                          <div className="timeline-content">
                            <h4>Submit Application</h4>
                            <p>Fill online application form with required documents</p>
                          </div>
                        ),
                      },
                      {
                        dot: <div className="timeline-dot">2</div>,
                        children: (
                          <div className="timeline-content">
                            <h4>Entrance Assessment</h4>
                            <p>Appear for grade-appropriate entrance test (if applicable)</p>
                          </div>
                        ),
                      },
                      {
                        dot: <div className="timeline-dot">3</div>,
                        children: (
                          <div className="timeline-content">
                            <h4>Parent-Student Interview</h4>
                            <p>Interaction with principal and academic coordinator</p>
                          </div>
                        ),
                      },
                      {
                        dot: <div className="timeline-dot">4</div>,
                        children: (
                          <div className="timeline-content">
                            <h4>Admission Confirmation</h4>
                            <p>Fee payment and enrollment completion</p>
                          </div>
                        ),
                      },
                    ]}
                  />

                  <div className="important-dates-box">
                    <Title level={4}>
                      <CalendarOutlined /> Important Dates
                    </Title>
                    <div className="date-item">
                      <Text strong>Application Deadline:</Text>
                      <Text>April 30, 2026</Text>
                    </div>
                    <div className="date-item">
                      <Text strong>Entrance Test:</Text>
                      <Text>May 15, 2026</Text>
                    </div>
                    <div className="date-item">
                      <Text strong>Results Announcement:</Text>
                      <Text>May 25, 2026</Text>
                    </div>
                    <div className="date-item">
                      <Text strong>Session Starts:</Text>
                      <Text>June 15, 2026</Text>
                    </div>
                  </div>

                  <Button 
                    type="primary" 
                    size="large" 
                    block
                    icon={<ArrowRightOutlined />}
                    onClick={() => navigate('/login')}
                  >
                    Apply Online Now
                  </Button>
                </Card>
              </Col>

              <Col xs={24} lg={12}>
                <div className="why-choose-box">
                  <Title level={3}>Why Enroll Your Child Here?</Title>
                  <div className="benefit-list">
                    {[
                      { icon: <HeartOutlined />, text: "Individual attention with small class sizes" },
                      { icon: <FireOutlined />, text: "Experienced and dedicated faculty members" },
                      { icon: <ThunderboltOutlined />, text: "State-of-the-art infrastructure & labs" },
                      { icon: <TrophyOutlined />, text: "Strong focus on sports and arts" },
                      { icon: <SafetyCertificateOutlined />, text: "Safe and secure campus environment" },
                      { icon: <LineChartOutlined />, text: "Regular parent-teacher communication" },
                      { icon: <BookOutlined />, text: "Comprehensive academic curriculum" },
                      { icon: <RocketOutlined />, text: "Career guidance and counseling" }
                    ].map((benefit, i) => (
                      <div key={i} className="benefit-item">
                        <span className="benefit-icon">{benefit.icon}</span>
                        <span>{benefit.text}</span>
                      </div>
                    ))}
                  </div>

                  <div className="cta-box">
                    <Title level={4}>Have Questions?</Title>
                    <Paragraph>
                      Our admissions team is ready to help you with any queries about 
                      the enrollment process, curriculum, or campus facilities.
                    </Paragraph>
                    <Button 
                      size="large" 
                      icon={<PhoneOutlined />}
                      onClick={() => scrollToSection('contact')}
                    >
                      Contact Admissions Office
                    </Button>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </section>

        {/* News & Events Section */}
        <section id="news" className="news-section">
          <div className="container">
            <div className="section-header">
              <span className="section-tag">Latest Updates</span>
              <h2 className="section-title">
                News & Upcoming
                <span className="gradient-text"> Events</span>
              </h2>
              <p className="section-description">
                Stay updated with the latest happenings, events, and announcements from our school.
              </p>
            </div>

            <Row gutter={[30, 30]}>
              {news.map((item, index) => (
                <Col xs={24} sm={12} lg={6} key={index}>
                  <Card className="news-card" hoverable>
                    <div className="news-type-badge">{item.type}</div>
                    <div className="news-date">
                      <CalendarOutlined /> {item.date}
                    </div>
                    <Title level={4}>{item.title}</Title>
                    <Paragraph>{item.description}</Paragraph>
                    <Button type="link" className="read-more-btn">
                      Read More <ArrowRightOutlined />
                    </Button>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="contact-section">
          <div className="container">
            <div className="section-header">
              <span className="section-tag">Get In Touch</span>
              <h2 className="section-title">
                Contact
                <span className="gradient-text"> Us</span>
              </h2>
              <p className="section-description">
                Have questions? We're here to help. Reach out to us through any of the channels below.
              </p>
            </div>

            <Row gutter={[60, 60]}>
              <Col xs={24} lg={12}>
                <div className="contact-info-section">
                  <div className="contact-info-card">
                    <div className="contact-icon">
                      <EnvironmentOutlined />
                    </div>
                    <div className="contact-details">
                      <h4>Visit Us</h4>
                      <p>123 Education Street<br />Knowledge City, Maharashtra<br />Pune 411001, India</p>
                    </div>
                  </div>

                  <div className="contact-info-card">
                    <div className="contact-icon">
                      <PhoneOutlined />
                    </div>
                    <div className="contact-details">
                      <h4>Call Us</h4>
                      <p>+91 123 456 7890<br />+91 098 765 4321</p>
                    </div>
                  </div>

                  <div className="contact-info-card">
                    <div className="contact-icon">
                      <MailOutlined />
                    </div>
                    <div className="contact-details">
                      <h4>Email Us</h4>
                      <p>info@schoolerp.com<br />admissions@schoolerp.com</p>
                    </div>
                  </div>

                  <div className="contact-info-card">
                    <div className="contact-icon">
                      <ClockCircleOutlined />
                    </div>
                    <div className="contact-details">
                      <h4>Office Hours</h4>
                      <p>Monday - Friday: 8:00 AM - 5:00 PM<br />Saturday: 9:00 AM - 2:00 PM</p>
                    </div>
                  </div>
                </div>
              </Col>

              <Col xs={24} lg={12}>
                <Card className="inquiry-form-card">
                  <Title level={3}>Send Us a Message</Title>
                  <Form layout="vertical" onFinish={handleInquirySubmit}>
                    <Form.Item 
                      name="name" 
                      label="Full Name"
                      rules={[{ required: true, message: 'Please enter your name' }]}
                    >
                      <Input size="large" placeholder="Your full name" />
                    </Form.Item>

                    <Form.Item 
                      name="email" 
                      label="Email Address"
                      rules={[
                        { required: true, message: 'Please enter your email' },
                        { type: 'email', message: 'Please enter a valid email' }
                      ]}
                    >
                      <Input size="large" placeholder="your@email.com" />
                    </Form.Item>

                    <Form.Item 
                      name="phone" 
                      label="Phone Number"
                      rules={[{ required: true, message: 'Please enter your phone' }]}
                    >
                      <Input size="large" placeholder="+91 1234567890" />
                    </Form.Item>

                    <Form.Item 
                      name="inquiry_type" 
                      label="Inquiry Type"
                      rules={[{ required: true, message: 'Please select inquiry type' }]}
                    >
                      <Select size="large" placeholder="Select inquiry type">
                        <Option value="admissions">Admissions</Option>
                        <Option value="academics">Academics</Option>
                        <Option value="general">General Information</Option>
                        <Option value="other">Other</Option>
                      </Select>
                    </Form.Item>

                    <Form.Item 
                      name="message" 
                      label="Message"
                      rules={[{ required: true, message: 'Please enter your message' }]}
                    >
                      <Input.TextArea 
                        rows={4} 
                        size="large" 
                        placeholder="Tell us about your inquiry..."
                      />
                    </Form.Item>

                    <Form.Item>
                      <Button type="primary" htmlType="submit" size="large" block>
                        Submit Inquiry
                      </Button>
                    </Form.Item>
                  </Form>
                </Card>
              </Col>
            </Row>
          </div>
        </section>
      </Content>

      {/* Footer */}
      <Footer className="modern-footer">
        <div className="container">
          <Row gutter={[40, 40]}>
            <Col xs={24} md={8}>
              <div className="footer-brand">
                <div className="logo-wrapper">
                  <div className="logo-gradient">
                    <span className="logo-icon">🎓</span>
                  </div>
                  <span className="brand-name">SchoolERP</span>
                </div>
                <p className="footer-description">
                  Leading educational institution committed to excellence in academics 
                  and holistic development of students for over 25 years.
                </p>
                <div className="social-links">
                  <a href="#" className="social-icon"><FacebookFilled /></a>
                  <a href="#" className="social-icon"><TwitterOutlined /></a>
                  <a href="#" className="social-icon"><InstagramFilled /></a>
                  <a href="#" className="social-icon"><LinkedinFilled /></a>
                </div>
              </div>
            </Col>

            <Col xs={12} md={5}>
              <div className="footer-column">
                <h4 className="footer-title">Quick Links</h4>
                <a onClick={() => scrollToSection('about')} className="footer-link">About Us</a>
                <a onClick={() => scrollToSection('programs')} className="footer-link">Programs</a>
                <a onClick={() => scrollToSection('achievements')} className="footer-link">Achievements</a>
                <a onClick={() => scrollToSection('admissions')} className="footer-link">Admissions</a>
                <a onClick={() => navigate('/login')} className="footer-link">Portal Login</a>
              </div>
            </Col>

            <Col xs={12} md={5}>
              <div className="footer-column">
                <h4 className="footer-title">Academics</h4>
                <a onClick={() => scrollToSection('programs')} className="footer-link">Primary Education</a>
                <a onClick={() => scrollToSection('programs')} className="footer-link">Middle School</a>
                <a onClick={() => scrollToSection('programs')} className="footer-link">High School</a>
                <a onClick={() => scrollToSection('programs')} className="footer-link">Senior Secondary</a>
              </div>
            </Col>

            <Col xs={24} md={6}>
              <div className="footer-column">
                <h4 className="footer-title">Contact Info</h4>
                <div className="footer-contact">
                  <p><EnvironmentOutlined /> Maharashtra, Pune 411001</p>
                  <p><PhoneOutlined /> +91 123 456 7890</p>
                  <p><MailOutlined /> info@schoolerp.com</p>
                </div>
              </div>
            </Col>
          </Row>

          <div className="footer-bottom">
            <p className="copyright">© 2026 SchoolERP. All rights reserved.</p>
            <div className="footer-links">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">Cookie Policy</a>
            </div>
          </div>
        </div>
      </Footer>
    </Layout>
  );
}