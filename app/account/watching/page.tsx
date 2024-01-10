import {Header} from "@/components/header";
import Footer from "@/components/footer";
import {getPageSession} from "@/lib/lucia";
import {redirect} from 'next/navigation'
import * as React from "react";
import {query} from "@/lib/dbUtilActions";
import Link from "next/link";

interface WatchingData {
    user_id: string,
    anime_id: string,
    title: string,
    total_episodes: number,
    current_episode: string, // id
    current_episode_number: number,
    current_episode_poster: string,
    current_progress: number,
    current_progress_out_of: number,
    created_at: string
}

function secoundsToTime(secounds: number) {
    const hours = Math.floor(secounds / 3600);
    const minutes = Math.floor((secounds - (hours * 3600)) / 60);
    const sec = secounds - (hours * 3600) - (minutes * 60);

    if (hours === 0) return `${minutes}:${sec.toFixed(0)}`

    return `${hours}:${minutes}:${sec.toFixed(0)}`;
}

export default async function Watching({params, searchParams}: {
    params: { slug: string };
    searchParams?: { [key: string]: string | string[] | undefined };
}) {
    const session = await getPageSession();

    if (!session) redirect('/')

    const watchingData: WatchingData[] = await query('SELECT * FROM anime_watch WHERE user_id = ?', [session.user.userId]).then((res) => res as WatchingData[]).catch(() => []);

    return (
        <main className="">
            <Header session={session} page="home"/>
            <div className="h-fit mt-14">
                <div className="container mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {
                            watchingData.map((data) => (
                                <Link href={'/anime/'+data.anime_id} key={data.anime_id} className="rounded-md overflow-hidden shadow-md bg-blue-900 transition ease-in-out duration-300 hover:scale-105 cursor-pointer">
                                    <div className="relative">
                                        <img src={data.current_episode_poster}
                                             className="w-full h-48 object-cover" alt=""/>
                                    </div>
                                    <div className="p-4 inline-flex w-full">
                                        <h1 className="font-bold">{data.title}</h1>
                                        <h2 className="mx-3">Ep {data.current_episode_number}/{data.total_episodes}</h2>
                                        <h2 className="ml-auto">{secoundsToTime(data.current_progress)} / {secoundsToTime(data.current_progress_out_of)}</h2>
                                    </div>
                                </Link>
                            ))
                        }
                    </div>
                </div>

            </div>
            <Footer/>
        </main>
    )
}
