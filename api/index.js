import { fetchGitData } from "../src/fetchers/fetchGitData.js";

import { getParams } from "../src/utils/getParams.js";
import { getSVG } from "../src/utils/getSVG.js";

export default async (req, res) => {
    const {
        bgc,
        tc,
        stc,
        bc,
        gc,
        f,
        t,
        c,
        w,
        h
    } = req.query;
    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'public, max-age=7200');
    res.setHeader('Access-Control-Allow-Origin', '*');

    const params = getParams(req.query);
    const dados = await fetchGitData();

    try {
        const svgCard = getSVG(params, dados);

        return res.status(200).send(svgCard);
    } catch (error) {
        return res.status(500).json({ erro: error.message });
    }
}