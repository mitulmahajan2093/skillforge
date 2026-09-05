import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getCourses, addCourse, updateCourse, deleteCourse } from "../services/courseService";
import { getAllUsers } from "../services/authService";
import { getUserEnrollments } from "../services/enrollmentService";
import CourseFormModal from "../components/CourseFormModal";
import Modal from "../components/Modal";
import LoadingSpinner from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";
import StatusBadge from "../components/StatusBadge";
import { countLessons, getEnrollmentStatus } from "../utils/format";

const TABS = [
  { id: "courses", label: "Courses" },
  { id: "users", label: "Users" },
  { id: "enrollments", label: "Enrollments" },
];

export default function AdminDashboard() {
  const [tab, setTab] = useState("courses");

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <p className="font-mono text-xs uppercase tracking-wide text-ember-500">Admin</p>
      <h1 className="mt-1 font-display text-3xl font-bold">Admin dashboard</h1>

      <div className="mt-6 flex gap-1 border-b border-ink-700">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`border-b-2 px-4 py-2.5 text-sm font-medium transition ${
              tab === t.id ? "border-ember-500 text-ember-500" : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {tab === "courses" && <AdminCourses />}
        {tab === "users" && <AdminUsers />}
        {tab === "enrollments" && <AdminEnrollments />}
      </div>
    </div>
  );
}

function AdminCourses() {
  const [courses, setCourses] = useState([]);
  const [status, setStatus] = useState("loading");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  function load() {
    setStatus("loading");
    getCourses()
      .then(setCourses)
      .then(() => setStatus("success"))
      .catch(() => setStatus("error"));
  }

  useEffect(load, []);

  async function handleSubmit(data) {
    try {
      if (editingCourse) {
        const updated = await updateCourse(editingCourse.id, data);
        setCourses((prev) => prev.map((c) => (c.id === editingCourse.id ? { ...c, ...updated } : c)));
        toast.success("Course updated");
      } else {
        const created = await addCourse(data);
        setCourses((prev) => [created, ...prev]);
        toast.success("Course added");
      }
    } catch (err) {
      toast.error(err.message || "Couldn't save that course. Try again.");
      throw err; // keep the modal open so the admin doesn't lose their edits
    }
  }

  async function confirmDelete() {
    try {
      await deleteCourse(deleteTarget.id);
      setCourses((prev) => prev.filter((c) => c.id !== deleteTarget.id));
      toast.success("Course deleted");
    } catch (err) {
      toast.error(err.message || "Couldn't delete that course. Try again.");
    } finally {
      setDeleteTarget(null);
    }
  }

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <p className="text-sm text-slate-400">{courses.length} course{courses.length === 1 ? "" : "s"}</p>
        <button
          onClick={() => {
            setEditingCourse(null);
            setModalOpen(true);
          }}
          className="rounded-lg bg-ember-500 px-4 py-2 text-sm font-semibold text-ink-950 shadow-ember transition hover:bg-ember-400"
        >
          + Add course
        </button>
      </div>

      {status === "loading" && <LoadingSpinner label="Loading courses…" />}
      {status === "error" && <ErrorState message="Couldn't load the course catalog." onRetry={load} />}
      {status === "success" && courses.length === 0 && (
        <EmptyState title="No courses yet" description="Add your first course to populate the catalog." />
      )}

      {status === "success" && courses.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-ink-700">
          <table className="w-full text-left text-sm">
            <thead className="bg-ink-800 text-xs uppercase tracking-wide text-slate-400">
              <tr>
                <th className="px-4 py-3">Course</th>
                <th className="hidden px-4 py-3 sm:table-cell">Category</th>
                <th className="hidden px-4 py-3 sm:table-cell">Lessons</th>
                <th className="hidden px-4 py-3 sm:table-cell">Students</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-700">
              {courses.map((c) => (
                <tr key={c.id}>
                  <td className="px-4 py-3 font-medium">{c.title}</td>
                  <td className="hidden px-4 py-3 text-slate-400 sm:table-cell">{c.category}</td>
                  <td className="hidden px-4 py-3 text-slate-400 sm:table-cell">{countLessons(c)}</td>
                  <td className="hidden px-4 py-3 text-slate-400 sm:table-cell">{c.enrollCount || 0}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => {
                          setEditingCourse(c);
                          setModalOpen(true);
                        }}
                        className="rounded-md border border-ink-500 px-3 py-1.5 text-xs font-medium hover:border-ember-500 hover:text-ember-500"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteTarget(c)}
                        className="rounded-md border border-danger-500/40 px-3 py-1.5 text-xs font-medium text-danger-500 hover:bg-danger-500/10"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <CourseFormModal open={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleSubmit} initialCourse={editingCourse} />

      <Modal
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title="Delete course?"
        footer={
          <>
            <button onClick={() => setDeleteTarget(null)} className="rounded-lg border border-ink-500 px-4 py-2 text-sm font-medium">
              Cancel
            </button>
            <button onClick={confirmDelete} className="rounded-lg bg-danger-500 px-4 py-2 text-sm font-semibold text-white">
              Delete
            </button>
          </>
        }
      >
        <p className="text-sm text-slate-400">
          This will permanently remove <span className="font-medium text-mist-100">{deleteTarget?.title}</span> from the catalog.
        </p>
      </Modal>
    </div>
  );
}

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [status, setStatus] = useState("loading");

  function load() {
    setStatus("loading");
    getAllUsers()
      .then(setUsers)
      .then(() => setStatus("success"))
      .catch(() => setStatus("error"));
  }

  useEffect(load, []);

  if (status === "loading") return <LoadingSpinner label="Loading users…" />;
  if (status === "error") return <ErrorState message="Couldn't load users." onRetry={load} />;
  if (users.length === 0) return <EmptyState title="No users yet" />;

  return (
    <div className="overflow-hidden rounded-2xl border border-ink-700">
      <table className="w-full text-left text-sm">
        <thead className="bg-ink-800 text-xs uppercase tracking-wide text-slate-400">
          <tr>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Role</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-ink-700">
          {users.map((u) => (
            <tr key={u.id}>
              <td className="px-4 py-3 font-medium">{u.name}</td>
              <td className="px-4 py-3 text-slate-400">{u.email}</td>
              <td className="px-4 py-3">
                <span className={`rounded-full px-2.5 py-0.5 text-xs capitalize ${u.role === "admin" ? "bg-ember-500/10 text-ember-500" : "bg-ink-700 text-slate-300"}`}>
                  {u.role}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AdminEnrollments() {
  const [rows, setRows] = useState([]);
  const [status, setStatus] = useState("loading");
  const [filter, setFilter] = useState("all");

  function load() {
    setStatus("loading");
    (async () => {
      const [users, courses] = await Promise.all([getAllUsers(), getCourses()]);
      const courseById = Object.fromEntries(courses.map((c) => [c.id, c]));
      const allEnrollments = (
        await Promise.all(users.map((u) => getUserEnrollments(u.id).then((es) => es.map((e) => ({ ...e, userName: u.name })))))
      ).flat();
      setRows(
        allEnrollments.map((e) => {
          const totalLessons = countLessons(courseById[e.courseId]);
          const completedCount = e.completedLessonIds?.length || 0;
          return {
            ...e,
            courseTitle: courseById[e.courseId]?.title || "Unknown course",
            totalLessons,
            enrollmentStatus: getEnrollmentStatus(completedCount, totalLessons),
          };
        })
      );
      setStatus("success");
    })().catch(() => setStatus("error"));
  }

  useEffect(load, []);

  if (status === "loading") return <LoadingSpinner label="Loading enrollments…" />;
  if (status === "error") return <ErrorState message="Couldn't load enrollments." onRetry={load} />;
  if (rows.length === 0) return <EmptyState title="No enrollments yet" />;

  const visibleRows = filter === "all" ? rows : rows.filter((r) => r.enrollmentStatus === filter);

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2">
        {["all", "in-progress", "completed", "pending"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full border px-3.5 py-1.5 text-xs font-medium capitalize transition ${
              filter === f
                ? "border-ember-500 bg-ember-500/10 text-ember-500"
                : "border-ink-600 text-slate-400 hover:border-slate-400 hover:text-slate-200"
            }`}
          >
            {f === "all" ? "All" : f.replace("-", " ")}
          </button>
        ))}
      </div>

      {visibleRows.length === 0 ? (
        <EmptyState title="No enrollments in this category" description="Try a different filter above." />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-ink-700">
          <table className="w-full text-left text-sm">
            <thead className="bg-ink-800 text-xs uppercase tracking-wide text-slate-400">
              <tr>
                <th className="px-4 py-3">Student</th>
                <th className="px-4 py-3">Course</th>
                <th className="px-4 py-3">Progress</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-700">
              {visibleRows.map((r) => (
                <tr key={r.id}>
                  <td className="px-4 py-3 font-medium">{r.userName}</td>
                  <td className="px-4 py-3 text-slate-400">{r.courseTitle}</td>
                  <td className="px-4 py-3 text-slate-400">
                    {r.completedLessonIds?.length || 0}/{r.totalLessons} lessons
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={r.enrollmentStatus} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
