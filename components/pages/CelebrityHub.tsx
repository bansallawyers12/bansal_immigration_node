import Image from "next/image";
import Link from "next/link";

const gallery = [
  ["/img/celebrity/Bollywood/Abhijeet Bhattacharya/abhijit-bhattacharjee.avif", "Abhijeet Bhattacharya"],
  ["/img/celebrity/Punjabi Singers/Gurdaas Maan Ji/Gurdaas-maan.avif", "Gurdaas Maan"],
  ["/img/celebrity/Punjabi Singers/Satinder Sartaaj/Satinder-sartaj.avif", "Satinder Sartaaj"],
  ["/img/celebrity/Bollywood/Sukhwinder Singh/Sukhwinder-Singh.avif", "Sukhwinder Singh"],
  ["/img/celebrity/Bollywood/Rahat Fateh Ali Khan/Rahat-Fateh-Ali-Khan.avif", "Rahat Fateh Ali Khan"],
  ["/img/celebrity/Punjabi Singers/Arjan Dhillion/Arjan-Dhillon.avif", "Arjan Dhillon"],
  ["/img/celebrity/Bollywood/Falguni Pathak/Falguni-Pathak.avif", "Falguni Pathak"],
  ["/img/celebrity/Punjabi Singers/Master Saleem/Master-Saleem.avif", "Master Saleem"],
];

export function CelebrityHub() {
  return (
    <div className="sky-gradient">
      <div className="bg-gradient-to-br from-purple-700 via-purple-600 to-pink-500 py-16 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h1 className="text-4xl font-bold md:text-5xl">Celebrity Visas</h1>
          <p className="mt-4 text-xl text-purple-100">
            Entertainment and performance visas for artists who have performed in Australia with Bansal Immigration support.
          </p>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 py-12">
        <h2 className="mb-8 text-center text-3xl font-bold text-white drop-shadow">Featured artists</h2>
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {gallery.map(([src, name]) => (
            <li key={src} className="overflow-hidden rounded-2xl bg-white/95 shadow-lg">
              <div className="relative aspect-[3/4]">
                <Image src={src} alt={name} fill className="object-cover" sizes="(max-width:768px) 50vw, 25vw" />
              </div>
              <p className="p-4 text-center font-semibold text-sg-navy">{name}</p>
            </li>
          ))}
        </ul>
        <p className="mt-10 text-center">
          <Link href="/contact" className="inline-block rounded-lg bg-white px-8 py-4 font-semibold text-purple-800">
            Talk to our entertainment visa team
          </Link>
        </p>
      </div>
      <style>{`.sky-gradient{background:linear-gradient(180deg,#e0e7ff 0%,#c7d2fe 30%,#fbbf24 70%,#f97316 100%);min-height:100vh;}`}</style>
    </div>
  );
}
