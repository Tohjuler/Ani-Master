"use client"

import * as React from "react"
import Link from "next/link"

import {cn} from "@/lib/utils"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"

import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog"
import {useState} from "react";
import Image from "next/image";
import Form from "@/components/form";

const components: { title: string; href: string; description: string }[] = [
    {
        title: "Search",
        href: "/anime",
        description:
            "The one place to search for all your favorite anime.",
    },
    {
        title: "Top",
        href: "/anime/top",
        description:
            "The top anime of all time.",
    },
    {
        title: "Trending",
        href: "/anime/trending",
        description:
            "The most popular anime right now.",
    },
    {
        title: "Random",
        href: "/anime/random",
        description: "Random anime, why not?",
    },
]

export function Header(props: { session: any, page: 'home' | 'anime' | 'manga' }) {
    const pageColor = {
        'home': 'from-blue-900',
        'anime': 'from-purple-900',
        'manga': 'from-green-900'
    }
    return (
        <div className={"w-full pb-5 flex bg-gradient-to-b p-2 " + pageColor[props.page]}>
            <NavigationMenu className="mx-auto">
                <NavigationMenuList>
                    <NavigationMenuItem>
                        <NavigationMenuTrigger>Home</NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                                <li className="row-span-3">
                                    <NavigationMenuLink asChild>
                                        <a
                                            className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-blue-900 to-purple-900 p-6 no-underline outline-none focus:shadow-md"
                                            href="/"
                                        >
                                            <div className="mb-2 mt-4 text-lg font-medium">
                                                Ani-Master
                                            </div>
                                            <p className="text-sm leading-tight text-muted-foreground">
                                                The one place for all anime and related content.<br/>
                                                The best of all it&apos;s free, and you can self host.
                                            </p>
                                        </a>
                                    </NavigationMenuLink>
                                </li>
                                <ListItem href="/" title="Github">
                                    Check out the source code and contribute.
                                </ListItem>
                                <ListItem href="/info" title="Infomation">
                                    Information about the project.
                                </ListItem>
                                <ListItem href="/random" title="Something Random">
                                    Just something random.
                                </ListItem>
                            </ul>
                        </NavigationMenuContent>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuTrigger>Anime</NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                                {components.map((component) => (
                                    <ListItem
                                        key={component.title}
                                        title={component.title}
                                        href={component.href}
                                    >
                                        {component.description}
                                    </ListItem>
                                ))}
                            </ul>
                        </NavigationMenuContent>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <Link href="/" legacyBehavior passHref>
                            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                Manga (Coming...)
                            </NavigationMenuLink>
                        </Link>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>
            <div suppressHydrationWarning className="mr-5">
                {
                    !props.session ? (
                        <>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button>Login</Button>
                                </DialogTrigger>
                                <DialogContent className="w-fit">
                                    <DialogHeader>
                                        <DialogTitle>Login</DialogTitle>
                                    </DialogHeader>
                                    <Form action="/api/login">
                                        <div className="block">
                                            <Input name="username" id="username" type="username" placeholder="Username"
                                                   required minLength={4} maxLength={31}/>
                                            <Input name="password" id="password" className="mt-3" type="password"
                                                   placeholder="Password" required/>
                                        </div>
                                        <DialogFooter>
                                            <Button className="mx-auto mt-4" type="submit">
                                                Login
                                            </Button>
                                        </DialogFooter>
                                    </Form>
                                </DialogContent>
                            </Dialog>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="secondary" className="ml-3">Signup</Button>
                                </DialogTrigger>
                                <DialogContent className="w-fit">
                                    <DialogHeader>
                                        <DialogTitle>Signup</DialogTitle>
                                    </DialogHeader>
                                    <Form action="/api/signup">
                                        <div className="block">
                                            <Input name="username" id="username" type="username" placeholder="Username"
                                                   required minLength={4} maxLength={31}/>
                                            <Input name="password" id="password" className="mt-3" type="password"
                                                   required placeholder="Password"/>
                                            <Input name="password2" id="password2" className="mt-3" type="password"
                                                   required placeholder="Confirm Password"/>
                                        </div>
                                        <DialogFooter>
                                            <Button type="submit" className="mx-auto mt-4">
                                                Signup
                                            </Button>
                                        </DialogFooter>
                                    </Form>
                                </DialogContent>
                            </Dialog>
                        </>
                    ) : (
                        <div className="mx-0.5 p-1 w-[65px] h-[65px]">
                            <DropdownMenu>
                                <DropdownMenuTrigger>
                                    <Image
                                        src={"/default_avatar.png"}
                                        alt="Avatar"
                                        className="rounded-full"
                                        width={65}
                                        height={65}
                                    />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem>Account</DropdownMenuItem>
                                    <DropdownMenuItem>Settings</DropdownMenuItem>
                                    <DropdownMenuItem className="text-red-500">
                                        <Form action="/api/logout">
                                            <button type="submit">Log out</button>
                                        </Form>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    )
                }
            </div>
        </div>
    )
}

const ListItem = React.forwardRef<
    React.ElementRef<"a">,
    React.ComponentPropsWithoutRef<"a">
>(({className, title, children, ...props}, ref) => {
    return (
        <li>
            <NavigationMenuLink asChild>
                <a
                    ref={ref}
                    className={cn(
                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                        className
                    )}
                    {...props}
                >
                    <div className="text-sm font-medium leading-none">{title}</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        {children}
                    </p>
                </a>
            </NavigationMenuLink>
        </li>
    )
})
ListItem.displayName = "ListItem"
