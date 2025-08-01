"use client";

import Image from "next/image";
import styles from "./navbar.module.css";
import Link from "next/link";
import SignIn from "./sign-in";
import { useEffect, useState } from "react";
import { User } from "firebase/auth";
import { onAuthStateChangedHelper } from "../firebase/firebase";
import Upload from "./upload";
export default function Navbar() {
  // Maintain User auth state in Navbar component itself using react hook: useState.
  // Initialize user state as null
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChangedHelper((user) => {
      setUser(user);
    });

    // Clean up subscription on unmount
    return () => unsubscribe();
  });

  return (
    <nav className={styles.nav}>
      <Link href="/">
        <Image src="/logo.png" alt="logo" width={180} height={50} />
      </Link>
      {user && <Upload />}
      <SignIn user={user} />
    </nav>
  );
}
