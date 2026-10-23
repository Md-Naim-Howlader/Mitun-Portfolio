
(function(){
  const $ = (s,c=document)=>c.querySelector(s), $$ = (s,c=document)=>[...c.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Footer year */
  $('#year').textContent = new Date().getFullYear();

  /* Navbar background + back-to-top + active link */
  const nav = $('#nav'), toTop = $('#toTop');
  const links = $$('.site-nav .nav-link');
  const sections = links.map(l => $(l.getAttribute('href')));
  function onScroll(){
    const y = window.scrollY;
    nav.classList.toggle('scrolled', y > 60);
    toTop.classList.toggle('show', y > 500);
    let current = 0;
    sections.forEach((s,i)=>{ if(s && s.getBoundingClientRect().top <= 120) current = i; });
    links.forEach((l,i)=>l.classList.toggle('active', i===current));
  }
  addEventListener('scroll', onScroll, {passive:true}); onScroll();
  toTop.addEventListener('click', ()=>scrollTo({top:0,behavior: reduce?'auto':'smooth'}));

  /* Close mobile menu after clicking a link */
  $$('.site-nav .nav-link').forEach(l=>l.addEventListener('click',()=>{
    const m = $('#menu'); if(m.classList.contains('show')) bootstrap.Collapse.getOrCreateInstance(m).hide();
  }));

  /* Typing effect in hero */
  const words = ['MH Mitun','a Digital Marketer','an SEO Expert','a Meta Ads Specialist'];
  const el = $('#typed');
  if(reduce){ el.textContent = words[0]; el.style.animation='none'; }
  else {
    let w=0,c=0,del=false;
    (function tick(){
      const word = words[w];
      el.textContent = word.slice(0,c);
      if(!del && c===word.length){ del=true; return setTimeout(tick,1600); }
      if(del && c===0){ del=false; w=(w+1)%words.length; }
      c += del ? -1 : 1;
      setTimeout(tick, del ? 40 : 90);
    })();
  }

  /* Skill bars + counters when visible */
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(!e.isIntersecting) return;
      const t = e.target;
      if(t.id==='skills') $$('.bar',t).forEach(b=>b.style.width=b.dataset.w+'%');
      if(t.id==='counters') $$('[data-count]',t).forEach(n=>{
        const end=+n.dataset.count, dur=reduce?0:1400, t0=performance.now();
        (function step(now){
          const p = dur ? Math.min((now-t0)/dur,1) : 1;
          n.textContent = Math.round(end*(1-Math.pow(1-p,3)));
          if(p<1) requestAnimationFrame(step);
        })(t0);
      });
      io.unobserve(t);
    });
  },{threshold:.25});
  io.observe($('#skills')); io.observe($('#counters'));

  /* Portfolio filter */
  $$('.filters button').forEach(btn=>btn.addEventListener('click',()=>{
    $$('.filters button').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.filter;
    $$('#works > div').forEach(item=>{
      item.style.display = (f==='all' || item.dataset.cat===f) ? '' : 'none';
    });
  }));

  /* Contact form (AJAX; falls back gracefully) */
  const form = $('#contactForm'), msg = $('#formMsg');
  form.addEventListener('submit', async e=>{
    e.preventDefault();
    if(!form.checkValidity()){ msg.className='text-danger'; msg.textContent='Please fill in your name, a valid email and a message.'; return; }
    msg.className='text-muted'; msg.textContent='Sending...';
    try{
      const r = await fetch(form.action,{method:'POST',body:new FormData(form),headers:{Accept:'application/json'}});
      if(!r.ok) throw 0;
      form.reset(); msg.className='text-success'; msg.textContent='Thanks! Your message has been sent.';
    }catch(_){
      msg.className='text-danger';
      msg.innerHTML='Could not send. Email me directly at <a href="mailto:contact.mhmitun@gmail.com">contact.mhmitun@gmail.com</a>.';
    }
  });
})();
