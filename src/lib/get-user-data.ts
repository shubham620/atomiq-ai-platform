import {
  collection,
  getDocs,
} from "firebase/firestore";

import { db } from "./firebase";

export const getUserData = async (
  email: string
) => {
  const snapshot = await getDocs(
    collection(db, "users")
  );

  const users = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return users.find(
  (user: any) =>
    user.email === email
);
};
