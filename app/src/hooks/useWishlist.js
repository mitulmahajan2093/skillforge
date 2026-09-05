import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "./useAuth";
import { getWishlistCourseIds, toggleWishlist } from "../services/enrollmentService";

export function useWishlist() {
  const { user, isAuthenticated } = useAuth();
  const [wishlistIds, setWishlistIds] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    if (!isAuthenticated) {
      setWishlistIds([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    getWishlistCourseIds(user.id)
      .then(setWishlistIds)
      .finally(() => setLoading(false));
  }, [isAuthenticated, user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const toggle = useCallback(
    async (courseId) => {
      if (!isAuthenticated) {
        toast.error("Log in to save courses to your wishlist.");
        return;
      }
      const wasAdded = await toggleWishlist(user.id, courseId);
      setWishlistIds((prev) => (wasAdded ? [...prev, courseId] : prev.filter((id) => id !== courseId)));
      toast.success(wasAdded ? "Added to wishlist" : "Removed from wishlist");
    },
    [isAuthenticated, user]
  );

  return { wishlistIds, loading, toggle, refresh };
}
