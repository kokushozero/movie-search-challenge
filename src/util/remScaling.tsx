import * as React from "react"

const DESKTOPTARGETWIDTH = 1920
const MOBILETARGETWIDTH = 1024
const BASEFONTSIZE = 16

const REMScaler: React.FC = ({ children }): JSX.Element => {

    const calculateRootFont = () => {
        const isDesktop = window.innerWidth > MOBILETARGETWIDTH
        const delta = window.innerWidth / (isDesktop ? DESKTOPTARGETWIDTH : MOBILETARGETWIDTH)
        return isDesktop ? delta * BASEFONTSIZE : delta * BASEFONTSIZE * 1.5
    }

    React.useEffect(() => {
        if (typeof window !== undefined) {
            const handleResize = () => {
                const remScale = calculateRootFont()
                window.document.getElementsByTagName('html')?.[0]?.setAttribute('style', `font-size: ${remScale}px`)
            }
            window.addEventListener('resize', handleResize)
            handleResize()
        }
    }, [])

    return (
        <>
            {children}
        </>
    )
}

export default REMScaler