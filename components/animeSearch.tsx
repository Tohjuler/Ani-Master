"use client";

import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Combobox} from "@/components/ui/combobox";
import {Label} from "@/components/ui/label"
import {useState} from "react";
import { useSearchParams } from 'next/navigation'

export default function AnimeSearch() {
    const searchParams = useSearchParams()

    const [query, setQuery] = useState<string>(searchParams.get("query") || "");
    const [types, setTypes] = useState<string[]>(searchParams.get("types")?.split(",") || []);
    const [genres, setGenres] = useState<string[]>(searchParams.get("genres")?.split(",") || []);
    const [status, setStatus] = useState<string[]>(searchParams.get("status")?.split(",") || []);
    const [sort, setSort] = useState<string[]>(searchParams.get("sort")?.split(",") || ["POPULARITY_DESC", "SCORE_DESC"]);

    const search = () => {
        // reload page with new query
        // Format: /anime?query=Jujutsu&types=TV&genres=Action&status=Releasing&sort=Popularity

        if (query === "") return;

        let url = "/anime";
        let urlQuery = "?query=" + query + "&";
        if (types.length > 0)
            urlQuery += "types=" + types.join(",") + "&";
        if (genres.length > 0)
            urlQuery += "genres=" + genres.join(",") + "&";
        if (status.length > 0)
            urlQuery += "status=" + status.join(",") + "&";
        if (sort.length > 0)
            urlQuery += "sort=" + sort.join(",");
        if (urlQuery.endsWith("&"))
            urlQuery = urlQuery.slice(0, -1);
        if (urlQuery.endsWith("?"))
            urlQuery = urlQuery.slice(0, -1);
        url += urlQuery;

        window.location.href = url;
    }

    return (
        <div className="w-full">
            <div className="mx-auto flex w-full max-w-sm items-center space-x-2 h-fit">
                <Input type="text" placeholder="Jujutsu..." value={query} onChange={(e) => setQuery(e.target.value)}/>
                <Button onClick={search}>Search</Button>
            </div>
            <div className="mt-5 space-x-2 flex w-full justify-center flex-wrap">
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="types">Types</Label>
                    <Combobox id="types" options={[
                        {label: "TV", value: "TV"},
                        {label: "TV Short", value: "TV_SHORT"},
                        {label: "OVA", value: "OVA"},
                        {label: "ONA", value: "ONA"},
                        {label: "Movie", value: "MOVIE"},
                        {label: "Special", value: "SPECIAL"},
                        {label: "Music", value: "MUSIC"},
                    ]} value={types} onValueChange={setTypes} multiple showAmount={5} clearable/>
                </div>

                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="genres">Genres</Label>
                    <Combobox id="genres" options={[
                        {label: "Action", value: "Action"},
                        {label: "Adventure", value: "Adventure"},
                        {label: "Cars", value: "Cars"},
                        {label: "Comedy", value: "Comedy"},
                        {label: "Drama", value: "Drama"},
                        {label: "Fantasy", value: "Fantasy"},
                        {label: "Horror", value: "Horror"},
                        {label: "Mahou Shoujo", value: "Mahou Shoujo"},
                        {label: "Mecha", value: "Mecha"},
                        {label: "Music", value: "Music"},
                        {label: "Mystery", value: "Mystery"},
                        {label: "Psychological", value: "Psychological"},
                        {label: "Romance", value: "Romance"},
                        {label: "Sci-Fi", value: "Sci-Fi"},
                        {label: "Slice of Life", value: "Slice of Life"},
                        {label: "Sports", value: "Sports"},
                        {label: "Supernatural", value: "Supernatural"},
                        {label: "Thriller", value: "Thriller"},
                    ]} value={genres} onValueChange={setGenres} multiple showAmount={3} clearable/>
                </div>

                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="status">Status</Label>
                    <Combobox id="status" options={[
                        {label: "Releasing", value: "RELEASING"},
                        {label: "Not Yet Released", value: "NOT_YET_RELEASED"},
                        {label: "Finished", value: "FINISHED"},
                        {label: "Cancelled", value: "CANCELLED"},
                        {label: "Hiatus", value: "HIATUS"},
                    ]} value={status} onValueChange={setStatus} multiple showAmount={3} clearable/>
                </div>

                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="sort">Sort</Label>
                    <Combobox id="sort" options={[
                        {label: "Popularity", value: "POPULARITY_DESC"},
                        {label: "Trending", value: "TRENDING_DESC"},
                        {label: "Updated", value: "UPDATED_AT_DESC"},
                        {label: "Start Date", value: "START_DATE_DESC"},
                        {label: "End Date", value: "END_DATE_DESC"},
                        {label: "Favourites", value: "FAVOURITES_DESC"},
                        {label: "Score", value: "SCORE_DESC"},
                        {label: "Title Romaji", value: "TITLE_ROMAJI_DESC"},
                        {label: "Title English", value: "TITLE_ENGLISH_DESC"},
                        {label: "Title Native", value: "TITLE_NATIVE_DESC"},
                        {label: "Episodes", value: "EPISODES_DESC"},
                        {label: "ID", value: "ID_DESC"},
                    ]} value={sort} onValueChange={setSort} multiple showAmount={3} clearable/>
                </div>
            </div>
        </div>
    )
}