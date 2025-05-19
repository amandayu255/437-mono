var it=Object.create;var q=Object.defineProperty;var ot=Object.getOwnPropertyDescriptor;var Z=(e,t)=>(t=Symbol[e])?t:Symbol.for("Symbol."+e),x=e=>{throw TypeError(e)};var H=(e,t,r)=>t in e?q(e,t,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[t]=r;var T=(e,t)=>q(e,"name",{value:t,configurable:!0});var V=e=>[,,,it((e==null?void 0:e[Z("metadata")])??null)],E=["class","method","getter","setter","accessor","field","value","get","set"],y=e=>e!==void 0&&typeof e!="function"?x("Function expected"):e,nt=(e,t,r,o,s)=>({kind:E[e],name:t,metadata:o,addInitializer:i=>r._?x("Already initialized"):s.push(y(i||null))}),A=(e,t)=>H(t,Z("metadata"),e[3]),k=(e,t,r,o)=>{for(var s=0,i=e[t>>1],n=i&&i.length;s<n;s++)t&1?i[s].call(r):o=i[s].call(r,o);return o},U=(e,t,r,o,s,i)=>{var n,d,N,v,j,a=t&7,C=!!(t&8),h=!!(t&16),I=a>3?e.length+1:a?C?1:2:0,Q=E[a+5],R=a>3&&(e[I-1]=[]),at=e[I]||(e[I]=[]),c=a&&(!h&&!C&&(s=s.prototype),a<5&&(a>3||!h)&&ot(a<4?s:{get[r](){return W(this,i)},set[r](l){return X(this,i,l)}},r));a?h&&a<4&&T(i,(a>2?"set ":a>1?"get ":"")+r):T(s,r);for(var B=o.length-1;B>=0;B--)v=nt(a,r,N={},e[3],at),a&&(v.static=C,v.private=h,j=v.access={has:h?l=>lt(s,l):l=>r in l},a^3&&(j.get=h?l=>(a^1?W:dt)(l,s,a^4?i:c.get):l=>l[r]),a>2&&(j.set=h?(l,P)=>X(l,s,P,a^4?i:c.set):(l,P)=>l[r]=P)),d=(0,o[B])(a?a<4?h?i:c[Q]:a>4?void 0:{get:c.get,set:c.set}:s,v),N._=1,a^4||d===void 0?y(d)&&(a>4?R.unshift(d):a?h?i=d:c[Q]=d:s=d):typeof d!="object"||d===null?x("Object expected"):(y(n=d.get)&&(c.get=n),y(n=d.set)&&(c.set=n),y(n=d.init)&&R.unshift(n));return a||A(e,s),c&&q(s,r,c),h?a^4?i:c:s},$=(e,t,r)=>H(e,typeof t!="symbol"?t+"":t,r),Y=(e,t,r)=>t.has(e)||x("Cannot "+r),lt=(e,t)=>Object(t)!==t?x('Cannot use the "in" operator on this value'):e.has(t),W=(e,t,r)=>(Y(e,t,"read from private field"),r?r.call(e):t.get(e));var X=(e,t,r,o)=>(Y(e,t,"write to private field"),o?o.call(e,r):t.set(e,r),r),dt=(e,t,r)=>(Y(e,t,"access private method"),r);import{i as w,a as z,x as u,O as G,n as f,r as D,d as rt,e as ct,b as ht}from"./state-Cs85tckI.js";const S=class S extends w{constructor(){super(...arguments),this.href="#",this.label=""}render(){return u`
      <a class="card" href=${this.href}>
        <div class="label">${this.label}</div>
      </a>
    `}};S.styles=z`
    :host {
      display: block;
      font-family: var(--font-family-base, sans-serif);
      margin-bottom: 1rem;
    }

    .card {
      display: block;
      padding: 1.25rem;
      border: 1.5px solid var(--color-border);
      border-radius: 12px;
      background-color: var(--color-background-header);
      color: var(--color-text-default);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      transition: transform 0.2s ease, box-shadow 0.3s ease;
      text-decoration: none;
    }

    .card:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
      background-color: var(--color-link-hover);
    }

    .label {
      font-size: 1.1rem;
      font-weight: bold;
      color: var(--color-text-default);
    }
  `,S.properties={href:{type:String},label:{type:String}};let F=S;const J=class J extends w{constructor(){super(...arguments),this._authObserver=new G(this,"blazing:auth"),this.users=[],this.playlists=[]}connectedCallback(){super.connectedCallback(),this._authObserver.observe(t=>{this._user=t.user,this.hydrate("/data/playlists.json")})}get authorization(){var t;return(t=this._user)!=null&&t.authenticated?{Authorization:`Bearer ${this._user.token}`}:void 0}async hydrate(t){const o=await(await fetch(t,{headers:this.authorization})).json();this.users=o.users||[],this.playlists=o.playlists||[],this.requestUpdate()}render(){return u`
      <div class="columns">
        <div class="column">
          <h2>Users</h2>
          ${this.users.map(t=>u`
              <musica-link href=${t.href} label=${t.label}></musica-link>
            `)}
        </div>
        <div class="column">
          <h2>Playlists</h2>
          ${this.playlists.map(t=>u`
              <musica-link href=${t.href} label=${t.label}></musica-link>
            `)}
        </div>
      </div>
    `}};J.styles=z`
    :host {
      display: block;
      padding: 2rem;
    }

    .columns {
      display: flex;
      gap: 4rem;
      justify-content: center;
      align-items: flex-start;
      flex-wrap: wrap;
    }

    .column {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      min-width: 220px;
    }

    h2 {
      font-size: 1.2rem;
      font-weight: bold;
      margin-bottom: 0.5rem;
      text-align: center;
    }

    .column h2 {
      margin-bottom: 1rem;
    }

    @media (max-width: 600px) {
      .columns {
        flex-direction: column;
        align-items: center;
        gap: 2rem;
      }

      .column {
        width: 100%;
        align-items: center;
      }
    }
  `;let _=J;customElements.define("musica-playlist",_);var ut=Object.defineProperty,O=(e,t,r,o)=>{for(var s=void 0,i=e.length-1,n;i>=0;i--)(n=e[i])&&(s=n(t,r,s)||s);return s&&ut(t,r,s),s};const K=class K extends w{constructor(){super(...arguments),this.title="",this.artist="",this.album="",this.cover="",this.href=""}render(){return u`
      <div class="card">
        <img src="${this.cover}" alt="${this.title} Cover" />
        <div class="info">
          <div class="title">${this.title}</div>
          <div class="artist">${this.artist}</div>
          <div class="album">${this.album}</div>
        </div>
      </div>
    `}};K.styles=z`
  :host {
    display: block;
    background: white;
    border-radius: 12px;
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.05);
    padding: 1rem;
    margin-bottom: 1rem;
    transition: transform 0.2s ease;
  }

  :host(:hover) {
    transform: translateY(-2px);
  }

  .card {
    display: flex;
    gap: 1rem;
    align-items: center;
  }

  img {
    width: 64px;
    height: 64px;
    object-fit: cover;
    border-radius: 8px;
  }

  .info {
    display: flex;
    flex-direction: column;
  }

  .title {
    font-weight: bold;
    font-size: 1.1rem;
    margin-bottom: 0.25rem;
  }

  .artist {
    font-size: 0.95rem;
  }

  .album {
    font-size: 0.9rem;
    font-style: italic;
    color: #666;
  }
`;let m=K;O([f()],m.prototype,"title");O([f()],m.prototype,"artist");O([f()],m.prototype,"album");O([f()],m.prototype,"cover");O([f()],m.prototype,"href");customElements.define("musica-card",m);var mt=Object.defineProperty,st=(e,t,r,o)=>{for(var s=void 0,i=e.length-1,n;i>=0;i--)(n=e[i])&&(s=n(t,r,s)||s);return s&&mt(t,r,s),s};const L=class L extends w{constructor(){super(...arguments),this.songs=[],this._authObserver=new G(this,"blazing:auth")}connectedCallback(){super.connectedCallback(),this._authObserver.observe(t=>{this._user=t.user,this.src&&this.hydrate(this.src)})}get authorization(){var t;return(t=this._user)!=null&&t.authenticated?{Authorization:`Bearer ${this._user.token}`}:void 0}async hydrate(t){const o=await(await fetch(t,{headers:this.authorization})).json();this.songs=o}renderSong(t){return u`
      <musica-card
        title=${t.title}
        artist=${t.artist}
        album=${t.album}
        cover=${t.cover}
        href=${t.link}
      ></musica-card>
    `}render(){return u`
      <section>${this.songs.map(t=>this.renderSong(t))}</section>
    `}};L.styles=z`
    section {
      display: grid;
      gap: 1rem;
    }
  `;let g=L;st([f()],g.prototype,"src");st([D()],g.prototype,"songs");customElements.define("musica-viewer",g);rt({"musica-link":F,"musica-playlist":_,"musica-card":m,"musica-viewer":g});var M,tt,et,b;class p extends(et=w,tt=[D()],M=[D()],et){constructor(){super(...arguments);$(this,"_authObserver",new G(this,"blazing:auth"));$(this,"loggedIn",k(b,8,this,!1)),k(b,11,this);$(this,"userid",k(b,12,this)),k(b,15,this)}connectedCallback(){super.connectedCallback(),this._authObserver.observe(r=>{const{user:o}=r;o&&o.authenticated?(this.loggedIn=!0,this.userid=o.username):(this.loggedIn=!1,this.userid=void 0)})}renderSignOutButton(){return u`
      <button
        @click=${r=>ct.relay(r,"auth:message",["auth/signout"])}>
        Sign Out
      </button>
    `}renderSignInButton(){return u`
      <a href="/login.html">Sign In…</a>
    `}render(){return u`
      <header>
        <a slot="actuator">
          Hello, ${this.userid||"traveler"}
        </a>
        <nav>
          ${this.loggedIn?this.renderSignOutButton():this.renderSignInButton()}
        </nav>
      </header>
      <slot></slot>
    `}static initializeOnce(){}}b=V(et),U(b,5,"loggedIn",tt,p),U(b,5,"userid",M,p),A(b,p),$(p,"styles",z`
    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      background-color: var(--color-background, #eee);
      border-bottom: 1px solid #ccc;
    }

    nav a, nav button {
      margin-left: 1rem;
      font-size: 1rem;
      background: none;
      border: none;
      color: var(--color-primary, #333);
      cursor: pointer;
    }

    [slot="actuator"] {
      font-weight: bold;
    }
  `);customElements.define("blz-header",p);rt({"blz-header":p,"mu-auth":ht.Provider});p.initializeOnce();const bt=document.querySelector("#dark-mode-toggle input");bt.addEventListener("change",e=>{const t=e.target.checked,r=new CustomEvent("darkmode:toggle",{bubbles:!0,detail:{dark:t}});document.body.dispatchEvent(r)});document.body.addEventListener("darkmode:toggle",e=>{document.body.classList.toggle("dark-mode",e.detail.dark)});
