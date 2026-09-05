import { useEffect, useMemo, useState } from "react";
import { getCourses, filterAndSortCourses } from "../services/courseService";

export function useCourses(filters = {}) {
  const [courses, setCourses] = useState([]);
  const [status, setStatus] = useState("loading"); // 'loading' | 'success' | 'error'
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    getCourses()
      .then((data) => {
        if (cancelled) return;
        setCourses(data);
        setStatus("success");
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err);
        setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => filterAndSortCourses(courses, filters), [courses, filters]);

  return { courses: filtered, allCourses: courses, status, error, isLoading: status === "loading" };
}
