/**
 * Spain Travel Handbook — shared.js
 * WeChat-first · Mobile-first · GFW-safe
 *
 * Exports (funciones globales disponibles en todas las páginas):
 *   initBottomNav(activeTab)   — inyecta bottom navigation
 *   showToast(msg, ms)         — toast notification
 *   initScrollReveal()         — scroll-reveal con IntersectionObserver
 *   initCopyButtons()          — copy-to-clipboard con fallback
 *   initReadingProgressBar()   — barra de progreso de lectura
 *   setLang(lang)              — aplica idioma 'zh' | 'en'
 *   currentLang                — idioma activo
 *   i18n                       — objeto de traducciones completo
 *
 * NO incluye (específico de cada página):
 *   attractionDetails / attractionImageSets / focusMap
 *   lógica del mapa SVG
 *   generador .ics (eliminado — GFW fix #5)
 *   drag-to-scroll (reemplazado por grids)
 *   city quick-nav bar (solo index.html monolito)
 */

/* ============================================================
   BOTTOM NAVIGATION
   Función principal que inyecta el nav en el body.
   activeTab: 'home' | 'cities' | 'festivals' | 'practical'
   ============================================================ */
function initBottomNav(activeTab) {
    var isHome       = activeTab === 'home';
    var isCities     = activeTab === 'cities';
    var isFestivals  = activeTab === 'festivals';
    var isPractical  = activeTab === 'practical';

    var t = (typeof i18n !== 'undefined' && typeof currentLang !== 'undefined')
        ? i18n[currentLang] : null;

    var labels = {
        home:      t ? t.bnHome      : '首页',
        cities:    t ? t.bnCities    : '城市',
        festivals: t ? t.bnFestivals : '节日',
        practical: t ? t.bnPractical : '实用'
    };

    var navHTML = '<nav class="bottom-nav" role="navigation" aria-label="主导航">'
        /* Home */
        + '<a href="index.html" class="bottom-nav-item' + (isHome ? ' active' : '') + '" aria-label="' + labels.home + '">'
        +   '<svg viewBox="0 0 24 24" stroke-width="1.8"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>'
        +   '<span>' + labels.home + '</span>'
        + '</a>'
        /* Cities */
        + '<a href="index.html#cities" class="bottom-nav-item' + (isCities ? ' active' : '') + '" aria-label="' + labels.cities + '">'
        +   '<svg viewBox="0 0 24 24" stroke-width="1.8"><rect x="3" y="8" width="18" height="14" rx="1"/><path d="M7 8V6a5 5 0 0 1 10 0v2"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="15" y2="17"/></svg>'
        +   '<span>' + labels.cities + '</span>'
        + '</a>'
        /* Festivals */
        + '<a href="festivals.html" class="bottom-nav-item' + (isFestivals ? ' active' : '') + '" aria-label="' + labels.festivals + '">'
        +   '<svg viewBox="0 0 24 24" stroke-width="1.8"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>'
        +   '<span>' + labels.festivals + '</span>'
        + '</a>'
        /* Practical */
        + '<a href="practical.html" class="bottom-nav-item' + (isPractical ? ' active' : '') + '" aria-label="' + labels.practical + '">'
        +   '<svg viewBox="0 0 24 24" stroke-width="1.8"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>'
        +   '<span>' + labels.practical + '</span>'
        + '</a>'
        + '</nav>';

    document.body.insertAdjacentHTML('beforeend', navHTML);
}

/* ============================================================
   TOAST NOTIFICATION
   ============================================================ */
var _toastTimer;

function showToast(msg, ms) {
    ms = ms || 2200;
    var el = document.getElementById('toastMsg');
    if (!el) {
        // Auto-crear si no existe en el DOM
        el = document.createElement('div');
        el.id = 'toastMsg';
        el.className = 'toast-msg';
        el.setAttribute('aria-live', 'polite');
        document.body.appendChild(el);
    }
    clearTimeout(_toastTimer);
    el.textContent = msg;
    el.classList.add('show');
    _toastTimer = setTimeout(function() { el.classList.remove('show'); }, ms);
}

/* ============================================================
   COPY TO CLIPBOARD
   Busca todos los .copy-btn y añade listener.
   Usa navigator.clipboard con fallback execCommand.
   ============================================================ */
function initCopyButtons() {
    document.querySelectorAll('.copy-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            var text = this.getAttribute('data-copy');
            var self = this;

            var copyFn = function(t) {
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    return navigator.clipboard.writeText(t);
                }
                var ta = document.createElement('textarea');
                ta.value = t;
                ta.style.cssText = 'position:fixed;opacity:0;top:-9999px;left:-9999px';
                document.body.appendChild(ta);
                ta.select();
                try { document.execCommand('copy'); } catch(e) {}
                document.body.removeChild(ta);
                return Promise.resolve();
            };

            copyFn(text).then(function() {
                var copied = (typeof currentLang !== 'undefined' && currentLang === 'en') ? '✓ Copied!' : '✓ 已复制到剪贴板';
                showToast(copied);
            }).catch(function() {
                showToast('复制失败，请手动复制');
            });
        });
    });
}

/* ============================================================
   SCROLL-REVEAL ANIMATION (IntersectionObserver)
   ============================================================ */
function initScrollReveal() {
    // Añadir clase reveal a elementos clave
    document.querySelectorAll('.attraction-card').forEach(function(el, i) {
        el.classList.add('reveal');
        if (i % 2 === 1) el.classList.add('reveal-d1');
    });
    document.querySelectorAll('.transport-card').forEach(function(el, i) {
        el.classList.add('reveal');
        el.classList.add('reveal-d' + Math.min(i, 3));
    });
    document.querySelectorAll('.section-title, .section-label').forEach(function(el) {
        el.classList.add('reveal');
    });

    if ('IntersectionObserver' in window) {
        var io = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -32px 0px' });

        document.querySelectorAll('.reveal').forEach(function(el) { io.observe(el); });
    } else {
        document.querySelectorAll('.reveal').forEach(function(el) { el.classList.add('visible'); });
    }
}

/* ============================================================
   READING PROGRESS BAR
   ============================================================ */
function initReadingProgressBar() {
    var bar = document.getElementById('progress-bar');
    if (!bar) return;
    var update = function() {
        var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        var docH = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        bar.style.width = docH > 0 ? Math.min((scrollTop / docH) * 100, 100) + '%' : '0%';
    };
    window.addEventListener('scroll', update, { passive: true });
}

/* ============================================================
   LAZY IMAGE POLYFILL (para browsers sin loading="lazy" nativo)
   ============================================================ */
function initLazyImages() {
    if ('loading' in HTMLImageElement.prototype) return; // soporte nativo
    var imgs = document.querySelectorAll('img[loading="lazy"]');
    if (!('IntersectionObserver' in window)) {
        imgs.forEach(function(img) {
            if (img.dataset.src) img.src = img.dataset.src;
        });
        return;
    }
    var lazyIO = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                var img = entry.target;
                if (img.dataset.src) { img.src = img.dataset.src; delete img.dataset.src; }
                lazyIO.unobserve(img);
            }
        });
    });
    imgs.forEach(function(img) { lazyIO.observe(img); });
}

/* ============================================================
   i18n — OBJETO COMPLETO DE TRADUCCIONES
   ============================================================ */
var i18n = {
    zh: {
        /* Bottom nav */
        bnHome:'首页', bnCities:'城市', bnFestivals:'节日', bnPractical:'实用',

        /* Nav desktop */
        navTips:'旅行贴士', navMap:'分布地图', navFests:'节日月份', navTransport:'城市交通',
        navMadrid:'马德里', navBcn:'巴塞罗那', navGranada:'格拉纳达', navSevilla:'塞维利亚',
        navMore:'其他城市', navCordoba:'科尔多瓦', navToledo:'托莱多', navSegovia:'塞哥维亚',

        /* Mobile drawer */
        mobileGuide:'指南', mobileCities:'城市',
        mobileTips:'旅行贴士', mobileMap:'分布地图', mobileFests:'节日月历', mobileTransport:'城市交通',
        mobileMadrid:'马德里', mobileBcn:'巴塞罗那', mobileGranada:'格拉纳达', mobileSevilla:'塞维利亚',
        mobileCordoba:'科尔多瓦', mobileToledo:'托莱多', mobileSegovia:'塞哥维亚',

        /* Hero */
        heroTitle:'西班牙旅行手册',
        heroSubtitle:'穿越千年文明的旅行指南',
        heroCardText:'精选西班牙 7 座经典城市，整合景点介绍、官方购票入口、开放时间与预约建议。',
        heroScrollText:'向下滑动探索',
        searchPlaceholder:'搜索城市或景点',
        searchBtn:'搜索',

        /* Section titles */
        secTipsTitle:'旅行贴士', secMapTitle:'城市分布图',
        secFestsTitle:'节日月份表', secTransportTitle:'城市交通',

        /* City quick-nav */
        quickTips:'贴士', quickMap:'地图', quickFests:'节日', quickTransport:'交通',
        quickMadrid:'马德里', quickBcn:'巴塞罗那', quickGranada:'格拉纳达',
        quickSevilla:'塞维利亚', quickCordoba:'科尔多瓦', quickToledo:'托莱多', quickSegovia:'塞哥维亚',

        /* Tip cards */
        tipLabels:['最佳旅行季节','货币','语言','紧急电话','防盗','用餐时间','午休','着装','省钱','交通','小费','防晒','门票','饮水','购物','网络','插座','住宿','节假日','退税'],
        tipContents:[
            '4–6月、9–10月最舒适，天气宜人，适合城市观光和徒步。7–8月安达卢西亚（塞维利亚、科尔多瓦、格拉纳达）常超过40℃，冬季南部温和、北部较冷。',
            '欧元（€）。绝大多数地方可刷卡，但小商店、部分酒吧、市场摊位和个别出租车仍偏好现金，建议随身带20–50欧现金。',
            '官方语言为西班牙语。马德里、巴塞罗那等旅游城市英语基本够用，但南部小城和乡村英语普及率较低，学几句基础西语会方便很多。',
            '112（警察、消防、救护车，全欧盟通用）。',
            '马德里、巴塞罗那等热门旅游城市扒手较多。背包尽量背前面，手机不要放桌边，贵重物品不放外套口袋，地铁和景区需特别注意。',
            '早餐较简单。午餐通常14:00–16:00。晚餐通常20:30–22:30开始。很多餐厅下午歇业，太早去可能不开门。',
            '部分小店、中小城市商铺会在13:30–17:00左右关门休息。大型商场、连锁超市和旅游区一般正常营业。',
            '日常穿着较随意，但进入教堂、修道院等宗教场所建议遮盖肩膀和膝盖，部分场所会严格执行。',
            '很多博物馆和景点设有免费开放时段，热门景点提前网上购票通常更便宜，也能避免现场排队。',
            '城市内优先选择地铁、公交和步行。城市间优先选择高铁（AVE、Avlo、Ouigo、Iryo），越早买越便宜。历史城区停车困难，自驾并非最佳选择。',
            '西班牙没有强制小费文化。咖啡馆和酒吧通常不用给。餐厅满意可留1–2欧或凑整，特别满意可留5%–10%。',
            '西班牙日照强烈。夏季安达卢西亚地区可超过40℃，防晒霜、太阳镜、帽子和水壶基本属于必备品。',
            '阿尔罕布拉宫、圣家堂、塞维利亚王宫等热门景点旺季常提前数周售罄，确定行程后尽早预订。',
            '西班牙自来水普遍可直接饮用。餐厅提供的瓶装水通常收费，不像部分国家免费续水。',
            '周日大部分商店关门。公共假期很多商铺也会缩短营业时间或停业。',
            '机场、火车站、酒店和多数餐厅提供免费WiFi。中国游客常用Vodafone、Orange、Movistar或DIGI电话卡。',
            '230V电压。欧洲标准双圆孔插头（Type C / F），国内设备通常需要转换插头。',
            '老城区酒店位置方便但可能较吵。许多历史建筑改造的民宿没有电梯，大件行李入住前最好确认。',
            '圣周（Semana Santa）、圣诞节、复活节和各地大型节庆期间，住宿价格上涨明显，热门景点需提前预订。',
            '非欧盟游客购物满额可办理退税。离境前记得在机场完成退税手续并保留购物小票。'
        ],

        /* Transport */
        transportIntro:'西班牙城际交通选择丰富，城市间往来便捷。机票价格浮动大，最好提前规划买票；火车价格也会浮动，需提前购买；大巴价格固定、班次多，可提前1周买。',
        trainName:'火车 AVE', trainDesc:'快速便捷，<br>但经常延误',
        busName:'大巴 ALSA', busDesc:'便宜班次多，<br>时间略久',
        planeName:'飞机', planeDesc:'远途适用，<br>机场耗时',
        bookingTipTitle:'订票建议',
        bookingLabelTrain:'火车', bookingLabelBus:'大巴', bookingLabelPlane:'飞机',
        routesToggleExpand:'查看剩余 5 条路线', routesToggleCollapse:'收起路线',
        routesHeaderRoute:'路线', routesHeaderRecommend:'推荐',

        /* City intros */
        cityIntros:{
            madrid:'西班牙首都，欧洲海拔最高的首都城市。三大世界级博物馆云集于此，皇宫与广场交相辉映，夜生活热烈，是感受西班牙现代活力与皇室历史的最佳起点。',
            barcelona:'加泰罗尼亚首府，高迪建筑奇迹的聚集地。地中海阳光、哥特老城、感恩大道与世界级美食汇聚一城，融合了南欧浪漫与现代创意，魅力无可复制。',
            granada:'伊斯兰文明在西班牙留下的最后印记。阿尔罕布拉宫俯瞰全城，阿尔拜辛区白墙窄巷里飘出弗拉门戈旋律，内华达山雪峰与摩尔宫殿共存，东西方文明在此深情交汇。',
            sevilla:'弗拉门戈的发源地，安达卢西亚的热情心脏。圣周游行震撼人心，四月春会欢腾整城，希拉尔达塔与王宫展现着摩尔与基督两种文明共同书写的辉煌历史。',
            cordoba:'中世纪伊斯兰世界最伟大的城市之一。大清真寺-主教座堂是建筑史上绝无仅有的奇观，每逢5月庭院节，全城私家庭院竞相盛开鲜花，令人叹为观止。',
            toledo:'塔霍河三面环抱的中世纪古城，基督、伊斯兰与犹太三大文明曾在此和平共居千年。石板街巷保存完好，从马德里乘高铁仅30分钟，是最值得半日出行的古城。',
            segovia:'卡斯蒂利亚高原上的童话小城，拥有迪士尼城堡原型与两千年罗马渡槽。古城小巧精致，烤乳猪是当地名物，从马德里出发仅需半小时，适合轻松一日游。'
        },

        /* Labels */
        labelDuration:'游览时间', labelAudio:'语音讲解', labelBooking:'预约建议',
        labelAddress:'地址', labelHours:'时间', labelTickets:'门票', labelWebsite:'官网',
        labelTip:'提示', labelCopy:'复制', labelAdmission:'入场方式：',

        /* Meta value map (zh → zh, for reset) */
        metaValueMap:{
            '有官方语音讲解':'有官方语音讲解','无官方语音讲解':'无官方语音讲解',
            '部分票型含导览':'部分票型含导览','部分时段有导览':'部分时段有导览',
            '提前一周':'提前一周','提前2个月以上':'提前2个月以上',
            '提前1个月':'提前1个月','不需要预约':'不需要预约','可现场买票':'可现场买票',
            /* en values → map back to zh */
            'Audio guide available':'有官方语音讲解','No audio guide':'无官方语音讲解',
            'Included in select tickets':'部分票型含导览','Guided tours at select times':'部分时段有导览',
            '1 week ahead':'提前一周','2+ months ahead':'提前2个月以上',
            '1 month ahead':'提前1个月','No reservation needed':'不需要预约','Walk-in available':'可现场买票'
        },
        ticketPrefix:'入场方式：',

        /* Attraction descriptions */
        attrDesc:{
            '马德里皇宫':'欧洲规模最大的皇宫之一，18世纪波旁王朝巴洛克杰作，拥有3418个房间。腓力五世下令重建，外立面多利克与爱奥尼亚柱式层叠，王座厅天鹅绒与镀金令人叹为观止。皇家军械库珍藏中世纪武器，皇家药房保存17世纪药瓶。宫前东方广场与阿尔穆德纳大教堂相呼应，构成马德里最庄重的历史轴线。',
            '普拉多国家博物馆':'世界三大博物馆之一，西班牙艺术的最高殿堂。馆藏逾35000件，委拉斯开兹《宫娥》、戈雅《1808年5月3日》与《黑色绘画》系列、博斯《人间乐园》等旷世名作云集于此。建筑本身是18世纪新古典主义杰作。',
            '索菲亚王后艺术中心':'西班牙现代与当代艺术最重要的殿堂，毕加索《格尔尼卡》是镇馆之宝。这幅11米宽的反战巨作令无数观者驻足沉默。达利、米罗的大型装置作品同样必看。由旧圣卡洛斯医院改建，现代玻璃电梯与18世纪砖石外墙形成强烈对比。',
            '丽池公园':'UNESCO世界遗产，马德里的城市绿肺，曾是波旁王室的私人园林。130公顷，15000株植物，人工湖可租划船，水晶宫举办免费当代艺术展，阿方索十二世纪念碑是最佳拍摄点。每周末有街头艺人，是感受马德里人日常生活节奏的最佳窗口。',
            '圣家堂':'UNESCO世界遗产，高迪倾注43年心血的未竟杰作，全球唯一尚未完工便列为世遗的建筑。诞生立面的石雕精细入微，受难立面简洁震撼，内部彩色玻璃将阳光化为魔幻光海，树形石柱支撑起轻盈的穹顶。预计2026年高迪逝世百年之际完工，届时将成为世界最高教堂。',
            '桂尔公园':'高迪与友人桂尔共同打造的彩色马赛克王国，UNESCO世界遗产。希腊神庙式广场的镶嵌彩椅是最具代表性的打卡地，龙形喷泉守护着台阶入口，百柱厅的多立克石柱气势磅礴。公园最高处是俯瞰巴塞罗那全城与地中海的绝佳观景台。',
            '巴特罗之家':'高迪的海洋梦境，被誉为"世界最美建筑"之一。外立面覆盖蓝绿色瓷砖碎片，在阳光下如鱼鳞般闪烁；阳台形似骨骼，屋顶龙脊蜿蜒。内部展示高迪将自然形态融入建筑的天才——没有直角，所有空间流动如海浪。夜间灯光版体验尤为震撼。',
            '米拉之家':'高迪最后的民用建筑作品，别名"石头矿场"（La Pedrera）。没有一条直线，外立面的石灰岩波浪与铸铁阳台如同海浪翻腾。屋顶露台是整栋建筑的高潮——造型各异的烟囱"武士"矗立其中，可俯瞰整个扩展区街景。顶层展示高迪建筑原理，阁楼的抛物线拱廊精美绝伦。',
            '毕加索博物馆':'全球最重要的毕加索博物馆之一，位于巴塞罗那老城哥特区。五座13至15世纪中世纪贵族宫殿串联而成，庭院幽静，建筑本身已是珍宝。馆藏4000余件，以毕加索早年习作和《宫娥》系列临摹55幅为核心，展示了天才艺术家从神童到革命者的成长轨迹。',
            '巴塞罗那主教座堂':'哥特区的精神核心，一座从13世纪延续修建至20世纪初的哥特式大教堂，花了近600年完成。中庭的白鹅庭院（13只白鹅象征圣埃乌拉利亚殉道时的年龄）是全欧洲最独特的教堂景观之一。屋顶平台可眺望巴塞罗那全城，地下室珍藏守护圣人圣埃乌拉利亚的石棺。',
            '阿尔罕布拉宫':'UNESCO世界遗产，伊斯兰建筑在西方的巅峰之作，西班牙参观人数最多的景点。纳斯里德宫的几何灰泥雕花精细至令人窒息，狮子庭院的12只大理石雄狮守护着最私密的宫廷空间，赫内拉利费花园的流水系统融合了伊斯兰园林艺术的精髓。赭红色城墙在内华达山雪峰的映衬下构成格拉纳达最永恒的天际线。',
            '格拉纳达主教座堂':'16世纪西班牙文艺复兴最重要的建筑成就之一，建造历时182年。正立面由阿隆索·卡诺设计，在恢弘的哥特结构内填入了文艺复兴式圆柱和古典装饰，这种"罗马式"风格在伊比利亚半岛独树一帜。毗邻的王室礼拜堂安葬着天主教双王伊莎贝拉与斐迪南，是收复失地运动的精神终点。',
            '圣尼古拉斯观景台':'格拉纳达最经典的观景点，阿尔拜辛区白色山丘上的传奇广场。站在这里，阿尔罕布拉宫全貌在眼前铺展——红色城墙、纳斯里德宫塔楼、远处内华达山脉雪峰尽收眼底。日落时夕阳将宫殿染成金红色，广场边街头音乐人弗拉门戈旋律随风飘来，被无数旅人誉为"世界最美日落之一"。',
            '圣胡安迪奥斯大教堂':'格拉纳达最华丽的巴洛克教堂，18世纪建成。主祭坛是西班牙巴洛克装饰艺术的极致——镀金雕塑层层叠叠，圣胡安迪奥斯圣徒的遗骨供奉其中，银光与金光交相辉映，奢华程度令初见者目瞪口呆。与格拉纳达大教堂的宏伟外观相比，这里展示的是伊比利亚半岛内部装饰的不同美学。',
            '塞维利亚大教堂与希拉尔达塔':'UNESCO世界遗产，全球最大的哥特式教堂，也是世界第三大教堂。1401年在旧清真寺的基础上开始修建，主祭坛镀金雕刻高达28米。哥伦布之墓安放于此，四位国王雕像托举着他的棺柩。希拉尔达塔原为清真寺宣礼塔，34段坡道无台阶设计供骑马登顶，如今俯瞰塞维利亚全城，是安达卢西亚最上镜的天际线。',
            '塞维利亚王宫':'UNESCO世界遗产，欧洲现存最古老的仍在使用的皇家宫殿。摩尔人城堡基础上叠加了穆德哈尔、哥特、文艺复兴多种风格，是西班牙文化融合的最佳建筑缩影。少女庭院柱廊倒影、大使厅镶嵌彩砖穹顶令人叹为观止。英剧《权力的游戏》多恩王国场景在此取景。皇家花园层层叠叠，迷宫与喷泉是绝佳避暑去处。',
            '西班牙广场':'塞维利亚最宏伟的城市舞台，1929年伊比利亚-美洲博览会的主展馆。半圆形宫殿长500米，赭红色砖砌外墙配以蓝白彩砖，环绕广场的运河可租划船。广场周边58个壁龛分别用彩色马赛克展示西班牙各省历史故事，是当地新婚照最热门拍摄地。《星球大战》与《阿拉伯的劳伦斯》曾在此取景。',
            '科尔多瓦大清真寺-主教座堂':'UNESCO世界遗产，人类建筑史上最震撼的宗教融合奇观。785年摩尔哈里发开始修建，历经四代扩建，856根双层红白拱柱在林间般的空间中绵延无尽。16世纪基督教君主强行在清真寺正中建起哥特式大教堂——两种截然不同的宗教美学就此永久共存于同一屋顶之下，形成全球唯一的建筑奇观。',
            '托莱多大教堂':'西班牙天主教最高圣殿，伊比利亚半岛最重要的哥特式教堂。1226年在旧清真寺基址上开始兴建，耗时三百年完工。28道彩色玻璃窗，750年历史的透明祭坛（Transparente）是巴洛克装饰艺术的极致，格列柯、戈雅等大师的原作悬挂于此。教堂珍宝室收藏10吨重的纯金圣体光，是全球最壮观的宗教珍宝之一。',
            '塞哥维亚古罗马渡槽':'两千年不倒的罗马工程奇迹，UNESCO世界遗产。渡槽建于公元1世纪，由20400块花岗岩堆砌而成——没有使用任何砂浆或粘合剂，纯靠石块之间的重力与精密切割咬合。双层拱廊最高处达28米，167道拱门横跨阿索格霍广场，从城市中心直入山间，全长约15公里。黄昏时分花岗岩被夕阳染成金色。',
            '塞哥维亚城堡':'迪士尼白雪公主城堡的原型，悬崖之上的童话宫殿。城堡始建于12世纪，临崖而建，最初为军事要塞，后经特拉斯塔马拉王朝改建为王族行宫。蓝色板岩屋顶在阳光下闪烁金属光泽，是城堡最独特的标志。内部松果厅、国王起居室和御座厅各具特色，军械库展示中世纪武器。登顶152级台阶的塔楼，可以360度俯瞰埃雷斯马河谷和远处连绵的卡斯蒂利亚平原。',
            '塞哥维亚大教堂':'西班牙最后一座哥特式大教堂，被誉为"哥特教堂中的女王"。始建于1525年，历时近两百年完工，伊莎贝拉一世曾在此加冕为卡斯蒂利亚女王。88米高的钟楼是城市天际线的核心，登上可饱览古城全景与远处的瓜达拉马山脉。教堂内部彩窗精美，博物馆藏有珍贵的宗教艺术品。主广场对面即是著名的烤乳猪百年老店Mesón de Cándido，厨师用瓷盘切乳猪的仪式是塞哥维亚不可错过的体验。'
        },

        /* Attraction tips */
        attrTip:{
            '马德里皇宫':'国事活动期间临时关闭，出发前官网确认；内部多处不可拍照；强烈建议租借含中文的官方语音导览器',
            '普拉多国家博物馆':'大包须寄存入口处；馆内全程禁止拍照；免费时段排队时间较长；强烈建议租中文语音导览器',
            '索菲亚王后艺术中心':'《格尔尼卡》禁止拍照；与普拉多步行约5分钟，可安排同日参观；建议留2小时以上',
            '丽池公园':'水晶宫免费入内，可查询展期；清晨和傍晚光线最美；避免正午阳光暴晒',
            '圣家堂':'旺季至少提前2周购票，含塔楼票更早售罄；内部为宗教场所请保持肃静；导览器支持中文',
            '桂尔公园':'必须提前官网分时购票，现场常售罄；建议开园后第一场人少；需步行上坡，穿舒适的鞋',
            '巴特罗之家':'AR导览体验生动，强烈推荐；夜间版灯光效果震撼；与米拉之家同在感恩大道，可串联参观',
            '米拉之家':'屋顶露台是最大亮点，雨天可能关闭；语音导览支持中文；与巴特罗之家步行约5分钟',
            '毕加索博物馆':'每月第一个周日免费需提前线上预约；周四17:00-20:00优惠场；位于哥特区，步行可达',
            '巴塞罗那主教座堂':'官网分时购票；Visita Catedral含屋顶和音频导览体验；夜游限额需提前预订；弥撒期间不开放游览（周日上午）',
            '阿尔罕布拉宫':'纳斯里德宫分时入场，错过预定时段不得入内；门票类型较多，全宫殿参观买 Alhambra General；夜间场另需单独购票',
            '格拉纳达主教座堂':'票多可现场购票；与王室礼拜堂联票；内部禁止拍照；步行可达阿尔拜辛老城',
            '圣尼古拉斯观景台':'日落前1小时到达占位；上山有两条路，建议从阿尔拜辛区步行穿越白色老街上山；小心扒手',
            '圣胡安迪奥斯大教堂':'有官网语音讲解；注意午休关门时段（约14:00-16:00）；教堂不大，参观约30分钟',
            '塞维利亚大教堂与希拉尔达塔':'线上购票省€1且可跳过长队；周日免费场限额极少需排队；登塔后可继续参观教堂本身',
            '塞维利亚王宫':'旺季提前至少1周线上购票；官方App有免费中文语音导览；《权力的游戏》拍摄地，建议告知同行者',
            '西班牙广场':'早晨和黄昏光线最美，中午阳光强烈；逢弗拉明戈表演可免费观看，时间不定',
            '科尔多瓦大清真寺-主教座堂':'官方语音导览内容详尽，强烈推荐；早上开门第一场光线透过彩窗照入柱廊最美；弥撒免费时段仅可进入约60%区域',
            '托莱多大教堂':'中午光线透过"透明祭坛"穹顶约11:00-12:00最为壮观；内部禁止拍照；语音导览含中文推荐购买',
            '塞哥维亚古罗马渡槽':'日出和日落时分光线最美，从台阶高处俯拍最佳角度',
            '塞哥维亚城堡':'含塔楼票每日限量，建议线上提前购买；塔楼152级台阶较窄；语音导览暂不含中文',
            '塞哥维亚大教堂':'与城堡和渡槽构成完美步行路线，建议连同参观；参观后可在主广场品尝百年老店Mesón de Cándido的烤乳猪'
        },

        /* Festival cards */
        festMonthSuffix:'月',
        festCards:[
            {city0:'全国',city1:'全国',city2:'圣塞巴斯蒂安'},
            {city0:'加的斯',city1:'特内里费',city2:'安达卢西亚'},
            {city0:'瓦伦西亚',city1:'全国'},
            {city0:'全国',city1:'塞维利亚'},
            {city0:'科尔多瓦',city1:'格拉纳达',city2:'马德里'},
            {city0:'格拉纳达',city1:'巴塞罗那',city2:'科尔多瓦'},
            {city0:'潘普洛纳',city1:'圣地亚哥'},
            {city0:'布尼奥尔/瓦伦西亚',city1:'巴塞罗那',city2:'毕尔巴鄂'},
            {city0:'赫雷斯',city1:'朗达',city2:'巴塞罗那'},
            {city0:'萨拉戈萨',city1:'全国',city2:'瓦伦西亚'},
            {city0:'全国',city1:'马德里'},
            {city0:'全国',city1:'全国',city2:'全国'}
        ],

        /* Footer */
        footerMeta:'© 2026 西班牙旅行手册 · 以上数据仅供参考，出行前请以各景点官方网站为准',
        footerAuthor:'作者 @小红书 喜马拉雅的果酱',
        toastCopied:'✓ 已复制到剪贴板'
    },

    en: {
        /* Bottom nav */
        bnHome:'Home', bnCities:'Cities', bnFestivals:'Fests', bnPractical:'Info',

        /* Nav desktop */
        navTips:'Travel Tips', navMap:'City Map', navFests:'Festivals', navTransport:'Transport',
        navMadrid:'Madrid', navBcn:'Barcelona', navGranada:'Granada', navSevilla:'Sevilla',
        navMore:'More Cities', navCordoba:'Córdoba', navToledo:'Toledo', navSegovia:'Segovia',

        /* Mobile drawer */
        mobileGuide:'Guide', mobileCities:'Cities',
        mobileTips:'Travel Tips', mobileMap:'City Map', mobileFests:'Festivals', mobileTransport:'Transport',
        mobileMadrid:'Madrid', mobileBcn:'Barcelona', mobileGranada:'Granada', mobileSevilla:'Sevilla',
        mobileCordoba:'Córdoba', mobileToledo:'Toledo', mobileSegovia:'Segovia',

        /* Hero */
        heroTitle:'Spain Travel Handbook',
        heroSubtitle:'A guide through millennia of civilization',
        heroCardText:'7 classic Spanish cities — attractions, official ticket links, opening hours, and booking tips.',
        heroScrollText:'Scroll to explore',
        searchPlaceholder:'Search cities or attractions',
        searchBtn:'Search',

        /* Section titles */
        secTipsTitle:'Travel Tips', secMapTitle:'City Map',
        secFestsTitle:'Festival Calendar', secTransportTitle:'City Transport',

        /* Quick nav */
        quickTips:'Tips', quickMap:'Map', quickFests:'Fests', quickTransport:'Transport',
        quickMadrid:'Madrid', quickBcn:'Barcelona', quickGranada:'Granada',
        quickSevilla:'Sevilla', quickCordoba:'Córdoba', quickToledo:'Toledo', quickSegovia:'Segovia',

        /* Tip cards */
        tipLabels:['Best Season','Currency','Language','Emergency','Pickpockets','Dining Hours','Siesta','Dress Code','Save Money','Getting Around','Tipping','Sun Protection','Tickets','Tap Water','Shopping','Internet','Power','Accommodation','Public Holidays','Tax Refund'],
        tipContents:[
            'Apr–Jun and Sep–Oct are the most comfortable months for sightseeing and hiking. Jul–Aug in Andalusia (Seville, Córdoba, Granada) regularly exceeds 40°C. Winters are mild in the south, cooler in the north.',
            'Euro (€). Card payments are widely accepted, but small shops, some bars, market stalls, and occasional taxis prefer cash. Carry €20–50 in cash.',
            'Spanish is the official language. English is sufficient in Madrid, Barcelona and major tourist areas, but less common in smaller southern towns. A few basic Spanish phrases go a long way.',
            '112 (police, fire, ambulance — works throughout the EU).',
            'Pickpockets are common in Madrid, Barcelona and popular tourist areas. Wear your bag in front, keep phones off tables, avoid valuables in jacket pockets; extra caution on metro and at attractions.',
            'Breakfast is light. Lunch is usually 14:00–16:00. Dinner typically starts 20:30–22:30. Many restaurants close in the afternoon — arriving too early may mean finding them shut.',
            'Some small shops and businesses in smaller cities close around 13:30–17:00. Major malls, supermarkets and tourist areas generally stay open.',
            'Casual dress is fine in general, but cover shoulders and knees when visiting churches or monasteries. Some venues enforce this strictly.',
            'Many museums and attractions have free admission windows. Booking popular sights online in advance is usually cheaper and skips on-site queues.',
            'Within cities, use metro, bus or walk. Between cities, high-speed train (AVE, Avlo, Ouigo, Iryo) is best — the earlier you book, the cheaper. Driving in historic centres is not recommended.',
            'No mandatory tipping culture in Spain. Not expected at cafés or bars. At restaurants, leaving €1–2 or rounding up is fine; 5–10% for exceptional service.',
            'Spain has intense sunshine. Andalusia in summer can exceed 40°C — sunscreen, sunglasses, a hat and a water bottle are essential.',
            'The Alhambra, Sagrada Família and Alcázar of Seville often sell out weeks ahead in peak season. Book as soon as your itinerary is confirmed.',
            'Tap water in Spain is generally safe to drink. Bottled water at restaurants is usually charged — refills are not free as in some other countries.',
            'Most shops are closed on Sundays. On public holidays, many businesses operate reduced hours or close entirely.',
            'Free WiFi is widely available at airports, train stations, hotels and most restaurants. Popular SIM options include Vodafone, Orange, Movistar and DIGI.',
            '230V. European standard two-pin plugs (Type C / F). Devices from other regions usually need a plug adapter.',
            'Old-town hotels are conveniently located but can be noisy. Many historic building guesthouses have no elevator — confirm before arriving with large luggage.',
            'During Semana Santa (Holy Week), Christmas, Easter and major local festivals, accommodation prices rise sharply and popular attractions require advance booking.',
            'Non-EU visitors can claim a VAT refund on qualifying purchases. Complete the refund procedure at the airport before departure and keep all receipts.'
        ],

        /* Transport */
        transportIntro:'Spain has excellent intercity transport. Flight prices fluctuate — book ahead; train prices vary, buy early; buses are fixed-price and frequent, book ~1 week ahead.',
        trainName:'Train (AVE)', trainDesc:'Fast & direct,<br>but delays are common',
        busName:'Bus (ALSA)', busDesc:'Affordable & frequent,<br>longer journey times',
        planeName:'Flight', planeDesc:'Best for long distances;<br>airport time adds up',
        bookingTipTitle:'Booking Tips',
        bookingLabelTrain:'Train', bookingLabelBus:'Bus', bookingLabelPlane:'Flight',
        routesToggleExpand:'Show 5 more routes', routesToggleCollapse:'Collapse routes',
        routesHeaderRoute:'Route', routesHeaderRecommend:'Best',

        /* City intros */
        cityIntros:{
            madrid:'Spain\'s capital and the highest-altitude capital in Europe. Home to three world-class museums, royal palaces and lively plazas, with a vibrant nightlife — the perfect starting point for Spain\'s royal history and modern energy.',
            barcelona:'Capital of Catalonia and home to Gaudí\'s architectural wonders. Mediterranean sunshine, a Gothic old town, the elegant Passeig de Gràcia and world-class cuisine make this city an unrivalled blend of southern European romance and modern creativity.',
            granada:'The last great monument of Islamic civilization in Spain. The Alhambra dominates the city, flamenco drifts through the whitewashed alleys of the Albaicín, and the snow-capped Sierra Nevada frames the Moorish palaces — East and West meet here in extraordinary harmony.',
            sevilla:'The birthplace of flamenco and the passionate heart of Andalusia. The awe-inspiring Semana Santa processions, the exuberant Feria de Abril, and the magnificent La Giralda tower and Alcázar palace embody a history shaped by both Moorish and Christian civilizations.',
            cordoba:'Once one of the greatest cities of the medieval Islamic world. The Mosque-Cathedral is an unrivalled architectural marvel, and every May the city bursts with colour during the Festival of the Patios, when private courtyards compete in flower displays.',
            toledo:'A medieval walled city embraced on three sides by the Tagus River, where Christian, Islamic and Jewish civilizations coexisted peacefully for a millennium. The stone streets are beautifully preserved; just 30 minutes from Madrid by high-speed train.',
            segovia:'A fairy-tale city on the Castilian plateau, home to the inspiration for Disney\'s castle and a two-thousand-year-old Roman aqueduct. The compact old city is charming, roast suckling pig is legendary, and it\'s just 30 minutes from Madrid by train.'
        },

        /* Labels */
        labelDuration:'Visit Duration', labelAudio:'Audio Guide', labelBooking:'Booking Tip',
        labelAddress:'Address', labelHours:'Hours', labelTickets:'Tickets', labelWebsite:'Website',
        labelTip:'Tips', labelCopy:'Copy', labelAdmission:'Admission: ',

        /* Meta value map */
        metaValueMap:{
            '有官方语音讲解':'Audio guide available','无官方语音讲解':'No audio guide',
            '部分票型含导览':'Included in select tickets','部分时段有导览':'Guided tours at select times',
            '提前一周':'1 week ahead','提前2个月以上':'2+ months ahead',
            '提前1个月':'1 month ahead','不需要预约':'No reservation needed','可现场买票':'Walk-in available',
            /* en values → keep as-is */
            'Audio guide available':'Audio guide available','No audio guide':'No audio guide',
            'Included in select tickets':'Included in select tickets','Guided tours at select times':'Guided tours at select times',
            '1 week ahead':'1 week ahead','2+ months ahead':'2+ months ahead',
            '1 month ahead':'1 month ahead','No reservation needed':'No reservation needed','Walk-in available':'Walk-in available'
        },
        ticketPrefix:'Admission: ',

        /* Attraction descriptions */
        attrDesc:{
            '马德里皇宫':'One of the largest palaces in Europe — an 18th-century Bourbon Baroque masterpiece with 3,418 rooms. The Throne Room\'s gilded grandeur is breathtaking; the Royal Armoury holds medieval weapons; the Royal Pharmacy preserves 17th-century medicine. The adjacent Plaza de Oriente and Almudena Cathedral form Madrid\'s grandest historical axis.',
            '普拉多国家博物馆':'One of the world\'s three greatest museums and Spain\'s supreme art institution. Over 35,000 works include Velázquez\'s Las Meninas, Goya\'s The Third of May 1808 and the Black Paintings series, and Bosch\'s The Garden of Earthly Delights. The building itself is an 18th-century Neoclassical masterpiece.',
            '索菲亚王后艺术中心':'Spain\'s most important museum of modern and contemporary art, home to Picasso\'s Guernica — the 11-metre anti-war canvas that leaves visitors in silent awe. Major works by Dalí and Miró are equally essential. Housed in a converted 18th-century hospital, with modern glass elevators set against the old brick facade.',
            '丽池公园':'A UNESCO World Heritage Site and Madrid\'s green lung, once the private gardens of the Bourbon royal family. 130 hectares, 15,000 plant species, a boating lake, free contemporary art in the Crystal Palace, and the Alfonso XII monument. Weekend street performers make this the best window into everyday Madrid life.',
            '圣家堂':'A UNESCO World Heritage Site and Gaudí\'s life\'s work — 43 years in the making and still unfinished, the only building listed as a World Heritage Site before completion. The Nativity façade is intricately carved; the Passion façade is stark and powerful. Inside, coloured glass transforms sunlight into a magical cascade beneath tree-like stone columns. Expected to be completed in 2026, the centenary of Gaudí\'s death.',
            '桂尔公园':'A UNESCO World Heritage Site — Gaudí\'s colourful mosaic kingdom created with his patron Güell. The terrace bench with its famous mosaic seating is the most iconic spot; a dragon fountain guards the stairway entrance; the Hall of a Hundred Columns is impressively grand. The park\'s highest point offers a panoramic view over Barcelona and the Mediterranean.',
            '巴特罗之家':'Gaudí\'s oceanic dream, hailed as one of the world\'s most beautiful buildings. The facade shimmers with blue-green mosaic tiles like fish scales in sunlight; balconies resemble skeletal bones; the roofline curves like a dragon\'s spine. Inside, not a single straight line — every space flows like a wave. The evening light installation is particularly spectacular.',
            '米拉之家':'Gaudí\'s final domestic work, nicknamed La Pedrera (The Stone Quarry). Not a single straight line: the limestone facade undulates like ocean waves, the iron balconies like seaweed. The rooftop terrace is the building\'s climax — warrior-like chimneys of diverse shapes stand as sentinels overlooking the Eixample. The top floor showcases Gaudí\'s architectural principles; the attic\'s parabolic arches are breathtaking.',
            '毕加索博物馆':'One of the world\'s most important Picasso museums, in five interconnected 13th–15th-century medieval palaces in Barcelona\'s Gothic Quarter. The tranquil courtyards are treasures in themselves. Over 4,000 works focus on Picasso\'s early studies and his 55-canvas series based on Velázquez\'s Las Meninas, tracing the artist\'s journey from child prodigy to revolutionary.',
            '巴塞罗那主教座堂':'The spiritual heart of the Gothic Quarter — a Gothic cathedral built continuously from the 13th to the early 20th century, taking nearly 600 years to complete. The Cloister of Geese (13 white geese symbolising Saint Eulalia\'s age at martyrdom) is one of Europe\'s most unique cathedral courtyards. The roof terrace offers panoramic views; the crypt holds the sarcophagus of patron saint Eulalia.',
            '阿尔罕布拉宫':'A UNESCO World Heritage Site and the pinnacle of Islamic architecture in the Western world — Spain\'s most-visited attraction. The geometric stucco of the Nasrid Palaces is breathtakingly intricate; the Court of the Lions, guarded by 12 marble lions, forms the most intimate royal space; the Generalife gardens embody the essence of Islamic garden artistry. The ochre walls against the snow-capped Sierra Nevada create Granada\'s most enduring skyline.',
            '格拉纳达主教座堂':'One of the most significant Spanish Renaissance achievements of the 16th century, taking 182 years to build. The facade was designed by Alonso Cano, blending Renaissance columns with the Gothic structure in a "Roman style" unique on the Iberian Peninsula. The adjacent Royal Chapel houses the tombs of the Catholic Monarchs Isabella and Ferdinand — the symbolic endpoint of the Reconquista.',
            '圣尼古拉斯观景台':'Granada\'s most iconic viewpoint — a legendary square on the white hillside of the Albaicín. From here, the full panorama of the Alhambra unfolds: red walls, Nasrid Palace towers, and the distant snow-capped Sierra Nevada. At sunset the palace glows gold and crimson while flamenco melodies drift from street musicians below. Widely regarded as "one of the world\'s most beautiful sunsets."',
            '圣胡安迪奥斯大教堂':'Granada\'s most opulent Baroque church, completed in the 18th century. The main altar is the ultimate expression of Spanish Baroque decorative art — layered gilded sculptures, the relics of Saint John of God enshrined within, silver and gold in dazzling interplay. Compared to Granada Cathedral\'s imposing exterior, this interior reveals a very different Iberian aesthetic.',
            '塞维利亚大教堂与希拉尔达塔':'A UNESCO World Heritage Site, the world\'s largest Gothic cathedral. Construction began in 1401 on the site of a former mosque; the gilded high altar rises to 28 metres. Christopher Columbus\'s tomb rests here, borne aloft by four royal statues. La Giralda, originally a mosque minaret, has 34 ramps (no steps) designed for horse-mounted ascent — now offering panoramic views over Seville and Andalusia\'s most recognisable skyline.',
            '塞维利亚王宫':'A UNESCO World Heritage Site and the oldest royal palace in Europe still in use. Built on Moorish foundations with Mudejar, Gothic and Renaissance layers, it is the finest architectural expression of Spain\'s cultural synthesis. The Gallery of the Maidens and the gilded-tile dome of the Ambassadors\' Hall are breathtaking. Used as a filming location for Game of Thrones. The royal gardens, with their mazes and fountains, are a perfect summer refuge.',
            '西班牙广场':'Seville\'s most magnificent civic space, built as the main pavilion for the 1929 Ibero-American Exposition. The semicircular palace stretches 500 metres; the surrounding canal offers rowing boats. The 58 alcoves around the plaza depict each Spanish province in colourful mosaic — a popular wedding photo location. Used as a filming location for Star Wars and Lawrence of Arabia.',
            '科尔多瓦大清真寺-主教座堂':'A UNESCO World Heritage Site and the most astonishing example of religious architectural fusion in history. Construction began in 785; after four expansions, 856 double red-and-white striped arches stretch through a forest-like space. In the 16th century, a Gothic cathedral was built inside the mosque — two radically different religious aesthetics permanently coexist beneath the same roof, a wholly unique architectural phenomenon.',
            '托莱多大教堂':'Spain\'s supreme Catholic sanctuary and the most important Gothic cathedral on the Iberian Peninsula. Construction began in 1226 on the site of a former mosque, taking 300 years to complete. 28 stained-glass windows, a 750-year-old Transparente altarpiece at the pinnacle of Baroque decorative art, and original works by El Greco and Goya. The Treasury houses a 10-ton solid gold monstrance — one of the world\'s most spectacular religious treasures.',
            '塞哥维亚古罗马渡槽':'A Roman engineering marvel standing two thousand years — a UNESCO World Heritage Site. Built in the 1st century AD from 20,400 granite blocks fitted together with no mortar or adhesive, held only by gravity and precision cutting. The double-tiered arches reach 28 metres; 167 arches span the Azogue­jo Square. At dusk the granite turns golden in the setting sun.',
            '塞哥维亚城堡':'The inspiration for Disney\'s Sleeping Beauty Castle — a fairy-tale palace perched on a rocky promontory. Dating from the 12th century, originally a fortress and later a royal residence. The distinctive blue slate roofs shimmer metallic in sunlight. Inside: the Pine Cone Hall, the King\'s Chamber, and the Throne Room. Climbing 152 steps to the tower offers a 360° view of the Eresma valley and the Castilian plains.',
            '塞哥维亚大教堂':'Spain\'s last Gothic cathedral, known as "the Lady of Cathedrals." Construction began in 1525 and took nearly two centuries; Queen Isabella I was crowned here. The 88-metre bell tower dominates the skyline. Exquisite stained glass inside, and a museum of religious art. Directly across the main square is the legendary century-old restaurant Mesón de Cándido, famous for cutting roast suckling pig with a plate.'
        },

        /* Attraction tips */
        attrTip:{
            '马德里皇宫':'Temporarily closes during state events — check the website before visiting. Photography is prohibited in many rooms. The official audio guide (available in Chinese) is strongly recommended.',
            '普拉多国家博物馆':'Large bags must be checked at the cloakroom. Photography is strictly prohibited. Free-entry windows involve long queues. A Chinese audio guide is strongly recommended.',
            '索菲亚王后艺术中心':'No photography allowed in front of Guernica. Just a 5-minute walk from the Prado — easy to combine in one day. Allow at least 2 hours.',
            '丽池公园':'The Crystal Palace is free to enter — check current exhibitions. Light is most beautiful at dawn and dusk. Avoid midday in summer.',
            '圣家堂':'Book at least 2 weeks ahead in peak season; tower tickets sell out even earlier. Maintain quiet — this is an active place of worship. Audio guide available in Chinese.',
            '桂尔公园':'Timed-entry tickets must be booked online in advance — walk-ups frequently sell out. Arrive at opening time for smaller crowds. The uphill walk requires comfortable footwear.',
            '巴特罗之家':'The AR audio guide is vivid and highly recommended. The evening light show is spectacular. Both Casa Batlló and Casa Milà are on Passeig de Gràcia — easy to visit together.',
            '米拉之家':'The rooftop terrace is the highlight; it may close in wet weather. Audio guide available in Chinese. Casa Batlló is a 5-minute walk away.',
            '毕加索博物馆':'First Sunday of each month is free — book online in advance. Discounted tickets Thu 17:00–20:00. Located in the Gothic Quarter — walkable from most central hotels.',
            '巴塞罗那主教座堂':'Timed tickets available online. The "Visita Catedral" ticket includes roof access and audio guide. Night tours are limited — book ahead. No tourist visits during Sunday morning Mass.',
            '阿尔罕布拉宫':'Nasrid Palaces have timed entry — missing your slot means no entry. For full palace access, buy "Alhambra General." Night visit requires a separate ticket.',
            '格拉纳达主教座堂':'Often available walk-in; combined ticket with Royal Chapel available. Photography prohibited inside. The Albaicín old town is a short walk away.',
            '圣尼古拉斯观景台':'Arrive 1 hour before sunset to find a good spot. Two routes up — take the path through the Albaicín\'s white alleys for the best experience. Watch for pickpockets.',
            '圣胡安迪奥斯大教堂':'Audio guide available online. Note midday closing hours (approx. 14:00–16:00). The church is small — allow about 30 minutes.',
            '塞维利亚大教堂与希拉尔达塔':'Online tickets save €1 and skip the queue. Sunday free sessions are very limited. After the tower, continue into the cathedral itself.',
            '塞维利亚王宫':'Book online at least 1 week ahead in high season. The official app has a free audio guide including Chinese. This is a Game of Thrones filming location — great to mention to travel companions.',
            '西班牙广场':'Light is most beautiful in the morning and at dusk; midday sun is intense. Free flamenco performances occasionally take place — check for schedules.',
            '科尔多瓦大清真寺-主教座堂':'The official audio guide is comprehensive and strongly recommended. First session at opening has the most beautiful light through the stained windows into the columns. Free Mass sessions cover only about 60% of the site.',
            '托莱多大教堂':'The Transparente altarpiece is most dramatic in the light around 11:00–12:00. Photography prohibited inside. Chinese audio guide available — recommended.',
            '塞哥维亚古罗马渡槽':'Light is most beautiful at sunrise and sunset. The steps above offer the best overhead angle for photos.',
            '塞哥维亚城堡':'Tower tickets are limited daily — book online in advance. The 152-step tower staircase is narrow. Audio guide currently not available in Chinese.',
            '塞哥维亚大教堂':'Together with the Alcázar and Aqueduct, this forms a perfect walking route. After your visit, try roast suckling pig at the legendary Mesón de Cándido on the main square.'
        },

        /* Festival cards */
        festMonthSuffix:'',
        festCards:[
            {city0:'Nationwide',city1:'Nationwide',city2:'San Sebastián'},
            {city0:'Cádiz',city1:'Tenerife',city2:'Andalusia'},
            {city0:'Valencia',city1:'Nationwide'},
            {city0:'Nationwide',city1:'Seville'},
            {city0:'Córdoba',city1:'Granada',city2:'Madrid'},
            {city0:'Granada',city1:'Barcelona',city2:'Córdoba'},
            {city0:'Pamplona',city1:'Santiago de Compostela'},
            {city0:'Buñol / Valencia',city1:'Barcelona',city2:'Bilbao'},
            {city0:'Jerez',city1:'Ronda',city2:'Barcelona'},
            {city0:'Zaragoza',city1:'Nationwide',city2:'Valencia'},
            {city0:'Nationwide',city1:'Madrid'},
            {city0:'Nationwide',city1:'Nationwide',city2:'Nationwide'}
        ],
        festItemTexts:[
            ["New Year's Day (Jan 1) — Midnight countdown at Puerta del Sol; eat 12 grapes with each bell chime.","Three Kings Day (Jan 6) — Magi processions through cities; children receive gifts, one of Spain's most important holidays.","Tamborrada (Jan 20) — 147 drum corps march through the night; the grandest Basque festival."],
            ["Carnaval (mid-Feb) — Spain's grandest carnival, famous for satirical songs and elaborate costumes.","Santa Cruz Carnival (late Feb) — The world's second-largest carnival; grand parades and costume parties.","Andalusia Day (Feb 28) — Regional holiday with flamenco performances and traditional celebrations."],
            ["Las Fallas (Mar 15–19) — Giant papier-mâché sculptures burned overnight amid thunderous fireworks. UNESCO Intangible Heritage.","San José Day (Mar 19) — Regional holiday in Valencia and other areas; festive activities in public squares."],
            ["Semana Santa (Holy Week) — Spectacular religious processions; most impressive in Seville, Málaga and Granada.","Feria de Abril (Seville Spring Fair) — Flamenco, horse-drawn carriages and festive marquees for a full week."],
            ["Festival de los Patios (early May) — Private courtyards open to the public, adorned in competing flower displays. UNESCO Intangible Heritage.","Día de la Cruz — Squares and alleyways decorated with ornate floral cross arrangements.","San Isidro (May 15) — Madrid's patron saint festival with bullfights, open-air concerts and traditional parades."],
            ["Corpus Christi — Grand religious processions coincide with the start of the summer fair season.","Sant Joan (Jun 23) — Fireworks light up the city until dawn; beach bonfires across Barcelona's coastline.","International Guitar Festival (Jun) — Classical and flamenco masters perform in the Alcázar gardens."],
            ["San Fermín Running of the Bulls (Jul 6–14) — Daily bull runs through the city streets; iconic white-and-red attire.","Día de Santiago (Jul 25) — Galicia's biggest festival; pilgrims gather at the Cathedral plaza."],
            ["La Tomatina (last Wed of Aug) — 100 tonnes of ripe tomatoes hurled in the world's most famous food fight.","Gràcia Festival (mid-Aug) — Residents compete to decorate streets with lights and flowers; community spirit at its finest.","Semana Grande Bilbao (mid-Aug) — 9 days of concerts, fireworks and flamenco; the north's grandest city festival."],
            ["Vendimia Wine Harvest (early Sep) — Sherry-wine region festivities in Andalusia; grape-treading ceremony and flamenco.","Feria Goyesca — Bullfighters wear 18th-century Goya-style costumes; deeply historic atmosphere.","La Mercè (Sep 24) — Human towers, fireworks and free concerts; Catalonia's great traditional celebration."],
            ["Fiestas del Pilar (around Oct 12) — One million flowers offered to the Virgin; parades, music and human towers.","Spain National Day (Oct 12) — Military parade in Madrid; Columbus Day anniversary.","Valencian Community Day (Oct 9) — Parades, concerts and regional celebrations."],
            ["Todos Los Santos (Nov 1) — Day of the Dead; families visit graves, flower markets across Spain.","Almudena Feast Day (Nov 9) — Madrid's patron Virgin; grand Mass at the Cathedral."],
            ["Constitution Day (Dec 6) & Immaculate Conception (Dec 8) — Double public holiday; festive atmosphere builds across cities.","Christmas (Dec 25) — Dazzling light displays, Christmas markets, roast suckling pig and almond sweets are tradition.","New Year's Eve (Dec 31) — Thousands count down at Puerta del Sol; eat 12 grapes on each chime to welcome the new year."]
        ],

        /* Footer */
        footerMeta:'© 2026 Spain Travel Handbook · Data provided for reference only. Please verify with official attraction websites before your trip.',
        footerAuthor:'by @喜马拉雅的果酱 on Xiaohongshu',
        toastCopied:'✓ Copied!'
    }
};

/* ============================================================
   i18n STATE
   ============================================================ */
var currentLang = localStorage.getItem('spainTravelLang') || 'zh';

/* ============================================================
   SET LANGUAGE — aplica traducciones al DOM
   Usa null-checks: funciona en cualquier página aunque no tenga
   todos los elementos de index.html
   ============================================================ */
function setLang(lang) {
    var t = i18n[lang];
    if (!t) return;

    /* — Nav desktop */
    var navEl = document.getElementById('nav');
    var setNavLink = function(sel, text) {
        var el = navEl && navEl.querySelector(sel);
        if (el) el.textContent = text;
    };
    setNavLink('a[href="#tips"].nav-item',       t.navTips);
    setNavLink('a[href="#map"].nav-item',        t.navMap);
    setNavLink('a[href="#festivals"].nav-item',  t.navFests);
    setNavLink('a[href="#transport"].nav-item',  t.navTransport);
    setNavLink('a[href="#madrid"].nav-item',     t.navMadrid);
    setNavLink('a[href="#barcelona"].nav-item',  t.navBcn);
    setNavLink('a[href="#granada"].nav-item',    t.navGranada);
    setNavLink('a[href="#sevilla"].nav-item',    t.navSevilla);
    var dropTrigger = navEl && navEl.querySelector('.nav-dropdown > .nav-item');
    if (dropTrigger) dropTrigger.textContent = t.navMore;
    setNavLink('a[href="#cordoba"].nav-dropdown-item',  t.navCordoba);
    setNavLink('a[href="#toledo"].nav-dropdown-item',   t.navToledo);
    setNavLink('a[href="#segovia"].nav-dropdown-item',  t.navSegovia);

    /* — Mobile drawer */
    var mobileMenu = document.getElementById('mobileMenu');
    var groupLabels = mobileMenu && mobileMenu.querySelectorAll('.mobile-menu-group-label');
    if (groupLabels && groupLabels[0]) groupLabels[0].textContent = t.mobileGuide;
    if (groupLabels && groupLabels[1]) groupLabels[1].textContent = t.mobileCities;
    var setMobileLink = function(href, text) {
        var a = mobileMenu && mobileMenu.querySelector('a[href="' + href + '"]');
        if (!a) return;
        var icon = a.querySelector('.mobile-menu-link-icon');
        a.innerHTML = (icon ? icon.outerHTML : '') + text;
    };
    setMobileLink('#tips',      t.mobileTips);
    setMobileLink('#map',       t.mobileMap);
    setMobileLink('#festivals', t.mobileFests);
    setMobileLink('#transport', t.mobileTransport);
    setMobileLink('#madrid',    t.mobileMadrid);
    setMobileLink('#barcelona', t.mobileBcn);
    setMobileLink('#granada',   t.mobileGranada);
    setMobileLink('#sevilla',   t.mobileSevilla);
    setMobileLink('#cordoba',   t.mobileCordoba);
    setMobileLink('#toledo',    t.mobileToledo);
    setMobileLink('#segovia',   t.mobileSegovia);

    /* — Hero */
    var heroTitle = document.querySelector('.hero-title');
    if (heroTitle) heroTitle.textContent = t.heroTitle;
    var heroSubtitle = document.querySelector('.hero-subtitle');
    if (heroSubtitle) heroSubtitle.textContent = t.heroSubtitle;
    var heroCardText = document.querySelector('.hero-card-text');
    if (heroCardText) heroCardText.textContent = t.heroCardText;
    var heroScrollText = document.querySelector('.hero-scroll-text');
    if (heroScrollText) heroScrollText.textContent = t.heroScrollText;
    var searchInput = document.getElementById('attractionSearch');
    if (searchInput) searchInput.placeholder = t.searchPlaceholder;
    var searchBtnEl = document.getElementById('searchBtn');
    if (searchBtnEl) searchBtnEl.textContent = t.searchBtn;

    /* — Section titles */
    var sec = function(id) { return document.querySelector('#' + id + ' .section-title'); };
    if (sec('tips'))      sec('tips').textContent      = t.secTipsTitle;
    if (sec('map'))       sec('map').textContent       = t.secMapTitle;
    if (sec('festivals')) sec('festivals').textContent = t.secFestsTitle;
    if (sec('transport')) sec('transport').textContent = t.secTransportTitle;

    /* — City quick-nav */
    var qnav = document.getElementById('cityQuickNav');
    var setQLink = function(href, text) {
        var el = qnav && qnav.querySelector('a[href="' + href + '"]');
        if (el) el.textContent = text;
    };
    setQLink('#tips',      t.quickTips);
    setQLink('#map',       t.quickMap);
    setQLink('#festivals', t.quickFests);
    setQLink('#transport', t.quickTransport);
    setQLink('#madrid',    t.quickMadrid);
    setQLink('#barcelona', t.quickBcn);
    setQLink('#granada',   t.quickGranada);
    setQLink('#sevilla',   t.quickSevilla);
    setQLink('#cordoba',   t.quickCordoba);
    setQLink('#toledo',    t.quickToledo);
    setQLink('#segovia',   t.quickSegovia);

    /* — Tip cards */
    document.querySelectorAll('#tipsGrid .tip-item').forEach(function(item, i) {
        var label   = item.querySelector('.tip-label');
        var content = item.querySelector('.tip-content');
        if (label   && t.tipLabels[i])   label.textContent   = t.tipLabels[i];
        if (content && t.tipContents[i]) content.textContent = t.tipContents[i];
    });

    /* — Transport section */
    var transEl = document.getElementById('transport');
    if (transEl) {
        var tIntro = transEl.querySelector('.transport-intro p');
        if (tIntro) tIntro.textContent = t.transportIntro;
        var cards = transEl.querySelectorAll('.transport-card');
        var setCard = function(card, name, desc) {
            var n = card && card.querySelector('.transport-name');
            var d = card && card.querySelector('.transport-desc');
            if (n) n.textContent = name;
            if (d) d.innerHTML  = desc;
        };
        setCard(cards[0], t.trainName,  t.trainDesc);
        setCard(cards[1], t.busName,    t.busDesc);
        setCard(cards[2], t.planeName,  t.planeDesc);
        var bTitle = transEl.querySelector('.booking-tip-title');
        if (bTitle) bTitle.textContent = t.bookingTipTitle;
        var bLabels = transEl.querySelectorAll('.booking-tip-label');
        if (bLabels[0]) bLabels[0].textContent = t.bookingLabelTrain;
        if (bLabels[1]) bLabels[1].textContent = t.bookingLabelBus;
        if (bLabels[2]) bLabels[2].textContent = t.bookingLabelPlane;
        var ths = transEl.querySelectorAll('.routes-table th');
        if (ths[0]) ths[0].textContent = t.routesHeaderRoute;
        if (ths[4]) ths[4].textContent = t.routesHeaderRecommend;
        transEl.querySelectorAll('.rt-text').forEach(function(el) {
            if (!el.getAttribute('data-zh')) el.setAttribute('data-zh', el.textContent.trim());
            var map = {'火车':'Train','大巴':'Bus','飞机':'Flight'};
            el.textContent = lang === 'en'
                ? (map[el.getAttribute('data-zh')] || el.getAttribute('data-zh'))
                : el.getAttribute('data-zh');
        });
    }
    var routesLabel = document.getElementById('routesToggleLabel');
    if (routesLabel) {
        var isExpanded = document.getElementById('routesExtra') && document.getElementById('routesExtra').classList.contains('expanded');
        routesLabel.textContent = isExpanded ? t.routesToggleCollapse : t.routesToggleExpand;
    }

    /* — City section intros */
    Object.keys(t.cityIntros).forEach(function(city) {
        var el = document.querySelector('#' + city + ' .city-intro');
        if (el) el.textContent = t.cityIntros[city];
    });

    /* — Recurring labels */
    document.querySelectorAll('.meta-chip-label').forEach(function(el) {
        if (!el.getAttribute('data-zh')) el.setAttribute('data-zh', el.textContent.trim());
        var map = {'游览时间':t.labelDuration,'语音讲解':t.labelAudio,'预约建议':t.labelBooking,
                   'Visit Duration':t.labelDuration,'Audio Guide':t.labelAudio,'Booking Tip':t.labelBooking};
        el.textContent = map[el.getAttribute('data-zh')] || el.getAttribute('data-zh');
    });
    document.querySelectorAll('.meta-chip-value').forEach(function(el) {
        if (!el.getAttribute('data-zh')) el.setAttribute('data-zh', el.textContent.trim());
        el.textContent = t.metaValueMap[el.getAttribute('data-zh')] || el.getAttribute('data-zh');
    });
    document.querySelectorAll('.info-label').forEach(function(el) {
        if (!el.getAttribute('data-zh')) el.setAttribute('data-zh', el.textContent.trim());
        var map = {'地址':t.labelAddress,'时间':t.labelHours,'门票':t.labelTickets,'官网':t.labelWebsite,
                   'Address':t.labelAddress,'Hours':t.labelHours,'Tickets':t.labelTickets,'Website':t.labelWebsite};
        el.textContent = map[el.getAttribute('data-zh')] || el.getAttribute('data-zh');
    });
    document.querySelectorAll('.attraction-tips .tips-label').forEach(function(el) {
        el.textContent = t.labelTip;
    });
    document.querySelectorAll('.copy-btn').forEach(function(btn) {
        if (!btn.getAttribute('data-zh-text')) btn.setAttribute('data-zh-text', btn.textContent.trim());
        btn.textContent = lang === 'en' ? t.labelCopy : (btn.getAttribute('data-zh-text') || '复制');
    });

    /* — Ticket info prefix */
    document.querySelectorAll('.ticket-info').forEach(function(el) {
        if (!el.getAttribute('data-zh')) el.setAttribute('data-zh', el.textContent.trim());
        var zh = el.getAttribute('data-zh');
        var enPrefix = 'Admission: ';
        var zhPrefix = '入场方式：';
        if (lang === 'en') {
            var content = zh.startsWith(zhPrefix) ? zh.slice(zhPrefix.length) : zh;
            var ticketMap = {
                '电子票二维码入场，无需携带护照':'E-ticket QR code; no passport required',
                '免费入园，无需门票':'Free entry; no ticket needed',
                '必须携带护照：票面实名制，入场须核验身份证件':'Passport required: real-name ticket, ID verified at entry',
                '现场购票或电子票均可，无需护照':'On-site or e-ticket accepted; no passport required',
                '现场购票，无需护照':'On-site purchase; no passport required'
            };
            el.textContent = enPrefix + (ticketMap[content] || content);
        } else {
            el.textContent = zh;
        }
    });

    /* — Attraction descriptions */
    document.querySelectorAll('.attraction-desc').forEach(function(el) {
        var title = el.closest('.attraction-body') && el.closest('.attraction-body').querySelector('.attraction-title');
        if (!title) return;
        var key = title.textContent.trim();
        if (!el.getAttribute('data-zh')) el.setAttribute('data-zh', el.textContent.trim());
        var text = t.attrDesc[key];
        if (text) el.textContent = text;
    });

    /* — Attraction tip texts */
    document.querySelectorAll('.attraction-tips .tips-text').forEach(function(el) {
        var title = el.closest('.attraction-body') && el.closest('.attraction-body').querySelector('.attraction-title');
        if (!title) return;
        var key = title.textContent.trim();
        if (!el.getAttribute('data-zh')) el.setAttribute('data-zh', el.textContent.trim());
        var text = t.attrTip[key];
        if (text) el.textContent = text;
    });

    /* — Festival cards */
    var festCards = document.querySelectorAll('#festivals .festival-card');
    festCards.forEach(function(card, monthIdx) {
        var monthEl = card.querySelector('.festival-month');
        if (monthEl) {
            var num = monthEl.querySelector('.festival-month-num');
            if (num) monthEl.innerHTML = num.outerHTML + t.festMonthSuffix;
        }
        var citySpans = card.querySelectorAll('.festival-city');
        var cityData  = t.festCards && t.festCards[monthIdx];
        if (cityData) {
            citySpans.forEach(function(span, i) {
                var k = 'city' + i;
                if (cityData[k]) span.textContent = cityData[k];
            });
        }
        var items     = card.querySelectorAll('.festival-list li');
        var itemTexts = i18n.en.festItemTexts && i18n.en.festItemTexts[monthIdx];
        items.forEach(function(li, i) {
            var citySpan = li.querySelector('.festival-city');
            if (!li.getAttribute('data-zh')) {
                var txtNode = Array.prototype.find.call(li.childNodes, function(n) { return n.nodeType === 3; });
                li.setAttribute('data-zh', txtNode ? txtNode.textContent.trim() : '');
            }
            var txt = lang === 'en' ? (itemTexts && itemTexts[i] ? itemTexts[i] : li.getAttribute('data-zh')) : li.getAttribute('data-zh');
            li.innerHTML = (citySpan ? citySpan.outerHTML : '') + txt;
        });
    });

    /* — Footer */
    var fMeta = document.querySelector('.footer-meta');
    if (fMeta) fMeta.textContent = t.footerMeta;
    var fAuthor = document.querySelector('.footer-author');
    if (fAuthor) fAuthor.textContent = t.footerAuthor;

    /* — Bottom nav labels (re-render si ya existe) */
    var bnItems = document.querySelectorAll('.bottom-nav-item span');
    if (bnItems.length === 4) {
        bnItems[0].textContent = t.bnHome;
        bnItems[1].textContent = t.bnCities;
        bnItems[2].textContent = t.bnFestivals;
        bnItems[3].textContent = t.bnPractical;
    }

    /* — html lang attribute */
    document.documentElement.lang = lang === 'en' ? 'en' : 'zh-CN';

    /* — Button active states */
    var btnZh = document.getElementById('langBtnZh');
    var btnEn = document.getElementById('langBtnEn');
    if (btnZh) btnZh.classList.toggle('active', lang === 'zh');
    if (btnEn) btnEn.classList.toggle('active', lang === 'en');
    var mBtnZh = document.getElementById('mobileLangZh');
    var mBtnEn = document.getElementById('mobileLangEn');
    if (mBtnZh) mBtnZh.classList.toggle('active', lang === 'zh');
    if (mBtnEn) mBtnEn.classList.toggle('active', lang === 'en');

    currentLang = lang;
    localStorage.setItem('spainTravelLang', lang);
}

/* ============================================================
   WIRE UP LANG TOGGLE BUTTONS
   Conecta automáticamente los botones #langBtnZh / #langBtnEn
   y sus equivalentes mobile. Llamar después de DOMContentLoaded.
   ============================================================ */
function initLangToggle() {
    var btnZh  = document.getElementById('langBtnZh');
    var btnEn  = document.getElementById('langBtnEn');
    var mBtnZh = document.getElementById('mobileLangZh');
    var mBtnEn = document.getElementById('mobileLangEn');

    if (btnZh)  btnZh.addEventListener('click',  function() { setLang('zh'); });
    if (btnEn)  btnEn.addEventListener('click',  function() { setLang('en'); });
    if (mBtnZh) mBtnZh.addEventListener('click', function() { setLang('zh'); });
    if (mBtnEn) mBtnEn.addEventListener('click', function() { setLang('en'); });

    /* Aplicar idioma guardado */
    setLang(currentLang);
}

/* ============================================================
   LUCIDE ICONS INIT
   Debe estar al final del script para que el DOM esté listo.
   ============================================================ */
if (typeof lucide !== 'undefined') {
    lucide.createIcons();
}
