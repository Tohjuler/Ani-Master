import {NextRequest, NextResponse} from "next/server";
import ProviderStatus from "@/lib/providerStatus";
import cacheData from "memory-cache";
import {ISource, META} from "@consumet/extensions";
import {getProvier} from "@/lib/utils";

export interface WatchResponse {
    sources: ISource | null
    onlineProviders: string[],
    provider: string,
    responseTime: number
}

export const GET = async (req: NextRequest, params: { params: { epid: string } }) => {
    if (cacheData.get(req.nextUrl.href)) return NextResponse.json<WatchResponse>(cacheData.get(req.nextUrl.href), {status: 200});
    const start = performance.now();

    const searchParams = new URLSearchParams(req.nextUrl.searchParams);

    const anilist = new META.Anilist(getProvier(searchParams.get('provider') || "Gogoanime") as any, {
        url: (process.env.PROXY_URL as string).includes(",") ? (process.env.PROXY_URL as string).split(",") : (process.env.PROXY_URL as string),
        key: process.env.PROXY_KEY as string,
        rotateInterval: parseInt(process.env.PROXY_ROTATE_INTERVAL as string)
    });

    // Get episode sources
    const currentEpSource: ISource | null = await anilist.fetchEpisodeSources(params.params.epid || "").catch(() => null);

    if (!currentEpSource) return NextResponse.json({error: "Episode not found", epId: params.params.epid || ""}, {status: 404})

    const data: WatchResponse = {
        sources: currentEpSource,
        onlineProviders: await ProviderStatus.getOnlineAnimeProvider(),
        provider: anilist.provider.name,
        responseTime: performance.now() - start
    }

    cacheData.put(req.nextUrl.href, data, 1000 * 60 * parseInt(process.env.CACHE_TIME as string));
    return NextResponse.json<WatchResponse>(data, {status: 200})
}
