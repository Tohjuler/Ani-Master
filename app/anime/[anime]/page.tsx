import {Header} from "@/components/header";
import Footer from "@/components/footer";
import {getPageSession} from "@/lib/lucia";
import {ITitle, META} from "@consumet/extensions";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import parse from "html-react-parser";
import AnimeWatch from "@/components/animeWatch";
import {AnimeWatchData} from "@/lib/dbUtil";
import {query} from "@/lib/dbUtilActions";
import Head from 'next/head'
import {getProvier} from "@/lib/utils";

const messagePage = (title: string, message: string, session: any) => (
    <main className="">
        <Header session={session} page="anime"/>
        <div className="mt-14 text-center">

            <h1 className="text-[30px] font-bold mb-3">{title}</h1>

            {
                message !== "" ? (
                    <h4 className="text-[18px]">
                        {message}
                    </h4>
                ) : null
            }

        </div>
        <div className="fixed bottom-0">
            <Footer/>
        </div>
    </main>
)


export default async function AnimePage({params, searchParams}: {
    params: { anime: string };
    searchParams?: { [key: string]: string | string[] | undefined };
}) {
    const session = await getPageSession();
    let watchData: AnimeWatchData | null = null;
    if (session)
        watchData = await query('SELECT * FROM anime_watch WHERE user_id = ? AND anime_id = ? LIMIT 1', [session.user.userId, params.anime]).then((res) => res[0] as AnimeWatchData).catch(() => null);
    let settings: { default_provider_anime: string, default_dubbed_anime: number } | null = null;
    if (session)
        settings = await query('SELECT default_provider_anime, default_dubbed_anime FROM user WHERE id = ?', [session.user.userId]).then((res) => res[0] as {
            default_provider_anime: string,
            default_dubbed_anime: number
        }).catch(() => null);

    const animeId = params.anime;

    if (!animeId || animeId === "" || animeId === "undefined") return messagePage("Anime not found", "", session);

    const anilist = new META.Anilist(getProvier(searchParams?.provider as string || "gogoanime") as any, {
        url: (process.env.PROXY_URL as string).includes(",") ? (process.env.PROXY_URL as string).split(",") : (process.env.PROXY_URL as string),
        key: process.env.PROXY_KEY as string,
        rotateInterval: parseInt(process.env.PROXY_ROTATE_INTERVAL as string)
    });

    const res = await anilist.fetchAnimeInfo(animeId).catch(() => null);

    if (!res) return messagePage("Anime not found", "", session);

    const title: string = typeof res.title === "string" ? (res.title as string) + "" : ((res.title as ITitle).userPreferred || (res.title as ITitle).romaji || (res.title as string) + "");
    return (
        <main className="">
            <Head>
                <title>Ani-Master | {title}</title>
            </Head>
            <Header session={session} page="anime"/>
            <div className="h-fit mt-14">
                <div className="grid grid-cols-4 gap-1">
                    <div>
                        <Card className="w-full">
                            <CardHeader>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={res.image} alt={title} className="rounded"/>
                            </CardHeader>
                            <CardContent>
                                <CardTitle className="text-center">{title}</CardTitle>
                                <CardDescription className="mt-2">
                                    {parse(res.description || "")}
                                </CardDescription>
                            </CardContent>
                            <CardFooter className="grid text-center">
                                <div className="inline-flex text-gray-600 text-[10px] mx-auto">
                                    <h6>{res.type}</h6>
                                    <h6 className="mx-2">•</h6>
                                    <h6>{res.status}</h6>
                                    <h6 className="mx-2">•</h6>
                                    <h6>{res.currentEpisodeCount || res.totalEpisodes}/{res.totalEpisodes} EPS</h6>
                                    <h6 className="mx-2">•</h6>
                                    <h6>{res.rating}</h6>
                                </div>
                                <h6 className="text-[15px]">{res.genres?.join(", ")}</h6>
                            </CardFooter>
                        </Card>
                    </div>
                    <div className="w-[97%] mx-auto col-span-3">
                        <AnimeWatch
                            session={session}
                            watchData={watchData}
                            settings={settings}
                            animeId={animeId}
                            searchParams={searchParams}
                            animeInfo={{
                                title: title,
                                totalEpisodes: res.totalEpisodes || 0,
                            }}
                        />
                    </div>
                </div>
            </div>
            <Footer/>
        </main>
    )
}
