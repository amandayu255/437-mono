var at=Object.create;var q=Object.defineProperty;var it=Object.getOwnPropertyDescriptor;var X=(e,t)=>(t=Symbol[e])?t:Symbol.for("Symbol."+e),y=e=>{throw TypeError(e)};var Z=(e,t,s)=>t in e?q(e,t,{enumerable:!0,configurable:!0,writable:!0,value:s}):e[t]=s;var R=(e,t)=>q(e,"name",{value:t,configurable:!0});var H=e=>[,,,at((e==null?void 0:e[X("metadata")])??null)],V=["class","method","getter","setter","accessor","field","value","get","set"],v=e=>e!==void 0&&typeof e!="function"?y("Function expected"):e,ot=(e,t,s,o,r)=>({kind:V[e],name:t,metadata:o,addInitializer:i=>s._?y("Already initialized"):r.push(v(i||null))}),U=(e,t)=>Z(t,X("metadata"),e[3]),x=(e,t,s,o)=>{for(var r=0,i=e[t>>1],n=i&&i.length;r<n;r++)t&1?i[r].call(s):o=i[r].call(s,o);return o},Y=(e,t,s,o,r,i)=>{var n,d,L,f,C,a=t&7,I=!!(t&8),h=!!(t&16),_=a>3?e.length+1:a?I?1:2:0,N=V[a+5],Q=a>3&&(e[_-1]=[]),rt=e[_]||(e[_]=[]),c=a&&(!h&&!I&&(r=r.prototype),a<5&&(a>3||!h)&&it(a<4?r:{get[s](){return T(this,i)},set[s](l){return W(this,i,l)}},s));a?h&&a<4&&R(i,(a>2?"set ":a>1?"get ":"")+s):R(r,s);for(var B=o.length-1;B>=0;B--)f=ot(a,s,L={},e[3],rt),a&&(f.static=I,f.private=h,C=f.access={has:h?l=>nt(r,l):l=>s in l},a^3&&(C.get=h?l=>(a^1?T:lt)(l,r,a^4?i:c.get):l=>l[s]),a>2&&(C.set=h?(l,P)=>W(l,r,P,a^4?i:c.set):(l,P)=>l[s]=P)),d=(0,o[B])(a?a<4?h?i:c[N]:a>4?void 0:{get:c.get,set:c.set}:r,f),L._=1,a^4||d===void 0?v(d)&&(a>4?Q.unshift(d):a?h?i=d:c[N]=d:r=d):typeof d!="object"||d===null?y("Object expected"):(v(n=d.get)&&(c.get=n),v(n=d.set)&&(c.set=n),v(n=d.init)&&Q.unshift(n));return a||U(e,r),c&&q(r,s,c),h?a^4?i:c:r},k=(e,t,s)=>Z(e,typeof t!="symbol"?t+"":t,s),D=(e,t,s)=>t.has(e)||y("Cannot "+s),nt=(e,t)=>Object(t)!==t?y('Cannot use the "in" operator on this value'):e.has(t),T=(e,t,s)=>(D(e,t,"read from private field"),s?s.call(e):t.get(e));var W=(e,t,s,o)=>(D(e,t,"write to private field"),o?o.call(e,s):t.set(e,s),s),lt=(e,t,s)=>(D(e,t,"access private method"),s);import{i as w,a as S,x as u,n as g,r as A,d as et,O as dt,e as ct,b as ht}from"./state-Cs85tckI.js";const z=class z extends w{constructor(){super(...arguments),this.href="#",this.label=""}render(){return u`
      <a class="card" href=${this.href}>
        <div class="label">${this.label}</div>
      </a>
    `}};z.styles=S`
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
  `,z.properties={href:{type:String},label:{type:String}};let F=z;const G=class G extends w{constructor(){super(...arguments),this.users=[],this.playlists=[]}connectedCallback(){super.connectedCallback(),this.hydrate("/data/playlists.json")}async hydrate(t){const o=await(await fetch(t)).json();this.users=o.users||[],this.playlists=o.playlists||[],this.requestUpdate()}render(){return u`
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
    `}};G.styles=S`
    :host {
      display: block;
      padding: 2rem;
    }

    .columns {
      display: flex;
      gap: 4rem;
      justify-content: center;
      align-items: flex-start; /* 👈 add this */
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
  `;let O=G;customElements.define("musica-playlist",O);var ut=Object.defineProperty,j=(e,t,s,o)=>{for(var r=void 0,i=e.length-1,n;i>=0;i--)(n=e[i])&&(r=n(t,s,r)||r);return r&&ut(t,s,r),r};const J=class J extends w{constructor(){super(...arguments),this.title="",this.artist="",this.album="",this.cover="",this.href=""}render(){return u`
      <div class="card">
        <img src="${this.cover}" alt="${this.title} Cover" />
        <div class="info">
          <div class="title">${this.title}</div>
          <div class="artist">${this.artist}</div>
          <div class="album">${this.album}</div>
        </div>
      </div>
    `}};J.styles=S`
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
`;let m=J;j([g()],m.prototype,"title");j([g()],m.prototype,"artist");j([g()],m.prototype,"album");j([g()],m.prototype,"cover");j([g()],m.prototype,"href");customElements.define("musica-card",m);var mt=Object.defineProperty,st=(e,t,s,o)=>{for(var r=void 0,i=e.length-1,n;i>=0;i--)(n=e[i])&&(r=n(t,s,r)||r);return r&&mt(t,s,r),r};const K=class K extends w{constructor(){super(...arguments),this.songs=[]}connectedCallback(){super.connectedCallback(),this.src&&this.hydrate(this.src)}async hydrate(t){const o=await(await fetch(t)).json();this.songs=o}renderSong(t){return u`
      <musica-card
        title=${t.title}
        artist=${t.artist}
        album=${t.album}
        cover=${t.cover}
        href=${t.link}
      ></musica-card>
    `}render(){return u`
      <section>${this.songs.map(t=>this.renderSong(t))}</section>
    `}};K.styles=S`
    section {
      display: grid;
      gap: 1rem;
    }
  `;let b=K;st([g()],b.prototype,"src");st([A()],b.prototype,"songs");customElements.define("musica-viewer",b);et({"musica-link":F,"musica-playlist":O,"musica-card":m,"musica-viewer":b});var E,M,tt,p;class $ extends(tt=w,M=[A()],E=[A()],tt){constructor(){super(...arguments);k(this,"_authObserver",new dt(this,"blazing:auth"));k(this,"loggedIn",x(p,8,this,!1)),x(p,11,this);k(this,"userid",x(p,12,this)),x(p,15,this)}connectedCallback(){super.connectedCallback(),this._authObserver.observe(s=>{const{user:o}=s;o&&o.authenticated?(this.loggedIn=!0,this.userid=o.username):(this.loggedIn=!1,this.userid=void 0)})}renderSignInButton(){return u`<a href="/login.html">Sign In</a>`}renderSignOutButton(){return u`
      <button @click=${s=>{ct.relay(s,"auth:message",["auth/signout"])}}>
        Sign Out
      </button>
    `}render(){return u`
      <header>
        <div>
          <slot></slot>
          <span>Hello, ${this.userid||"guest"}!</span>
        </div>
        <nav>
          ${this.loggedIn?this.renderSignOutButton():this.renderSignInButton()}
        </nav>
      </header>
    `}static initializeOnce(){}}p=H(tt),Y(p,5,"loggedIn",M,$),Y(p,5,"userid",E,$),U(p,$),k($,"styles",S`
    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      background: var(--color-background);
      border-bottom: 1px solid #ccc;
    }

    nav a, button {
      margin-left: 1rem;
    }
  `);et({"blz-header":$,"mu-auth":ht.Provider});const pt=document.querySelector("#dark-mode-toggle input");pt.addEventListener("change",e=>{const t=e.target.checked,s=new CustomEvent("darkmode:toggle",{bubbles:!0,detail:{dark:t}});document.body.dispatchEvent(s)});document.body.addEventListener("darkmode:toggle",e=>{document.body.classList.toggle("dark-mode",e.detail.dark)});
