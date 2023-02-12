import "../styles/tailwind.css";
import type { AppProps } from "next/app";
import Link from "next/link";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <div className="min-h-[100%] grid grid-rows-[auto_1fr_auto] grid-cols-[100%] bg-[#efefef]">
        <header className="bg-[#181818] text-[#efefef] m-2 rounded-lg">
          <div className="flex items-center justify-between px-4 py-2">
            <div>
              <Link href="/">Storyboard</Link>
            </div>
            <nav>
              <ul className="flex items-center gap-4 text-sm [&_a:hover]:underline">
                <li>
                  <Link href="/board">Board</Link>
                </li>
                <li>
                  <Link href="/board/post">Post</Link>
                </li>
              </ul>
            </nav>
          </div>
        </header>

        <main>
          <Component {...pageProps} />
        </main>

        <footer className="bg-stone-300">
          <div className="flex justify-between p-4">
            <p className="text-xs">&copy; {new Date().getFullYear()}</p>
            <ul className="flex gap-2 text-xs">
              <li>
                <a
                  className="hover:underline"
                  href="https://ryanrampersad.com"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  made by ryan rampersad
                </a>
              </li>
              <li>
                <a
                  className="hover:underline"
                  href="https://github.com/ryanmr/storyboard-app"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  github
                </a>
              </li>
            </ul>
          </div>
        </footer>
      </div>
    </>
  );
}
