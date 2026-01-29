import { useState, useEffect } from 'react';
import { Layout, Button, Row, Col, Card, Typography, Space, Avatar } from 'antd';
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
  PlayCircleFilled,
  ArrowRightOutlined,
  FacebookFilled,
  TwitterOutlined,
  InstagramFilled,
  LinkedinFilled,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

const { Header, Content, Footer } = Layout;
const { Title, Text, Paragraph } = Typography;

export default function LandingPage() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: <UserOutlined />,
      title: "Student Management",
      description: "Comprehensive student profiles, enrollment tracking, and academic records in one powerful system.",
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
    },
    {
      icon: <CalendarOutlined />,
      title: "Smart Scheduling",
      description: "Intelligent timetable management with automatic conflict detection and optimization.",
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
    },
    {
      icon: <LineChartOutlined />,
      title: "Analytics Dashboard",
      description: "Real-time insights into student performance, attendance, and institutional metrics.",
      gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
    },
    {
      icon: <TeamOutlined />,
      title: "Communication Hub",
      description: "Seamless messaging between teachers, students, and parents with instant notifications.",
      gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)"
    },
    {
      icon: <BookOutlined />,
      title: "Exam & Grading",
      description: "Automated grading system with customizable rubrics and instant report generation.",
      gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)"
    },
    {
      icon: <SafetyCertificateOutlined />,
      title: "Data Security",
      description: "Enterprise-grade encryption with role-based access control and compliance.",
      gradient: "linear-gradient(135deg, #30cfd0 0%, #330867 100%)"
    }
  ];

  const stats = [
    { number: "50K+", label: "Active Students", icon: <UserOutlined /> },
    { number: "500+", label: "Partner Schools", icon: <TrophyOutlined /> },
    { number: "98%", label: "Satisfaction Rate", icon: <StarFilled /> },
    { number: "24/7", label: "Support Available", icon: <BellOutlined /> }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Principal, Westwood Academy",
      avatar: "https://i.pravatar.cc/150?img=1",
      content: "Lorem ipsum dolor sit amet consectetur adipiscing elit. Adipiscing elit quisque faucibus ex sapien vitae pellentesque.",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Administrator, Lincoln High",
      avatar: "https://i.pravatar.cc/150?img=2",
      content: "Lorem ipsum dolor sit amet consectetur adipiscing elit. Dolor sit amet consectetur adipiscing elit quisque faucibus.",
      rating: 5
    },
    {
      name: "Emily Rodriguez",
      role: "Head Teacher, Sunrise Elementary",
      avatar: "https://i.pravatar.cc/150?img=3",
      content: "Lorem ipsum dolor sit amet consectetur adipiscing elit. Dolor sit amet consectetur adipiscing elit quisque faucibus.",
      rating: 5
    }
  ];

  return (
    <Layout className="landing-page">
      {/* Header */}
      <Header className={`modern-header ${scrolled ? 'scrolled' : ''}`}>
        <div className="header-content">
          <div className="logo-wrapper">
            <div className="logo-gradient">
              <span className="logo-icon">🎓</span>
            </div>
            <span className="brand-name">SchoolMS</span>
          </div>
          <Space className="header-actions" size="large">
            <Button 
              type="text" 
              size="large"
              className="header-btn signin-btn"
              onClick={() => navigate('/login')}
            >
              Sign In
            </Button>
            <Button 
              type="primary" 
              size="large"
              className="header-btn register-btn"
              onClick={() => navigate('/register')}
            >
              Register
            </Button>
          </Space>
        </div>
      </Header>

      <Content>
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-background">
            <div className="gradient-orb orb-1"></div>
            <div className="gradient-orb orb-2"></div>
            <div className="gradient-orb orb-3"></div>
          </div>
          
          <div className="hero-content">
            <Row gutter={[60, 60]} align="middle">
              <Col xs={24} lg={12}>
                <div className="hero-text" data-aos="fade-up">
                  <div className="hero-badge">
                    <RocketOutlined className="badge-icon" />
                    <span>Trusted by 500+ Schools Worldwide</span>
                  </div>
                  
                  <h1 className="hero-title">
                    Transform Your
                    <span className="gradient-text"> School Management </span>
                    with Confidence
                  </h1>
                  
                  <p className="hero-subtitle">
                    Empower educators, engage students, and simplify administration. 
                    The all-in-one platform designed for modern education.
                  </p>
                  
                  

                  <div className="trust-badges">
                    <div className="badge-item">
                      <CheckCircleOutlined className="check-icon" />
                      <span>Trusted by Schools & Institutions</span>
                    </div>
                    <div className="badge-item">
                      <CheckCircleOutlined className="check-icon" />
                      <span>Secure & Reliable Platform</span>
                    </div>
                  </div>
                </div>
              </Col>

              <Col xs={24} lg={12}>
                <div className="hero-visual" data-aos="fade-left">
                  <div className="floating-card card-1">
                    <div className="card-icon">
                      <UserOutlined />
                    </div>
                    <div className="card-content">
                      <div className="card-number">5,234</div>
                      <div className="card-label">Active Students</div>
                    </div>
                  </div>
                  
                  <div className="floating-card card-2">
                    <div className="card-icon success">
                      <TrophyOutlined />
                    </div>
                    <div className="card-content">
                      <div className="card-number">98%</div>
                      <div className="card-label">Success Rate</div>
                    </div>
                  </div>

                  <div className="hero-image-wrapper">
                    <div className="image-glow"></div>
                    <img 
                      src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=900&fit=crop" 
                      alt="Students"
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
              {stats.map((stat, index) => (
                <Col xs={12} md={6} key={index}>
                  <div className="stat-card" data-aos="zoom-in" data-aos-delay={index * 100}>
                    <div className="stat-icon">{stat.icon}</div>
                    <div className="stat-number">{stat.number}</div>
                    <div className="stat-label">{stat.label}</div>
                  </div>
                </Col>
              ))}
            </Row>
          </div>
        </section>

        {/* Features Section */}
        <section className="features-section">
          <div className="container">
            <div className="section-header" data-aos="fade-up">
              <span className="section-tag">Powerful Features</span>
              <h2 className="section-title">
                Everything You Need to
                <span className="gradient-text"> Manage Your School</span>
              </h2>
              <p className="section-description">
                Comprehensive tools designed to simplify administration and enhance 
                the educational experience for everyone.
              </p>
            </div>

            <Row gutter={[30, 30]}>
              {features.map((feature, index) => (
                <Col xs={24} md={8} key={index}>
                  <Card 
                    className="feature-card"
                    data-aos="fade-up"
                    data-aos-delay={index * 100}
                  >
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

        {/* About/CTA Section */}
        <section className="about-cta-section">
          <div className="container">
            <Row gutter={[60, 60]} align="middle">
              <Col xs={24} lg={12} data-aos="fade-right">
                <div className="about-image-grid">
                  <div className="grid-item item-1">
                    <img src="https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=400&h=500&fit=crop" alt="Students" />
                  </div>
                  <div className="grid-item item-2">
                    <img src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=300&fit=crop" alt="Classroom" />
                  </div>
                  <div className="experience-badge">
                    <div className="badge-number">15+</div>
                    <div className="badge-text">Years of Excellence</div>
                  </div>
                </div>
              </Col>

              <Col xs={24} lg={12} data-aos="fade-left">
                <div className="about-content">
                  <span className="section-tag">About Us</span>
                  <h2 className="section-title">
                    Empowering Education Through
                    <span className="gradient-text"> Innovation</span>
                  </h2>
                  <p className="section-description">
                    For over 15 years, we've been at the forefront of educational technology, 
                    helping schools worldwide transform their operations and focus on what truly matters - education.
                  </p>

                  <div className="check-list">
                    {[
                      "Reduce administrative workload by 60%",
                      "Real-time parent-teacher communication",
                      "Automated attendance & grade tracking",
                      "Comprehensive analytics & reporting"
                    ].map((item, i) => (
                      <div key={i} className="check-item">
                        <CheckCircleOutlined className="check-icon" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>

                  <Button size="large" className="cta-button primary">
                    Discover More <ArrowRightOutlined />
                  </Button>
                </div>
              </Col>
            </Row>
          </div>
        </section>

        {/* Testimonials */}
        <section className="testimonials-section">
          <div className="container">
            <div className="section-header" data-aos="fade-up">
              <span className="section-tag">Testimonials</span>
              <h2 className="section-title">
                Loved by Schools Worldwide
              </h2>
              <p className="section-description">
                Join thousands of satisfied educators who have transformed their schools with EduManage.
              </p>
            </div>

            <Row gutter={[30, 30]}>
              {testimonials.map((testimonial, index) => (
                <Col xs={24} md={8} key={index}>
                  <Card 
                    className="testimonial-card"
                    data-aos="fade-up"
                    data-aos-delay={index * 100}
                  >
                    <div className="quote-mark">"</div>
                    <p className="testimonial-text">{testimonial.content}</p>
                    <div className="testimonial-rating">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <StarFilled key={i} className="star" />
                      ))}
                    </div>
                    <div className="testimonial-author">
                      <Avatar size={56} src={testimonial.avatar} />
                      <div className="author-info">
                        <div className="author-name">{testimonial.name}</div>
                        <div className="author-role">{testimonial.role}</div>
                      </div>
                    </div>
                  </Card>
                </Col>
              ))}
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
                  <span className="brand-name">SchoolMS</span>
                </div>
                <p className="footer-description">
                  Empowering schools with modern management solutions. Streamline your 
                  administration and focus on what truly matters - education.
                </p>
                <div className="social-links">
                  <a href="#" className="social-icon"><FacebookFilled /></a>
                  <a href="#" className="social-icon"><TwitterOutlined /></a>
                  <a href="#" className="social-icon"><InstagramFilled /></a>
                  <a href="#" className="social-icon"><LinkedinFilled /></a>
                </div>
              </div>
            </Col>



            <Col xs={12} md={4}>
              <div className="footer-column">
                <h4 className="footer-title">Company</h4>
                <a href="#" className="footer-link">About Us</a>
                <a href="#" className="footer-link">Careers</a>
                <a href="#" className="footer-link">Blog</a>
                <a href="#" className="footer-link">Contact</a>
              </div>
            </Col>

            <Col xs={24} md={8}>
              <div className="footer-column">
                <h4 className="footer-title">Contact Us</h4>
                <div className="contact-info">
                  <div className="contact-item">
                    <EnvironmentOutlined />
                    <span>Maharashtra, Pune 10001</span>
                  </div>
                  <div className="contact-item">
                    <PhoneOutlined />
                    <span>+91 1234567890</span>
                  </div>
                  <div className="contact-item">
                    <MailOutlined />
                    <span>hello@schoolms.com</span>
                  </div>
                </div>
              </div>
            </Col>
          </Row>

          <div className="footer-bottom">
            <p className="copyright">© 2026 EduManage. All rights reserved.</p>
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