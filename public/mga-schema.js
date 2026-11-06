/*
 * MGA .in : dynamic schema (Course, FAQ, Breadcrumb, Image, WebPage)
 * Place this file at: public/mga-schema.js
 * Load in index.html before </body>:  <script src="/mga-schema.js"></script>
 */
(function () {
  var IDS = {
    course: 'mga-course-schema',
    faq: 'mga-faq-schema',
    breadcrumb: 'mga-breadcrumb-schema',
    image: 'mga-image-schema',
    webpage: 'mga-webpage-schema'
  };

  // ---------- shared helpers ----------
  function clean(t) { return (t || '').replace(/\s+/g, ' ').trim(); }
  function abs(u) { try { return new URL(u, location.origin).href; } catch (e) { return ''; } }
  function sameSite(u) { try { return new URL(u).origin === location.origin; } catch (e) { return false; } }
  function metaContent(sel) {
    var m = document.querySelector(sel);
    return m ? (m.getAttribute('content') || '').trim() : '';
  }
  function fmt(n) { return Number(n).toLocaleString('en-IN'); }
  function pageText() { return (document.body && document.body.innerText) || ''; }
  // price must appear as a standalone number (so "80,000" does NOT match inside "1,80,000")
  function priceVisible(n) {
    var re = new RegExp('(^|[^\\d,])' + fmt(n).replace(/,/g, ',') + '(?!\\d)');
    return re.test(pageText());
  }
  function titleCase(slug) {
    var small = { 'in': 1, 'and': 1, 'of': 1, 'for': 1, 'the': 1 };
    return slug.split('-').map(function (w, i) {
      return (i > 0 && small[w]) ? w : w.charAt(0).toUpperCase() + w.slice(1);
    }).join(' ');
  }
  function canonicalUrl() {
    var el = document.querySelector('link[rel="canonical"]');
    var u = el ? abs(el.getAttribute('href')) : '';
    if (!u || !sameSite(u)) u = location.origin + location.pathname.replace(/\/+$/, '');
    return u;
  }
  function clearById(id) {
    var old = document.getElementById(id);
    if (old && old.parentNode) old.parentNode.removeChild(old);
  }
  function inject(id, data) {
    var s = document.createElement('script');
    s.type = 'application/ld+json';
    s.id = id;
    s.text = JSON.stringify(data);
    document.head.appendChild(s);
  }
  function courseFromPath() {
    var m = location.pathname.match(/\/courses\/(certificate|pg-diploma|fellowship)-in-([^\/?#]+)/);
    return m ? { key: m[1], slug: m[2] } : null;
  }

  // ---------- COURSE ----------
  // Category pricing as shown on live pages (INR). Update here when prices change.
  var PRICING = {
    'certificate': { label: 'Certificate', duration: 'P6M',  registration: 20000, online: 80000,  hybrid: null },
    'pg-diploma':  { label: 'PG Diploma',  duration: 'P12M', registration: 50000, online: 130000, hybrid: 150000 },
    'fellowship':  { label: 'Fellowship',  duration: 'P12M', registration: 50000, online: 150000, hybrid: 180000 }
  };

  window.mgaClearCourseSchema = function () { clearById(IDS.course); };

  window.mgaSetCourseSchema = function (c) {
    c = c || {};
    clearById(IDS.course);

    var p = courseFromPath();
    if (!p) return;
    var cat = PRICING[p.key];

    var name = clean(c.name || (cat.label + ' in ' + titleCase(p.slug)));
    var desc = clean(c.description || metaContent('meta[name="description"]'));
    if (!name || !desc) return;

    var pageUrl = canonicalUrl();
    var img = abs(c.image || metaContent('meta[property="og:image"]'));
    var region = { '@type': 'Country', 'name': 'India' };
    var regNote = 'Registration fee: INR ' + fmt(cat.registration);
    var offers = [], instances = [];

    if (cat.online && priceVisible(cat.online)) {
      offers.push({
        '@type': 'Offer', 'name': 'Online programme', 'category': 'Paid',
        'price': cat.online, 'priceCurrency': 'INR',
        'availability': 'https://schema.org/InStock', 'url': pageUrl,
        'eligibleRegion': region,
        'description': 'Total online programme cost. ' + regNote
      });
      instances.push({ '@type': 'CourseInstance', 'courseMode': 'online' });
    }
    if (cat.hybrid && priceVisible(cat.hybrid)) {
      offers.push({
        '@type': 'Offer', 'name': 'Hybrid programme', 'category': 'Paid',
        'price': cat.hybrid, 'priceCurrency': 'INR',
        'availability': 'https://schema.org/InStock', 'url': pageUrl,
        'eligibleRegion': region,
        'description': 'Total hybrid programme cost. ' + regNote
      });
      instances.push({ '@type': 'CourseInstance', 'courseMode': 'blended' });
    }
    if (!instances.length) instances.push({ '@type': 'CourseInstance', 'courseMode': 'online' });

    var data = {
      '@context': 'https://schema.org',
      '@type': 'Course',
      '@id': pageUrl + '#course',
      'name': name,
      'description': desc,
      'url': pageUrl,
      'inLanguage': 'en-IN',
      'provider': { '@id': location.origin + '/#organization' },
      'audience': { '@type': 'Audience', 'audienceType': 'Doctors in India', 'geographicArea': region },
      'isAccessibleForFree': false,
      'timeRequired': cat.duration,
      'hasCourseInstance': instances.length === 1 ? instances[0] : instances
    };
    if (img) data.image = img;
    if (c.credential) data.educationalCredentialAwarded = c.credential;
    if (c.prerequisites) data.coursePrerequisites = c.prerequisites;
    if (offers.length) data.offers = offers.length === 1 ? offers[0] : offers;

    inject(IDS.course, data);
  };

  // ---------- FAQ ----------
  window.mgaClearFaqSchema = function () { clearById(IDS.faq); };

  window.mgaSetFaqSchema = function (items) {
    clearById(IDS.faq);

    if (!items) {
      items = [];
      var nodes = document.querySelectorAll('[data-mga-faq-item]');
      for (var i = 0; i < nodes.length; i++) {
        var q = nodes[i].querySelector('[data-mga-faq-q]');
        var a = nodes[i].querySelector('[data-mga-faq-a]');
        if (q && a) items.push({ q: clean(q.textContent), a: clean(a.textContent) });
      }
    }

    var visible = clean(pageText());
    var entities = [];
    for (var j = 0; j < items.length; j++) {
      var qq = clean(items[j].q), aa = clean(items[j].a);
      if (!qq || !aa) continue;
      if (visible.indexOf(qq) === -1) continue;
      entities.push({ '@type': 'Question', 'name': qq, 'acceptedAnswer': { '@type': 'Answer', 'text': aa } });
    }
    if (!entities.length) return;

    var pageUrl = canonicalUrl();
    var data = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      '@id': pageUrl + '#faq',
      'url': pageUrl,
      'inLanguage': 'en-IN',
      'mainEntity': entities
    };
    if (document.getElementById(IDS.course)) data.about = { '@id': pageUrl + '#course' };

    inject(IDS.faq, data);
  };

  // ---------- BREADCRUMB ----------
  window.mgaClearBreadcrumbSchema = function () { clearById(IDS.breadcrumb); };

  window.mgaSetBreadcrumbSchema = function (c) {
    c = c || {};
    clearById(IDS.breadcrumb);

    var m = location.pathname.match(/^\/courses\/([^\/?#]+)/);
    if (!m) return;

    var pageUrl = canonicalUrl();

    var name = clean(c.name);
    if (!name) {
      var cs = document.getElementById(IDS.course);
      if (cs) { try { name = clean(JSON.parse(cs.text).name); } catch (e) {} }
    }
    if (!name) {
      var p = courseFromPath();
      if (p) name = PRICING[p.key].label + ' in ' + titleCase(p.slug);
    }
    if (!name) return;

    var coursesUrl = '', coursesLabel = '';
    var links = document.querySelectorAll('header a[href], nav a[href]');
    for (var i = 0; i < links.length; i++) {
      var href = abs(links[i].getAttribute('href'));
      if (sameSite(href) && new URL(href).pathname.replace(/\/+$/, '') === '/courses') {
        coursesUrl = href;
        coursesLabel = clean(links[i].textContent);
        break;
      }
    }
    if (!coursesUrl) coursesUrl = location.origin + '/courses';
    if (!coursesLabel) coursesLabel = 'Courses';

    inject(IDS.breadcrumb, {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      '@id': pageUrl + '#breadcrumb',
      'itemListElement': [
        { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': location.origin + '/' },
        { '@type': 'ListItem', 'position': 2, 'name': coursesLabel, 'item': coursesUrl },
        { '@type': 'ListItem', 'position': 3, 'name': name, 'item': pageUrl }
      ]
    });
  };

  // ---------- IMAGE ----------
  window.mgaClearImageSchema = function () { clearById(IDS.image); };

  window.mgaSetImageSchema = function (c) {
    c = c || {};
    clearById(IDS.image);

    var course = null;
    var cs = document.getElementById(IDS.course);
    if (cs) { try { course = JSON.parse(cs.text); } catch (e) {} }

    var src = c.image || (course && course.image) || metaContent('meta[property="og:image"]');
    var url = src ? abs(src) : '';
    if (!/^https?:\/\//.test(url)) return;

    var caption = clean(c.caption || (course && course.name) || '');
    var pageUrl = canonicalUrl();

    var data = {
      '@context': 'https://schema.org',
      '@type': 'ImageObject',
      '@id': pageUrl + '#primaryimage',
      'inLanguage': 'en-IN',
      'url': url,
      'contentUrl': url
    };
    if (caption) data.caption = caption;

    var imgs = document.images;
    for (var i = 0; i < imgs.length; i++) {
      if (imgs[i].complete && imgs[i].naturalWidth > 0 && abs(imgs[i].currentSrc || imgs[i].src) === url) {
        data.width = imgs[i].naturalWidth;
        data.height = imgs[i].naturalHeight;
        break;
      }
    }
    inject(IDS.image, data);
  };

  // ---------- WEBPAGE (homepage only) ----------
  window.mgaClearWebPageSchema = function () { clearById(IDS.webpage); };

  window.mgaSetWebPageSchema = function () {
    clearById(IDS.webpage);
    if (location.pathname.replace(/\/+$/, '') !== '') return; // homepage only
    var o = location.origin;
    inject(IDS.webpage, {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': o + '/#webpage',
      'url': o + '/',
      'name': 'Medical Global Academy India',
      'description': 'Online medical education platform offering Fellowship, PG Diploma and Certificate programs for MBBS, MD, MS and other eligible medical professionals in India',
      'isPartOf': { '@id': o + '/#website' },
      'about': { '@id': o + '/#organization' },
      'primaryImageOfPage': { '@id': o + '/#logo' },
      'inLanguage': 'en-IN',
      'spatialCoverage': { '@type': 'Country', 'name': 'India' }
    });
  };
})();