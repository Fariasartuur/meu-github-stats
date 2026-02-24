import { getRankColor } from "../utils/getRankColor.js"

export const Badge = (stars, width) => {
    const {rank, rankColor} = getRankColor(stars);

    return `
        <g transform="translate(${width - 125}, 38)">
            <rect width="85" height="22" rx="11" fill="${rankColor}" fill-opacity="0.2" stroke="${rankColor}" stroke-width="1.2" />
            <text x="42" y="15" text-anchor="middle" style="font: 700 10px sans-serif; fill: ${rankColor}; text-transform: uppercase;">${rank}</text>
        </g>`;
}