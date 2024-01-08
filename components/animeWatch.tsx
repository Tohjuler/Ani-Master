"use client";

import {ChevronRight, ChevronLeft} from "lucide-react"
import VideoPlayer from "@/components/videoPlayer";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {Button} from "@/components/ui/button";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {useEffect, useState} from "react";
import axios from "axios";
import {WatchResponse} from "@/app/api/anime/watch/[epid]/route";
import {Skeleton} from "@/components/ui/skeleton";
import {IAnimeEpisode, ISource} from "@consumet/extensions";

export default function AnimeWatch(props: {
    animeId: string,
    searchParams?: { [key: string]: string | string[] | undefined }
}) {
    const [data, setData] = useState<WatchResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [provider, setProvider] = useState<string>(props.searchParams?.provider as string || "Gogoanime");
    const [ep, setEp] = useState<string>(props.searchParams?.ep as string || "1");
    const [epId, setEpId] = useState<string | null>(null);
    const [dub, setDub] = useState<string>(props.searchParams?.dub === "true" ? "true" : "false");
    const [subEps, setSubEps] = useState<IAnimeEpisode[]>([]);
    const [dubEps, setDubEps] = useState<IAnimeEpisode[]>([]);
    const [qualities, setQualities] = useState<string[]>([]);
    const [currentQuality, setCurrentQuality] = useState<string | null>(null);

    // TODO: Ep cache

    useEffect(() => {
        setData(null);

        axios.get('/api/anime/' + props.animeId + "/eps", {
            params: {
                provider: provider,
            }
        }).then((res) => {
            setSubEps(res.data.sub);
            setDubEps(res.data.dub);

            const newEp = (dub === "true" ? res.data.dub : res.data.sub).find((ep2: IAnimeEpisode) => ep2.number === parseInt(ep));
            if (newEp) setEpId(newEp.id);

            console.log('Fetched episodes data', res.data)
            console.log('Current episode', newEp)
        }).catch((err) => {
            console.error(err);
            if (err.response.status === 404) return setError("Anime not found");
            else
                setError(err.response.data?.error || err.message || "Episodes not found");
        })
    }, [props.animeId, provider]);

    useEffect(() => {
        setData(null);
        if (!epId) return;

        axios.get('/api/anime/watch/' + epId, {
            params: {
                provider: provider,
            }
        })
            .then((res) => {
                setData(res.data);

                if (res.data.sources.sources.length === 0) return setError("No sources found");
                setQualities(res.data.sources.sources.filter((s: any) => s.quality).map((s: any) => s.quality) || []);

                console.log('Fetched episode data', res.data)
            })
            .catch((err) => {
                console.error(err);
                if (err.response.status === 404) return setError("Episode not found");
                else
                    setError(err.response.data?.error || err.message || "Unknown error");
            })
    }, [epId])

    useEffect(() => {
        if (qualities.length === 0) return;
        setCurrentQuality(qualities[0]);
        if (qualities?.includes("1080p")) setCurrentQuality("auto");
        if (qualities?.includes("1080p")) setCurrentQuality("1080p");
    }, [qualities]);

    if (!subEps && !dubEps) return <h1 className="text-center">Episodes not found.</h1>

    const currentEp: IAnimeEpisode | undefined = [...subEps, ...dubEps].find((ep) => ep.id === epId);

    if (error) return <h1 className="text-center">{error}</h1>

    if (!data || !subEps || !subEps) return (
        <div>
            <Skeleton className="w-full h-[800px]"/>
            <Skeleton className="w-full h-[100px] mt-3"/>
            <Skeleton className="w-full h-[300px] mt-5"/>
        </div>
    )

    return (
        <div key={currentEp?.id + ep}>
            <VideoPlayer className="rounded w-full" postImage={currentEp?.image || ""}
                         src={data?.sources?.sources.find((s) => s.quality === currentQuality)?.url || ""}
                         referer={data?.sources?.headers?.referer || ""}
            />

            <div className="w-full bg-purple-900 rounded p-2 mt-3 inline-flex">
                <h2 className="mt-2">{currentEp?.number} - {currentEp?.title} {dub === "true" ? "(Dub)" : null}</h2>

                <Select value={provider} onValueChange={setProvider}>
                    <SelectTrigger className="w-[180px] mx-5">
                        <SelectValue placeholder="Provider"/>
                    </SelectTrigger>
                    <SelectContent>
                        {
                            data?.onlineProviders.map((provider) => {
                                return (
                                    <SelectItem key={provider} value={provider}>{provider}</SelectItem>
                                )
                            })
                        }
                    </SelectContent>
                </Select>

                <Select value={currentQuality || "auto"} onValueChange={setCurrentQuality}>
                    <SelectTrigger className="w-[180px] mr-5">
                        <SelectValue placeholder="Provider"/>
                    </SelectTrigger>
                    <SelectContent>
                        {
                            qualities.map((quality) => {
                                return (
                                    <SelectItem key={quality} value={quality}>{quality}</SelectItem>
                                )
                            })
                        }
                    </SelectContent>
                </Select>

                <div className="mx-2 ml-auto space-x-1">
                    <Button variant="outline" size="icon"
                            disabled={ep === "1"}
                            onClick={() => {
                                if (ep === "1") return;
                                const newEp = (currentEp?.number || 2) - 1
                                setEpId((dub === "true" ? dubEps : subEps).find((ep) => ep.number === newEp)?.id + "");
                            }}>
                        <ChevronLeft className="h-4 w-4"/>
                    </Button>
                    <Button variant="outline" size="icon"
                            disabled={ep === (dub === "true" ? dubEps : subEps).length.toString()}
                            onClick={() => {
                                if (ep === (dub === "true" ? dubEps : subEps).length.toString()) return;
                                const newEp = (currentEp?.number || 0) + 1
                                setEpId((dub === "true" ? dubEps : subEps).find((ep) => ep.number === newEp)?.id + "");
                            }}>
                        <ChevronRight className="h-4 w-4"/>
                    </Button>
                </div>
            </div>

            <div className="mt-5 rounded p-2 bg-[#292996]">
                <h1>Episodes</h1>
                <Tabs defaultValue={dub === "true" ? "dub" : "sub"} className="w-full">
                    <TabsList>
                        <TabsTrigger value="sub">Sub</TabsTrigger>
                        <TabsTrigger value="dub">Dub</TabsTrigger>
                    </TabsList>
                    <TabsContent value="sub"
                                 className="flex flex-wrap">{getEpisodeList(subEps || [], false, (epId, dub) => {
                        setEpId(epId);
                        setDub(dub + "")
                    }, epId)}</TabsContent>
                    <TabsContent value="dub"
                                 className="flex flex-wrap">{getEpisodeList(dubEps || [], true, (epId, dub) => {
                        setEpId(epId);
                        setDub(dub + "")
                    }, epId)}</TabsContent>
                </Tabs>
            </div>
        </div>
    )
}

function getEpisodeList(episodes: IAnimeEpisode[], dub: boolean, setEp: (epId: string, dub: boolean) => void, epId: string | null) {
    return episodes.map((episode) => {
        return (
            <Button className="m-1" onClick={() => setEp(episode.id + "", dub)}
                    key={episode.id}
                    variant={episode.id === epId ? "destructive" : episode.isFiller ? "default" : "secondary"}>
                {episode.number} - {episode.title}
            </Button>
        )
    })
}