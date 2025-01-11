
import { auth, signIn, signOut } from "@/auth"

export default function GoogleSignIn() {
    // const session = await auth()
    // console.log(session?.user);

    return (
        <>
            {/* {session && session?.user ?
                <form
                    action={async () => {
                        "use server"
                        await signOut()
                    }}
                >
                    <button type="submit">signout</button>
                </form>
                : */}
            <form
                action={async () => {
                    "use server"
                    await signIn("google")
                }}
            >
                <button type="submit">Signin with Google</button>
            </form>
            {/* } */}

        </>

    )
} 