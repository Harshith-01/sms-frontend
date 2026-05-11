import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Tabs,
  Card,
  Button,
  Space,
  Spin,
  message,
  Form,
  Input,
  Select,
  DatePicker,
  Row,
  Col,
  Avatar,
  Divider,
} from 'antd';
import { SaveOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { getStudentById, createStudent, updateStudentBasic, updateStudentContact, updateStudentParent, updateStudentAcademic, updateStudentAdmission } from '../../services/studentService';
import dayjs from 'dayjs';
import './Form.css';

const { Option } = Select;
const { TextArea } = Input;

export default function StudentForm({ mode = 'view' }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('1');
  const [saving, setSaving] = useState(false);

  const isAddMode = mode === 'add';
  const isEditMode = mode === 'edit';
  const isViewMode = mode === 'view';

  useEffect(() => {
    if (isAddMode) {
      return;
    }

    if (id) {
      fetchStudent(id);
    } else if (!isAddMode) {
      const userId = localStorage.getItem("userId");
      if (userId) {
        fetchStudent(userId);
      }
    }
  }, [id, mode]);

  const fetchStudent = async (studentId) => {
    setLoading(true);
    try {
      const response = await getStudentById(studentId || id);
      const data = response.data;

      // Map nested response structure to flat form fields
      const flat = {
        // basic
        student_id: data.basic?.student_id,
        admission_number: data.basic?.admission_number,
        full_name: data.basic?.full_name,
        gender: data.basic?.gender,
        nationality: data.basic?.nationality,
        blood_group: data.basic?.blood_group,
        aadhaar_number: data.basic?.aadhaar_number,
        dob: data.basic?.date_of_birth ? dayjs(data.basic.date_of_birth) : null,

        // contact
        email: data.contact?.email,
        contact_number: data.contact?.contact_number,
        alternate_number: data.contact?.alternate_number,
        current_address: data.contact?.current_address,
        permanent_address: data.contact?.permanent_address,
        city: data.contact?.city,
        state: data.contact?.state,
        pin_code: data.contact?.pin_code,

        // parent
        father_name: data.parent?.father_name,
        mother_name: data.parent?.mother_name,
        guardian_name: data.parent?.guardian_name,
        primary_contact: data.parent?.primary_contact,
        parent_email: data.parent?.email,
        occupation: data.parent?.occupation,
        annual_income: data.parent?.annual_income,

        // academic_current
        program_name: data.academic_current?.program_name,
        department: data.academic_current?.department,
        class_section_id: data.academic_current?.class_section_id,
        semester_year: data.academic_current?.semester_year,
        subjects: data.academic_current?.subjects,
        enrollment_date: data.academic_current?.enrollment_date ? dayjs(data.academic_current.enrollment_date) : null,
        previous_college: data.academic_current?.previous_college,
        previous_marks: data.academic_current?.previous_marks,
        academic_status: data.academic_current?.academic_status,
        academic_year: data.academic_current?.academic_year,

        // admission_records[0]
        admission_date: data.admission_records?.[0]?.admission_date ? dayjs(data.admission_records[0].admission_date) : null,
        admission_type: data.admission_records?.[0]?.admission_type,
        entrance_exam: data.admission_records?.[0]?.entrance_exam,
        rank: data.admission_records?.[0]?.rank,
        admission_category: data.admission_records?.[0]?.admission_category,
        fees_payment_status: data.admission_records?.[0]?.fees_payment_status,
        scholarship_details: data.admission_records?.[0]?.scholarship_details,
      };

      setStudent({
        ...flat,
        student_id: data.basic?.student_id,
        admission_id: data.admission_records?.[0]?.id,
        photo_url: data.basic?.photo_url,
      });

      form.setFieldsValue(flat);
    } catch (error) {
      message.error('Failed to fetch student details');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (values) => {
    setSaving(true);
    try {
      if (isAddMode) {
        const data = {
          basic: {
            admission_number: values.admission_number,
            full_name: values.full_name,
            date_of_birth: values.dob ? dayjs(values.dob).format("YYYY-MM-DD") : null,
            gender: values.gender,
            nationality: values.nationality,
            blood_group: values.blood_group || null,
            aadhaar_number: values.aadhaar_number || null,
          },
          contact: {
            email: values.email,
            contact_number: values.contact_number,
          },
        };

        await createStudent(data);
        message.success("Student added successfully");
        navigate("/admin/onboarding/students");
      } else if (isEditMode) {
        const studentId = id;

        if (activeTab === "1") {
          await updateStudentBasic(studentId, {
            admission_number: values.admission_number,
            full_name: values.full_name,
            date_of_birth: values.dob ? dayjs(values.dob).format("YYYY-MM-DD") : null,
            gender: values.gender,
            nationality: values.nationality,
            blood_group: values.blood_group,
            aadhaar_number: values.aadhaar_number,
          });
        }

        else if (activeTab === "2") {
          await updateStudentContact(studentId, {
            email: values.email,
            contact_number: values.contact_number,
            alternate_number: values.alternate_number,
            current_address: values.current_address,
            permanent_address: values.permanent_address,
            city: values.city,
            state: values.state,
            pin_code: values.pin_code,
          });
        }

        else if (activeTab === "3") {
          await updateStudentParent(studentId, {
            father_name: values.father_name,
            mother_name: values.mother_name,
            guardian_name: values.guardian_name,
            primary_contact: values.primary_contact,
            email: values.parent_email,
            occupation: values.occupation,
            annual_income: values.annual_income,
          });
        }

        else if (activeTab === "4") {
          await updateStudentAcademic(studentId, {
            program_name: values.program_name,
            department: values.department,
            class_section_id: values.class_section_id,
            semester_year: values.semester_year,
            subjects: values.subjects,
            enrollment_date: values.enrollment_date ? dayjs(values.enrollment_date).format("YYYY-MM-DD") : null,
            previous_college: values.previous_college,
            previous_marks: values.previous_marks,
            academic_status: values.academic_status,
          });
        }

        else if (activeTab === "5") {
          await updateStudentAdmission(
            studentId,
            student?.admission_id,
            {
              admission_date: values.admission_date ? dayjs(values.admission_date).format("YYYY-MM-DD") : null,
              admission_type: values.admission_type,
              entrance_exam: values.entrance_exam,
              rank: values.rank,
              admission_category: values.admission_category,
              fees_payment_status: values.fees_payment_status,
              scholarship_details: values.scholarship_details,
            }
          );
        }

        message.success("Student updated successfully");
        navigate(`/admin/onboarding/students/${studentId}`);
      }
    } catch (error) {
      message.error(
        isAddMode ? "Failed to add student" : "Failed to update student"
      );
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    if (isAddMode || isEditMode) {
      navigate('/admin/onboarding/students');
    } else {
      const userRole = localStorage.getItem('userRole');
      navigate(userRole === 'STUDENT' ? '/student/dashboard' : '/admin/onboarding/students');
    }
  };

  if (loading) return <div className="form-loading"><Spin size="large" /></div>;

  const renderField = (label, value, name, type = 'text', options = [], required = false) => (
    <Col xs={24} sm={12} lg={8}>
      <div className="field-group">
        <label className="field-label">{label}</label>
        {isViewMode ? (
          <div className="field-value">{value || '—'}</div>
        ) : type === 'select' ? (
          <Form.Item name={name} noStyle rules={required ? [{ required: true, message: 'Required' }] : []}>
            <Select className="field-input" placeholder={`Select ${label.toLowerCase()}`}>
              {options.map(opt => <Option key={opt} value={opt}>{opt}</Option>)}
            </Select>
          </Form.Item>
        ) : type === 'date' ? (
          <Form.Item name={name} noStyle rules={required ? [{ required: true, message: 'Required' }] : []}>
            <DatePicker format="DD/MM/YYYY" className="field-input" style={{ width: '100%' }} />
          </Form.Item>
        ) : type === 'textarea' ? (
          <Form.Item name={name} noStyle rules={required ? [{ required: true, message: 'Required' }] : []}>
            <TextArea rows={2} className="field-input" placeholder={`Enter ${label.toLowerCase()}`} />
          </Form.Item>
        ) : (
          <Form.Item name={name} noStyle rules={required ? [{ required: true, message: 'Required' }] : []}>
            <Input className="field-input" placeholder={`Enter ${label.toLowerCase()}`} />
          </Form.Item>
        )}
      </div>
    </Col>
  );

  const EditButtons = () => (
    isEditMode ? (
      <Space size="middle">
        <Button onClick={handleBack} size="large">Cancel</Button>
        <Button type="primary" icon={<SaveOutlined />} onClick={() => form.submit()} loading={saving} size="large">Save Changes</Button>
      </Space>
    ) : null
  );

  // ADD MODE - All basic fields + email (NO password)
  if (isAddMode) {
    return (
      <div className="form-container">
        <div className="page-header">
          <div className="header-left">
            <h1 className="page-title">Add New Student</h1>
            <p className="page-description">Enter student basic information (password auto-generated)</p>
          </div>
          <Button icon={<ArrowLeftOutlined />} onClick={handleBack} size="large" className="back-btn">Back</Button>
        </div>
        <div className="page-content">
          <Card className="tab-card" bordered={false}>
            <div className="card-header">
              <h2 className="card-title">Student Basic Information</h2>
            </div>
            <Divider />
            <Form form={form} layout="vertical" onFinish={handleSave}>
              <Row gutter={[32, 24]}>
                {renderField('Admission Number', '', 'admission_number', 'text', [], true)}
                {renderField('Full Name', '', 'full_name', 'text', [], true)}
                {renderField('Email', '', 'email', 'text', [], true)}
                {renderField('Contact Number', '', 'contact_number', 'text', [], true)}
                {renderField('Date of Birth', '', 'dob', 'date', [], true)}
                {renderField('Gender', '', 'gender', 'select', ['Male', 'Female', 'Other'], true)}
                {renderField('Nationality', '', 'nationality', 'text', [], true)}
                {renderField('Blood Group', '', 'blood_group', 'select', ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'], false)}
                {renderField('Aadhaar Number', '', 'aadhaar_number', 'text', [], false)}
              </Row>

              <Row gutter={16} style={{ marginTop: 32 }}>
                <Col>
                  <Button type="primary" htmlType="submit" icon={<SaveOutlined />} size="large" loading={saving}>
                    Add Student
                  </Button>
                </Col>
                <Col>
                  <Button onClick={() => form.resetFields()} size="large">Reset</Button>
                </Col>
                <Col>
                  <Button onClick={handleBack} size="large">Cancel</Button>
                </Col>
              </Row>
            </Form>
          </Card>
        </div>
      </div>
    );
  }

  const tabsData = [
    { key: '1', label: 'Basic Details', title: 'Student Basic Information' },
    { key: '2', label: 'Contact Info', title: 'Contact Information' },
    { key: '3', label: 'Parent & Guardian', title: 'Parent/Guardian Details' },
    { key: '4', label: 'Academic Info', title: 'Academic Information' },
    { key: '5', label: 'Admission Details', title: 'Admission Information' },
  ];

  const renderTabContent = (tabKey) => {
    const hasPhoto = tabKey === '1' && !isAddMode;
    return (
      <Card className="tab-card" bordered={false}>
        <div className="card-header">
          <h2 className="card-title">{tabsData.find(t => t.key === tabKey)?.title}</h2>
          <EditButtons />
        </div>
        <Divider />
        <Form form={form} layout="vertical" onFinish={handleSave} disabled={isViewMode}>
          <div className={hasPhoto ? 'form-layout' : ''}>
            {hasPhoto && (
              <div className="photo-section">
                <Avatar size={180} src={student?.photo_url || `https://ui-avatars.com/api/?name=${student?.full_name || 'Student'}&background=667eea&color=fff&size=180`} className="form-avatar" />
              </div>
            )}
            <div className={hasPhoto ? 'info-section' : ''}>
              <Row gutter={[32, 24]}>
                {tabKey === '1' && (
                  <>
                    {!isAddMode && student && (
                      <Col xs={24} sm={12} lg={8}><div className="field-group"><label className="field-label">Student ID</label><div className="field-value static">{student.student_id}</div></div></Col>
                    )}
                    {renderField('Admission Number', student?.admission_number, 'admission_number')}
                    {renderField('Full Name', student?.full_name, 'full_name')}
                    {renderField('DOB', student?.dob ? dayjs(student.dob).format('DD/MM/YYYY') : '', 'dob', 'date')}
                    {renderField('Gender', student?.gender, 'gender', 'select', ['Male', 'Female', 'Other'])}
                    {renderField('Nationality', student?.nationality, 'nationality')}
                    {renderField('Blood Group', student?.blood_group, 'blood_group')}
                    {renderField('Aadhaar Number', student?.aadhaar_number, 'aadhaar_number')}
                  </>
                )}
                {tabKey === '2' && (
                  <>
                    {renderField('Email', student?.email, 'email')}
                    {renderField('Contact Number', student?.contact_number, 'contact_number')}
                    {renderField('Alternate Number', student?.alternate_number, 'alternate_number')}
                    {renderField('City', student?.city, 'city')}
                    {renderField('State', student?.state, 'state')}
                    {renderField('Pin Code', student?.pin_code, 'pin_code')}
                    {renderField('Current Address', student?.current_address, 'current_address', 'textarea')}
                    {renderField('Permanent Address', student?.permanent_address, 'permanent_address', 'textarea')}
                  </>
                )}
                {tabKey === '3' && (
                  <>
                    {renderField("Father's Name", student?.father_name, 'father_name')}
                    {renderField("Mother's Name", student?.mother_name, 'mother_name')}
                    {renderField("Guardian's Name", student?.guardian_name, 'guardian_name')}
                    {renderField('Primary Contact', student?.primary_contact, 'primary_contact')}
                    {renderField('Parent Email', student?.parent_email, 'parent_email')}
                    {renderField('Occupation', student?.occupation, 'occupation')}
                    {renderField('Annual Income', student?.annual_income, 'annual_income')}
                  </>
                )}
                {tabKey === '4' && (
                  <>
                    {renderField('Program Name', student?.program_name, 'program_name')}
                    {renderField('Department', student?.department, 'department')}
                    {renderField('Class', student?.class_section_id, 'class_section_id')}
                    {renderField('Semester/Year', student?.semester_year, 'semester_year')}
                    {renderField('Subjects', student?.subjects, 'subjects')}
                    {renderField('Enrollment Date', student?.enrollment_date ? dayjs(student.enrollment_date).format('DD/MM/YYYY') : '', 'enrollment_date', 'date')}
                    {renderField('Previous College', student?.previous_college, 'previous_college')}
                    {renderField('Previous Marks', student?.previous_marks, 'previous_marks')}
                    {renderField('Academic Status', student?.academic_status, 'academic_status')}
                    {renderField('Academic Year', student?.academic_year, 'academic_year')}
                  </>
                )}
                {tabKey === '5' && (
                  <>
                    {renderField('Admission Date', student?.admission_date ? dayjs(student.admission_date).format('DD/MM/YYYY') : '', 'admission_date', 'date')}
                    {renderField('Admission Type', student?.admission_type, 'admission_type')}
                    {renderField('Entrance Exam', student?.entrance_exam, 'entrance_exam')}
                    {renderField('Rank', student?.rank, 'rank')}
                    {renderField('Admission Category', student?.admission_category, 'admission_category')}
                    {renderField('Fees Payment Status', student?.fees_payment_status, 'fees_payment_status')}
                    {renderField('Scholarship Details', student?.scholarship_details, 'scholarship_details', 'textarea')}
                  </>
                )}
              </Row>
            </div>
          </div>
        </Form>
      </Card>
    );
  };

  const tabItems = tabsData.map(tab => ({ ...tab, children: renderTabContent(tab.key) }));

  return (
    <div className="form-container">
      <div className="page-header">
        <div className="header-left">
          <h1 className="page-title">{isEditMode ? 'Edit Student' : 'Student Management'}</h1>
          <p className="page-description">{isEditMode ? 'Update student information' : 'View student information'}</p>
        </div>
        <Button icon={<ArrowLeftOutlined />} onClick={handleBack} size="large" className="back-btn">Back</Button>
      </div>
      <div className="page-content">
        <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} size="large" className="form-tabs" />
      </div>
    </div>
  );
}