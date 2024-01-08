import {NextRequest, NextResponse} from "next/server";
import {getProvier} from "@/app/anime/[anime]/page";
import ProviderStatus from "@/lib/providerStatus";
import cacheData from "memory-cache";
import {ISource, META} from "@consumet/extensions";

export interface WatchResponse {
    sources: ISource | null
    onlineProviders: string[],
    provider: string
}

export const GET = async (req: NextRequest, params: { params: { epid: string } }) => {
    if (cacheData.get(req.nextUrl.href)) return NextResponse.json<WatchResponse>(cacheData.get(req.nextUrl.href), {status: 200});

    const searchParams = new URLSearchParams(req.nextUrl.searchParams);

    const anilist = new META.Anilist(getProvier(searchParams.get('provider') || "Gogoanime"));

    // Get episode sources
    const currentEpSource: ISource | null = await anilist.fetchEpisodeSources(params.params.epid || "").catch(() => null);

    if (!currentEpSource) return NextResponse.json({error: "Episode not found", epId: params.params.epid || ""}, {status: 404})

    const data: WatchResponse = {
        sources: currentEpSource,
        onlineProviders: await ProviderStatus.getOnlineAnimeProvider(),
        provider: anilist.provider.name
    }

    cacheData.put(req.nextUrl.href, data, 1000 * 60 * 30);
    return NextResponse.json<WatchResponse>(data, {status: 200})
}
