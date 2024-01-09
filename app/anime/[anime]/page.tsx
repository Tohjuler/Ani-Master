import {Header} from "@/components/header";
import Footer from "@/components/footer";
import {getPageSession} from "@/lib/lucia";
import {IAnimeEpisode, ITitle, META, ANIME} from "@consumet/extensions";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import parse from "html-react-parser";
import Link from "next/link";
import AnimeWatch from "@/components/animeWatch";
import {AnimeWatchData} from "@/lib/dbUtil";
import {query} from "@/lib/dbUtilActions";

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
    const animeId = params.anime;

    if (!animeId || animeId === "" || animeId === "undefined") return messagePage("Anime not found", "", session);

    const anilist = new META.Anilist(getProvier(searchParams?.provider as string || "gogoanime"));

    const res = await anilist.fetchAnimeInfo(animeId).catch(() => null);
    const subEps = await anilist.fetchEpisodesListById(animeId, false, true).catch(() => null);
    const dubEps = await anilist.fetchEpisodesListById(animeId, true, true).catch(() => null);

    const currentEpNumber = searchParams?.ep as string || "1";
    const dub: boolean = searchParams?.dub === "true" || false;
    const currentEp = dub ? dubEps?.find((ep) => ep.number === parseInt(currentEpNumber)) : subEps?.find((ep) => ep.number === parseInt(currentEpNumber));

    const currentEpSource = await anilist.fetchEpisodeSources(currentEp?.id || "").catch(() => null);

    if (!res) return messagePage("Anime not found", "", session);

    const changeSetting = (key: string, value: string, base?: string): string => {
        let url = new URL(base || process.env.NEXT_PUBLIC_BASE_URL + "/anime/" + animeId);
        if (currentEpNumber !== "1")
            url.searchParams.set("ep", currentEpNumber)
        if (dub)
            url.searchParams.set("dub", dub.toString())
        if (searchParams?.provider)
            url.searchParams.set("provider", searchParams.provider as string)
        url.searchParams.set(key, value)
        return url.toString();
    }
    const title: string = typeof res.title === "string" ? (res.title as string) + "" : ((res.title as ITitle).userPreferred || (res.title as ITitle).romaji || (res.title as string) + "");
    return (
        <main className="">
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
                        <AnimeWatch session={session} watchData={watchData} animeId={animeId} searchParams={searchParams}/>
                    </div>
                </div>
            </div>
            <Footer/>
        </main>
    )
}

function getEpisodeList(episodes: IAnimeEpisode[], dub: boolean, changeSetting: (key: string, value: string, base?: string) => string) {
    return episodes.map((episode) => {
        return (
            <Link href={changeSetting("ep", episode.number.toString(), dub ? changeSetting("dub", "true") : undefined)}
                  key={episode.id}>
                <h1 className={"m-1 rounded p-1 px-2 w-fit cursor-pointer " + (episode.isFiller ? "bg-[#c78e32]" : "bg-[#1f242b]")}>{episode.number} - {episode.title}</h1>
            </Link>
        )
    })
}

export function getProvier(provider: string) {
    switch (provider.toLowerCase()) {
        case "9anime":
            return new ANIME.NineAnime();
        case "gogoanime":
            return new ANIME.Gogoanime();
        case "anify":
            return new ANIME.Anify();
        case "animefox":
            return new ANIME.AnimeFox();
        case "animepahe":
            return new ANIME.AnimePahe();
        case "animesaturn":
            return new ANIME.AnimeSaturn();
        case "bilibili":
            return new ANIME.Bilibili();
        case "crunchyroll":
            return new ANIME.Crunchyroll();
        case "marin":
            return new ANIME.Marin();
        case "zoro":
            return new ANIME.Zoro();
        default:
            return new ANIME.Gogoanime();
    }
}
