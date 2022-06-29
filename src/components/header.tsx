import '../index.css'


function Header() {
    return (

        <div className="max-w-[979px] mx-auto px-4">
            <div className="flex items-center">
                <img className="w-[120px]" src="https://beta.defiflow.xyz/images/defiflowlogo.png" />
                <div className="flex ml-auto">
                    <a href="https://twitter.com/defiflow_" target="_blank">
                        <img className="mr-[12px]" src="https://beta.defiflow.xyz/images/twitter-brands.svg" alt="" />
                    </a>
                    <a href="https://discord.com/invite/ANbhQHc5U2" target="_blank">
                        <img src="https://beta.defiflow.xyz/images/discord-brands.svg" alt="" />
                    </a>
                </div>
            </div>
        </div>

    )
}

export default Header;