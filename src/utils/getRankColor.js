import { RANK_COLORS } from "../constants/Colors.constant";

export const getRankColor = (stars) => {

    let rank = 'BRONZE';
    if (stars >= 1500) rank = 'DIAMANTE';
    else if (stars > 1000) rank = 'OURO';
    else if (stars > 400) rank = 'PRATA';
    return { rank, rankColor: RANK_COLORS[rank] };
}