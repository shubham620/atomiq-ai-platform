import {
  addDoc,
  collection,
} from "firebase/firestore";

import { db } from "./firebase";

export const createAuditLog = async ({
  action,
  user,
  role,
  goal,
}: any) => {
  try {
    await addDoc(
      collection(db, "auditLogs"),
      {
        action,
        user,
        role,
        goal,
        timestamp: new Date(),
      }
    );
  } catch (error) {
    console.error(
      "Audit log failed",
      error
    );
  }
};