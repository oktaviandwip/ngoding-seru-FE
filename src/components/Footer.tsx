import Image from "next/image";
import logo from "@/assets/ngoding-seru-logo-putih.png";

export default function Footer() {
  return (
    <footer className="bg-black text-white px-0 py-10 md:p-10">
      <div className="container flex items-center justify-start space-x-4 text-sm">
        <Image
          src={logo}
          alt="Ngoding seru logo putih"
          width={80}
          height={80}
          quality={100}
        />
        <div className="flex flex-col">
          <p>Email: ngodingseru@gmail.com</p>
          <p>No. Telp: +6285171021035</p>
        </div>
      </div>
    </footer>
  );
}
