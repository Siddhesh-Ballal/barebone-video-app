import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import { getVideos } from "./firebase/functions";

export default async function Home() {
  const videos = await getVideos();


  return (
    <div className={styles.page}>
      <main>
        {
          videos.map((video) => (
              <Link href={`/watch?v=${video.filename}`} key={video.id}>
                <Image
                  src={'/thumbnail.png'}
                  alt={'video'}
                  width={120}
                  height={80}
                  className={styles.thumbnail}
                />
              </Link>
          ))
        }
      </main>
    </div>
  );
}


export const revalidate = 30;
// Disable caching to make sure we get latest data
// -> Next.js will revalidate the page every 30 seconds