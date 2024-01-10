import {Header} from "@/components/header";
import Footer from "@/components/footer";
import Link from "next/link"
import {Button} from "@/components/ui/button"
import {getPageSession} from "@/lib/lucia";

export default async function Home() {
    const session = await getPageSession();

    return (
        <main className="">
            <Header session={session} page='home'/>
            <div className="h-[35vw] mt-14 text-center ">
                <h1 className="font-bold text-[40px] mb-3">Ani-Master</h1>
                <h4 className="text-[18px]">
                    Welcome to Ani-Master, the one place for all anime and related content.<br/><br/>
                    Right now we are in early development, so please be patient.<br/>
                    If you want to help out, check out our <a href="/">GitHub</a>.<br/>
                    Right now Anime is the only thing we have, but we are working on more.
                </h4>
                <div className="mt-8">
                    <Button asChild>
                        <Link href="/anime">Anime</Link>
                    </Button>
                </div>
            </div>
            <Footer/>
        </main>
    )
}
