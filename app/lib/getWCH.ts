export function getWCH(T:number, mpsV:number) {
    const V = mpsV * 3.6;

    const windChill = 13.12 + 0.6215*T - 11.37*Math.pow(V, 0.16) + 0.3965*T*Math.pow(V, 0.16)
    return Math.round(windChill*10) / 10
}