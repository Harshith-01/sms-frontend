import { useState, useEffect } from 'react';
import { Layout, Button, Row, Col, Card, Typography, Form, Input, Select, message } from 'antd';
import { 
  UserOutlined, 
  CheckCircleOutlined,
  RocketOutlined,
  TrophyOutlined,
  TeamOutlined,
  BookOutlined,
  SafetyCertificateOutlined,
  CalendarOutlined,
  ArrowRightOutlined,
  FacebookFilled,
  TwitterOutlined,
  InstagramFilled,
  LinkedinFilled,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  MenuOutlined,
  PlayCircleOutlined,
  StarFilled,
  LineChartOutlined,
  GlobalOutlined,
  SendOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

const { Header, Content, Footer } = Layout;
const { Title, Text, Paragraph } = Typography;

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
    message.success('Thank you! We will contact you soon.');
  };

  const features = [
    {
      icon: <BookOutlined />,
      title: "Fun Meets Learning",
      description: "Interactive lessons that make education exciting and engaging for every student."
    },
    {
      icon: <RocketOutlined />,
      title: "Unlock Your Potential",
      description: "Personalized learning paths designed to help each student reach their full capabilities."
    },
    {
      icon: <TeamOutlined />,
      title: "One-on-One Learning",
      description: "Connect with expert tutors anytime, anywhere for personalized attention."
    },
    {
      icon: <SafetyCertificateOutlined />,
      title: "Safe & Secure",
      description: "Advanced security measures ensuring complete data protection and privacy."
    }
  ];

  return (
    <Layout className="landing-page-pro">
      {/* Header */}
      <Header className={`pro-header ${scrolled ? 'scrolled' : ''}`}>
        <div className="header-wrapper">
          <div className="logo-section" onClick={() => scrollToSection('hero')}>
            <div className="logo-circle">
              <span className="logo-emoji">🎓</span>
            </div>
            <span className="brand-text">SchoolERP</span>
          </div>

          {/* Desktop Nav */}
          <nav className="nav-links desktop-only">
            <a onClick={() => scrollToSection('about')}>About</a>
            <a onClick={() => scrollToSection('features')}>Features</a>
            <a onClick={() => scrollToSection('admissions')}>Admissions</a>
            <a onClick={() => scrollToSection('contact')}>Contact</a>
          </nav>

          {/* Mobile Menu Toggle */}
          <Button 
            className="mobile-toggle"
            icon={<MenuOutlined />}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          />

          {/* Desktop Actions */}
          <div className="header-cta desktop-only">
            <Button 
              type="text" 
              size="large"
              onClick={() => navigate('/login')}
              className="login-btn"
            >
              Portal Login
            </Button>
            <Button 
              type="primary" 
              size="large"
              className="apply-btn"
              onClick={() => scrollToSection('contact')}
            >
              Apply Now
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="mobile-menu">
            <a onClick={() => scrollToSection('about')}>About</a>
            <a onClick={() => scrollToSection('features')}>Features</a>
            <a onClick={() => scrollToSection('admissions')}>Admissions</a>
            <a onClick={() => scrollToSection('contact')}>Contact</a>
            <Button type="primary" block onClick={() => navigate('/login')}>
              Portal Login
            </Button>
          </nav>
        )}
      </Header>

      <Content>
        {/* Hero Section */}
        <section id="hero" className="hero-pro">
          <div className="hero-container">
            <Row gutter={[80, 60]} align="middle">
              <Col xs={24} lg={12}>
                <div className="hero-left">
                  <div className="welcome-tag">
                    <span className="star-icon">✨</span>
                    <span>Welcome to School</span>
                  </div>
                  
                  <h1 className="hero-main-title">
                    ERP <span className="highlight-yellow">Portal</span>
                  </h1>
                  
                  <h2 className="hero-subtitle">
                    Smart. <span className="bold-text">Secure.</span> Seamless<br/>
                    School Management.
                  </h2>
                  
                  <p className="hero-description">
                    Our ERP system brings all school operations under one digital roof—from 
                    admissions to attendance and exams—built for efficiency and ease.
                  </p>
                  
                  <div className="hero-buttons">
                    <Button 
                      type="primary" 
                      size="large" 
                      className="btn-primary-hero"
                      onClick={() => scrollToSection('contact')}
                    >
                      JOIN NOW
                    </Button>
                    <Button 
                      size="large" 
                      className="btn-secondary-hero"
                      icon={<PlayCircleOutlined />}
                      onClick={() => scrollToSection('about')}
                    >
                      See how it works?
                    </Button>
                  </div>
                </div>
              </Col>

              <Col xs={24} lg={12}>
                <div className="hero-right">
                  <div className="hero-shape">
                    <img 
                      src="https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&h=900&fit=crop" 
                      alt="Student with backpack"
                      className="hero-student-img"
                    />
                  </div>
                  <div className="curve-decoration"></div>
                </div>
              </Col>
            </Row>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="about-pro">
          <div className="about-container">
            <Row gutter={[80, 60]} align="middle">
              <Col xs={24} lg={12}>
                <div className="about-visual">
                  <div className="video-thumbnail">
                    <img 
                      src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop" 
                      alt="Students learning"
                    />
                    <div className="play-overlay">
                      <PlayCircleOutlined className="play-icon" />
                    </div>
                  </div>
                </div>
              </Col>

              <Col xs={24} lg={12}>
                <div className="about-content">
                  <div className="section-tag-small">ABOUT US</div>
                  <h2 className="section-heading">
                    School <span className="bold-text">ERP</span>
                  </h2>
                  <p className="section-text">
                    A modern, cloud-based ERP system built specifically for schools. 
                    Designed for administrators, teachers, students, and parents to 
                    streamline operations, improve communication, and enhance learning outcomes.
                  </p>
                  <Button 
                    type="primary" 
                    size="large"
                    className="learn-more-btn"
                  >
                    LEARN MORE
                  </Button>
                </div>
              </Col>
            </Row>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section id="features" className="why-choose-pro">
          <div className="why-container">
            <Row gutter={[80, 60]} align="middle">
              <Col xs={24} lg={12} className="order-2-mobile">
                <div className="why-content">
                  <div className="section-tag-small">WHY CHOOSE US</div>
                  <h2 className="section-heading">
                    Our <span className="bold-text">ERP</span>
                  </h2>
                  <p className="section-text">
                    An all-in-one platform designed to make school management effortless. 
                    Whether you're an administrator, teacher, parent, or student, our ERP 
                    portal empowers you with the tools you need.
                  </p>
                  <Button 
                    type="primary" 
                    size="large"
                    className="learn-more-btn"
                  >
                    LEARN MORE
                  </Button>
                </div>
              </Col>

              <Col xs={24} lg={12} className="order-1-mobile">
                <div className="why-visual">
                  <div className="circular-images">
                    <div className="circle-large">
                      <img 
                        src="https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=600&h=600&fit=crop" 
                        alt="Classroom"
                      />
                    </div>
                    <div className="circle-small">
                      <img 
                        src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=400&fit=crop" 
                        alt="Student studying"
                      />
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </section>

        {/* Features Grid Section */}
        <section className="features-grid-pro">
          <div className="features-container">
            <div className="features-header">
              <div className="section-tag-center">KEY FEATURES</div>
              <h2 className="section-heading-center">
                Why we are <span className="bold-text">best from others?</span>
              </h2>
              <p className="section-desc-center">
                Our comprehensive platform combines cutting-edge technology with 
                user-friendly design to deliver exceptional results.
              </p>
            </div>

            <Row gutter={[40, 40]}>
              {features.map((feature, index) => (
                <Col xs={24} sm={12} lg={6} key={index}>
                  <Card className="feature-card-pro" bordered={false}>
                    <div className="feature-image-wrapper">
                      <img 
                        src={`https://images.unsplash.com/photo-${
                          index === 0 ? '1522202176988-66273c2fd55f' :
                          index === 1 ? '1503676260728-1c00da094a0b' :
                          index === 2 ? '1427504494785-3a9ca7044f45' :
                          '1524178232752-5aa446c20e41'
                        }?w=400&h=300&fit=crop`}
                        alt={feature.title}
                        className="feature-img"
                      />
                    </div>
                    <div className="feature-content">
                      <h3>{feature.title}</h3>
                      <p>{feature.description}</p>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        </section>

        {/* Stats Section */}
        <section className="stats-pro">
          <div className="stats-container">
            <Row gutter={[40, 40]}>
              <Col xs={12} sm={6}>
                <div className="stat-box">
                  <div className="stat-number">2,000+</div>
                  <div className="stat-label">Students</div>
                </div>
              </Col>
              <Col xs={12} sm={6}>
                <div className="stat-box">
                  <div className="stat-number">150+</div>
                  <div className="stat-label">Teachers</div>
                </div>
              </Col>
              <Col xs={12} sm={6}>
                <div className="stat-box">
                  <div className="stat-number">100%</div>
                  <div className="stat-label">Pass Rate</div>
                </div>
              </Col>
              <Col xs={12} sm={6}>
                <div className="stat-box">
                  <div className="stat-number">25+</div>
                  <div className="stat-label">Years</div>
                </div>
              </Col>
            </Row>
          </div>
        </section>

        {/* Admissions Section */}
        <section id="admissions" className="admissions-pro">
          <div className="admissions-container">
            <div className="admissions-header">
              <div className="section-tag-center">ADMISSIONS 2026-27</div>
              <h2 className="section-heading-center">
                Join Our <span className="bold-text">Learning Community</span>
              </h2>
            </div>

            <Row gutter={[60, 60]}>
              <Col xs={24} lg={12}>
                <Card className="admission-card" bordered={false}>
                  <Title level={3}>Important Dates</Title>
                  <div className="dates-list">
                    <div className="date-row">
                      <CalendarOutlined className="date-icon" />
                      <div className="date-info">
                        <Text strong>Application Deadline</Text>
                        <Text>April 30, 2026</Text>
                      </div>
                    </div>
                    <div className="date-row">
                      <CalendarOutlined className="date-icon" />
                      <div className="date-info">
                        <Text strong>Entrance Test</Text>
                        <Text>May 15, 2026</Text>
                      </div>
                    </div>
                    <div className="date-row">
                      <CalendarOutlined className="date-icon" />
                      <div className="date-info">
                        <Text strong>Results Announcement</Text>
                        <Text>May 25, 2026</Text>
                      </div>
                    </div>
                    <div className="date-row">
                      <CalendarOutlined className="date-icon" />
                      <div className="date-info">
                        <Text strong>Session Starts</Text>
                        <Text>June 15, 2026</Text>
                      </div>
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
                <div className="benefits-list">
                  <Title level={3}>Why Enroll Here?</Title>
                  {[
                    { icon: <StarFilled />, text: "Individual attention with small class sizes" },
                    { icon: <TeamOutlined />, text: "Experienced and dedicated faculty" },
                    { icon: <SafetyCertificateOutlined />, text: "Safe and secure campus environment" },
                    { icon: <LineChartOutlined />, text: "Regular parent-teacher communication" },
                    { icon: <TrophyOutlined />, text: "Strong focus on sports and arts" },
                    { icon: <BookOutlined />, text: "Comprehensive academic curriculum" }
                  ].map((benefit, i) => (
                    <div key={i} className="benefit-row">
                      <span className="benefit-icon-box">{benefit.icon}</span>
                      <span className="benefit-text">{benefit.text}</span>
                    </div>
                  ))}
                </div>
              </Col>
            </Row>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="contact-pro">
          <div className="contact-container">
            <Row gutter={[80, 60]} align="middle">
              <Col xs={24} lg={10}>
                <div className="contact-left">
                  <div className="contact-tag">You are here!</div>
                  <h2 className="contact-heading">
                    Let's <span className="bold-text">Start</span>
                  </h2>
                  <p className="contact-subheading">
                    Initiating Your Journey to Success and Growth.
                  </p>

                  <div className="contact-info-list">
                    <div className="contact-info-item">
                      <div className="contact-icon-circle">
                        <PhoneOutlined />
                      </div>
                      <span>(205) 555-0100</span>
                    </div>
                    <div className="contact-info-item">
                      <div className="contact-icon-circle">
                        <MailOutlined />
                      </div>
                      <span>info@School.com</span>
                    </div>
                    <div className="contact-info-item">
                      <div className="contact-icon-circle">
                        <GlobalOutlined />
                      </div>
                      <span>www.School.com</span>
                    </div>
                  </div>
                </div>
              </Col>

              <Col xs={24} lg={14}>
                <Card className="contact-form-card" bordered={false}>
                  <div className="form-header">
                    <MailOutlined className="form-header-icon" />
                    <span>LET'S CONNECT!</span>
                  </div>
                  <p className="form-description">
                    Send us a message, and we'll promptly discuss your project with you.
                  </p>

                  <Form layout="vertical" onFinish={handleInquirySubmit}>
                    <Row gutter={16}>
                      <Col xs={24} sm={12}>
                        <Form.Item 
                          name="fullName" 
                          rules={[{ required: true, message: 'Required' }]}
                        >
                          <Input size="large" placeholder="Full Name" />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12}>
                        <Form.Item 
                          name="companyName" 
                          rules={[{ required: true, message: 'Required' }]}
                        >
                          <Input size="large" placeholder="Company Name" />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Row gutter={16}>
                      <Col xs={24} sm={12}>
                        <Form.Item 
                          name="mobileNumber" 
                          rules={[{ required: true, message: 'Required' }]}
                        >
                          <Input size="large" placeholder="Mobile Number" />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12}>
                        <Form.Item 
                          name="emailAddress" 
                          rules={[
                            { required: true, message: 'Required' },
                            { type: 'email', message: 'Invalid email' }
                          ]}
                        >
                          <Input size="large" placeholder="Email Address" />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Form.Item 
                      name="services" 
                      rules={[{ required: true, message: 'Required' }]}
                    >
                      <Select size="large" placeholder="Select Services">
                        <Select.Option value="admissions">Admissions</Select.Option>
                        <Select.Option value="academics">Academics</Select.Option>
                        <Select.Option value="general">General Information</Select.Option>
                      </Select>
                    </Form.Item>

                    <Form.Item 
                      name="message" 
                      rules={[{ required: true, message: 'Required' }]}
                    >
                      <Input.TextArea 
                        rows={4} 
                        size="large" 
                        placeholder="How can we help you?"
                      />
                    </Form.Item>

                    <Form.Item>
                      <Button 
                        type="primary" 
                        htmlType="submit" 
                        size="large" 
                        block
                        icon={<SendOutlined />}
                        className="submit-btn-pro"
                      >
                        Inquire Now
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
      <Footer className="footer-pro">
        <div className="footer-container">
          <Row gutter={[60, 40]}>
            <Col xs={24} md={8}>
              <div className="footer-brand">
                <div className="footer-logo-section">
                  <div className="footer-logo-circle">
                    <span>🎓</span>
                  </div>
                  <span className="footer-brand-name">Next Learn</span>
                </div>
                <p className="footer-desc">
                  Simply dummy text of the printing and typesetting industry. 
                  Lorem Ipsum has been the industry's standard dummy text ever 
                  since the 1500s.
                </p>
              </div>
            </Col>

            <Col xs={12} md={5}>
              <div className="footer-column">
                <h4>Company</h4>
                <a onClick={() => scrollToSection('about')}>About</a>
                <a onClick={() => scrollToSection('features')}>Our Achievements</a>
                <a>Our Partners</a>
                <a>Our Locations</a>
                <a>Careers</a>
                <a onClick={() => scrollToSection('contact')}>Contacts</a>
              </div>
            </Col>

            <Col xs={12} md={5}>
              <div className="footer-column">
                <h4>Quick Links</h4>
                <a onClick={() => scrollToSection('admissions')}>Admissions</a>
                <a onClick={() => scrollToSection('features')}>Programs</a>
                <a onClick={() => navigate('/login')}>Portal Login</a>
                <a>Privacy Policy</a>
                <a>Terms of Service</a>
              </div>
            </Col>

            <Col xs={24} md={6}>
              <div className="footer-column">
                <h4>Sign Up</h4>
                <p className="newsletter-text">
                  Sign up to Techno weekly newsletter to get the latest updates.
                </p>
                <Form layout="inline" className="newsletter-form">
                  <Input 
                    placeholder="Enter your email" 
                    size="large"
                    className="newsletter-input"
                  />
                  <Button 
                    type="primary" 
                    size="large"
                    className="newsletter-btn"
                  >
                    Send
                  </Button>
                </Form>
                <div className="social-icons">
                  <a className="social-icon"><FacebookFilled /></a>
                  <a className="social-icon"><TwitterOutlined /></a>
                  <a className="social-icon"><LinkedinFilled /></a>
                  <a className="social-icon"><InstagramFilled /></a>
                </div>
              </div>
            </Col>
          </Row>

          <div className="footer-bottom">
            <p>© 2026 SchoolERP. All rights reserved.</p>
          </div>
        </div>
      </Footer>
    </Layout>
  );
}