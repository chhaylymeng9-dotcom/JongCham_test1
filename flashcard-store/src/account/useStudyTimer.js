import { useEffect } from "react";
import { addStudySeconds, logStudyDay } from "../storage.js";

// Counts wall-clock time this component stays mounted as study time, and
// marks today in the day-streak log. Call once from the top of
// Lessons/Practice/Exam — whichever of those tabs is open is "studying"
// for as long as it stays open.
export function useStudyTimer() {
  useEffect(() => {
    const start = Date.now();
    logStudyDay();
    return () => addStudySeconds((Date.now() - start) / 1000);
  }, []);
}
