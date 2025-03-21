import { Rss } from "lucide-react"
// import { NavigationMenuBar } from "./NavigationMenuBar"
import { ThemeToggler } from "./ThemeToggler"
import { UserDropDownButton } from "./UserDropDownButton"
import SearchBox from "./SearchBox"
import Link from "next/link"

function Navbar() {
    return (
        <div className="flex justify-between items-center bg-gradient-to-t from-cyan-700 to-cyan-900 p-4">
            <Link href="/" className="flex items-center justify-center text-3xl gap-2 bg-gradient-to-r from-cyan-100 to-cyan-500 bg-clip-text text-transparent">
                <Rss color="white" size={36} />
                <span>Blogino</span>
            </Link>
            {/* <NavigationMenuBar /> */}
            <SearchBox />
            <div className="flex items-center justify-center gap-2">
                <UserDropDownButton />
                <ThemeToggler />
            </div>
        </div>
    )
}

export default Navbar