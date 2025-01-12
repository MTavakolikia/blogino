import { NavigationMenuBar } from "../navigation-menu-bar"
import { ThemeToggler } from "../theme-toggler"

function Navbar() {
    return (
        <div className="flex justify-between">
            <p>login</p>
            <NavigationMenuBar />
            <ThemeToggler />
        </div>
    )
}

export default Navbar