import { useEffect, useState } from "react";
import Modal from "./Modal";
import FormField from "./FormField";
import { validateRequired } from "../utils/validation";

const emptyForm = {
  title: "",
  description: "",
  thumbnail: "",
  instructor: "",
  category: "Frontend",
  difficulty: "Beginner",
  duration: "",
  technologies: "",
};

function makeId(prefix) {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

export default function CourseFormModal({ open, onClose, onSubmit, initialCourse }) {
  const [form, setForm] = useState(emptyForm);
  const [modules, setModules] = useState([]);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialCourse) {
      setForm({
        title: initialCourse.title || "",
        description: initialCourse.description || "",
        thumbnail: initialCourse.thumbnail || "",
        instructor: initialCourse.instructor || "",
        category: initialCourse.category || "Frontend",
        difficulty: initialCourse.difficulty || "Beginner",
        duration: initialCourse.duration || "",
        technologies: (initialCourse.technologies || []).join(", "),
      });
      setModules(initialCourse.modules?.length ? initialCourse.modules : []);
    } else {
      setForm(emptyForm);
      setModules([]);
    }
    setErrors({});
  }, [initialCourse, open]);

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  // --- Modules & lessons ---------------------------------------------
  function addModule() {
    setModules((mods) => [...mods, { id: makeId("m"), title: "", lessons: [] }]);
  }
  function removeModule(moduleId) {
    setModules((mods) => mods.filter((m) => m.id !== moduleId));
  }
  function updateModuleTitle(moduleId, title) {
    setModules((mods) => mods.map((m) => (m.id === moduleId ? { ...m, title } : m)));
  }
  function addLesson(moduleId) {
    setModules((mods) =>
      mods.map((m) =>
        m.id === moduleId
          ? { ...m, lessons: [...m.lessons, { id: makeId("l"), title: "", duration: "" }] }
          : m
      )
    );
  }
  function removeLesson(moduleId, lessonId) {
    setModules((mods) =>
      mods.map((m) =>
        m.id === moduleId ? { ...m, lessons: m.lessons.filter((l) => l.id !== lessonId) } : m
      )
    );
  }
  function updateLesson(moduleId, lessonId, patch) {
    setModules((mods) =>
      mods.map((m) =>
        m.id === moduleId
          ? { ...m, lessons: m.lessons.map((l) => (l.id === lessonId ? { ...l, ...patch } : l)) }
          : m
      )
    );
  }

  function validate() {
    const next = {
      title: validateRequired(form.title, "Title"),
      description: validateRequired(form.description, "Description"),
      instructor: validateRequired(form.instructor, "Instructor"),
      duration: validateRequired(form.duration, "Duration"),
    };
    setErrors(next);
    return !Object.values(next).some(Boolean);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      // Drop modules with an empty title, and lessons with an empty title,
      // rather than saving placeholder rows the admin never filled in.
      const cleanModules = modules
        .filter((m) => m.title.trim())
        .map((m) => ({ ...m, lessons: m.lessons.filter((l) => l.title.trim()) }));

      await onSubmit({
        ...form,
        thumbnail: form.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80",
        technologies: form.technologies.split(",").map((t) => t.trim()).filter(Boolean),
        modules: cleanModules,
      });
      onClose();
    } catch {
      // Save failed — onSubmit already surfaced a toast. Keep the modal
      // open (and the admin's edits intact) so they can retry.
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={initialCourse ? "Edit course" : "Add course"} size="lg">
      <form onSubmit={handleSubmit} className="max-h-[70vh] space-y-4 overflow-y-auto pr-1">
        <FormField id="title" name="title" label="Title" value={form.title} onChange={handleChange} error={errors.title} />
        <FormField as="textarea" id="description" name="description" label="Description" rows={3} value={form.description} onChange={handleChange} error={errors.description} />
        <FormField id="thumbnail" name="thumbnail" label="Thumbnail URL" value={form.thumbnail} onChange={handleChange} placeholder="https://…" />
        <div className="grid grid-cols-2 gap-4">
          <FormField id="instructor" name="instructor" label="Instructor" value={form.instructor} onChange={handleChange} error={errors.instructor} />
          <FormField id="duration" name="duration" label="Duration" placeholder="e.g. 10h 30m" value={form.duration} onChange={handleChange} error={errors.duration} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="category" className="mb-1.5 block text-sm font-medium text-slate-300">Category</label>
            <select id="category" name="category" value={form.category} onChange={handleChange} className="w-full rounded-lg border border-ink-500 bg-transparent px-3.5 py-2.5 text-sm outline-none focus:border-ember-500">
              <option>Frontend</option>
              <option>Backend</option>
              <option>Design</option>
            </select>
          </div>
          <div>
            <label htmlFor="difficulty" className="mb-1.5 block text-sm font-medium text-slate-300">Difficulty</label>
            <select id="difficulty" name="difficulty" value={form.difficulty} onChange={handleChange} className="w-full rounded-lg border border-ink-500 bg-transparent px-3.5 py-2.5 text-sm outline-none focus:border-ember-500">
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
          </div>
        </div>
        <FormField id="technologies" name="technologies" label="Technologies (comma-separated)" value={form.technologies} onChange={handleChange} placeholder="React, Firebase, Tailwind CSS" />

        <div className="border-t border-ink-700 pt-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-medium text-slate-300">Modules &amp; lessons</p>
            <button
              type="button"
              onClick={addModule}
              className="rounded-lg border border-ink-500 px-3 py-1.5 text-xs font-medium transition hover:border-ember-500 hover:text-ember-500"
            >
              + Add module
            </button>
          </div>

          {modules.length === 0 ? (
            <p className="rounded-lg border border-dashed border-ink-600 px-3 py-4 text-center text-xs text-slate-400">
              No modules yet. Courses can be published without content and filled in later.
            </p>
          ) : (
            <div className="space-y-3">
              {modules.map((module, mIdx) => (
                <div key={module.id} className="rounded-xl border border-ink-600 bg-ink-900 p-3">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="font-mono text-xs text-slate-400">M{mIdx + 1}</span>
                    <input
                      value={module.title}
                      onChange={(e) => updateModuleTitle(module.id, e.target.value)}
                      placeholder="Module title, e.g. Foundations"
                      className="flex-1 rounded-lg border border-ink-500 bg-transparent px-3 py-1.5 text-sm outline-none focus:border-ember-500"
                    />
                    <button
                      type="button"
                      onClick={() => removeModule(module.id)}
                      aria-label="Remove module"
                      className="rounded-md p-1.5 text-slate-400 transition hover:bg-ink-700 hover:text-danger-500"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="space-y-2 pl-6">
                    {module.lessons.map((lesson, lIdx) => (
                      <div key={lesson.id} className="flex items-center gap-2">
                        <span className="font-mono text-[11px] text-slate-400">L{lIdx + 1}</span>
                        <input
                          value={lesson.title}
                          onChange={(e) => updateLesson(module.id, lesson.id, { title: e.target.value })}
                          placeholder="Lesson title"
                          className="flex-1 rounded-lg border border-ink-500 bg-transparent px-3 py-1.5 text-sm outline-none focus:border-ember-500"
                        />
                        <input
                          value={lesson.duration}
                          onChange={(e) => updateLesson(module.id, lesson.id, { duration: e.target.value })}
                          placeholder="12m"
                          className="w-16 rounded-lg border border-ink-500 bg-transparent px-2 py-1.5 text-sm outline-none focus:border-ember-500"
                        />
                        <button
                          type="button"
                          onClick={() => removeLesson(module.id, lesson.id)}
                          aria-label="Remove lesson"
                          className="rounded-md p-1.5 text-slate-400 transition hover:bg-ink-700 hover:text-danger-500"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addLesson(module.id)}
                      className="text-xs font-medium text-slate-400 transition hover:text-ember-500"
                    >
                      + Add lesson
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="rounded-lg border border-ink-500 px-4 py-2 text-sm font-medium hover:border-slate-400">
            Cancel
          </button>
          <button type="submit" disabled={submitting} className="rounded-lg bg-ember-500 px-4 py-2 text-sm font-semibold text-ink-950 disabled:opacity-60">
            {submitting ? "Saving…" : initialCourse ? "Save changes" : "Add course"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
