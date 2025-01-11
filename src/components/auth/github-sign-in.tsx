
import { auth, signIn, signOut } from "@/auth"

export default async function GithubSignIn() {
    const session = await auth()
    return (
        <>
            {session && session?.user ?
                <form
                    action={async () => {
                        "use server"
                        await signOut()
                    }
                    }
                >
                    <button type="submit">Signout</button>
                </form >
                :

                <form
                    action={async () => {
                        "use server"
                        await signIn("github")
                    }
                    }
                >
                    <button type="submit">Signin with GitHub</button>
                </form >
            }
        </>)
}