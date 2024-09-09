export const colors = {
    black: "#000",
    white: "#fff",
    transparent: "#0000",
    body: "rgb(35,80,10)",
    bodySecondary: "rgb(15,50,5)",
    ui: (opacity?: number) => `rgba(0,125,100,${opacity || 0.8})`,
    fgui: (opacity: number) => `rgba(0,255,150,${opacity})`,
    dwhite: (opacity: number) => `rgba(255,255,255,${opacity})`,
}
