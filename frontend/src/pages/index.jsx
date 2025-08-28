import Head from "next/head";
import { useRouter } from "next/router";
import styles from "../styles/Home.module.css";
import UserLayout from "@/layout/userLayout";

export default function Home() {
  const router = useRouter();

  return (
    <UserLayout>
      <Head>
        <title>proConnect - Connect Without Bugs</title>
        <meta
          name="description"
          content="A True Social Media Experience — With Stories, Without Bugs!"
        />
      </Head>

      <div className={styles.container}>
        <div className={styles.mainContainer}>
          <div className={styles.mainContainer_left}>
            <h1>Connect with Friends without Exaggeration</h1>
            <p>A True Social Media Experience — With Stories, Without Bugs!</p>

            <button
              className={styles.buttonJoin}
              onClick={() => router.push("/login")}
            >
              Join Now
            </button>
          </div>

          <div className={styles.mainContainer_right}>
            <img
              src="/images/Proconnect.jpg"
              alt="ProConnect Banner"
              width={500}
              height={500}
            />
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
