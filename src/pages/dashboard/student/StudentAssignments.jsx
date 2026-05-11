import React, { useState, useEffect, useCallback } from "react";
import {
  Table,
  Card,
  Button,
  Input,
  Select,
  DatePicker,
  Tag,
  Modal,
  Form,
  Upload,
  Typography,
  Space,
  Row,
  Col,
  Skeleton,
  notification,
  Tooltip,
  Empty,
  Divider,
  Badge,
  Alert,
  InputNumber,
} from "antd";
import {
  SearchOutlined,
  ReloadOutlined,
  EyeOutlined,
  UploadOutlined,
  FileTextOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  BookOutlined,
  PaperClipOutlined,
  LinkOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import {
  getAssignments,
  submitAssignment,
  getStudentAssignmentHistory,
} from "../../../services/assessmentService";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

// ─── Status tag configs ────────────────────────────────────────────────────────

const ASSIGNMENT_STATUS_CONFIG = {
  DRAFT: { color: "default", label: "Draft" },
  PUBLISHED: { color: "blue", label: "Published" },
  CLOSED: { color: "orange", label: "Closed" },
  CANCELLED: { color: "red", label: "Cancelled" },
  ARCHIVED: { color: "purple", label: "Archived" },
};

const SUBMISSION_STATUS_CONFIG = {
  NOT_SUBMITTED: { color: "default", label: "Not Submitted" },
  SUBMITTED: { color: "green", label: "Submitted" },
  LATE_SUBMITTED: { color: "orange", label: "Late Submitted" },
  EXCUSED: { color: "cyan", label: "Excused" },
  MISSING: { color: "red", label: "Missing" },
  PLAGIARIZED: { color: "volcano", label: "Plagiarized" },
};

const AssignmentStatusTag = ({ status }) => {
  const cfg = ASSIGNMENT_STATUS_CONFIG[status] || {
    color: "default",
    label: status,
  };
  return <Tag color={cfg.color}>{cfg.label}</Tag>;
};

const SubmissionStatusTag = ({ status }) => {
  const cfg = SUBMISSION_STATUS_CONFIG[status] || {
    color: "default",
    label: status || "Not Submitted",
  };
  return <Tag color={cfg.color}>{cfg.label}</Tag>;
};

// ─── Stat card ────────────────────────────────────────────────────────────────

const StatCard = ({ title, value, icon, color, loading }) => (
  <Card
    style={{
      borderRadius: 12,
      boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
      border: "1px solid #f0f0f0",
      height: "100%",
    }}
    bodyStyle={{ padding: "20px 24px" }}
  >
    {loading ? (
      <Skeleton active paragraph={{ rows: 1 }} />
    ) : (
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 10,
            background: `${color}15`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 22,
            color: color,
            flexShrink: 0,
          }}
        >
          {icon}
        </div>
        <div>
          <div
            style={{ fontSize: 24, fontWeight: 700, color: "#1f2937", lineHeight: 1.2 }}
          >
            {value}
          </div>
          <div style={{ fontSize: 13, color: "#6b7280", marginTop: 2 }}>
            {title}
          </div>
        </div>
      </div>
    )}
  </Card>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const StudentAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(false);

  // Filters
  const [searchText, setSearchText] = useState("");
  const [subjectFilter, setSubjectFilter] = useState(null);
  const [statusFilter, setStatusFilter] = useState(null);
  const [dueDateFilter, setDueDateFilter] = useState(null);

  // Modals
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  const [submitForm] = Form.useForm();

  // ── Fetch data ────────────────────────────────────────────────────────────

  const fetchAssignments = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAssignments();
      setAssignments(Array.isArray(data) ? data : data?.data || []);
    } catch (err) {
      notification.error({
        message: "Failed to load assignments",
        description: err?.message || "Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchHistory = useCallback(async () => {
    setHistoryLoading(true);
    try {
      // student_id ideally from auth context; use a placeholder if not available
      const studentId =
        JSON.parse(localStorage.getItem("user") || "{}")?.id || "me";
      const data = await getStudentAssignmentHistory(studentId);
      setHistory(Array.isArray(data) ? data : data?.data || []);
    } catch {
      // history is supplementary; silently ignore
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAssignments();
    fetchHistory();
  }, [fetchAssignments, fetchHistory]);

  // ── Merge submission status from history ──────────────────────────────────

  const enrichedAssignments = assignments.map((a) => {
    const record = history.find((h) => h.assignment_id === a.id || h.assignment_id === a.assignment_id);
    return {
      ...a,
      submission_status: record?.submission_status || "NOT_SUBMITTED",
      obtained_marks: record?.obtained_marks ?? null,
      grade: record?.grade ?? null,
    };
  });

  // ── Filtered data ─────────────────────────────────────────────────────────

  const filteredData = enrichedAssignments.filter((a) => {
    const matchSearch = !searchText || a.title?.toLowerCase().includes(searchText.toLowerCase());
    const matchSubject = !subjectFilter || a.subject_id === subjectFilter || a.subject_name === subjectFilter;
    const matchStatus = !statusFilter || a.submission_status === statusFilter;
    const matchDue = !dueDateFilter || dayjs(a.due_date).isSame(dueDateFilter, "day");
    return matchSearch && matchSubject && matchStatus && matchDue;
  });

  // ── Stats ─────────────────────────────────────────────────────────────────

  const stats = {
    total: enrichedAssignments.length,
    pending: enrichedAssignments.filter((a) => a.submission_status === "NOT_SUBMITTED").length,
    submitted: enrichedAssignments.filter((a) =>
      ["SUBMITTED", "LATE_SUBMITTED"].includes(a.submission_status)
    ).length,
    overdue: enrichedAssignments.filter((a) => {
      const isOverdue = dayjs().isAfter(dayjs(a.due_date));
      return isOverdue && a.submission_status === "NOT_SUBMITTED";
    }).length,
  };

  // ── Unique subjects for filter ────────────────────────────────────────────

  const subjects = [
    ...new Map(
      enrichedAssignments
        .filter((a) => a.subject_name)
        .map((a) => [a.subject_name, a.subject_name])
    ).values(),
  ];

  // ── Helpers ───────────────────────────────────────────────────────────────

  const isOverdue = (assignment) =>
    dayjs().isAfter(dayjs(assignment.due_date));

  const canSubmit = (assignment) => {
    if (["SUBMITTED", "LATE_SUBMITTED"].includes(assignment.submission_status))
      return false;
    if (assignment.status === "CLOSED" || assignment.status === "CANCELLED")
      return false;
    if (isOverdue(assignment) && !assignment.allow_late_submission) return false;
    if (
      assignment.allow_late_submission &&
      assignment.late_until &&
      dayjs().isAfter(dayjs(assignment.late_until))
    )
      return false;
    return true;
  };

  // ── Submit handler ────────────────────────────────────────────────────────

  const handleSubmit = async (values) => {
    if (!selectedAssignment) return;
    setSubmitLoading(true);
    try {
      const payload = {
        submission_text: values.submission_text,
        attachment_url: values.attachment_url || "",
        word_count: values.word_count || 0,
      };
      await submitAssignment(selectedAssignment.id || selectedAssignment.assignment_id, payload);
      notification.success({ message: "Assignment submitted successfully!" });
      setSubmitModalOpen(false);
      submitForm.resetFields();
      fetchAssignments();
      fetchHistory();
    } catch (err) {
      notification.error({
        message: "Submission failed",
        description: err?.message || "Please try again.",
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  // ── Table columns ─────────────────────────────────────────────────────────

  const columns = [
    {
      title: "Code",
      dataIndex: "assignment_code",
      key: "assignment_code",
      width: 110,
      sorter: (a, b) => (a.assignment_code || "").localeCompare(b.assignment_code || ""),
      render: (val) => (
        <Text style={{ color: "#5a6acf", fontWeight: 600, fontFamily: "monospace" }}>
          {val || "—"}
        </Text>
      ),
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      sorter: (a, b) => (a.title || "").localeCompare(b.title || ""),
      render: (val, record) => (
        <div>
          <Text strong style={{ display: "block" }}>
            {val}
          </Text>
          {isOverdue(record) && record.submission_status === "NOT_SUBMITTED" && (
            <Tag color="red" style={{ marginTop: 2, fontSize: 11 }}>
              Overdue
            </Tag>
          )}
        </div>
      ),
    },
    {
      title: "Subject",
      dataIndex: "subject_name",
      key: "subject_name",
      render: (val) =>
        val ? <Tag color="blue">{val}</Tag> : <Text type="secondary">—</Text>,
    },
    {
      title: "Due Date",
      dataIndex: "due_date",
      key: "due_date",
      sorter: (a, b) => dayjs(a.due_date).unix() - dayjs(b.due_date).unix(),
      render: (val) => {
        if (!val) return <Text type="secondary">—</Text>;
        const isPast = dayjs().isAfter(dayjs(val));
        return (
          <span style={{ color: isPast ? "#f5222d" : "#1f2937" }}>
            {dayjs(val).format("DD MMM YYYY")}
          </span>
        );
      },
    },
    {
      title: "Max Marks",
      dataIndex: "max_marks",
      key: "max_marks",
      align: "center",
      render: (val) => val ?? "—",
    },
    {
      title: "Status",
      dataIndex: "submission_status",
      key: "submission_status",
      render: (val) => <SubmissionStatusTag status={val} />,
    },
    {
      title: "Marks",
      dataIndex: "obtained_marks",
      key: "obtained_marks",
      align: "center",
      render: (val, record) =>
        val != null ? (
          <Text strong>
            {val}/{record.max_marks}
          </Text>
        ) : (
          <Text type="secondary">—</Text>
        ),
    },
    {
      title: "Grade",
      dataIndex: "grade",
      key: "grade",
      align: "center",
      render: (val) =>
        val ? (
          <Tag color="green" style={{ fontWeight: 700 }}>
            {val}
          </Tag>
        ) : (
          <Text type="secondary">—</Text>
        ),
    },
    {
      title: "Actions",
      key: "actions",
      align: "center",
      width: 110,
      render: (_, record) => (
        <Space>
          <Tooltip title="View Details">
            <Button
              type="text"
              icon={<EyeOutlined style={{ color: "#5a6acf" }} />}
              onClick={() => {
                setSelectedAssignment(record);
                setViewModalOpen(true);
              }}
            />
          </Tooltip>
          <Tooltip
            title={
              !canSubmit(record)
                ? ["SUBMITTED", "LATE_SUBMITTED"].includes(record.submission_status)
                  ? "Already submitted"
                  : "Submission closed"
                : "Submit"
            }
          >
            <Button
              type="text"
              icon={
                <UploadOutlined
                  style={{
                    color: canSubmit(record) ? "#52c41a" : "#d9d9d9",
                  }}
                />
              }
              disabled={!canSubmit(record)}
              onClick={() => {
                setSelectedAssignment(record);
                setSubmitModalOpen(true);
              }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="student-page" style={{ minHeight: "100vh", background: "#f8f9fa" }}>
      {/* Page Header */}
      <div
        style={{
          background: "#ffffff",
          padding: "28px 40px",
          borderBottom: "1px solid #e5e7eb",
          marginBottom: 24,
        }}
      >
        <Title level={3} style={{ margin: 0, fontWeight: 700, color: "#1f2937" }}>
          My Assignments
        </Title>
        <Text style={{ color: "#6b7280", fontSize: 14 }}>
          Track assignments, submissions, and grades
        </Text>
      </div>

      <div
        className="page-content"
        style={{ padding: "0 40px 32px 40px" }}
      >
        {/* Stats Row */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={12} sm={12} md={6}>
            <StatCard
              title="Total Assignments"
              value={stats.total}
              icon={<BookOutlined />}
              color="#5a6acf"
              loading={loading}
            />
          </Col>
          <Col xs={12} sm={12} md={6}>
            <StatCard
              title="Pending"
              value={stats.pending}
              icon={<ClockCircleOutlined />}
              color="#fa8c16"
              loading={loading}
            />
          </Col>
          <Col xs={12} sm={12} md={6}>
            <StatCard
              title="Submitted"
              value={stats.submitted}
              icon={<CheckCircleOutlined />}
              color="#52c41a"
              loading={loading}
            />
          </Col>
          <Col xs={12} sm={12} md={6}>
            <StatCard
              title="Overdue"
              value={stats.overdue}
              icon={<ExclamationCircleOutlined />}
              color="#f5222d"
              loading={loading}
            />
          </Col>
        </Row>

        {/* Filter Card */}
        <Card
          style={{
            borderRadius: 12,
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            marginBottom: 16,
            border: "1px solid #f0f0f0",
          }}
          bodyStyle={{ padding: "16px 24px" }}
        >
          <Row gutter={[12, 12]} align="middle">
            <Col xs={24} sm={12} md={6}>
              <Input
                prefix={<SearchOutlined style={{ color: "#9ca3af" }} />}
                placeholder="Search by title"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                allowClear
                style={{ borderRadius: 8 }}
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Select
                placeholder="Subject"
                style={{ width: "100%", borderRadius: 8 }}
                allowClear
                value={subjectFilter}
                onChange={setSubjectFilter}
              >
                {subjects.map((s) => (
                  <Option key={s} value={s}>
                    {s}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Select
                placeholder="Submission Status"
                style={{ width: "100%" }}
                allowClear
                value={statusFilter}
                onChange={setStatusFilter}
              >
                {Object.entries(SUBMISSION_STATUS_CONFIG).map(([key, cfg]) => (
                  <Option key={key} value={key}>
                    {cfg.label}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col xs={24} sm={12} md={4}>
              <DatePicker
                placeholder="Due date"
                style={{ width: "100%" }}
                value={dueDateFilter}
                onChange={setDueDateFilter}
                allowClear
              />
            </Col>
            <Col xs={24} sm={12} md={2}>
              <Button
                icon={<ReloadOutlined />}
                onClick={() => {
                  setSearchText("");
                  setSubjectFilter(null);
                  setStatusFilter(null);
                  setDueDateFilter(null);
                  fetchAssignments();
                  fetchHistory();
                }}
                style={{ borderRadius: 8, width: "100%" }}
              >
                Reset
              </Button>
            </Col>
          </Row>
        </Card>

        {/* Table Card */}
        <Card
          className="table-card"
          style={{
            borderRadius: 12,
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            border: "1px solid #f0f0f0",
          }}
          bodyStyle={{ padding: 0 }}
        >
          {loading ? (
            <div style={{ padding: 24 }}>
              <Skeleton active paragraph={{ rows: 8 }} />
            </div>
          ) : (
            <Table
              dataSource={filteredData}
              columns={columns}
              rowKey={(r) => r.id || r.assignment_id || r.assignment_code}
              pagination={{
                pageSize: 10,
                showTotal: (total) => `Total ${total} assignments`,
                showSizeChanger: true,
                pageSizeOptions: ["10", "20", "50"],
              }}
              locale={{
                emptyText: (
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description="No assignments found"
                  />
                ),
              }}
              scroll={{ x: 900 }}
              style={{ borderRadius: 12 }}
            />
          )}
        </Card>
      </div>

      {/* ── View Assignment Modal ─────────────────────────────────────────── */}
      <Modal
        title={
          <Space>
            <FileTextOutlined style={{ color: "#5a6acf" }} />
            <span>Assignment Details</span>
          </Space>
        }
        open={viewModalOpen}
        onCancel={() => setViewModalOpen(false)}
        footer={[
          <Button key="close" onClick={() => setViewModalOpen(false)}>
            Close
          </Button>,
          canSubmit(selectedAssignment || {}) && (
            <Button
              key="submit"
              type="primary"
              style={{ background: "#5a6acf", borderColor: "#5a6acf" }}
              onClick={() => {
                setViewModalOpen(false);
                setSubmitModalOpen(true);
              }}
            >
              Submit Assignment
            </Button>
          ),
        ].filter(Boolean)}
        width={640}
        bodyStyle={{ paddingTop: 8 }}
      >
        {selectedAssignment && (
          <div>
            {isOverdue(selectedAssignment) &&
              selectedAssignment.submission_status === "NOT_SUBMITTED" && (
                <Alert
                  type={selectedAssignment.allow_late_submission ? "warning" : "error"}
                  message={
                    selectedAssignment.allow_late_submission
                      ? `Late submission allowed until ${
                          selectedAssignment.late_until
                            ? dayjs(selectedAssignment.late_until).format("DD MMM YYYY")
                            : "—"
                        }`
                      : "Due date has passed. Submission is closed."
                  }
                  showIcon
                  style={{ marginBottom: 16 }}
                />
              )}

            <Row gutter={[16, 12]}>
              <Col span={24}>
                <Text type="secondary" style={{ fontSize: 12 }}>Title</Text>
                <div>
                  <Text strong style={{ fontSize: 16 }}>
                    {selectedAssignment.title}
                  </Text>
                </div>
              </Col>
              <Col span={12}>
                <Text type="secondary" style={{ fontSize: 12 }}>Assignment Code</Text>
                <div>
                  <Text code>{selectedAssignment.assignment_code || "—"}</Text>
                </div>
              </Col>
              <Col span={12}>
                <Text type="secondary" style={{ fontSize: 12 }}>Subject</Text>
                <div>
                  {selectedAssignment.subject_name ? (
                    <Tag color="blue">{selectedAssignment.subject_name}</Tag>
                  ) : (
                    "—"
                  )}
                </div>
              </Col>
              <Col span={12}>
                <Text type="secondary" style={{ fontSize: 12 }}>Teacher</Text>
                <div>
                  <Text>{selectedAssignment.teacher_name || "—"}</Text>
                </div>
              </Col>
              <Col span={12}>
                <Text type="secondary" style={{ fontSize: 12 }}>Due Date</Text>
                <div>
                  <Text
                    style={{
                      color: isOverdue(selectedAssignment) ? "#f5222d" : "#1f2937",
                    }}
                  >
                    {selectedAssignment.due_date
                      ? dayjs(selectedAssignment.due_date).format("DD MMM YYYY, hh:mm A")
                      : "—"}
                  </Text>
                </div>
              </Col>
              <Col span={12}>
                <Text type="secondary" style={{ fontSize: 12 }}>Max Marks</Text>
                <div>
                  <Text strong>{selectedAssignment.max_marks ?? "—"}</Text>
                </div>
              </Col>
              <Col span={12}>
                <Text type="secondary" style={{ fontSize: 12 }}>Pass Marks</Text>
                <div>
                  <Text>{selectedAssignment.pass_marks ?? "—"}</Text>
                </div>
              </Col>
              <Col span={12}>
                <Text type="secondary" style={{ fontSize: 12 }}>Assignment Status</Text>
                <div>
                  <AssignmentStatusTag status={selectedAssignment.status} />
                </div>
              </Col>
              <Col span={12}>
                <Text type="secondary" style={{ fontSize: 12 }}>Submission Status</Text>
                <div>
                  <SubmissionStatusTag status={selectedAssignment.submission_status} />
                </div>
              </Col>
              {selectedAssignment.description && (
                <Col span={24}>
                  <Divider style={{ margin: "8px 0" }} />
                  <Text type="secondary" style={{ fontSize: 12 }}>Description</Text>
                  <Paragraph
                    style={{ marginTop: 4, marginBottom: 0, color: "#374151" }}
                  >
                    {selectedAssignment.description}
                  </Paragraph>
                </Col>
              )}
              {selectedAssignment.grading_rubric_json && (
                <Col span={24}>
                  <Text type="secondary" style={{ fontSize: 12 }}>Grading Rubric</Text>
                  <div
                    style={{
                      background: "#f9fafb",
                      borderRadius: 8,
                      padding: "10px 14px",
                      marginTop: 4,
                      fontSize: 13,
                      color: "#374151",
                      border: "1px solid #e5e7eb",
                    }}
                  >
                    {typeof selectedAssignment.grading_rubric_json === "string"
                      ? selectedAssignment.grading_rubric_json
                      : JSON.stringify(selectedAssignment.grading_rubric_json, null, 2)}
                  </div>
                </Col>
              )}
              {selectedAssignment.attachment_url && (
                <Col span={24}>
                  <Text type="secondary" style={{ fontSize: 12 }}>Attachment</Text>
                  <div style={{ marginTop: 4 }}>
                    <a
                      href={selectedAssignment.attachment_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Space>
                        <LinkOutlined />
                        View Attachment
                      </Space>
                    </a>
                  </div>
                </Col>
              )}
            </Row>
          </div>
        )}
      </Modal>

      {/* ── Submit Assignment Modal ───────────────────────────────────────── */}
      <Modal
        title={
          <Space>
            <UploadOutlined style={{ color: "#52c41a" }} />
            <span>Submit Assignment</span>
          </Space>
        }
        open={submitModalOpen}
        onCancel={() => {
          setSubmitModalOpen(false);
          submitForm.resetFields();
        }}
        footer={null}
        width={560}
      >
        {selectedAssignment && (
          <>
            {isOverdue(selectedAssignment) && selectedAssignment.allow_late_submission && (
              <Alert
                type="warning"
                message="This is a late submission."
                showIcon
                style={{ marginBottom: 16 }}
              />
            )}
            <div
              style={{
                background: "#f9fafb",
                borderRadius: 8,
                padding: "10px 14px",
                marginBottom: 16,
                border: "1px solid #e5e7eb",
              }}
            >
              <Text strong>{selectedAssignment.title}</Text>
              <div style={{ marginTop: 4 }}>
                <Space size={12}>
                  {selectedAssignment.subject_name && (
                    <Tag color="blue">{selectedAssignment.subject_name}</Tag>
                  )}
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    Due: {dayjs(selectedAssignment.due_date).format("DD MMM YYYY")}
                  </Text>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    Max: {selectedAssignment.max_marks} marks
                  </Text>
                </Space>
              </div>
            </div>

            <Form
              form={submitForm}
              layout="vertical"
              onFinish={handleSubmit}
            >
              <Form.Item
                name="submission_text"
                label="Submission Text"
                rules={[{ required: true, message: "Please enter your submission" }]}
              >
                <TextArea
                  rows={5}
                  placeholder="Write your answer or submission here..."
                  style={{ borderRadius: 8 }}
                  showCount
                  maxLength={10000}
                />
              </Form.Item>

              <Form.Item name="attachment_url" label="Attachment URL">
                <Input
                  prefix={<PaperClipOutlined style={{ color: "#9ca3af" }} />}
                  placeholder="Paste a link to your file (Google Drive, Dropbox, etc.)"
                  style={{ borderRadius: 8 }}
                />
              </Form.Item>

              <Form.Item
                name="word_count"
                label="Word Count"
                rules={[
                  {
                    validator: (_, value) =>
                      value === undefined || value === null || value >= 0
                        ? Promise.resolve()
                        : Promise.reject("Word count cannot be negative"),
                  },
                ]}
              >
                <InputNumber
                  min={0}
                  placeholder="e.g. 500"
                  style={{ width: "100%", borderRadius: 8 }}
                />
              </Form.Item>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 8 }}>
                <Button
                  onClick={() => {
                    setSubmitModalOpen(false);
                    submitForm.resetFields();
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={submitLoading}
                  style={{ background: "#5a6acf", borderColor: "#5a6acf" }}
                >
                  Submit Assignment
                </Button>
              </div>
            </Form>
          </>
        )}
      </Modal>
    </div>
  );
};

export default StudentAssignments;