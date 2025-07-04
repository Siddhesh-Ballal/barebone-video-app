import Image from "next/image";
import styles from "./navbar.module.css";
import Link from "next/link";
export default function Navbar() {
  return (
    <nav className={styles.nav}>
      <Link href="/">
        <Image src="/logo.png" alt="logo" width={180} height={50} />
      </Link>
    </nav>
  );
}
