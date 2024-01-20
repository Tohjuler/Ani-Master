import {Header} from "@/components/header";
import Footer from "@/components/footer";
import {getPageSession} from "@/lib/lucia";
import AnimeSearch from "@/components/animeSearch";
import parse from 'html-react-parser';
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,} from "@/components/ui/card"
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,} from "@/components/ui/tooltip"
import Link from "next/link";
import {IAnimeResult, ISearch, ITitle, META} from '@consumet/extensions';
import {getAnilist} from "@/lib/utils";

export default async function Anime({params, searchParams}: {
    params: { slug: string };
    searchParams?: { [key: string]: string | string[] | undefined };
}) {
    const session = await getPageSession();

    const anilist = getAnilist(undefined)

    let res: ISearch<IAnimeResult> | null = null;
    if (searchParams?.query)
        res = await anilist.advancedSearch(
            searchParams.query as string,
            undefined,
            parseInt(searchParams?.page as string || "1") || 1,
            undefined,
            searchParams.types as string || undefined,
            (searchParams.sort as string)?.split(",") || ["POPULARITY_DESC", "SCORE_DESC"],
            (searchParams.genres as string)?.split(",") || undefined,
            undefined,
            undefined,
            searchParams.status as string || undefined,
            undefined,
        )

    const pages = () => {
        if (!res) return;
        let pages = [];
        for (let i = 1; i <= (res.currentPage || 1); i++) {
            pages.push(
                <PaginationItem key={i}>
                    <PaginationLink href={pageUrl(i)}>{i}</PaginationLink>
                </PaginationItem>
            )
        }
        if (res.hasNextPage) {
            pages.push(
                <PaginationItem key={(res.currentPage || 1) + 1}>
                    <PaginationLink
                        href={pageUrl((res.currentPage || 1) + 1)}>{(res.currentPage || 1) + 1}</PaginationLink>
                </PaginationItem>
            )
            pages.push(
                <PaginationItem>
                    <PaginationEllipsis/>
                </PaginationItem>
            )
        }
        return pages;
    }

    const getCurrentUrl = (): string => {
        const url = new URL(process.env.NEXT_PUBLIC_BASE_URL + "/anime");
        if (searchParams?.query)
            url.searchParams.set("query", searchParams?.query as string)
        if (searchParams?.types)
            url.searchParams.set("types", searchParams?.types as string)
        if (searchParams?.genres)
            url.searchParams.set("genres", searchParams?.genres as string)
        if (searchParams?.status)
            url.searchParams.set("status", searchParams?.status as string)
        if (searchParams?.sort)
            url.searchParams.set("sort", searchParams?.sort as string)
        url.searchParams.set("page", searchParams?.page as string || "1")
        return url.toString();
    }

    const nextPageUrl = (): string => {
        if (!res) return getCurrentUrl();
        const currentUrl = new URL(getCurrentUrl());
        currentUrl.searchParams.set("page", ((res.currentPage || 1) + 1).toString());
        return currentUrl.toString();
    }

    const prevPageUrl = (): string => {
        if (!res) return getCurrentUrl()
        const currentUrl = new URL(getCurrentUrl());
        currentUrl.searchParams.set("page", ((res.currentPage || 1) - 1).toString());
        return currentUrl.toString();
    }

    const pageUrl = (page: number): string => {
        if (!res) return getCurrentUrl()
        const currentUrl = new URL(getCurrentUrl());
        currentUrl.searchParams.set("page", page.toString());
        return currentUrl.toString();
    }

    return (
        <main className="">
            <Header session={session} page="anime"/>
            <div className="h-fit mt-14">
                <AnimeSearch/>

                <div className="flex flex-wrap justify-center mt-[75px]">
                    {res && getAnimeCards(res)}
                </div>

                <Pagination className="mt-5">
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious href={prevPageUrl()}/>
                        </PaginationItem>
                        {pages()}
                        <PaginationItem>
                            <PaginationNext href={nextPageUrl()}/>
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>

            </div>
            <Footer/>
        </main>
    )
}

function getAnimeCards(searchRes: ISearch<IAnimeResult> | string | null): JSX.Element {
    if (!searchRes) return (<></>);
    if (typeof searchRes === "string") return (<h1>{searchRes}</h1>);

    const cutDescription = (description: string): string => {
        if (description.length > 150)
            return description.slice(0, 150).split(" ").slice(0, -1).join(" ") + "...";
        return description;
    }

    return (
        <>
            {
                searchRes.results.map((anime) => {
                    const title: string = typeof anime.title === "string" ? anime.title : ((anime.title as ITitle).userPreferred || anime.title as string);
                    return (
                        <Link href={"/anime/" + anime.id} key={anime.id}
                              className="w-[15%] transition ease-in-out hover:scale-105 cursor-pointer">
                            <Card className="h-[630px] m-2">
                                <CardHeader>
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={anime.image} alt={title} className="rounded"/>
                                </CardHeader>
                                <CardContent>
                                    <CardTitle className="text-center">{title}</CardTitle>
                                    <CardDescription className="mt-2">
                                        {
                                            anime.description.length <= 150 ?
                                                parse(anime.description) : (
                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger>
                                                                {parse(cutDescription(anime.description))}
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p className="max-w-[400px] text-wrap">{parse(anime.description)}</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                )
                                        }
                                    </CardDescription>
                                </CardContent>
                                <CardFooter className="grid text-center">
                                    <div className="inline-flex text-gray-600 text-[10px] mx-auto">
                                        <h6>{anime.type}</h6>
                                        <h6 className="mx-2">•</h6>
                                        <h6>{anime.status}</h6>
                                        <h6 className="mx-2">•</h6>
                                        <h6>{anime.currentEpisodeCount || anime.totalEpisodes}/{anime.totalEpisodes} EPS</h6>
                                        <h6 className="mx-2">•</h6>
                                        <h6>{anime.rating}</h6>
                                    </div>
                                    <h6 className="text-[15px]">{anime.genres.join(", ")}</h6>
                                </CardFooter>
                            </Card>
                        </Link>
                    );
                })
            }
        </>
    )
}
