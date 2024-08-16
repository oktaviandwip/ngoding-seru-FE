"use client";

import Image from "next/image";
import javascript from "@/assets/javascript.svg";
import typescript from "@/assets/typescript.svg";
import react from "@/assets/react.svg";
import nextjs from "@/assets/nextjs.svg";
import tailwindcss from "@/assets/tailwindcss.svg";
import go from "@/assets/go.svg";
import nodejs from "@/assets/nodejs.svg";
import postgresql from "@/assets/postgresql.svg";
import mysql from "@/assets/mysql.svg";
import { useRouter } from "next/navigation";

const frontendList = [
  { image: javascript, alt: "Javascript", link: "/javascript" },
  { image: typescript, alt: "Typescript", link: "/typescript" },
  { image: react, alt: "React", link: "/react" },
  { image: nextjs, alt: "Nextjs", link: "/nextjs" },
  { image: tailwindcss, alt: "TailwindCSS", link: "/tailwindcss" },
];

const backendList = [
  { image: nodejs, alt: "Nodejs", link: "/nodejs" },
  { image: go, alt: "Go", link: "/go" },
  { image: postgresql, alt: "Postgresql", link: "/postgresql" },
  { image: mysql, alt: "Mysql", link: "/mysql" },
];

export default function Home() {
  const router = useRouter();

  return (
    <main className="space-y-12">
      <div className="space-y-6">
        <div className="text-2xl font-cofo-medium">Frontend</div>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-6">
          {frontendList.map((v) => (
            <Image
              key={v.alt}
              src={v.image}
              alt={v.alt}
              width={100}
              height={100}
              onClick={() => router.push(`/quiz/${v.link}`)}
            />
          ))}
        </div>
      </div>
      <div className="space-y-6">
        <div className="text-2xl font-cofo-medium">Backend</div>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-6">
          {backendList.map((v) => (
            <Image
              key={v.alt}
              src={v.image}
              alt={v.alt}
              width={100}
              height={100}
              onClick={() => router.push(`/quiz/${v.link}`)}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
