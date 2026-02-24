export const getParams = (query) => {
    return {
        hideCommit : query.hideCommit ? query.hideCommit.toLowerCase() === 'true' : false,
        bgColor : query.bgc ? `#${query.bgc}` : '#3c0366',
        titleColor: query.tc ? `#${query.tc}` : '#d8b4fe',
        statColor: query.stc ? `#${query.stc}` : '#f3e8ff',
        borderColor : query.bc ? `#${query.bc}` : 'rgba(126, 34, 206, 0.5)',
        glowColor : query.gc ? `#${query.gc}` : '#7e22ce',
        focus : query.f ? query.f.toLowerCase() : null,
        type : query.t ? query.t.toLowerCase() : 'default',
        count : Math.min(Math.max(parseInt(query.c) || 5, 4), 8),
        widthParam : parseInt(query.w) || null,
        heightParam : parseInt(query.h) || null
    }
}