/* ============================================================
   Spain Travel Guide – City & Attraction Data + Init
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    const attractionDetails = {
        '马德里皇宫': { duration: '1.5-2小时', audio: '有官方语音讲解', booking: '提前一周', ticket: '电子票二维码入场，无需携带护照' },
        '普拉多国家博物馆': { duration: '2.5-4小时', audio: '有官方语音讲解', booking: '提前一周', ticket: '电子票二维码入场，无需携带护照' },
        '索菲亚王后艺术中心': { duration: '1.5-2.5小时', audio: '有官方语音讲解', booking: '提前一周', ticket: '电子票二维码入场，无需携带护照' },
        '丽池公园': { duration: '1-2小时', audio: '无官方语音讲解', booking: '不需要预约', ticket: '免费入园，无需门票' },
        '圣家堂': { duration: '1.5-2小时', audio: '有官方语音讲解', booking: '提前2个月以上', ticket: '电子票二维码入场，无需携带护照' },
        '桂尔公园': { duration: '1.5-2小时', audio: '有官方语音讲解', booking: '提前1个月', ticket: '电子票二维码入场，无需携带护照' },
        '巴特罗之家': { duration: '1-1.5小时', audio: '有官方语音讲解', booking: '提前1个月', ticket: '电子票二维码入场，无需携带护照' },
        '米拉之家': { duration: '1-1.5小时', audio: '有官方语音讲解', booking: '提前一周', ticket: '电子票二维码入场，无需携带护照' },
        '毕加索博物馆': { duration: '1.5-2小时', audio: '有官方语音讲解', booking: '提前一周', ticket: '电子票二维码入场，无需携带护照' },
        '巴塞罗那主教座堂': { duration: '45-75分钟', audio: '部分票型含导览', booking: '可现场买票', ticket: '现场购票或电子票均可，无需护照' },
        '阿尔罕布拉宫': { duration: '3-4小时', audio: '无官方语音讲解', booking: '提前2个月以上', ticket: '必须携带护照：票面实名制，入场须核验身份证件' },
        '格拉纳达主教座堂': { duration: '45-60分钟', audio: '有官方语音讲解', booking: '可现场买票', ticket: '现场购票或电子票均可，无需护照' },
        '圣胡安迪奥斯大教堂': { duration: '40-60分钟', audio: '部分时段有导览', booking: '可现场买票', ticket: '现场购票，无需护照' },
        '圣尼古拉斯观景台': { duration: '30-60分钟', audio: '无官方语音讲解', booking: '不需要预约', ticket: '免费参观，无需门票' },
        '塞维利亚大教堂与希拉尔达塔': { duration: '1.5-2小时', audio: '有官方语音讲解', booking: '提前1个月', ticket: '电子票二维码入场，无需携带护照' },
        '塞维利亚王宫': { duration: '2-3小时', audio: '有官方语音讲解', booking: '提前1个月', ticket: '电子票二维码入场，无需携带护照' },
        '科尔多瓦大清真寺-主教座堂': { duration: '1-1.5小时', audio: '有官方语音讲解', booking: '提前一周', ticket: '电子票二维码入场，无需携带护照' },
        '托莱多大教堂': { duration: '1-1.5小时', audio: '有官方语音讲解', booking: '可现场买票', ticket: '现场购票或电子票均可，无需护照' },
        '塞哥维亚古罗马渡槽': { duration: '30-45分钟', audio: '无官方语音讲解', booking: '不需要预约', ticket: '免费参观，无需门票' },
        '塞哥维亚城堡': { duration: '1-1.5小时', audio: '有官方语音讲解', booking: '提前一周', ticket: '电子票二维码入场，无需携带护照' },
        '塞哥维亚大教堂': { duration: '45-75分钟', audio: '有官方语音讲解', booking: '可现场买票', ticket: '现场购票或电子票均可，无需护照' }
    };

    const attractionImageSets = {
        '马德里皇宫': ['./assets/images/photo-1658922184330-001b78430070.jpg'],
        '普拉多国家博物馆': ['./assets/images/photo-1570794155462-374865de09b3.jpg'],
        '索菲亚王后艺术中心': ['./assets/images/photo-1778472822309-0d14d6b4c9f5.jpg'],
        '丽池公园': ['./assets/images/photo-1708205750515-afdbd5378c13.jpg'],
        '圣家堂': ['./assets/images/photo-1650964827770-421afa7960ac.jpg'],
        '桂尔公园': ['./assets/images/photo-1630219694734-fe47ab76b15e.jpg'],
        '巴特罗之家': ['./assets/images/photo-1651940774004-c1b6e2f6de6a.jpg'],
        '毕加索博物馆': ['./assets/images/photo-1595613483603-de2c1c19322c.jpg'],
        '巴塞罗那主教座堂': ['./assets/images/photo-1583670827188-74440de10cc7.jpg'],
        '阿尔罕布拉宫': ['./assets/images/photo-1620677366922-4c1741eb010d.jpg'],
        '格拉纳达主教座堂': ['./assets/images/photo-1567514582055-060ec38b7583.jpg'],
        '圣胡安迪奥斯大教堂': ['./assets/images/photo-1674081361240-16e7fc618749.jpg'],
        '圣尼古拉斯观景台': ['./assets/images/photo-1743254051328-5c3b8712e6ef.jpg'],
        '塞维利亚大教堂与希拉尔达塔': ['./assets/images/photo-1509840841025-9088ba78a826.jpg'],
        '塞维利亚王宫': ['./assets/images/photo-1764695490073-97f1efd5130a.jpg'],
        '科尔多瓦大清真寺-主教座堂': ['./assets/images/photo-1623002866514-4ebad37868fd.jpg'],
        '托莱多大教堂': ['./assets/images/photo-1720993395856-f41a6222475a.jpg'],
        '塞哥维亚古罗马渡槽': ['./assets/images/photo-1698223632628-fb28ccb63280.jpg'],
        '塞哥维亚城堡': ['./assets/images/hasmik-ghazaryan-olson-jUGqWReweQw-unsplash.jpg'],
        '塞哥维亚大教堂': ['./assets/images/photo-1601668364652-8767ac7a7b90.jpg'],
        '米拉之家': ['./assets/images/photo-1638969535357-01e525eb00bd.jpg'],
        '西班牙广场': ['./assets/images/photo-1688404808661-92f72f2ea258.jpg']
    };

    const focusMap = {
        "马德里皇宫": "img-pos-60", "普拉多国家博物馆": "img-pos-center",
        "索菲亚王后艺术中心": "img-pos-upper", "丽池公园": "img-pos-center",
        "圣家堂": "img-pos-top", "桂尔公园": "img-pos-lower",
        "巴特罗之家": "img-pos-center", "米拉之家": "img-pos-75",
        "毕加索博物馆": "img-pos-center", "巴塞罗那主教座堂": "img-pos-upper",
        "阿尔罕布拉宫": "img-pos-lower", "格拉纳达主教座堂": "img-pos-center",
        "圣胡安迪奥斯大教堂": "img-pos-upper", "圣尼古拉斯观景台": "img-pos-55",
        "塞维利亚大教堂与希拉尔达塔": "img-pos-60", "塞维利亚王宫": "img-pos-70",
        "西班牙广场": "img-pos-center", "科尔多瓦大清真寺-主教座堂": "img-pos-center",
        "托莱多大教堂": "img-pos-upper", "塞哥维亚古罗马渡槽": "img-pos-upper",
        "塞哥维亚城堡": "img-pos-center", "塞哥维亚大教堂": "img-pos-upper"
    };

    // ── Attraction card initialisation ──────────────────────
    document.querySelectorAll('.attraction-card').forEach(card => {
        const title = card.querySelector('.attraction-title')?.textContent.trim();
        const detail = attractionDetails[title];
        const titleEn = card.querySelector('.attraction-title-en');
        const body = card.querySelector('.attraction-body');
        const originalImage = card.querySelector('.attraction-image');

        // Replace image with gallery + correct focus class
        if (originalImage) {
            const sources = attractionImageSets[title] || [originalImage.getAttribute('src')];
            const gallery = document.createElement('div');
            gallery.className = 'attraction-gallery';
            const img = document.createElement('img');
            img.src = sources[0];
            img.alt = title || originalImage.alt;
            img.className = 'attraction-image ' + (focusMap[title] || 'img-pos-center');
            img.loading = 'lazy';
            gallery.appendChild(img);
            originalImage.replaceWith(gallery);
        }

        // Inject meta chips if not already present
        if (detail && titleEn && body && !body.querySelector('.attraction-meta')) {
            const meta = document.createElement('div');
            meta.className = 'attraction-meta';
            meta.innerHTML = `
                <div class="meta-chip"><span class="meta-chip-label">游览时间</span><span class="meta-chip-value">${detail.duration}</span></div>
                <div class="meta-chip"><span class="meta-chip-label">语音讲解</span><span class="meta-chip-value">${detail.audio}</span></div>
                <div class="meta-chip"><span class="meta-chip-label">预约建议</span><span class="meta-chip-value">${detail.booking}</span></div>
            `;
            titleEn.insertAdjacentElement('afterend', meta);

            const tips = card.querySelector('.attraction-tips');
            if (tips && detail.ticket && !tips.querySelector('.ticket-info')) {
                const ticketInfo = document.createElement('p');
                ticketInfo.className = 'ticket-info';
                ticketInfo.textContent = '入场方式：' + detail.ticket;
                tips.appendChild(ticketInfo);
            }
        }
    });

    // ── City search (ciudades.html) ────────────────────────
    const searchInput = document.getElementById('attractionSearch');
    const searchClear = document.getElementById('searchClear');
    const searchBtn = document.getElementById('searchBtn');
    const suggestionsEl = document.getElementById('searchSuggestions');

    if (searchInput) {
        const clearHighlights = () => {
            document.querySelectorAll('.attraction-card').forEach(c => {
                c.style.outline = '';
                c.style.boxShadow = '';
            });
        };

        const doSearch = (query) => {
            const q = query.trim().toLowerCase();
            searchClear?.classList.toggle('visible', q.length > 0);
            clearHighlights();
            hideSuggestions();
            if (!q) return;

            let firstMatch = null;
            document.querySelectorAll('.attraction-card').forEach(card => {
                const t = card.querySelector('.attraction-title')?.textContent || '';
                const te = card.querySelector('.attraction-title-en')?.textContent || '';
                const cn = card.closest('.city-section')?.querySelector('.city-name')?.textContent || '';
                const match = t.toLowerCase().includes(q) || te.toLowerCase().includes(q) || cn.toLowerCase().includes(q);
                if (match) {
                    card.style.outline = '2px solid var(--accent)';
                    card.style.boxShadow = '0 0 0 4px rgba(196,146,58,0.18)';
                    if (!firstMatch) firstMatch = card;
                }
            });

            if (firstMatch) {
                const navEl = document.getElementById('nav');
                const top = firstMatch.getBoundingClientRect().top + window.scrollY - (navEl?.offsetHeight || 70) - 16;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        };

        const hideSuggestions = () => suggestionsEl?.classList.remove('open');

        const suggestionData = [...document.querySelectorAll('.attraction-card')].map(card => ({
            card,
            title: card.querySelector('.attraction-title')?.textContent.trim() || '',
            titleEn: card.querySelector('.attraction-title-en')?.textContent.trim() || '',
            city: card.closest('.city-section')?.querySelector('.city-name')?.textContent.trim().split(/\s/)[0] || ''
        })).filter(s => s.title);

        const showSuggestions = (q) => {
            if (!suggestionsEl) return;
            const lower = q.toLowerCase();
            const esc = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const re = new RegExp(`(${esc})`, 'gi');
            const matches = suggestionData.filter(s =>
                s.title.toLowerCase().includes(lower) ||
                s.titleEn.toLowerCase().includes(lower) ||
                s.city.toLowerCase().includes(lower)
            ).slice(0, 7);

            if (!matches.length) { hideSuggestions(); return; }

            suggestionsEl.innerHTML = matches.map((s, i) =>
                `<div class="search-suggestion-item" data-idx="${i}">
                    <span class="suggestion-name">${s.title.replace(re, '<em>$1</em>')}</span>
                    <span class="suggestion-city">${s.city}</span>
                </div>`
            ).join('');

            suggestionsEl.querySelectorAll('.search-suggestion-item').forEach((el, i) => {
                el.addEventListener('mousedown', e => {
                    e.preventDefault();
                    const item = matches[i];
                    clearHighlights();
                    item.card.style.outline = '2px solid var(--accent)';
                    item.card.style.boxShadow = '0 0 0 4px rgba(196,146,58,0.18)';
                    const navEl = document.getElementById('nav');
                    const top = item.card.getBoundingClientRect().top + window.scrollY - (navEl?.offsetHeight || 70) - 16;
                    window.scrollTo({ top, behavior: 'smooth' });
                    searchInput.value = item.title;
                    searchClear?.classList.add('visible');
                    hideSuggestions();
                });
            });

            suggestionsEl.classList.add('open');
        };

        searchInput.addEventListener('input', e => {
            const val = e.target.value;
            searchClear?.classList.toggle('visible', val.length > 0);
            clearHighlights();
            val.trim().length > 0 ? showSuggestions(val.trim()) : hideSuggestions();
        });

        searchInput.addEventListener('keydown', e => {
            if (e.key === 'Enter') { e.preventDefault(); doSearch(searchInput.value); }
            if (e.key === 'Escape') { hideSuggestions(); searchInput.blur(); }
        });

        searchBtn?.addEventListener('click', () => doSearch(searchInput.value));
        searchClear?.addEventListener('click', () => {
            searchInput.value = '';
            clearHighlights();
            hideSuggestions();
            searchClear.classList.remove('visible');
            searchInput.focus();
        });

        document.addEventListener('click', e => {
            if (!e.target.closest('.city-search-wrap, .hero-search-wrap')) hideSuggestions();
        });

        // Handle URL ?q= search param (when coming from home page search)
        const urlQ = new URLSearchParams(location.search).get('q');
        if (urlQ) {
            searchInput.value = urlQ;
            setTimeout(() => doSearch(urlQ), 400);
        }
    }

});
