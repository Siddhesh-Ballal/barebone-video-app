import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <ol>
          <li>
            Get started by editing <code>app/page.tsx</code>.
          </li>
        </ol>
      </main>
    </div>
  );
}
