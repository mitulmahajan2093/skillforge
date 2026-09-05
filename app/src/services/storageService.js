import { isFirebaseConfigured, storage } from "../firebase/config";

export async function uploadCourseThumbnail(file, courseId) {
  if (!file) return null;

  if (isFirebaseConfigured) {
    const { ref, uploadBytes, getDownloadURL } = await import("firebase/storage");
    const storageRef = ref(storage, `course-thumbnails/${courseId}-${file.name}`);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  }

  // Demo mode: no real storage backend, so preview locally via object URL.
  return URL.createObjectURL(file);
}
