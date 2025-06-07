(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))s(r);new MutationObserver(r=>{for(const o of r)if(o.type==="childList")for(const i of o.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&s(i)}).observe(document,{childList:!0,subtree:!0});function t(r){const o={};return r.integrity&&(o.integrity=r.integrity),r.referrerPolicy&&(o.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?o.credentials="include":r.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function s(r){if(r.ep)return;r.ep=!0;const o=t(r);fetch(r.href,o)}})();const hs=document.querySelector("#dark-mode-toggle input");hs.addEventListener("change",n=>{const e=n.target.checked,t=new CustomEvent("darkmode:toggle",{bubbles:!0,detail:{dark:e}});document.body.dispatchEvent(t)});document.body.addEventListener("darkmode:toggle",n=>{document.body.classList.toggle("dark-mode",n.detail.dark)});var Z,Bt;class fe extends Error{}fe.prototype.name="InvalidTokenError";function ds(n){return decodeURIComponent(atob(n).replace(/(.)/g,(e,t)=>{let s=t.charCodeAt(0).toString(16).toUpperCase();return s.length<2&&(s="0"+s),"%"+s}))}function us(n){let e=n.replace(/-/g,"+").replace(/_/g,"/");switch(e.length%4){case 0:break;case 2:e+="==";break;case 3:e+="=";break;default:throw new Error("base64 string is not of the correct length")}try{return ds(e)}catch{return atob(e)}}function _r(n,e){if(typeof n!="string")throw new fe("Invalid token specified: must be a string");e||(e={});const t=e.header===!0?0:1,s=n.split(".")[t];if(typeof s!="string")throw new fe(`Invalid token specified: missing part #${t+1}`);let r;try{r=us(s)}catch(o){throw new fe(`Invalid token specified: invalid base64 for part #${t+1} (${o.message})`)}try{return JSON.parse(r)}catch(o){throw new fe(`Invalid token specified: invalid json for part #${t+1} (${o.message})`)}}const ps="mu:context",it=`${ps}:change`;class ms{constructor(e,t){this._proxy=fs(e,t)}get value(){return this._proxy}set value(e){Object.assign(this._proxy,e)}apply(e){this.value=e(this.value)}}class ft extends HTMLElement{constructor(e){super(),console.log("Constructing context provider",this),this.context=new ms(e,this),this.style.display="contents"}attach(e){return this.addEventListener(it,e),e}detach(e){this.removeEventListener(it,e)}}function fs(n,e){return new Proxy(n,{get:(s,r,o)=>{if(r==="then")return;const i=Reflect.get(s,r,o);return console.log(`Context['${r}'] => `,i),i},set:(s,r,o,i)=>{const l=n[r];console.log(`Context['${r.toString()}'] <= `,o);const a=Reflect.set(s,r,o,i);if(a){let u=new CustomEvent(it,{bubbles:!0,cancelable:!0,composed:!0});Object.assign(u,{property:r,oldValue:l,value:o}),e.dispatchEvent(u)}else console.log(`Context['${r}] was not set to ${o}`);return a}})}function gs(n,e){const t=$r(e,n);return new Promise((s,r)=>{if(t){const o=t.localName;customElements.whenDefined(o).then(()=>s(t))}else r({context:e,reason:`No provider for this context "${e}:`})})}function $r(n,e){const t=`[provides="${n}"]`;if(!e||e===document.getRootNode())return;const s=e.closest(t);if(s)return s;const r=e.getRootNode();if(r instanceof ShadowRoot)return $r(n,r.host)}class bs extends CustomEvent{constructor(e,t="mu:message"){super(t,{bubbles:!0,composed:!0,detail:e})}}function wr(n="mu:message"){return(e,...t)=>e.dispatchEvent(new bs(t,n))}class gt{constructor(e,t,s="service:message",r=!0){this._pending=[],this._context=t,this._update=e,this._eventType=s,this._running=r}attach(e){e.addEventListener(this._eventType,t=>{t.stopPropagation();const s=t.detail;this.consume(s)})}start(){this._running||(console.log(`Starting ${this._eventType} service`),this._running=!0,this._pending.forEach(e=>this.process(e)))}apply(e){this._context.apply(e)}consume(e){this._running?this.process(e):(console.log(`Queueing ${this._eventType} message`,e),this._pending.push(e))}process(e){console.log(`Processing ${this._eventType} message`,e);const t=this._update(e,this.apply.bind(this));t&&t(this._context.value)}}function vs(n){return e=>({...e,...n})}const at="mu:auth:jwt",xr=class kr extends gt{constructor(e,t){super((s,r)=>this.update(s,r),e,kr.EVENT_TYPE),this._redirectForLogin=t}update(e,t){switch(e[0]){case"auth/signin":const{token:s,redirect:r}=e[1];return t(_s(s)),et(r);case"auth/signout":return t($s()),et(this._redirectForLogin);case"auth/redirect":return et(this._redirectForLogin,{next:window.location.href});default:const o=e[0];throw new Error(`Unhandled Auth message "${o}"`)}}};xr.EVENT_TYPE="auth:message";let Ar=xr;const Sr=wr(Ar.EVENT_TYPE);function et(n,e={}){if(!n)return;const t=window.location.href,s=new URL(n,t);return Object.entries(e).forEach(([r,o])=>s.searchParams.set(r,o)),()=>{console.log("Redirecting to ",n),window.location.assign(s)}}class ys extends ft{get redirect(){return this.getAttribute("redirect")||void 0}constructor(){const e=se.authenticateFromLocalStorage();super({user:e,token:e.authenticated?e.token:void 0})}connectedCallback(){new Ar(this.context,this.redirect).attach(this)}}class re{constructor(){this.authenticated=!1,this.username="anonymous"}static deauthenticate(e){return e.authenticated=!1,e.username="anonymous",localStorage.removeItem(at),e}}class se extends re{constructor(e){super();const t=_r(e);console.log("Token payload",t),this.token=e,this.authenticated=!0,this.username=t.username}static authenticate(e){const t=new se(e);return localStorage.setItem(at,e),t}static authenticateFromLocalStorage(){const e=localStorage.getItem(at);return e?se.authenticate(e):new re}}function _s(n){return vs({user:se.authenticate(n),token:n})}function $s(){return n=>{const e=n.user;return{user:e&&e.authenticated?re.deauthenticate(e):e,token:""}}}function ws(n){return n.authenticated?{Authorization:`Bearer ${n.token||"NO_TOKEN"}`}:{}}function xs(n){return n.authenticated?_r(n.token||""):{}}const M=Object.freeze(Object.defineProperty({__proto__:null,AuthenticatedUser:se,Provider:ys,User:re,dispatch:Sr,headers:ws,payload:xs},Symbol.toStringTag,{value:"Module"}));function lt(n,e,t){const s=n.target,r=new CustomEvent(e,{bubbles:!0,composed:!0,detail:t});console.log(`Relaying event from ${n.type}:`,r),s.dispatchEvent(r),n.stopPropagation()}function Vt(n,e="*"){return n.composedPath().find(s=>{const r=s;return r.tagName&&r.matches(e)})}function Er(n,...e){const t=n.map((r,o)=>o?[e[o-1],r]:[r]).flat().join("");let s=new CSSStyleSheet;return s.replaceSync(t),s}const ks=new DOMParser;function H(n,...e){const t=e.map(l),s=n.map((a,u)=>{if(u===0)return[a];const p=t[u-1];return p instanceof Node?[`<ins id="mu-html-${u-1}"></ins>`,a]:[p,a]}).flat().join(""),r=ks.parseFromString(s,"text/html"),o=r.head.childElementCount?r.head.children:r.body.children,i=new DocumentFragment;return i.replaceChildren(...o),t.forEach((a,u)=>{if(a instanceof Node){const p=i.querySelector(`ins#mu-html-${u}`);if(p){const d=p.parentNode;d==null||d.replaceChild(a,p)}else console.log("Missing insertion point:",`ins#mu-html-${u}`)}}),i;function l(a,u){if(a===null)return"";switch(typeof a){case"string":return Gt(a);case"bigint":case"boolean":case"number":case"symbol":return Gt(a.toString());case"object":if(a instanceof Node||a instanceof DocumentFragment)return a;if(Array.isArray(a)){const p=new DocumentFragment,d=a.map(l);return p.replaceChildren(...d),p}return new Text(a.toString());default:return new Comment(`[invalid parameter of type "${typeof a}"]`)}}}function Gt(n){return n.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function qe(n,e={mode:"open"}){const t=n.attachShadow(e),s={template:r,styles:o};return s;function r(i){const l=i.firstElementChild,a=l&&l.tagName==="TEMPLATE"?l:void 0;return a&&t.appendChild(a.content.cloneNode(!0)),s}function o(...i){t.adoptedStyleSheets=i}}Z=class extends HTMLElement{constructor(){super(),this._state={},qe(this).template(Z.template).styles(Z.styles),this.addEventListener("change",n=>{const e=n.target;if(e){const t=e.name,s=e.value;t&&(this._state[t]=s)}}),this.form&&this.form.addEventListener("submit",n=>{n.preventDefault(),lt(n,"mu-form:submit",this._state)})}set init(n){this._state=n||{},As(this._state,this)}get form(){var n;return(n=this.shadowRoot)==null?void 0:n.querySelector("form")}},Z.template=H`
    <template>
      <form autocomplete="off">
        <slot></slot>
        <slot name="submit">
          <button type="submit">Submit</button>
        </slot>
      </form>
      <slot name="delete"></slot>
      <style></style>
    </template>
  `,Z.styles=Er`
    form {
      display: grid;
      gap: var(--size-spacing-medium);
      grid-column: 1/-1;
      grid-template-columns:
        subgrid
        [start] [label] [input] [col2] [col3] [end];
    }
    ::slotted(label) {
      display: grid;
      grid-column: label / end;
      grid-template-columns: subgrid;
      gap: var(--size-spacing-medium);
    }
    ::slotted(fieldset) {
      display: contents;
    }
    button[type="submit"] {
      grid-column: input;
      justify-self: start;
    }
  `;function As(n,e){const t=Object.entries(n);for(const[s,r]of t){const o=e.querySelector(`[name="${s}"]`);if(o){const i=o;switch(i.type){case"checkbox":const l=i;l.checked=!!r;break;case"date":i.value=r.toISOString().substr(0,10);break;default:i.value=r;break}}}return n}const Pr=class Cr extends gt{constructor(e){super((t,s)=>this.update(t,s),e,Cr.EVENT_TYPE)}update(e,t){switch(e[0]){case"history/navigate":{const{href:s,state:r}=e[1];t(Es(s,r));break}case"history/redirect":{const{href:s,state:r}=e[1];t(Ps(s,r));break}}}};Pr.EVENT_TYPE="history:message";let bt=Pr;class Wt extends ft{constructor(){super({location:document.location,state:{}}),this.addEventListener("click",e=>{const t=Ss(e);if(t){const s=new URL(t.href);s.origin===this.context.value.location.origin&&(console.log("Preventing Click Event on <A>",e),e.preventDefault(),vt(t,"history/navigate",{href:s.pathname+s.search}))}}),window.addEventListener("popstate",e=>{console.log("Popstate",e.state),this.context.value={location:document.location,state:e.state}})}connectedCallback(){new bt(this.context).attach(this)}}function Ss(n){const e=n.currentTarget,t=s=>s.tagName=="A"&&s.href;if(n.button===0)if(n.composed){const r=n.composedPath().find(t);return r||void 0}else{for(let s=n.target;s;s===e?null:s.parentElement)if(t(s))return s;return}}function Es(n,e={}){return history.pushState(e,"",n),()=>({location:document.location,state:history.state})}function Ps(n,e={}){return history.replaceState(e,"",n),()=>({location:document.location,state:history.state})}const vt=wr(bt.EVENT_TYPE),Cs=Object.freeze(Object.defineProperty({__proto__:null,HistoryProvider:Wt,Provider:Wt,Service:bt,dispatch:vt},Symbol.toStringTag,{value:"Module"}));class ye{constructor(e,t){this._effects=[],this._target=e,this._contextLabel=t}observe(e=void 0){return new Promise((t,s)=>{if(this._provider){const r=new Yt(this._provider,e);this._effects.push(r),t(r)}else gs(this._target,this._contextLabel).then(r=>{const o=new Yt(r,e);this._provider=r,this._effects.push(o),r.attach(i=>this._handleChange(i)),t(o)}).catch(r=>console.log(`Observer ${this._contextLabel}: ${r}`,r))})}_handleChange(e){console.log("Received change event for observers",e,this._effects),e.stopPropagation(),this._effects.forEach(t=>t.runEffect())}}class Yt{constructor(e,t){this._provider=e,t&&this.setEffect(t)}get context(){return this._provider.context}get value(){return this.context.value}setEffect(e){this._effectFn=e,this.runEffect()}runEffect(){this._effectFn&&this._effectFn(this.context.value)}}const Or=class Tr extends HTMLElement{constructor(){super(),this._state={},this._user=new re,this._authObserver=new ye(this,"blazing:auth"),qe(this).template(Tr.template),this.form&&this.form.addEventListener("submit",e=>{if(e.preventDefault(),this.src||this.action){if(console.log("Submitting form",this._state),this.action)this.action(this._state);else if(this.src){const t=this.isNew?"POST":"PUT",s=this.isNew?"created":"updated",r=this.isNew?this.src.replace(/[/][$]new$/,""):this.src;Os(r,this._state,t,this.authorization).then(o=>de(o,this)).then(o=>{const i=`mu-rest-form:${s}`,l=new CustomEvent(i,{bubbles:!0,composed:!0,detail:{method:t,[s]:o,url:r}});this.dispatchEvent(l)}).catch(o=>{const i="mu-rest-form:error",l=new CustomEvent(i,{bubbles:!0,composed:!0,detail:{method:t,error:o,url:r,request:this._state}});this.dispatchEvent(l)})}}}),this.addEventListener("change",e=>{const t=e.target;if(t){const s=t.name,r=t.value;s&&(this._state[s]=r)}})}get src(){return this.getAttribute("src")}get isNew(){return this.hasAttribute("new")}set init(e){this._state=e||{},de(this._state,this)}get form(){var e;return(e=this.shadowRoot)==null?void 0:e.querySelector("form")}get authorization(){var e;return(e=this._user)!=null&&e.authenticated?{Authorization:`Bearer ${this._user.token}`}:{}}connectedCallback(){this._authObserver.observe(({user:e})=>{e&&(this._user=e,this.src&&!this.isNew&&Jt(this.src,this.authorization).then(t=>{this._state=t,de(t,this)}))})}attributeChangedCallback(e,t,s){switch(e){case"src":this.src&&s&&s!==t&&!this.isNew&&Jt(this.src,this.authorization).then(r=>{this._state=r,de(r,this)});break;case"new":s&&(this._state={},de({},this));break}}};Or.observedAttributes=["src","new","action"];Or.template=H`
    <template>
      <form autocomplete="off">
        <slot></slot>
        <slot name="submit">
          <button type="submit">Submit</button>
        </slot>
      </form>
      <slot name="delete"></slot>
      <style>
        form {
          display: grid;
          gap: var(--size-spacing-medium);
          grid-template-columns: [start] 1fr [label] 1fr [input] 3fr 1fr [end];
        }
        ::slotted(label) {
          display: grid;
          grid-column: label / end;
          grid-template-columns: subgrid;
          gap: var(--size-spacing-medium);
        }
        button[type="submit"] {
          grid-column: input;
          justify-self: start;
        }
      </style>
    </template>
  `;function Jt(n,e){return fetch(n,{headers:e}).then(t=>{if(t.status!==200)throw`Status: ${t.status}`;return t.json()}).catch(t=>console.log(`Failed to load form from ${n}:`,t))}function de(n,e){const t=Object.entries(n);for(const[s,r]of t){const o=e.querySelector(`[name="${s}"]`);if(o){const i=o;switch(i.type){case"checkbox":const l=i;l.checked=!!r;break;default:i.value=r;break}}}return n}function Os(n,e,t="PUT",s={}){return fetch(n,{method:t,headers:{"Content-Type":"application/json",...s},body:JSON.stringify(e)}).then(r=>{if(r.status!=200&&r.status!=201)throw`Form submission failed: Status ${r.status}`;return r.json()})}const Rr=class Mr extends gt{constructor(e,t){super(t,e,Mr.EVENT_TYPE,!1)}};Rr.EVENT_TYPE="mu:message";let Ur=Rr;class Ts extends ft{constructor(e,t,s){super(t),this._user=new re,this._updateFn=e,this._authObserver=new ye(this,s)}connectedCallback(){const e=new Ur(this.context,(t,s)=>this._updateFn(t,s,this._user));e.attach(this),this._authObserver.observe(({user:t})=>{console.log("Store got auth",t),t&&(this._user=t),e.start()})}}const Rs=Object.freeze(Object.defineProperty({__proto__:null,Provider:Ts,Service:Ur},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Te=globalThis,yt=Te.ShadowRoot&&(Te.ShadyCSS===void 0||Te.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,_t=Symbol(),Kt=new WeakMap;let Nr=class{constructor(e,t,s){if(this._$cssResult$=!0,s!==_t)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(yt&&e===void 0){const s=t!==void 0&&t.length===1;s&&(e=Kt.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),s&&Kt.set(t,e))}return e}toString(){return this.cssText}};const Ms=n=>new Nr(typeof n=="string"?n:n+"",void 0,_t),Us=(n,...e)=>{const t=n.length===1?n[0]:e.reduce((s,r,o)=>s+(i=>{if(i._$cssResult$===!0)return i.cssText;if(typeof i=="number")return i;throw Error("Value passed to 'css' function must be a 'css' function result: "+i+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+n[o+1],n[0]);return new Nr(t,n,_t)},Ns=(n,e)=>{if(yt)n.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const t of e){const s=document.createElement("style"),r=Te.litNonce;r!==void 0&&s.setAttribute("nonce",r),s.textContent=t.cssText,n.appendChild(s)}},Zt=yt?n=>n:n=>n instanceof CSSStyleSheet?(e=>{let t="";for(const s of e.cssRules)t+=s.cssText;return Ms(t)})(n):n;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:js,defineProperty:Is,getOwnPropertyDescriptor:Ds,getOwnPropertyNames:Ls,getOwnPropertySymbols:zs,getPrototypeOf:Hs}=Object,ne=globalThis,Qt=ne.trustedTypes,Fs=Qt?Qt.emptyScript:"",Xt=ne.reactiveElementPolyfillSupport,ge=(n,e)=>n,Me={toAttribute(n,e){switch(e){case Boolean:n=n?Fs:null;break;case Object:case Array:n=n==null?n:JSON.stringify(n)}return n},fromAttribute(n,e){let t=n;switch(e){case Boolean:t=n!==null;break;case Number:t=n===null?null:Number(n);break;case Object:case Array:try{t=JSON.parse(n)}catch{t=null}}return t}},$t=(n,e)=>!js(n,e),er={attribute:!0,type:String,converter:Me,reflect:!1,hasChanged:$t};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),ne.litPropertyMetadata??(ne.litPropertyMetadata=new WeakMap);let X=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??(this.l=[])).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=er){if(t.state&&(t.attribute=!1),this._$Ei(),this.elementProperties.set(e,t),!t.noAccessor){const s=Symbol(),r=this.getPropertyDescriptor(e,s,t);r!==void 0&&Is(this.prototype,e,r)}}static getPropertyDescriptor(e,t,s){const{get:r,set:o}=Ds(this.prototype,e)??{get(){return this[t]},set(i){this[t]=i}};return{get(){return r==null?void 0:r.call(this)},set(i){const l=r==null?void 0:r.call(this);o.call(this,i),this.requestUpdate(e,l,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??er}static _$Ei(){if(this.hasOwnProperty(ge("elementProperties")))return;const e=Hs(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(ge("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(ge("properties"))){const t=this.properties,s=[...Ls(t),...zs(t)];for(const r of s)this.createProperty(r,t[r])}const e=this[Symbol.metadata];if(e!==null){const t=litPropertyMetadata.get(e);if(t!==void 0)for(const[s,r]of t)this.elementProperties.set(s,r)}this._$Eh=new Map;for(const[t,s]of this.elementProperties){const r=this._$Eu(t,s);r!==void 0&&this._$Eh.set(r,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const s=new Set(e.flat(1/0).reverse());for(const r of s)t.unshift(Zt(r))}else e!==void 0&&t.push(Zt(e));return t}static _$Eu(e,t){const s=t.attribute;return s===!1?void 0:typeof s=="string"?s:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var e;this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),(e=this.constructor.l)==null||e.forEach(t=>t(this))}addController(e){var t;(this._$EO??(this._$EO=new Set)).add(e),this.renderRoot!==void 0&&this.isConnected&&((t=e.hostConnected)==null||t.call(e))}removeController(e){var t;(t=this._$EO)==null||t.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const s of t.keys())this.hasOwnProperty(s)&&(e.set(s,this[s]),delete this[s]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Ns(e,this.constructor.elementStyles),e}connectedCallback(){var e;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(e=this._$EO)==null||e.forEach(t=>{var s;return(s=t.hostConnected)==null?void 0:s.call(t)})}enableUpdating(e){}disconnectedCallback(){var e;(e=this._$EO)==null||e.forEach(t=>{var s;return(s=t.hostDisconnected)==null?void 0:s.call(t)})}attributeChangedCallback(e,t,s){this._$AK(e,s)}_$EC(e,t){var s;const r=this.constructor.elementProperties.get(e),o=this.constructor._$Eu(e,r);if(o!==void 0&&r.reflect===!0){const i=(((s=r.converter)==null?void 0:s.toAttribute)!==void 0?r.converter:Me).toAttribute(t,r.type);this._$Em=e,i==null?this.removeAttribute(o):this.setAttribute(o,i),this._$Em=null}}_$AK(e,t){var s;const r=this.constructor,o=r._$Eh.get(e);if(o!==void 0&&this._$Em!==o){const i=r.getPropertyOptions(o),l=typeof i.converter=="function"?{fromAttribute:i.converter}:((s=i.converter)==null?void 0:s.fromAttribute)!==void 0?i.converter:Me;this._$Em=o,this[o]=l.fromAttribute(t,i.type),this._$Em=null}}requestUpdate(e,t,s){if(e!==void 0){if(s??(s=this.constructor.getPropertyOptions(e)),!(s.hasChanged??$t)(this[e],t))return;this.P(e,t,s)}this.isUpdatePending===!1&&(this._$ES=this._$ET())}P(e,t,s){this._$AL.has(e)||this._$AL.set(e,t),s.reflect===!0&&this._$Em!==e&&(this._$Ej??(this._$Ej=new Set)).add(e)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var e;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[o,i]of this._$Ep)this[o]=i;this._$Ep=void 0}const r=this.constructor.elementProperties;if(r.size>0)for(const[o,i]of r)i.wrapped!==!0||this._$AL.has(o)||this[o]===void 0||this.P(o,this[o],i)}let t=!1;const s=this._$AL;try{t=this.shouldUpdate(s),t?(this.willUpdate(s),(e=this._$EO)==null||e.forEach(r=>{var o;return(o=r.hostUpdate)==null?void 0:o.call(r)}),this.update(s)):this._$EU()}catch(r){throw t=!1,this._$EU(),r}t&&this._$AE(s)}willUpdate(e){}_$AE(e){var t;(t=this._$EO)==null||t.forEach(s=>{var r;return(r=s.hostUpdated)==null?void 0:r.call(s)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Ej&&(this._$Ej=this._$Ej.forEach(t=>this._$EC(t,this[t]))),this._$EU()}updated(e){}firstUpdated(e){}};X.elementStyles=[],X.shadowRootOptions={mode:"open"},X[ge("elementProperties")]=new Map,X[ge("finalized")]=new Map,Xt==null||Xt({ReactiveElement:X}),(ne.reactiveElementVersions??(ne.reactiveElementVersions=[])).push("2.0.4");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ue=globalThis,Ne=Ue.trustedTypes,tr=Ne?Ne.createPolicy("lit-html",{createHTML:n=>n}):void 0,jr="$lit$",O=`lit$${Math.random().toFixed(9).slice(2)}$`,Ir="?"+O,qs=`<${Ir}>`,q=document,_e=()=>q.createComment(""),$e=n=>n===null||typeof n!="object"&&typeof n!="function",wt=Array.isArray,Bs=n=>wt(n)||typeof(n==null?void 0:n[Symbol.iterator])=="function",tt=`[ 	
\f\r]`,ue=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,rr=/-->/g,sr=/>/g,I=RegExp(`>|${tt}(?:([^\\s"'>=/]+)(${tt}*=${tt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),nr=/'/g,or=/"/g,Dr=/^(?:script|style|textarea|title)$/i,Vs=n=>(e,...t)=>({_$litType$:n,strings:e,values:t}),pe=Vs(1),oe=Symbol.for("lit-noChange"),_=Symbol.for("lit-nothing"),ir=new WeakMap,L=q.createTreeWalker(q,129);function Lr(n,e){if(!wt(n)||!n.hasOwnProperty("raw"))throw Error("invalid template strings array");return tr!==void 0?tr.createHTML(e):e}const Gs=(n,e)=>{const t=n.length-1,s=[];let r,o=e===2?"<svg>":e===3?"<math>":"",i=ue;for(let l=0;l<t;l++){const a=n[l];let u,p,d=-1,c=0;for(;c<a.length&&(i.lastIndex=c,p=i.exec(a),p!==null);)c=i.lastIndex,i===ue?p[1]==="!--"?i=rr:p[1]!==void 0?i=sr:p[2]!==void 0?(Dr.test(p[2])&&(r=RegExp("</"+p[2],"g")),i=I):p[3]!==void 0&&(i=I):i===I?p[0]===">"?(i=r??ue,d=-1):p[1]===void 0?d=-2:(d=i.lastIndex-p[2].length,u=p[1],i=p[3]===void 0?I:p[3]==='"'?or:nr):i===or||i===nr?i=I:i===rr||i===sr?i=ue:(i=I,r=void 0);const h=i===I&&n[l+1].startsWith("/>")?" ":"";o+=i===ue?a+qs:d>=0?(s.push(u),a.slice(0,d)+jr+a.slice(d)+O+h):a+O+(d===-2?l:h)}return[Lr(n,o+(n[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),s]};let ct=class zr{constructor({strings:e,_$litType$:t},s){let r;this.parts=[];let o=0,i=0;const l=e.length-1,a=this.parts,[u,p]=Gs(e,t);if(this.el=zr.createElement(u,s),L.currentNode=this.el.content,t===2||t===3){const d=this.el.content.firstChild;d.replaceWith(...d.childNodes)}for(;(r=L.nextNode())!==null&&a.length<l;){if(r.nodeType===1){if(r.hasAttributes())for(const d of r.getAttributeNames())if(d.endsWith(jr)){const c=p[i++],h=r.getAttribute(d).split(O),m=/([.?@])?(.*)/.exec(c);a.push({type:1,index:o,name:m[2],strings:h,ctor:m[1]==="."?Ys:m[1]==="?"?Js:m[1]==="@"?Ks:Be}),r.removeAttribute(d)}else d.startsWith(O)&&(a.push({type:6,index:o}),r.removeAttribute(d));if(Dr.test(r.tagName)){const d=r.textContent.split(O),c=d.length-1;if(c>0){r.textContent=Ne?Ne.emptyScript:"";for(let h=0;h<c;h++)r.append(d[h],_e()),L.nextNode(),a.push({type:2,index:++o});r.append(d[c],_e())}}}else if(r.nodeType===8)if(r.data===Ir)a.push({type:2,index:o});else{let d=-1;for(;(d=r.data.indexOf(O,d+1))!==-1;)a.push({type:7,index:o}),d+=O.length-1}o++}}static createElement(e,t){const s=q.createElement("template");return s.innerHTML=e,s}};function ie(n,e,t=n,s){var r,o;if(e===oe)return e;let i=s!==void 0?(r=t.o)==null?void 0:r[s]:t.l;const l=$e(e)?void 0:e._$litDirective$;return(i==null?void 0:i.constructor)!==l&&((o=i==null?void 0:i._$AO)==null||o.call(i,!1),l===void 0?i=void 0:(i=new l(n),i._$AT(n,t,s)),s!==void 0?(t.o??(t.o=[]))[s]=i:t.l=i),i!==void 0&&(e=ie(n,i._$AS(n,e.values),i,s)),e}class Ws{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:s}=this._$AD,r=((e==null?void 0:e.creationScope)??q).importNode(t,!0);L.currentNode=r;let o=L.nextNode(),i=0,l=0,a=s[0];for(;a!==void 0;){if(i===a.index){let u;a.type===2?u=new Se(o,o.nextSibling,this,e):a.type===1?u=new a.ctor(o,a.name,a.strings,this,e):a.type===6&&(u=new Zs(o,this,e)),this._$AV.push(u),a=s[++l]}i!==(a==null?void 0:a.index)&&(o=L.nextNode(),i++)}return L.currentNode=q,r}p(e){let t=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(e,s,t),t+=s.strings.length-2):s._$AI(e[t])),t++}}class Se{get _$AU(){var e;return((e=this._$AM)==null?void 0:e._$AU)??this.v}constructor(e,t,s,r){this.type=2,this._$AH=_,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=s,this.options=r,this.v=(r==null?void 0:r.isConnected)??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return t!==void 0&&(e==null?void 0:e.nodeType)===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=ie(this,e,t),$e(e)?e===_||e==null||e===""?(this._$AH!==_&&this._$AR(),this._$AH=_):e!==this._$AH&&e!==oe&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):Bs(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==_&&$e(this._$AH)?this._$AA.nextSibling.data=e:this.T(q.createTextNode(e)),this._$AH=e}$(e){var t;const{values:s,_$litType$:r}=e,o=typeof r=="number"?this._$AC(e):(r.el===void 0&&(r.el=ct.createElement(Lr(r.h,r.h[0]),this.options)),r);if(((t=this._$AH)==null?void 0:t._$AD)===o)this._$AH.p(s);else{const i=new Ws(o,this),l=i.u(this.options);i.p(s),this.T(l),this._$AH=i}}_$AC(e){let t=ir.get(e.strings);return t===void 0&&ir.set(e.strings,t=new ct(e)),t}k(e){wt(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let s,r=0;for(const o of e)r===t.length?t.push(s=new Se(this.O(_e()),this.O(_e()),this,this.options)):s=t[r],s._$AI(o),r++;r<t.length&&(this._$AR(s&&s._$AB.nextSibling,r),t.length=r)}_$AR(e=this._$AA.nextSibling,t){var s;for((s=this._$AP)==null?void 0:s.call(this,!1,!0,t);e&&e!==this._$AB;){const r=e.nextSibling;e.remove(),e=r}}setConnected(e){var t;this._$AM===void 0&&(this.v=e,(t=this._$AP)==null||t.call(this,e))}}class Be{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,s,r,o){this.type=1,this._$AH=_,this._$AN=void 0,this.element=e,this.name=t,this._$AM=r,this.options=o,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=_}_$AI(e,t=this,s,r){const o=this.strings;let i=!1;if(o===void 0)e=ie(this,e,t,0),i=!$e(e)||e!==this._$AH&&e!==oe,i&&(this._$AH=e);else{const l=e;let a,u;for(e=o[0],a=0;a<o.length-1;a++)u=ie(this,l[s+a],t,a),u===oe&&(u=this._$AH[a]),i||(i=!$e(u)||u!==this._$AH[a]),u===_?e=_:e!==_&&(e+=(u??"")+o[a+1]),this._$AH[a]=u}i&&!r&&this.j(e)}j(e){e===_?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class Ys extends Be{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===_?void 0:e}}class Js extends Be{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==_)}}class Ks extends Be{constructor(e,t,s,r,o){super(e,t,s,r,o),this.type=5}_$AI(e,t=this){if((e=ie(this,e,t,0)??_)===oe)return;const s=this._$AH,r=e===_&&s!==_||e.capture!==s.capture||e.once!==s.once||e.passive!==s.passive,o=e!==_&&(s===_||r);r&&this.element.removeEventListener(this.name,this,s),o&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){var t;typeof this._$AH=="function"?this._$AH.call(((t=this.options)==null?void 0:t.host)??this.element,e):this._$AH.handleEvent(e)}}class Zs{constructor(e,t,s){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(e){ie(this,e)}}const ar=Ue.litHtmlPolyfillSupport;ar==null||ar(ct,Se),(Ue.litHtmlVersions??(Ue.litHtmlVersions=[])).push("3.2.0");const Qs=(n,e,t)=>{const s=(t==null?void 0:t.renderBefore)??e;let r=s._$litPart$;if(r===void 0){const o=(t==null?void 0:t.renderBefore)??null;s._$litPart$=r=new Se(e.insertBefore(_e(),o),o,void 0,t??{})}return r._$AI(n),r};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let te=class extends X{constructor(){super(...arguments),this.renderOptions={host:this},this.o=void 0}createRenderRoot(){var e;const t=super.createRenderRoot();return(e=this.renderOptions).renderBefore??(e.renderBefore=t.firstChild),t}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this.o=Qs(t,this.renderRoot,this.renderOptions)}connectedCallback(){var e;super.connectedCallback(),(e=this.o)==null||e.setConnected(!0)}disconnectedCallback(){var e;super.disconnectedCallback(),(e=this.o)==null||e.setConnected(!1)}render(){return oe}};te._$litElement$=!0,te.finalized=!0,(Bt=globalThis.litElementHydrateSupport)==null||Bt.call(globalThis,{LitElement:te});const lr=globalThis.litElementPolyfillSupport;lr==null||lr({LitElement:te});(globalThis.litElementVersions??(globalThis.litElementVersions=[])).push("4.1.0");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Xs={attribute:!0,type:String,converter:Me,reflect:!1,hasChanged:$t},en=(n=Xs,e,t)=>{const{kind:s,metadata:r}=t;let o=globalThis.litPropertyMetadata.get(r);if(o===void 0&&globalThis.litPropertyMetadata.set(r,o=new Map),o.set(t.name,n),s==="accessor"){const{name:i}=t;return{set(l){const a=e.get.call(this);e.set.call(this,l),this.requestUpdate(i,a,n)},init(l){return l!==void 0&&this.P(i,void 0,n),l}}}if(s==="setter"){const{name:i}=t;return function(l){const a=this[i];e.call(this,l),this.requestUpdate(i,a,n)}}throw Error("Unsupported decorator location: "+s)};function Hr(n){return(e,t)=>typeof t=="object"?en(n,e,t):((s,r,o)=>{const i=r.hasOwnProperty(o);return r.constructor.createProperty(o,i?{...s,wrapped:!0}:s),i?Object.getOwnPropertyDescriptor(r,o):void 0})(n,e,t)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function Fr(n){return Hr({...n,state:!0,attribute:!1})}function tn(n){return n&&n.__esModule&&Object.prototype.hasOwnProperty.call(n,"default")?n.default:n}function rn(n){throw new Error('Could not dynamically require "'+n+'". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.')}var qr={};(function(n){var e=function(){var t=function(d,c,h,m){for(h=h||{},m=d.length;m--;h[d[m]]=c);return h},s=[1,9],r=[1,10],o=[1,11],i=[1,12],l=[5,11,12,13,14,15],a={trace:function(){},yy:{},symbols_:{error:2,root:3,expressions:4,EOF:5,expression:6,optional:7,literal:8,splat:9,param:10,"(":11,")":12,LITERAL:13,SPLAT:14,PARAM:15,$accept:0,$end:1},terminals_:{2:"error",5:"EOF",11:"(",12:")",13:"LITERAL",14:"SPLAT",15:"PARAM"},productions_:[0,[3,2],[3,1],[4,2],[4,1],[6,1],[6,1],[6,1],[6,1],[7,3],[8,1],[9,1],[10,1]],performAction:function(c,h,m,g,f,v,Je){var A=v.length-1;switch(f){case 1:return new g.Root({},[v[A-1]]);case 2:return new g.Root({},[new g.Literal({value:""})]);case 3:this.$=new g.Concat({},[v[A-1],v[A]]);break;case 4:case 5:this.$=v[A];break;case 6:this.$=new g.Literal({value:v[A]});break;case 7:this.$=new g.Splat({name:v[A]});break;case 8:this.$=new g.Param({name:v[A]});break;case 9:this.$=new g.Optional({},[v[A-1]]);break;case 10:this.$=c;break;case 11:case 12:this.$=c.slice(1);break}},table:[{3:1,4:2,5:[1,3],6:4,7:5,8:6,9:7,10:8,11:s,13:r,14:o,15:i},{1:[3]},{5:[1,13],6:14,7:5,8:6,9:7,10:8,11:s,13:r,14:o,15:i},{1:[2,2]},t(l,[2,4]),t(l,[2,5]),t(l,[2,6]),t(l,[2,7]),t(l,[2,8]),{4:15,6:4,7:5,8:6,9:7,10:8,11:s,13:r,14:o,15:i},t(l,[2,10]),t(l,[2,11]),t(l,[2,12]),{1:[2,1]},t(l,[2,3]),{6:14,7:5,8:6,9:7,10:8,11:s,12:[1,16],13:r,14:o,15:i},t(l,[2,9])],defaultActions:{3:[2,2],13:[2,1]},parseError:function(c,h){if(h.recoverable)this.trace(c);else{let m=function(g,f){this.message=g,this.hash=f};throw m.prototype=Error,new m(c,h)}},parse:function(c){var h=this,m=[0],g=[null],f=[],v=this.table,Je="",A=0,Ht=0,is=2,Ft=1,as=f.slice.call(arguments,1),y=Object.create(this.lexer),N={yy:{}};for(var Ke in this.yy)Object.prototype.hasOwnProperty.call(this.yy,Ke)&&(N.yy[Ke]=this.yy[Ke]);y.setInput(c,N.yy),N.yy.lexer=y,N.yy.parser=this,typeof y.yylloc>"u"&&(y.yylloc={});var Ze=y.yylloc;f.push(Ze);var ls=y.options&&y.options.ranges;typeof N.yy.parseError=="function"?this.parseError=N.yy.parseError:this.parseError=Object.getPrototypeOf(this).parseError;for(var cs=function(){var K;return K=y.lex()||Ft,typeof K!="number"&&(K=h.symbols_[K]||K),K},x,j,S,Qe,J={},Ce,P,qt,Oe;;){if(j=m[m.length-1],this.defaultActions[j]?S=this.defaultActions[j]:((x===null||typeof x>"u")&&(x=cs()),S=v[j]&&v[j][x]),typeof S>"u"||!S.length||!S[0]){var Xe="";Oe=[];for(Ce in v[j])this.terminals_[Ce]&&Ce>is&&Oe.push("'"+this.terminals_[Ce]+"'");y.showPosition?Xe="Parse error on line "+(A+1)+`:
`+y.showPosition()+`
Expecting `+Oe.join(", ")+", got '"+(this.terminals_[x]||x)+"'":Xe="Parse error on line "+(A+1)+": Unexpected "+(x==Ft?"end of input":"'"+(this.terminals_[x]||x)+"'"),this.parseError(Xe,{text:y.match,token:this.terminals_[x]||x,line:y.yylineno,loc:Ze,expected:Oe})}if(S[0]instanceof Array&&S.length>1)throw new Error("Parse Error: multiple actions possible at state: "+j+", token: "+x);switch(S[0]){case 1:m.push(x),g.push(y.yytext),f.push(y.yylloc),m.push(S[1]),x=null,Ht=y.yyleng,Je=y.yytext,A=y.yylineno,Ze=y.yylloc;break;case 2:if(P=this.productions_[S[1]][1],J.$=g[g.length-P],J._$={first_line:f[f.length-(P||1)].first_line,last_line:f[f.length-1].last_line,first_column:f[f.length-(P||1)].first_column,last_column:f[f.length-1].last_column},ls&&(J._$.range=[f[f.length-(P||1)].range[0],f[f.length-1].range[1]]),Qe=this.performAction.apply(J,[Je,Ht,A,N.yy,S[1],g,f].concat(as)),typeof Qe<"u")return Qe;P&&(m=m.slice(0,-1*P*2),g=g.slice(0,-1*P),f=f.slice(0,-1*P)),m.push(this.productions_[S[1]][0]),g.push(J.$),f.push(J._$),qt=v[m[m.length-2]][m[m.length-1]],m.push(qt);break;case 3:return!0}}return!0}},u=function(){var d={EOF:1,parseError:function(h,m){if(this.yy.parser)this.yy.parser.parseError(h,m);else throw new Error(h)},setInput:function(c,h){return this.yy=h||this.yy||{},this._input=c,this._more=this._backtrack=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match="",this.conditionStack=["INITIAL"],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this.options.ranges&&(this.yylloc.range=[0,0]),this.offset=0,this},input:function(){var c=this._input[0];this.yytext+=c,this.yyleng++,this.offset++,this.match+=c,this.matched+=c;var h=c.match(/(?:\r\n?|\n).*/g);return h?(this.yylineno++,this.yylloc.last_line++):this.yylloc.last_column++,this.options.ranges&&this.yylloc.range[1]++,this._input=this._input.slice(1),c},unput:function(c){var h=c.length,m=c.split(/(?:\r\n?|\n)/g);this._input=c+this._input,this.yytext=this.yytext.substr(0,this.yytext.length-h),this.offset-=h;var g=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1),this.matched=this.matched.substr(0,this.matched.length-1),m.length-1&&(this.yylineno-=m.length-1);var f=this.yylloc.range;return this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:m?(m.length===g.length?this.yylloc.first_column:0)+g[g.length-m.length].length-m[0].length:this.yylloc.first_column-h},this.options.ranges&&(this.yylloc.range=[f[0],f[0]+this.yyleng-h]),this.yyleng=this.yytext.length,this},more:function(){return this._more=!0,this},reject:function(){if(this.options.backtrack_lexer)this._backtrack=!0;else return this.parseError("Lexical error on line "+(this.yylineno+1)+`. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).
`+this.showPosition(),{text:"",token:null,line:this.yylineno});return this},less:function(c){this.unput(this.match.slice(c))},pastInput:function(){var c=this.matched.substr(0,this.matched.length-this.match.length);return(c.length>20?"...":"")+c.substr(-20).replace(/\n/g,"")},upcomingInput:function(){var c=this.match;return c.length<20&&(c+=this._input.substr(0,20-c.length)),(c.substr(0,20)+(c.length>20?"...":"")).replace(/\n/g,"")},showPosition:function(){var c=this.pastInput(),h=new Array(c.length+1).join("-");return c+this.upcomingInput()+`
`+h+"^"},test_match:function(c,h){var m,g,f;if(this.options.backtrack_lexer&&(f={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done},this.options.ranges&&(f.yylloc.range=this.yylloc.range.slice(0))),g=c[0].match(/(?:\r\n?|\n).*/g),g&&(this.yylineno+=g.length),this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:g?g[g.length-1].length-g[g.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+c[0].length},this.yytext+=c[0],this.match+=c[0],this.matches=c,this.yyleng=this.yytext.length,this.options.ranges&&(this.yylloc.range=[this.offset,this.offset+=this.yyleng]),this._more=!1,this._backtrack=!1,this._input=this._input.slice(c[0].length),this.matched+=c[0],m=this.performAction.call(this,this.yy,this,h,this.conditionStack[this.conditionStack.length-1]),this.done&&this._input&&(this.done=!1),m)return m;if(this._backtrack){for(var v in f)this[v]=f[v];return!1}return!1},next:function(){if(this.done)return this.EOF;this._input||(this.done=!0);var c,h,m,g;this._more||(this.yytext="",this.match="");for(var f=this._currentRules(),v=0;v<f.length;v++)if(m=this._input.match(this.rules[f[v]]),m&&(!h||m[0].length>h[0].length)){if(h=m,g=v,this.options.backtrack_lexer){if(c=this.test_match(m,f[v]),c!==!1)return c;if(this._backtrack){h=!1;continue}else return!1}else if(!this.options.flex)break}return h?(c=this.test_match(h,f[g]),c!==!1?c:!1):this._input===""?this.EOF:this.parseError("Lexical error on line "+(this.yylineno+1)+`. Unrecognized text.
`+this.showPosition(),{text:"",token:null,line:this.yylineno})},lex:function(){var h=this.next();return h||this.lex()},begin:function(h){this.conditionStack.push(h)},popState:function(){var h=this.conditionStack.length-1;return h>0?this.conditionStack.pop():this.conditionStack[0]},_currentRules:function(){return this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1]?this.conditions[this.conditionStack[this.conditionStack.length-1]].rules:this.conditions.INITIAL.rules},topState:function(h){return h=this.conditionStack.length-1-Math.abs(h||0),h>=0?this.conditionStack[h]:"INITIAL"},pushState:function(h){this.begin(h)},stateStackSize:function(){return this.conditionStack.length},options:{},performAction:function(h,m,g,f){switch(g){case 0:return"(";case 1:return")";case 2:return"SPLAT";case 3:return"PARAM";case 4:return"LITERAL";case 5:return"LITERAL";case 6:return"EOF"}},rules:[/^(?:\()/,/^(?:\))/,/^(?:\*+\w+)/,/^(?::+\w+)/,/^(?:[\w%\-~\n]+)/,/^(?:.)/,/^(?:$)/],conditions:{INITIAL:{rules:[0,1,2,3,4,5,6],inclusive:!0}}};return d}();a.lexer=u;function p(){this.yy={}}return p.prototype=a,a.Parser=p,new p}();typeof rn<"u"&&(n.parser=e,n.Parser=e.Parser,n.parse=function(){return e.parse.apply(e,arguments)})})(qr);function Q(n){return function(e,t){return{displayName:n,props:e,children:t||[]}}}var Br={Root:Q("Root"),Concat:Q("Concat"),Literal:Q("Literal"),Splat:Q("Splat"),Param:Q("Param"),Optional:Q("Optional")},Vr=qr.parser;Vr.yy=Br;var sn=Vr,nn=Object.keys(Br);function on(n){return nn.forEach(function(e){if(typeof n[e]>"u")throw new Error("No handler defined for "+e.displayName)}),{visit:function(e,t){return this.handlers[e.displayName].call(this,e,t)},handlers:n}}var Gr=on,an=Gr,ln=/[\-{}\[\]+?.,\\\^$|#\s]/g;function Wr(n){this.captures=n.captures,this.re=n.re}Wr.prototype.match=function(n){var e=this.re.exec(n),t={};if(e)return this.captures.forEach(function(s,r){typeof e[r+1]>"u"?t[s]=void 0:t[s]=decodeURIComponent(e[r+1])}),t};var cn=an({Concat:function(n){return n.children.reduce((function(e,t){var s=this.visit(t);return{re:e.re+s.re,captures:e.captures.concat(s.captures)}}).bind(this),{re:"",captures:[]})},Literal:function(n){return{re:n.props.value.replace(ln,"\\$&"),captures:[]}},Splat:function(n){return{re:"([^?]*?)",captures:[n.props.name]}},Param:function(n){return{re:"([^\\/\\?]+)",captures:[n.props.name]}},Optional:function(n){var e=this.visit(n.children[0]);return{re:"(?:"+e.re+")?",captures:e.captures}},Root:function(n){var e=this.visit(n.children[0]);return new Wr({re:new RegExp("^"+e.re+"(?=\\?|$)"),captures:e.captures})}}),hn=cn,dn=Gr,un=dn({Concat:function(n,e){var t=n.children.map((function(s){return this.visit(s,e)}).bind(this));return t.some(function(s){return s===!1})?!1:t.join("")},Literal:function(n){return decodeURI(n.props.value)},Splat:function(n,e){return e[n.props.name]?e[n.props.name]:!1},Param:function(n,e){return e[n.props.name]?e[n.props.name]:!1},Optional:function(n,e){var t=this.visit(n.children[0],e);return t||""},Root:function(n,e){e=e||{};var t=this.visit(n.children[0],e);return t?encodeURI(t):!1}}),pn=un,mn=sn,fn=hn,gn=pn;Ee.prototype=Object.create(null);Ee.prototype.match=function(n){var e=fn.visit(this.ast),t=e.match(n);return t||!1};Ee.prototype.reverse=function(n){return gn.visit(this.ast,n)};function Ee(n){var e;if(this?e=this:e=Object.create(Ee.prototype),typeof n>"u")throw new Error("A route spec is required");return e.spec=n,e.ast=mn.parse(n),e}var bn=Ee,vn=bn,yn=vn;const _n=tn(yn);var $n=Object.defineProperty,Yr=(n,e,t,s)=>{for(var r=void 0,o=n.length-1,i;o>=0;o--)(i=n[o])&&(r=i(e,t,r)||r);return r&&$n(e,t,r),r};const Jr=class extends te{constructor(e,t,s=""){super(),this._cases=[],this._fallback=()=>pe` <h1>Not Found</h1> `,this._cases=e.map(r=>({...r,route:new _n(r.path)})),this._historyObserver=new ye(this,t),this._authObserver=new ye(this,s)}connectedCallback(){this._historyObserver.observe(({location:e})=>{console.log("New location",e),e&&(this._match=this.matchRoute(e))}),this._authObserver.observe(({user:e})=>{this._user=e}),super.connectedCallback()}render(){return console.log("Rendering for match",this._match,this._user),pe` <main>${(()=>{const t=this._match;if(t){if("view"in t)return this._user?t.auth&&t.auth!=="public"&&this._user&&!this._user.authenticated?(Sr(this,"auth/redirect"),pe` <h1>Redirecting for Login</h1> `):(console.log("Loading view, ",t.params,t.query),t.view(t.params||{},t.query)):pe` <h1>Authenticating</h1> `;if("redirect"in t){const s=t.redirect;if(typeof s=="string")return this.redirect(s),pe` <h1>Redirecting to ${s}…</h1> `}}return this._fallback({})})()}</main> `}updated(e){e.has("_match")&&this.requestUpdate()}matchRoute(e){const{search:t,pathname:s}=e,r=new URLSearchParams(t),o=s+t;for(const i of this._cases){const l=i.route.match(o);if(l)return{...i,path:s,params:l,query:r}}}redirect(e){vt(this,"history/redirect",{href:e})}};Jr.styles=Us`
    :host,
    main {
      display: contents;
    }
  `;let je=Jr;Yr([Fr()],je.prototype,"_user");Yr([Fr()],je.prototype,"_match");const wn=Object.freeze(Object.defineProperty({__proto__:null,Element:je,Switch:je},Symbol.toStringTag,{value:"Module"})),xn=class Kr extends HTMLElement{constructor(){if(super(),qe(this).template(Kr.template),this.shadowRoot){const e=this.shadowRoot.querySelector("slot[name='actuator']");e&&e.addEventListener("click",()=>this.toggle())}}toggle(){this.hasAttribute("open")?this.removeAttribute("open"):this.setAttribute("open","open")}};xn.template=H`
    <template>
      <slot name="actuator"><button>Menu</button></slot>
      <div id="panel">
        <slot></slot>
      </div>

      <style>
        :host {
          position: relative;
        }
        #is-shown {
          display: none;
        }
        #panel {
          display: none;

          position: absolute;
          right: 0;
          margin-top: var(--size-spacing-small);
          width: max-content;
          padding: var(--size-spacing-small);
          border-radius: var(--size-radius-small);
          background: var(--color-background-card);
          color: var(--color-text);
          box-shadow: var(--shadow-popover);
        }
        :host([open]) #panel {
          display: block;
        }
      </style>
    </template>
  `;const Zr=class ht extends HTMLElement{constructor(){super(),this._array=[],qe(this).template(ht.template).styles(ht.styles),this.addEventListener("input-array:add",e=>{e.stopPropagation(),this.append(Qr("",this._array.length))}),this.addEventListener("input-array:remove",e=>{e.stopPropagation(),this.removeClosestItem(e.target)}),this.addEventListener("change",e=>{e.stopPropagation();const t=e.target;if(t&&t!==this){const s=new Event("change",{bubbles:!0}),r=t.value,o=t.closest("label");if(o){const i=Array.from(this.children).indexOf(o);this._array[i]=r,this.dispatchEvent(s)}}}),this.addEventListener("click",e=>{Vt(e,"button.add")?lt(e,"input-array:add"):Vt(e,"button.remove")&&lt(e,"input-array:remove")})}get name(){return this.getAttribute("name")}get value(){return this._array}set value(e){this._array=Array.isArray(e)?e:[e],kn(this._array,this)}removeClosestItem(e){const t=e.closest("label");if(console.log("Removing closest item:",t,e),t){const s=Array.from(this.children).indexOf(t);this._array.splice(s,1),t.remove()}}};Zr.template=H`
    <template>
      <ul>
        <slot></slot>
      </ul>
      <button class="add">
        <slot name="label-add">Add one</slot>
        <style></style>
      </button>
    </template>
  `;Zr.styles=Er`
    :host {
      display: grid;
      grid-template-columns: subgrid;
      grid-column: input / end;
    }
    ul {
      display: contents;
    }
    button.add {
      grid-column: input / input-end;
    }
    ::slotted(label) {
      grid-column: 1 / -1;
      display: grid;
      grid-template-columns: subgrid;
    }
  `;function kn(n,e){e.replaceChildren(),n.forEach((t,s)=>e.append(Qr(t)))}function Qr(n,e){const t=n===void 0?H`<input />`:H`<input value="${n}" />`;return H`
    <label>
      ${t}
      <button class="remove" type="button">Remove</button>
    </label>
  `}function Y(n){return Object.entries(n).map(([e,t])=>{customElements.get(e)||customElements.define(e,t)}),customElements}var An=Object.defineProperty,Sn=Object.getOwnPropertyDescriptor,En=(n,e,t,s)=>{for(var r=Sn(e,t),o=n.length-1,i;o>=0;o--)(i=n[o])&&(r=i(e,t,r)||r);return r&&An(e,t,r),r};class E extends te{constructor(e){super(),this._pending=[],this._observer=new ye(this,e)}get model(){return this._lastModel=this._context?this._context.value:{},this._lastModel}connectedCallback(){var e;super.connectedCallback(),(e=this._observer)==null||e.observe().then(t=>{console.log("View effect (initial)",this,t),this._context=t.context,this._pending.length&&this._pending.forEach(([s,r])=>{console.log("Dispatching queued event",r,s),s.dispatchEvent(r)}),t.setEffect(()=>{var s;if(console.log("View effect",this,t,(s=this._context)==null?void 0:s.value),this._context)console.log("requesting update"),this.requestUpdate();else throw"View context not ready for effect"})})}dispatchMessage(e,t=this){const s=new CustomEvent("mu:message",{bubbles:!0,composed:!0,detail:e});this._context?(console.log("Dispatching message event",s),t.dispatchEvent(s)):(console.log("Queueing message event",s),this._pending.push([t,s]))}ref(e){return this.model?this.model[e]:void 0}}En([Hr()],E.prototype,"model");/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Re=globalThis,xt=Re.ShadowRoot&&(Re.ShadyCSS===void 0||Re.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,kt=Symbol(),cr=new WeakMap;let Xr=class{constructor(e,t,s){if(this._$cssResult$=!0,s!==kt)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(xt&&e===void 0){const s=t!==void 0&&t.length===1;s&&(e=cr.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),s&&cr.set(t,e))}return e}toString(){return this.cssText}};const Pn=n=>new Xr(typeof n=="string"?n:n+"",void 0,kt),k=(n,...e)=>{const t=n.length===1?n[0]:e.reduce((s,r,o)=>s+(i=>{if(i._$cssResult$===!0)return i.cssText;if(typeof i=="number")return i;throw Error("Value passed to 'css' function must be a 'css' function result: "+i+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+n[o+1],n[0]);return new Xr(t,n,kt)},Cn=(n,e)=>{if(xt)n.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const t of e){const s=document.createElement("style"),r=Re.litNonce;r!==void 0&&s.setAttribute("nonce",r),s.textContent=t.cssText,n.appendChild(s)}},hr=xt?n=>n:n=>n instanceof CSSStyleSheet?(e=>{let t="";for(const s of e.cssRules)t+=s.cssText;return Pn(t)})(n):n;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:On,defineProperty:Tn,getOwnPropertyDescriptor:Rn,getOwnPropertyNames:Mn,getOwnPropertySymbols:Un,getPrototypeOf:Nn}=Object,R=globalThis,dr=R.trustedTypes,jn=dr?dr.emptyScript:"",rt=R.reactiveElementPolyfillSupport,be=(n,e)=>n,Ie={toAttribute(n,e){switch(e){case Boolean:n=n?jn:null;break;case Object:case Array:n=n==null?n:JSON.stringify(n)}return n},fromAttribute(n,e){let t=n;switch(e){case Boolean:t=n!==null;break;case Number:t=n===null?null:Number(n);break;case Object:case Array:try{t=JSON.parse(n)}catch{t=null}}return t}},At=(n,e)=>!On(n,e),ur={attribute:!0,type:String,converter:Ie,reflect:!1,useDefault:!1,hasChanged:At};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),R.litPropertyMetadata??(R.litPropertyMetadata=new WeakMap);let ee=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??(this.l=[])).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=ur){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const s=Symbol(),r=this.getPropertyDescriptor(e,s,t);r!==void 0&&Tn(this.prototype,e,r)}}static getPropertyDescriptor(e,t,s){const{get:r,set:o}=Rn(this.prototype,e)??{get(){return this[t]},set(i){this[t]=i}};return{get:r,set(i){const l=r==null?void 0:r.call(this);o==null||o.call(this,i),this.requestUpdate(e,l,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??ur}static _$Ei(){if(this.hasOwnProperty(be("elementProperties")))return;const e=Nn(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(be("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(be("properties"))){const t=this.properties,s=[...Mn(t),...Un(t)];for(const r of s)this.createProperty(r,t[r])}const e=this[Symbol.metadata];if(e!==null){const t=litPropertyMetadata.get(e);if(t!==void 0)for(const[s,r]of t)this.elementProperties.set(s,r)}this._$Eh=new Map;for(const[t,s]of this.elementProperties){const r=this._$Eu(t,s);r!==void 0&&this._$Eh.set(r,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const s=new Set(e.flat(1/0).reverse());for(const r of s)t.unshift(hr(r))}else e!==void 0&&t.push(hr(e));return t}static _$Eu(e,t){const s=t.attribute;return s===!1?void 0:typeof s=="string"?s:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var e;this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),(e=this.constructor.l)==null||e.forEach(t=>t(this))}addController(e){var t;(this._$EO??(this._$EO=new Set)).add(e),this.renderRoot!==void 0&&this.isConnected&&((t=e.hostConnected)==null||t.call(e))}removeController(e){var t;(t=this._$EO)==null||t.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const s of t.keys())this.hasOwnProperty(s)&&(e.set(s,this[s]),delete this[s]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Cn(e,this.constructor.elementStyles),e}connectedCallback(){var e;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(e=this._$EO)==null||e.forEach(t=>{var s;return(s=t.hostConnected)==null?void 0:s.call(t)})}enableUpdating(e){}disconnectedCallback(){var e;(e=this._$EO)==null||e.forEach(t=>{var s;return(s=t.hostDisconnected)==null?void 0:s.call(t)})}attributeChangedCallback(e,t,s){this._$AK(e,s)}_$ET(e,t){var o;const s=this.constructor.elementProperties.get(e),r=this.constructor._$Eu(e,s);if(r!==void 0&&s.reflect===!0){const i=(((o=s.converter)==null?void 0:o.toAttribute)!==void 0?s.converter:Ie).toAttribute(t,s.type);this._$Em=e,i==null?this.removeAttribute(r):this.setAttribute(r,i),this._$Em=null}}_$AK(e,t){var o,i;const s=this.constructor,r=s._$Eh.get(e);if(r!==void 0&&this._$Em!==r){const l=s.getPropertyOptions(r),a=typeof l.converter=="function"?{fromAttribute:l.converter}:((o=l.converter)==null?void 0:o.fromAttribute)!==void 0?l.converter:Ie;this._$Em=r,this[r]=a.fromAttribute(t,l.type)??((i=this._$Ej)==null?void 0:i.get(r))??null,this._$Em=null}}requestUpdate(e,t,s){var r;if(e!==void 0){const o=this.constructor,i=this[e];if(s??(s=o.getPropertyOptions(e)),!((s.hasChanged??At)(i,t)||s.useDefault&&s.reflect&&i===((r=this._$Ej)==null?void 0:r.get(e))&&!this.hasAttribute(o._$Eu(e,s))))return;this.C(e,t,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,t,{useDefault:s,reflect:r,wrapped:o},i){s&&!(this._$Ej??(this._$Ej=new Map)).has(e)&&(this._$Ej.set(e,i??t??this[e]),o!==!0||i!==void 0)||(this._$AL.has(e)||(this.hasUpdated||s||(t=void 0),this._$AL.set(e,t)),r===!0&&this._$Em!==e&&(this._$Eq??(this._$Eq=new Set)).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var s;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[o,i]of this._$Ep)this[o]=i;this._$Ep=void 0}const r=this.constructor.elementProperties;if(r.size>0)for(const[o,i]of r){const{wrapped:l}=i,a=this[o];l!==!0||this._$AL.has(o)||a===void 0||this.C(o,void 0,i,a)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),(s=this._$EO)==null||s.forEach(r=>{var o;return(o=r.hostUpdate)==null?void 0:o.call(r)}),this.update(t)):this._$EM()}catch(r){throw e=!1,this._$EM(),r}e&&this._$AE(t)}willUpdate(e){}_$AE(e){var t;(t=this._$EO)==null||t.forEach(s=>{var r;return(r=s.hostUpdated)==null?void 0:r.call(s)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&(this._$Eq=this._$Eq.forEach(t=>this._$ET(t,this[t]))),this._$EM()}updated(e){}firstUpdated(e){}};ee.elementStyles=[],ee.shadowRootOptions={mode:"open"},ee[be("elementProperties")]=new Map,ee[be("finalized")]=new Map,rt==null||rt({ReactiveElement:ee}),(R.reactiveElementVersions??(R.reactiveElementVersions=[])).push("2.1.0");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ve=globalThis,De=ve.trustedTypes,pr=De?De.createPolicy("lit-html",{createHTML:n=>n}):void 0,es="$lit$",T=`lit$${Math.random().toFixed(9).slice(2)}$`,ts="?"+T,In=`<${ts}>`,B=document,we=()=>B.createComment(""),xe=n=>n===null||typeof n!="object"&&typeof n!="function",St=Array.isArray,Dn=n=>St(n)||typeof(n==null?void 0:n[Symbol.iterator])=="function",st=`[ 	
\f\r]`,me=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,mr=/-->/g,fr=/>/g,D=RegExp(`>|${st}(?:([^\\s"'>=/]+)(${st}*=${st}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),gr=/'/g,br=/"/g,rs=/^(?:script|style|textarea|title)$/i,Ln=n=>(e,...t)=>({_$litType$:n,strings:e,values:t}),b=Ln(1),ae=Symbol.for("lit-noChange"),$=Symbol.for("lit-nothing"),vr=new WeakMap,z=B.createTreeWalker(B,129);function ss(n,e){if(!St(n)||!n.hasOwnProperty("raw"))throw Error("invalid template strings array");return pr!==void 0?pr.createHTML(e):e}const zn=(n,e)=>{const t=n.length-1,s=[];let r,o=e===2?"<svg>":e===3?"<math>":"",i=me;for(let l=0;l<t;l++){const a=n[l];let u,p,d=-1,c=0;for(;c<a.length&&(i.lastIndex=c,p=i.exec(a),p!==null);)c=i.lastIndex,i===me?p[1]==="!--"?i=mr:p[1]!==void 0?i=fr:p[2]!==void 0?(rs.test(p[2])&&(r=RegExp("</"+p[2],"g")),i=D):p[3]!==void 0&&(i=D):i===D?p[0]===">"?(i=r??me,d=-1):p[1]===void 0?d=-2:(d=i.lastIndex-p[2].length,u=p[1],i=p[3]===void 0?D:p[3]==='"'?br:gr):i===br||i===gr?i=D:i===mr||i===fr?i=me:(i=D,r=void 0);const h=i===D&&n[l+1].startsWith("/>")?" ":"";o+=i===me?a+In:d>=0?(s.push(u),a.slice(0,d)+es+a.slice(d)+T+h):a+T+(d===-2?l:h)}return[ss(n,o+(n[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),s]};class ke{constructor({strings:e,_$litType$:t},s){let r;this.parts=[];let o=0,i=0;const l=e.length-1,a=this.parts,[u,p]=zn(e,t);if(this.el=ke.createElement(u,s),z.currentNode=this.el.content,t===2||t===3){const d=this.el.content.firstChild;d.replaceWith(...d.childNodes)}for(;(r=z.nextNode())!==null&&a.length<l;){if(r.nodeType===1){if(r.hasAttributes())for(const d of r.getAttributeNames())if(d.endsWith(es)){const c=p[i++],h=r.getAttribute(d).split(T),m=/([.?@])?(.*)/.exec(c);a.push({type:1,index:o,name:m[2],strings:h,ctor:m[1]==="."?Fn:m[1]==="?"?qn:m[1]==="@"?Bn:Ve}),r.removeAttribute(d)}else d.startsWith(T)&&(a.push({type:6,index:o}),r.removeAttribute(d));if(rs.test(r.tagName)){const d=r.textContent.split(T),c=d.length-1;if(c>0){r.textContent=De?De.emptyScript:"";for(let h=0;h<c;h++)r.append(d[h],we()),z.nextNode(),a.push({type:2,index:++o});r.append(d[c],we())}}}else if(r.nodeType===8)if(r.data===ts)a.push({type:2,index:o});else{let d=-1;for(;(d=r.data.indexOf(T,d+1))!==-1;)a.push({type:7,index:o}),d+=T.length-1}o++}}static createElement(e,t){const s=B.createElement("template");return s.innerHTML=e,s}}function le(n,e,t=n,s){var i,l;if(e===ae)return e;let r=s!==void 0?(i=t._$Co)==null?void 0:i[s]:t._$Cl;const o=xe(e)?void 0:e._$litDirective$;return(r==null?void 0:r.constructor)!==o&&((l=r==null?void 0:r._$AO)==null||l.call(r,!1),o===void 0?r=void 0:(r=new o(n),r._$AT(n,t,s)),s!==void 0?(t._$Co??(t._$Co=[]))[s]=r:t._$Cl=r),r!==void 0&&(e=le(n,r._$AS(n,e.values),r,s)),e}class Hn{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:s}=this._$AD,r=((e==null?void 0:e.creationScope)??B).importNode(t,!0);z.currentNode=r;let o=z.nextNode(),i=0,l=0,a=s[0];for(;a!==void 0;){if(i===a.index){let u;a.type===2?u=new Pe(o,o.nextSibling,this,e):a.type===1?u=new a.ctor(o,a.name,a.strings,this,e):a.type===6&&(u=new Vn(o,this,e)),this._$AV.push(u),a=s[++l]}i!==(a==null?void 0:a.index)&&(o=z.nextNode(),i++)}return z.currentNode=B,r}p(e){let t=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(e,s,t),t+=s.strings.length-2):s._$AI(e[t])),t++}}class Pe{get _$AU(){var e;return((e=this._$AM)==null?void 0:e._$AU)??this._$Cv}constructor(e,t,s,r){this.type=2,this._$AH=$,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=s,this.options=r,this._$Cv=(r==null?void 0:r.isConnected)??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return t!==void 0&&(e==null?void 0:e.nodeType)===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=le(this,e,t),xe(e)?e===$||e==null||e===""?(this._$AH!==$&&this._$AR(),this._$AH=$):e!==this._$AH&&e!==ae&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):Dn(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==$&&xe(this._$AH)?this._$AA.nextSibling.data=e:this.T(B.createTextNode(e)),this._$AH=e}$(e){var o;const{values:t,_$litType$:s}=e,r=typeof s=="number"?this._$AC(e):(s.el===void 0&&(s.el=ke.createElement(ss(s.h,s.h[0]),this.options)),s);if(((o=this._$AH)==null?void 0:o._$AD)===r)this._$AH.p(t);else{const i=new Hn(r,this),l=i.u(this.options);i.p(t),this.T(l),this._$AH=i}}_$AC(e){let t=vr.get(e.strings);return t===void 0&&vr.set(e.strings,t=new ke(e)),t}k(e){St(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let s,r=0;for(const o of e)r===t.length?t.push(s=new Pe(this.O(we()),this.O(we()),this,this.options)):s=t[r],s._$AI(o),r++;r<t.length&&(this._$AR(s&&s._$AB.nextSibling,r),t.length=r)}_$AR(e=this._$AA.nextSibling,t){var s;for((s=this._$AP)==null?void 0:s.call(this,!1,!0,t);e&&e!==this._$AB;){const r=e.nextSibling;e.remove(),e=r}}setConnected(e){var t;this._$AM===void 0&&(this._$Cv=e,(t=this._$AP)==null||t.call(this,e))}}class Ve{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,s,r,o){this.type=1,this._$AH=$,this._$AN=void 0,this.element=e,this.name=t,this._$AM=r,this.options=o,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=$}_$AI(e,t=this,s,r){const o=this.strings;let i=!1;if(o===void 0)e=le(this,e,t,0),i=!xe(e)||e!==this._$AH&&e!==ae,i&&(this._$AH=e);else{const l=e;let a,u;for(e=o[0],a=0;a<o.length-1;a++)u=le(this,l[s+a],t,a),u===ae&&(u=this._$AH[a]),i||(i=!xe(u)||u!==this._$AH[a]),u===$?e=$:e!==$&&(e+=(u??"")+o[a+1]),this._$AH[a]=u}i&&!r&&this.j(e)}j(e){e===$?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class Fn extends Ve{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===$?void 0:e}}class qn extends Ve{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==$)}}class Bn extends Ve{constructor(e,t,s,r,o){super(e,t,s,r,o),this.type=5}_$AI(e,t=this){if((e=le(this,e,t,0)??$)===ae)return;const s=this._$AH,r=e===$&&s!==$||e.capture!==s.capture||e.once!==s.once||e.passive!==s.passive,o=e!==$&&(s===$||r);r&&this.element.removeEventListener(this.name,this,s),o&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){var t;typeof this._$AH=="function"?this._$AH.call(((t=this.options)==null?void 0:t.host)??this.element,e):this._$AH.handleEvent(e)}}class Vn{constructor(e,t,s){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(e){le(this,e)}}const nt=ve.litHtmlPolyfillSupport;nt==null||nt(ke,Pe),(ve.litHtmlVersions??(ve.litHtmlVersions=[])).push("3.3.0");const Gn=(n,e,t)=>{const s=(t==null?void 0:t.renderBefore)??e;let r=s._$litPart$;if(r===void 0){const o=(t==null?void 0:t.renderBefore)??null;s._$litPart$=r=new Pe(e.insertBefore(we(),o),o,void 0,t??{})}return r._$AI(n),r};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const F=globalThis;class C extends ee{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t;const e=super.createRenderRoot();return(t=this.renderOptions).renderBefore??(t.renderBefore=e.firstChild),e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=Gn(t,this.renderRoot,this.renderOptions)}connectedCallback(){var e;super.connectedCallback(),(e=this._$Do)==null||e.setConnected(!0)}disconnectedCallback(){var e;super.disconnectedCallback(),(e=this._$Do)==null||e.setConnected(!1)}render(){return ae}}var yr;C._$litElement$=!0,C.finalized=!0,(yr=F.litElementHydrateSupport)==null||yr.call(F,{LitElement:C});const ot=F.litElementPolyfillSupport;ot==null||ot({LitElement:C});(F.litElementVersions??(F.litElementVersions=[])).push("4.2.0");const Wn={songs:[],albums:[],genres:[]};function Yn(n,e,t){switch(n[0]){case"songs/load":Zn(t).then(r=>e(o=>({...o,songs:r})));break;case"songs/set":e(r=>({...r,songs:n[1].songs}));break;case"song/select":{const{songId:r}=n[1];e(o=>{const i=o.songs.find(l=>l._id===r);return{...o,selectedSong:i}});break}case"songs/add":{Jn(n[1],t).then(r=>e(o=>({...o,songs:[...o.songs,r]}))).then(()=>{var r,o;return(o=(r=n[1]).onSuccess)==null?void 0:o.call(r)}).catch(r=>{var o,i;return(i=(o=n[1]).onFailure)==null?void 0:i.call(o,r)});break}case"songs/save":{Kn(n[1],t).then(r=>e(o=>({...o,songs:o.songs.map(i=>i._id===r._id?r:i)}))).then(()=>{var r,o;return(o=(r=n[1]).onSuccess)==null?void 0:o.call(r)}).catch(r=>{var o,i;return(i=(o=n[1]).onFailure)==null?void 0:i.call(o,r)});break}case"genre/save":{Qn(n[1],t).then(r=>e(o=>({...o,genres:o.genres.map(i=>i._id===r._id?r:i)}))).then(()=>{var r,o;return(o=(r=n[1]).onSuccess)==null?void 0:o.call(r)}).catch(r=>{var o,i;return(i=(o=n[1]).onFailure)==null?void 0:i.call(o,r)});break}case"albums/load":fetch("/api/albums",{headers:M.headers(t)}).then(r=>r.json()).then(r=>e(o=>({...o,albums:r})));break;case"genres/load":fetch("/api/genres",{headers:M.headers(t)}).then(r=>r.json()).then(r=>e(o=>({...o,genres:r})));break;case"album/save":{Xn(n[1],t).then(r=>e(o=>({...o,albums:o.albums.map(i=>i._id===r._id?r:i)}))).then(()=>{var r,o;return(o=(r=n[1]).onSuccess)==null?void 0:o.call(r)}).catch(r=>{var o,i;return(i=(o=n[1]).onFailure)==null?void 0:i.call(o,r)});break}default:const s=n[0];throw new Error(`Unhandled message: ${s}`)}}function Jn(n,e){return fetch("/api/songs",{method:"POST",headers:{"Content-Type":"application/json",...M.headers(e)},body:JSON.stringify(n.song)}).then(t=>{if(t.status===201)return t.json();throw new Error("Failed to create new song")}).then(t=>t)}function Kn(n,e){return fetch(`/api/songs/${n.songId}`,{method:"PUT",headers:{"Content-Type":"application/json",...M.headers(e)},body:JSON.stringify(n.song)}).then(t=>{if(t.status===200)return t.json();throw new Error(`Failed to save song for ${n.songId}`)}).then(t=>t)}function Zn(n){const e=M.headers(n);return console.log("Auth headers:",e),fetch("/api/songs",{headers:e}).then(t=>{if(t.status===403)throw new Error("Forbidden - check token");return t.ok?t.json():[]}).then(t=>t)}function Qn(n,e){return fetch(`/api/genres/${n.genreId}`,{method:"PUT",headers:{"Content-Type":"application/json",...M.headers(e)},body:JSON.stringify(n.genre)}).then(t=>{if(t.status===200)return t.json();throw new Error(`Failed to save genre for ${n.genreId}`)}).then(t=>t)}function Xn(n,e){return fetch(`/api/albums/${n.albumId}`,{method:"PUT",headers:{"Content-Type":"application/json",...M.headers(e)},body:JSON.stringify(n.album)}).then(t=>{if(t.status===200)return t.json();throw new Error(`Failed to save album for ${n.albumId}`)}).then(t=>t)}const Ct=class Ct extends C{static initializeOnce(){}render(){return b`
      <header>
        <h1>🎵 Musica</h1>
        <slot name="actuator"></slot>
      </header>
    `}};Ct.styles=k`
    header {
      padding: 1rem 2rem;
      background: #fff;
      border-bottom: 1px solid #ccc;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-family: "Karla", sans-serif;
    }

    h1 {
      font-size: 1.5rem;
    }

    ::slotted(*) {
      margin-left: auto;
    }
  `;let Le=Ct;customElements.define("blazing-header",Le);/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ns=n=>(e,t)=>{t!==void 0?t.addInitializer(()=>{customElements.define(n,e)}):customElements.define(n,e)};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const eo={attribute:!0,type:String,converter:Ie,reflect:!1,hasChanged:At},to=(n=eo,e,t)=>{const{kind:s,metadata:r}=t;let o=globalThis.litPropertyMetadata.get(r);if(o===void 0&&globalThis.litPropertyMetadata.set(r,o=new Map),s==="setter"&&((n=Object.create(n)).wrapped=!0),o.set(t.name,n),s==="accessor"){const{name:i}=t;return{set(l){const a=e.get.call(this);e.set.call(this,l),this.requestUpdate(i,a,n)},init(l){return l!==void 0&&this.C(i,void 0,n,l),l}}}if(s==="setter"){const{name:i}=t;return function(l){const a=this[i];e.call(this,l),this.requestUpdate(i,a,n)}}throw Error("Unsupported decorator location: "+s)};function U(n){return(e,t)=>typeof t=="object"?to(n,e,t):((s,r,o)=>{const i=r.hasOwnProperty(o);return r.constructor.createProperty(o,s),i?Object.getOwnPropertyDescriptor(r,o):void 0})(n,e,t)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function w(n){return U({...n,state:!0,attribute:!1})}var ro=Object.defineProperty,Ge=(n,e,t,s)=>{for(var r=void 0,o=n.length-1,i;o>=0;o--)(i=n[o])&&(r=i(e,t,r)||r);return r&&ro(e,t,r),r};const Ot=class Ot extends C{constructor(){super(...arguments),this.formData={},this.redirect="/"}get canSubmit(){return!!(this.api&&this.formData.username&&this.formData.password)}render(){return b`
      <form
        @change=${e=>this.handleChange(e)}
        @submit=${e=>this.handleSubmit(e)}
      >
        <slot></slot>
        <slot name="button">
          <button type="submit" ?disabled=${!this.canSubmit}>Login</button>
        </slot>
        <p class="error">${this.error}</p>
      </form>
    `}handleChange(e){const t=e.target,s=t==null?void 0:t.name,r=t==null?void 0:t.value,o=this.formData;switch(s){case"username":this.formData={...o,username:r};break;case"password":this.formData={...o,password:r};break}}handleSubmit(e){e.preventDefault(),this.canSubmit&&fetch((this==null?void 0:this.api)||"",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(this.formData)}).then(t=>{if(t.status!==200)throw"Login failed";return t.json()}).then(t=>{const{token:s}=t,r=new CustomEvent("auth:message",{bubbles:!0,composed:!0,detail:["auth/signin",{token:s,redirect:this.redirect}]});console.log("dispatching message",r),this.dispatchEvent(new CustomEvent("auth:message",{bubbles:!0,composed:!0,detail:["auth/signin",{token:s,redirect:this.redirect}]}))}).catch(t=>{console.log(t),this.error=t.toString()})}};Ot.styles=k`
    :host {
      display: block;
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      max-width: 320px;
      margin: auto;
      padding: 1rem;
    }

    label {
      display: flex;
      flex-direction: column;
      font-weight: 600;
      font-size: 0.9rem;
      gap: 0.5rem;
    }

    input {
      padding: 0.5rem;
      border-radius: 0.25rem;
      border: 1px solid #ccc;
      font-size: 1rem;
    }

    button {
      background-color: var(--color-primary, #00449e);
      color: white;
      border: none;
      padding: 0.75rem;
      border-radius: 0.25rem;
      font-size: 1rem;
      cursor: pointer;
    }

    button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .error {
      color: var(--color-error, red);
      font-weight: bold;
      text-align: center;
    }
  `;let V=Ot;Ge([w()],V.prototype,"formData");Ge([U()],V.prototype,"api");Ge([U()],V.prototype,"redirect");Ge([w()],V.prototype,"error");customElements.define("login-form",V);var so=Object.getOwnPropertyDescriptor,no=(n,e,t,s)=>{for(var r=s>1?void 0:s?so(e,t):e,o=n.length-1,i;o>=0;o--)(i=n[o])&&(r=i(r)||r);return r};let dt=class extends C{render(){return b`
      <main>
        <h2>User Login</h2>
        <login-form api="/auth/login">
          <label>
            <span>Username:</span>
            <input name="username" autocomplete="off" />
          </label>
          <label>
            <span>Password:</span>
            <input type="password" name="password" />
          </label>
        </login-form>
        <p>
          Or did you want to
          <a href="/register">Sign up as a new user</a>?
        </p>
      </main>
    `}};dt.styles=k`
    main {
      max-width: 500px;
      margin: auto;
      padding: 2rem;
    }
    h2 {
      text-align: center;
    }
  `;dt=no([ns("login-view")],dt);var oo=Object.defineProperty,We=(n,e,t,s)=>{for(var r=void 0,o=n.length-1,i;o>=0;o--)(i=n[o])&&(r=i(e,t,r)||r);return r&&oo(e,t,r),r};const Tt=class Tt extends C{constructor(){super(...arguments),this.formData={},this.redirect="/"}get canSubmit(){return!!(this.api&&this.formData.username&&this.formData.password)}render(){return b`
      <form
        @change=${e=>this.handleChange(e)}
        @submit=${e=>this.handleSubmit(e)}
      >
        <slot></slot>
        <slot name="button">
          <button type="submit" ?disabled=${!this.canSubmit}>Register</button>
        </slot>
        <p class="error">${this.error}</p>
      </form>
    `}handleChange(e){const t=e.target,s=t==null?void 0:t.name,r=t==null?void 0:t.value,o=this.formData;switch(s){case"username":this.formData={...o,username:r};break;case"password":this.formData={...o,password:r};break}}handleSubmit(e){e.preventDefault(),this.canSubmit&&fetch((this==null?void 0:this.api)||"",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(this.formData)}).then(t=>{if(t.status!==201)throw"Registration failed";return t.json()}).then(t=>{const{token:s}=t;this.dispatchEvent(new CustomEvent("auth:message",{bubbles:!0,composed:!0,detail:["auth/signin",{token:s,redirect:this.redirect}]}))}).catch(t=>{this.error=t.toString()})}};Tt.styles=k`
    :host {
      display: block;
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      max-width: 320px;
      margin: auto;
      padding: 1rem;
    }

    label {
      display: flex;
      flex-direction: column;
      font-weight: 600;
      font-size: 0.9rem;
      gap: 0.5rem;
    }

    input {
      padding: 0.5rem;
      border-radius: 0.25rem;
      border: 1px solid #ccc;
      font-size: 1rem;
    }

    button {
      background-color: var(--color-primary, #00449e);
      color: white;
      border: none;
      padding: 0.75rem;
      border-radius: 0.25rem;
      font-size: 1rem;
      cursor: pointer;
    }

    button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .error {
      color: var(--color-error, red);
      font-weight: bold;
      text-align: center;
    }
  `;let G=Tt;We([w()],G.prototype,"formData");We([U()],G.prototype,"api");We([U()],G.prototype,"redirect");We([w()],G.prototype,"error");customElements.define("register-form",G);var io=Object.getOwnPropertyDescriptor,ao=(n,e,t,s)=>{for(var r=s>1?void 0:s?io(e,t):e,o=n.length-1,i;o>=0;o--)(i=n[o])&&(r=i(r)||r);return r};let ut=class extends C{render(){return b`
      <main>
        <h2>Register New Account</h2>
        <register-form api="/auth/register">
          <label>
            <span>Username:</span>
            <input name="username" autocomplete="off" />
          </label>
          <label>
            <span>Password:</span>
            <input type="password" name="password" />
          </label>
        </register-form>
        <p>
          Already have an account?
          <a href="/login">Back to login</a>
        </p>
      </main>
    `}};ut.styles=k`
    main {
      max-width: 500px;
      margin: auto;
      padding: 2rem;
    }
    h2 {
      text-align: center;
    }
  `;ut=ao([ns("register-view")],ut);var lo=Object.defineProperty,Et=(n,e,t,s)=>{for(var r=void 0,o=n.length-1,i;o>=0;o--)(i=n[o])&&(r=i(e,t,r)||r);return r&&lo(e,t,r),r};const Rt=class Rt extends E{constructor(){super("musica:model"),this.selectedAlbum="",this.selectedGenre="",this.songs=[],this.darkMode=localStorage.getItem("dark-mode")==="true"}connectedCallback(){super.connectedCallback(),this.dispatchMessage(["albums/load",{}]),this.dispatchMessage(["genres/load",{}])}async loadSongs(){try{const e=await fetch("/api/songs");if(!e.ok)throw new Error("Failed to fetch songs");this.songs=await e.json()}catch(e){console.error("Error loading songs:",e)}}logout(){localStorage.removeItem("token");const e=new CustomEvent("auth:message",{bubbles:!0,composed:!0,detail:["auth/signout",{redirect:"/login"}]});this.dispatchEvent(e)}toggleDarkMode(e){const t=e.target.checked;this.darkMode=t,document.body.classList.toggle("dark-mode",t),localStorage.setItem("dark-mode",String(t))}render(){var e,t;return this.model.albums,this.model.genres,b`
      <div class="container">
        <h2>Add New Song</h2>
        <form @submit=${this.addSong}>
          <input type="text" name="title" placeholder="Title" required />
          <input type="text" name="artist" placeholder="Artist" required />

          <select name="album">
            <option value="">Select Album (optional)</option>
            ${(e=this.model.albums)==null?void 0:e.map(s=>b`<option value=${s.name}>${s.name}</option>`)}
          </select>

          <select name="genre">
            <option value="">Select Genre (optional)</option>
            ${(t=this.model.genres)==null?void 0:t.map(s=>b`<option value=${s.name}>${s.name}</option>`)}
          </select>

          <input type="url" name="url" placeholder="Song URL (optional)" />
          <button type="submit">Add Song</button>
        </form>
        <p class="back-link"><a href="/app/songs">&#8592; Back to Songs</a></p>
      </div>
    `}addSong(e){var o,i,l,a,u,p;e.preventDefault();const t=e.target,s=new FormData(t),r={title:((o=s.get("title"))==null?void 0:o.toString())||"",artist:((i=s.get("artist"))==null?void 0:i.toString())||"",album:((l=s.get("album"))==null?void 0:l.toString())||"",genre:((a=s.get("genre"))==null?void 0:a.toString())||"",url:((u=s.get("url"))==null?void 0:u.toString())||"",cover:((p=s.get("cover"))==null?void 0:p.toString())||""};this.dispatchMessage(["songs/add",{song:r,onSuccess:()=>history.back()}])}};Rt.styles=k`
    .container {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 4rem 1rem;
    }

    h2 {
      font-size: 2rem;
      margin-bottom: 2rem;
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      width: 150%;
      max-width: 400px;
      background: var(--color-card-bg, white);
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    input[type="text"],
    input[type="url"] {
      padding: 0.9rem 1.2rem;
      font-size: 1.1rem;
      border: 1px solid #ccc;
      border-radius: 8px;
      background: white;
    }

    select[name="album"],
    select[name="genre"] {
      padding: 0.75rem 1rem;
      font-size: 1rem;
      border: 1px solid #ccc;
      border-radius: 8px;
      background: white;
      appearance: none;
      -webkit-appearance: none;
      -moz-appearance: none;
      background-image: url('data:image/svg+xml;utf8,<svg fill="none" stroke="%23666" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M6 9l6 6 6-6"/></svg>');
      background-repeat: no-repeat;
      background-position: right 1rem center;
      background-size: 1em;
      cursor: pointer;
    }

    input[type="text"]:focus,
    input[type="url"]:focus,
    select[name="album"]:focus,
    select[name="genre"]:focus {
      border-color: var(--color-primary, #00449e);
      outline: none;
    }

    button {
      padding: 0.75rem;
      font-size: 1rem;
      background-color: var(--color-primary, #00449e);
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
    }

    button:hover {
      background-color: var(--color-primary-hover, #00307d);
    }

    .back-link {
      margin-top: 1rem;
      font-size: 0.95rem;
    }

    .back-link a {
      color: var(--color-link, #00449e);
      text-decoration: none;
    }

    .back-link a:hover {
      text-decoration: underline;
    }
  `;let ce=Rt;Et([w()],ce.prototype,"selectedAlbum");Et([w()],ce.prototype,"selectedGenre");Et([w()],ce.prototype,"songs");Y({"song-add":ce});var co=Object.defineProperty,ho=(n,e,t,s)=>{for(var r=void 0,o=n.length-1,i;o>=0;o--)(i=n[o])&&(r=i(e,t,r)||r);return r&&co(e,t,r),r};const Mt=class Mt extends E{constructor(){super("musica:model"),this.songId=""}render(){const e=this.model.songs.find(r=>r._id===this.songId),t=this.model.albums||[],s=this.model.genres||[];return b`
      <div class="container">
        <h2>Edit Song</h2>
        <form @submit=${this.save}>
          <input
            type="text"
            name="title"
            .value=${(e==null?void 0:e.title)||""}
            placeholder="Song title"
            required
          />
          <input
            type="text"
            name="artist"
            .value=${(e==null?void 0:e.artist)||""}
            placeholder="Artist"
            required
          />
          <select name="album">
            ${t.map(r=>b`<option
                value=${r.name}
                ?selected=${(e==null?void 0:e.album)===r.name}
              >
                ${r.name}
              </option>`)}
          </select>
          <select name="genre">
            ${s.map(r=>b`<option
                value=${r.name}
                ?selected=${(e==null?void 0:e.genre)===r.name}
              >
                ${r.name}
              </option>`)}
          </select>
          <input
            type="number"
            name="year"
            .value=${(e==null?void 0:e.year)||""}
            placeholder="Year"
          />
          <input
            type="text"
            name="url"
            .value=${(e==null?void 0:e.url)||""}
            placeholder="Audio URL"
          />
          <button type="submit">Save</button>
        </form>
        <p><a href="/app/songs">← Back to Songs</a></p>
      </div>
    `}save(e){var o,i,l,a,u;e.preventDefault();const t=e.target,s=new FormData(t),r={...this.model.songs.find(p=>p._id===this.songId),title:((o=s.get("title"))==null?void 0:o.toString())??"",artist:((i=s.get("artist"))==null?void 0:i.toString())??"",album:((l=s.get("album"))==null?void 0:l.toString())??"",genre:((a=s.get("genre"))==null?void 0:a.toString())??"",year:Number(s.get("year"))||void 0,url:((u=s.get("url"))==null?void 0:u.toString())??""};this.dispatchMessage(["songs/save",{songId:this.songId,song:r,onSuccess:()=>history.back()}])}};Mt.styles=k`
    .container {
      padding: 1rem;
    }
    form {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      max-width: 400px;
    }
    input,
    select,
    button {
      padding: 0.5rem;
      font-size: 1rem;
    }
  `;let ze=Mt;ho([U({attribute:"song-id"})],ze.prototype,"songId");Y({"song-edit":ze});var uo=Object.defineProperty,Pt=(n,e,t,s)=>{for(var r=void 0,o=n.length-1,i;o>=0;o--)(i=n[o])&&(r=i(e,t,r)||r);return r&&uo(e,t,r),r};const Ut=class Ut extends E{constructor(){super("musica:model"),this.selectedAlbum="",this.selectedGenre="",this.darkMode=localStorage.getItem("dark-mode")==="true"}get songs(){return this.model.songs.filter(e=>(!this.selectedAlbum||e.album===this.selectedAlbum)&&(!this.selectedGenre||e.genre===this.selectedGenre))}connectedCallback(){super.connectedCallback(),this.dispatchMessage(["songs/load",{}]),this.dispatchMessage(["albums/load",{}]),this.dispatchMessage(["genres/load",{}])}logout(){localStorage.removeItem("token");const e=new CustomEvent("auth:message",{bubbles:!0,composed:!0,detail:["auth/signout",{redirect:"/login"}]});this.dispatchEvent(e)}toggleDarkMode(e){const t=e.target.checked;this.darkMode=t,document.body.classList.toggle("dark-mode",t),localStorage.setItem("dark-mode",String(t))}async deleteSong(e){if(confirm("Are you sure you want to delete this song?"))try{if(!(await fetch(`/api/songs/${e}`,{method:"DELETE"})).ok)throw new Error("Failed to delete song");this.dispatchMessage(["songs/load",{}])}catch(t){console.error("Delete error:",t)}}render(){var e,t;return b`
      <div class="navbar">
        <div class="navbar-wrapper">
          <strong>Welcome to Musica</strong>
          <div class="nav-links">
            <a href="/app/songs">
              <button>Songs</button>
            </a>
            <a href="/app/genres">
              <button>Genres</button>
            </a>
            <a href="/app/albums">
              <button>Albums</button>
            </a>

            <a href="/logout">
              <button>Logout</button>
            </a>

            <label class="toggle-label">
              <input
                type="checkbox"
                class="toggle-input"
                autocomplete="off"
                .checked=${this.darkMode}
                @change=${s=>this.toggleDarkMode(s)}
              />
              <span class="toggle-slider">Dark Mode</span>
            </label>
          </div>
        </div>
      </div>

      <div class="container">
        <h2>Song List</h2>

        <div class="filter-bar">
          <select
            @change=${s=>this.selectedAlbum=s.target.value}
          >
            <option value="">All Albums</option>
            ${(e=this.model.albums)==null?void 0:e.map(s=>b`<option
                  value=${s.name}
                  ?selected=${s.name===this.selectedAlbum}
                >
                  ${s.name}
                </option>`)}
          </select>

          <select
            @change=${s=>this.selectedGenre=s.target.value}
          >
            <option value="">All Genres</option>
            ${(t=this.model.genres)==null?void 0:t.map(s=>b`<option
                  value=${s.name}
                  ?selected=${s.name===this.selectedGenre}
                >
                  ${s.name}
                </option>`)}
          </select>

          <a href="/app/songs/add">
            <button>Add Song</button>
          </a>
        </div>

        <div class="grid">
          ${this.songs.map(s=>b`
              <div class="card">
                <div class="info">
                  <div class="title">${s.title}</div>
                  <div class="artist">${s.artist}</div>
                </div>
                <div class="button-row">
                  <a href=${`/app/songs/edit/${s._id}`}>
                    <button class="edit-btn">Edit</button>
                  </a>

                  <button
                    class="delete-btn"
                    @click=${()=>this.deleteSong(s._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            `)}
        </div>
      </div>
    `}};Ut.styles=k`
    .navbar {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      background-color: #004d40;
      color: white;
      padding: 1rem 2rem;
      z-index: 1000;
    }

    .navbar-wrapper {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      max-width: 1450px;
      padding-left: 0;
      padding-right: 0;
    }

    .nav-links {
      display: flex;
      gap: 1.25rem;
    }

    .nav-links button {
      background-color: white;
      color: #004d40;
      border: none;
      border-radius: 6px;
      padding: 0.5rem 1rem;
      cursor: pointer;
      font-weight: bold;
      min-width: 130px;
    }

    .nav-links button:hover {
      background-color: #dcedc8;
    }

    button {
      padding: 0.5rem 1rem;
      background-color: var(--color-primary, #00449e);
      color: white;
      border: none;
      border-radius: 0.25rem;
      font-size: 1rem;
      cursor: pointer;
    }

    .container {
      max-width: 800px;
      margin: 6rem auto 2rem;
      padding: 1rem;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    h2 {
      font-size: 1.8rem;
      margin-bottom: 1.5rem;
      text-align: center;
    }

    .filter-bar {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 1rem;
      margin-bottom: 2rem;
    }

    select {
      padding: 0.5rem;
      font-size: 1rem;
    }

    .card {
      background: var(--color-card-bg);
      color: var(--color-card-text);
      border-radius: 12px;
      padding: 1rem;
      width: 260px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      transition: transform 0.2s ease;
    }

    .card:hover {
      transform: translateY(-4px);
    }

    .cover {
      width: 100px;
      height: 100px;
      object-fit: cover;
      border-radius: 8px;
    }

    .info {
      text-align: center;
    }

    .title {
      font-weight: bold;
      font-size: 1.2rem;
      margin-bottom: 0.25rem;
    }

    .artist {
      font-size: 0.95rem;
      color: #666;
    }

    .grid {
      display: flex;
      flex-wrap: wrap;
      gap: 1.5rem;
      justify-content: center;
    }

    .button-row {
      display: flex;
      gap: 0.5rem;
    }

    .edit-btn {
      padding: 0.4rem 1rem;
      font-size: 0.9rem;
      background-color: #888;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      min-width: 70px;
    }

    .delete-btn {
      padding: 0.4rem 1rem;
      font-size: 0.9rem;
      background-color: red;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      min-width: 70px;
    }

    .edit-btn:hover,
    .delete-btn:hover {
      background-color: #666;
    }

    #dark-mode-toggle {
      position: fixed;
      top: 1rem;
      right: 6rem;
      z-index: 2000;
      font-size: 0.9rem;
      background-color: rgba(255, 255, 255, 0.85);
      padding: 0.3rem 0.6rem;
      border-radius: 6px;
      color: #222;
    }

    body.dark-mode #dark-mode-toggle {
      background-color: rgba(0, 0, 0, 0.7);
      color: white;
    }

    body.dark-mode {
      --color-card-bg: #1e1e1e;
      --color-card-text: #f1f1f1;
      --color-primary: #bb86fc;
      --color-primary-hover: #985eff;
      background-color: #121212;
      color: white;
    }

    body.dark-mode .navbar {
      background-color: #222;
    }

    body.dark-mode .nav-links button {
      background-color: #333;
      color: white;
    }

    body.dark-mode .nav-links button:hover {
      background-color: #444;
    }

    body.dark-mode button {
      background-color: var(--color-primary);
    }

    body.dark-mode button:hover {
      background-color: var(--color-primary-hover);
    }

    .toggle-container {
      margin-top: 5.5rem;
      display: flex;
      justify-content: flex-end;
      width: 100%;
      max-width: 1200px;
      padding: 0 2rem;
    }

    .toggle-label {
      font-size: 0.95rem;
      background-color: rgba(255, 255, 255, 0.85);
      padding: 0.3rem 0.6rem;
      border-radius: 6px;
      color: #222;
    }

    body.dark-mode .toggle-label {
      background-color: rgba(0, 0, 0, 0.7);
      color: white;
    }
  `;let he=Ut;Pt([w()],he.prototype,"selectedAlbum");Pt([w()],he.prototype,"selectedGenre");Pt([w()],he.prototype,"darkMode");customElements.define("songs-view",he);var po=Object.defineProperty,os=(n,e,t,s)=>{for(var r=void 0,o=n.length-1,i;o>=0;o--)(i=n[o])&&(r=i(e,t,r)||r);return r&&po(e,t,r),r};const Nt=class Nt extends E{constructor(){super("musica:model"),this.albums=[],this.darkMode=localStorage.getItem("dark-mode")==="true"}connectedCallback(){super.connectedCallback(),this.loadAlbums()}toggleDarkMode(e){const t=e.target.checked;this.darkMode=t,document.body.classList.toggle("dark-mode",t),localStorage.setItem("dark-mode",String(t))}async loadAlbums(){try{const e=await fetch("/api/albums");if(!e.ok)throw new Error("Failed to load albums");this.albums=await e.json()}catch(e){console.error("Error fetching albums:",e)}}async deleteAlbum(e){if(confirm("Are you sure you want to delete this album?"))try{if(!(await fetch(`/api/albums/${e}`,{method:"DELETE"})).ok)throw new Error("Failed to delete");this.loadAlbums()}catch(t){console.error("Delete error:",t)}}render(){return b`
      <div class="navbar">
        <div class="navbar-wrapper">
          <strong>Welcome to Musica</strong>
          <div class="nav-links">
            <a href="/app/songs">
              <button>Songs</button>
            </a>
            <a href="/app/genres">
              <button>Genres</button>
            </a>
            <a href="/app/albums">
              <button>Albums</button>
            </a>
            <a href="/logout">
              <button>Logout</button>
            </a>

            <label class="toggle-label">
              <input
                type="checkbox"
                class="toggle-input"
                autocomplete="off"
                .checked=${this.darkMode}
                @change=${e=>this.toggleDarkMode(e)}
              />
              <span class="toggle-slider">Dark Mode</span>
            </label>
          </div>
        </div>
      </div>

      <div class="container">
        <h2>Albums</h2>

        <div class="top-buttons">
          <a href="/app/albums/add"><button>Add Album</button></a>
          <button @click=${()=>alert("Select an album to delete below.")}>
            Delete Album
          </button>
        </div>

        <div class="album-list">
          ${this.albums.map(e=>b`
              <div class="album-card">
                <img
                  class="cover"
                  src=${e.cover||"/images/default.jpeg"}
                  alt="Cover for ${e.name}"
                />
                <div class="title">${e.name}</div>
                <div class="artist">${e.artist||"Unknown Artist"}</div>
                <div class="button-row">
                  <a href=${`/app/albums/edit/${e._id}`}>
                    <button class="edit-btn">Edit</button>
                  </a>

                  <button
                    class="delete-btn"
                    @click=${()=>this.deleteAlbum(e._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            `)}
        </div>
      </div>
    `}};Nt.styles=k`
    .navbar {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      background-color: #004d40;
      color: white;
      padding: 1rem 2rem;
      z-index: 1000;
    }

    .navbar-wrapper {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      max-width: 1450px;
      padding-left: 0;
      padding-right: 0;
    }

    .nav-links {
      display: flex;
      gap: 1.25rem;
    }

    .nav-links button {
      background-color: white;
      color: #004d40;
      border: none;
      border-radius: 6px;
      padding: 0.5rem 1rem;
      cursor: pointer;
      font-weight: bold;
    }

    .nav-links button:hover {
      background-color: #dcedc8;
    }

    .toggle-label {
      font-size: 0.95rem;
      background-color: rgba(255, 255, 255, 0.85);
      padding: 0.3rem 0.6rem;
      border-radius: 6px;
      color: #222;
    }

    body.dark-mode .toggle-label {
      background-color: rgba(0, 0, 0, 0.7);
      color: white;
    }

    .container {
      padding: 4rem 1rem;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    h2 {
      font-size: 2rem;
      margin-bottom: 2rem;
    }

    button {
      padding: 0.75rem 1.25rem;
      background-color: var(--color-primary, #00449e);
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      cursor: pointer;
      min-width: 130px;
    }

    button:hover {
      background-color: var(--color-primary-hover, #00307d);
    }

    .edit-btn {
      padding: 0.4rem 1rem;
      font-size: 0.9rem;
      background-color: #888;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      min-width: 70px;
    }

    .delete-btn {
      padding: 0.4rem 1rem;
      font-size: 0.9rem;
      background-color: red;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      min-width: 70px;
    }

    .edit-btn:hover,
    .delete-btn:hover {
      background-color: #666;
    }

    .button-row {
      display: flex;
      justify-content: center;
      gap: 0.5rem;
      margin-top: 0.5rem;
    }

    .top-buttons {
      display: flex;
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .album-list {
      display: flex;
      flex-wrap: wrap;
      gap: 1.5rem;
      justify-content: center;
      margin-top: 1rem;
    }

    .album-card {
      background: var(--color-card-bg, white);
      color: var(--color-card-text, #000);
      padding: 1rem 1.25rem;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      min-width: 240px;
      text-align: center;
    }

    .cover {
      width: 100%;
      max-width: 180px;
      border-radius: 8px;
      margin-bottom: 1rem;
    }

    .title {
      font-size: 1.2rem;
      font-weight: bold;
    }

    .artist {
      font-size: 0.95rem;
      color: #555;
    }
  `;let Ae=Nt;os([w()],Ae.prototype,"albums");os([w()],Ae.prototype,"darkMode");customElements.define("album-view",Ae);const jt=class jt extends E{constructor(){super("musica:model")}render(){return b`
      <div class="container">
        <h2>Add Album</h2>
        <form @submit=${this.save}>
          <input name="name" placeholder="Album Name" required />
          <input name="artist" placeholder="Artist" required />
          <input name="year" type="number" placeholder="Year" required />
          <input name="genre" placeholder="Genre (optional)" />
          <input name="cover" type="file" accept="image/*" />
          <button type="submit">Add</button>
        </form>

        <!-- Hidden redirect link -->
        <a id="redirectLink" href="/app/albums" class="hidden-link">Go to Albums</a>

        <p class="back-link">
          <a href="/app/albums">&#8592; Back to Albums</a>
        </p>
      </div>
    `}save(e){e.preventDefault();const t=e.target,s=new FormData(t);fetch("/api/albums",{method:"POST",body:s}).then(r=>{if(!r.ok)throw new Error("Failed to add album");const o=this.renderRoot.querySelector("#redirectLink");o&&o.click()}).catch(console.error)}};jt.styles=k`
    .container {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 4rem 1rem;
    }

    h2 {
      font-size: 2rem;
      margin-bottom: 2rem;
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      width: 100%;
      max-width: 400px;
      background: var(--color-card-bg, white);
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    input {
      padding: 0.75rem;
      font-size: 1rem;
      border: 1px solid #ccc;
      border-radius: 8px;
      background: white;
    }

    button {
      padding: 0.75rem;
      font-size: 1rem;
      background-color: var(--color-primary, #00449e);
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
    }

    button:hover {
      background-color: var(--color-primary-hover, #00307d);
    }

    .back-link {
      margin-top: 1rem;
      font-size: 0.95rem;
    }

    .back-link a {
      color: var(--color-link, #00449e);
      text-decoration: none;
    }

    .back-link a:hover {
      text-decoration: underline;
    }

    a.hidden-link {
      display: none;
    }
  `;let pt=jt;Y({"album-add":pt});var mo=Object.defineProperty,fo=(n,e,t,s)=>{for(var r=void 0,o=n.length-1,i;o>=0;o--)(i=n[o])&&(r=i(e,t,r)||r);return r&&mo(e,t,r),r};const It=class It extends E{constructor(){super("musica:model"),this.albumId=""}render(){var t;const e=(t=this.model.albums)==null?void 0:t.find(s=>s._id===this.albumId);return b`
      <div class="container">
        <h2>Edit Album</h2>
        <form @submit=${this.save}>
          <input
            type="text"
            name="name"
            .value=${(e==null?void 0:e.name)||""}
            placeholder="Album name"
            required
          />
          <button type="submit">Save</button>
        </form>
        <p><a href="/app/albums">← Back to Albums</a></p>
      </div>
    `}save(e){var o,i;e.preventDefault();const t=e.target,s=new FormData(t),r={...(o=this.model.albums)==null?void 0:o.find(l=>l._id===this.albumId),name:((i=s.get("name"))==null?void 0:i.toString())??""};this.dispatchMessage(["album/save",{albumId:this.albumId,album:r,onSuccess:()=>history.back()}])}};It.styles=k`
    .container {
      padding: 1rem;
    }
    form {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      max-width: 400px;
    }
    input,
    button {
      padding: 0.5rem;
      font-size: 1rem;
    }
  `;let He=It;fo([U({attribute:"album-id"})],He.prototype,"albumId");Y({"album-edit":He});var go=Object.defineProperty,Ye=(n,e,t,s)=>{for(var r=void 0,o=n.length-1,i;o>=0;o--)(i=n[o])&&(r=i(e,t,r)||r);return r&&go(e,t,r),r};const Dt=class Dt extends E{constructor(){super("musica:model"),this.genres=[],this.songs=[],this.albums=[],this.darkMode=localStorage.getItem("dark-mode")==="true"}connectedCallback(){super.connectedCallback(),this.loadGenres(),this.loadSongs(),this.loadAlbums()}toggleDarkMode(e){const t=e.target.checked;this.darkMode=t,document.body.classList.toggle("dark-mode",t),localStorage.setItem("dark-mode",String(t))}async loadGenres(){try{const e=await fetch("/api/genres");if(!e.ok)throw new Error("Failed to fetch genres");this.genres=await e.json()}catch(e){console.error("Error loading genres:",e)}}async loadSongs(){try{const e=await fetch("/api/songs");if(!e.ok)throw new Error("Failed to fetch songs");this.songs=await e.json()}catch(e){console.error("Error loading songs:",e)}}async loadAlbums(){try{const e=await fetch("/api/albums");if(!e.ok)throw new Error("Failed to fetch albums");this.albums=await e.json()}catch(e){console.error("Error loading albums:",e)}}getSongCountForGenre(e){return this.songs.filter(t=>t.genre===e).length}getAlbumCountForGenre(e){return this.albums.filter(t=>t.genre===e).length}async deleteGenre(e){if(confirm("Are you sure you want to delete this genre?"))try{if(!(await fetch(`/api/genres/${e}`,{method:"DELETE"})).ok)throw new Error("Failed to delete genre");this.loadGenres()}catch(t){console.error("Delete error:",t)}}render(){return b`
      <div class="navbar">
        <div class="navbar-wrapper">
          <strong>Welcome to Musica</strong>
          <div class="nav-links">
            <a href="/app/songs">
              <button>Songs</button>
            </a>
            <a href="/app/genres">
              <button>Genres</button>
            </a>
            <a href="/app/albums">
              <button>Albums</button>
            </a>
            <a href="/logout">
              <button>Logout</button>
            </a>

            <label class="toggle-label">
              <input
                type="checkbox"
                class="toggle-input"
                autocomplete="off"
                .checked=${this.darkMode}
                @change=${e=>this.toggleDarkMode(e)}
              />
              <span class="toggle-slider">Dark Mode</span>
            </label>
          </div>
        </div>
      </div>

      <div class="container">
        <h2>Genres</h2>

        <div class="top-buttons">
          <a href="/app/genres/add"><button>Add Genre</button></a>
          <button @click=${()=>alert("Select a genre to delete below.")}>
            Delete Genre
          </button>
        </div>

        <div class="genre-list">
          ${this.genres.map(e=>b`
              <div class="genre-card">
                <div class="genre-title">${e.name}</div>
                <div class="genre-meta">
                  ${e.description?b`<p>${e.description}</p>`:""}
                  <p>${this.getSongCountForGenre(e.name)} song(s)</p>
                  <p>${this.getAlbumCountForGenre(e.name)} album(s)</p>
                </div>
                <div class="button-row">
                  <a href=${`/app/genres/edit/${e._id}`}>
                    <button class="edit-btn">Edit</button>
                  </a>

                  <button
                    class="delete-btn"
                    @click=${()=>this.deleteGenre(e._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            `)}
        </div>
      </div>
    `}};Dt.styles=k`
    .navbar {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      background-color: #004d40;
      color: white;
      padding: 1rem 2rem;
      z-index: 1000;
    }

    .navbar-wrapper {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      max-width: 1450px;
      padding-left: 0;
      padding-right: 0;
    }

    .nav-links {
      display: flex;
      gap: 1.25rem;
    }

    .nav-links button {
      background-color: white;
      color: #004d40;
      border: none;
      border-radius: 6px;
      padding: 0.5rem 1rem;
      cursor: pointer;
      font-weight: bold;
    }

    .nav-links button:hover {
      background-color: #dcedc8;
    }

    .toggle-label {
      font-size: 0.95rem;
      background-color: rgba(255, 255, 255, 0.85);
      padding: 0.3rem 0.6rem;
      border-radius: 6px;
      color: #222;
    }

    body.dark-mode .toggle-label {
      background-color: rgba(0, 0, 0, 0.7);
      color: white;
    }

    .container {
      padding: 4rem 1rem;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    h2 {
      font-size: 2rem;
      margin-bottom: 2rem;
    }

    .top-buttons {
      display: flex;
      gap: 1rem;
      margin-bottom: 2rem;
    }

    button {
      padding: 0.75rem 1.25rem;
      background-color: var(--color-primary, #00449e);
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      cursor: pointer;
      min-width: 130px;
    }

    button:hover {
      background-color: var(--color-primary-hover, #00307d);
    }

    .genre-list {
      display: flex;
      flex-wrap: wrap;
      gap: 1.5rem;
      justify-content: center;
      margin-top: 1rem;
    }

    .genre-card {
      background: var(--color-card-bg, white);
      color: var(--color-card-text, #000);
      padding: 1rem 1.25rem;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      min-width: 240px;
      text-align: center;
    }

    .genre-title {
      font-size: 1.2rem;
      font-weight: bold;
      margin-bottom: 0.5rem;
    }

    .genre-meta {
      font-size: 0.9rem;
      color: #555;
      margin-bottom: 0.5rem;
    }

    .button-row {
      display: flex;
      justify-content: center;
      gap: 0.5rem;
      margin-top: 0.5rem;
    }

    .edit-btn {
      padding: 0.4rem 1rem;
      font-size: 0.9rem;
      background-color: #888;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      min-width: 70px;
    }

    .delete-btn {
      padding: 0.4rem 1rem;
      font-size: 0.9rem;
      background-color: red;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      min-width: 70px;
    }

    .edit-btn:hover,
    .delete-btn:hover {
      background-color: #666;
    }
  `;let W=Dt;Ye([w()],W.prototype,"genres");Ye([w()],W.prototype,"songs");Ye([w()],W.prototype,"albums");Ye([w()],W.prototype,"darkMode");customElements.define("genre-view",W);const Lt=class Lt extends E{constructor(){super("musica:model")}render(){return b`
      <div class="container">
        <h2>Add Genre</h2>
        <form @submit=${this.save}>
          <input name="name" placeholder="Genre Name" required />
          <button type="submit">Add</button>
        </form>
        <p class="back-link"><a href="/app/genres">&#8592; Back to Genres</a></p>
      </div>
    `}save(e){e.preventDefault();const t=e.target,s=Object.fromEntries(new FormData(t));fetch("/api/genres",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(s)}).then(r=>{if(!r.ok)throw new Error("Failed to add genre");history.back()}).catch(console.error)}};Lt.styles=k`
    .container {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 4rem 1rem;
    }

    h2 {
      font-size: 2rem;
      margin-bottom: 2rem;
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      width: 100%;
      max-width: 400px;
      background: var(--color-card-bg, white);
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    input {
      padding: 0.75rem;
      font-size: 1rem;
      border: 1px solid #ccc;
      border-radius: 8px;
      background: white;
    }

    button {
      padding: 0.75rem;
      font-size: 1rem;
      background-color: var(--color-primary, #00449e);
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
    }

    button:hover {
      background-color: var(--color-primary-hover, #00307d);
    }

    .back-link {
      margin-top: 1rem;
      font-size: 0.95rem;
    }

    .back-link a {
      color: var(--color-link, #00449e);
      text-decoration: none;
    }

    .back-link a:hover {
      text-decoration: underline;
    }
  `;let mt=Lt;Y({"genre-add":mt});var bo=Object.defineProperty,vo=(n,e,t,s)=>{for(var r=void 0,o=n.length-1,i;o>=0;o--)(i=n[o])&&(r=i(e,t,r)||r);return r&&bo(e,t,r),r};const zt=class zt extends E{constructor(){super("musica:model"),this.genreId=""}render(){var t;const e=(t=this.model.genres)==null?void 0:t.find(s=>s._id===this.genreId);return b`
      <div class="container">
        <h2>Edit Genre</h2>
        <form @submit=${this.save}>
          <input
            type="text"
            name="name"
            .value=${(e==null?void 0:e.name)||""}
            placeholder="Genre name"
            required
          />
          <button type="submit">Save</button>
        </form>
        <p><a href="/app/genres">← Back to Genres</a></p>
      </div>
    `}save(e){var o,i;e.preventDefault();const t=e.target,s=new FormData(t),r={...(o=this.model.genres)==null?void 0:o.find(l=>l._id===this.genreId),name:((i=s.get("name"))==null?void 0:i.toString())??""};this.dispatchMessage(["genre/save",{genreId:this.genreId,genre:r,onSuccess:()=>history.back()}])}};zt.styles=k`
    .container {
      padding: 1rem;
    }
    form {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      max-width: 400px;
    }
    input,
    button {
      padding: 0.5rem;
      font-size: 1rem;
    }
  `;let Fe=zt;vo([U({attribute:"genre-id"})],Fe.prototype,"genreId");Y({"genre-edit":Fe});const yo=[{path:"/app/songs",view:()=>b`<songs-view></songs-view>`},{path:"/app/songs/add",view:()=>b`<song-add></song-add>`},{path:"/app/songs/:songId/edit",view:n=>b`<song-edit song-id=${n.songId}></song-edit>`},{path:"/app/genres",view:()=>b`<genre-view></genre-view>`},{path:"/app/genres/add",view:()=>b`<genre-add></genre-add>`},{path:"/app/genre/:genreId/edit",view:n=>b`<genre-edit genre-id=${n.genreId}></genre-edit>`},{path:"/app/albums",view:()=>b`<album-view></album-view>`},{path:"/app/albums/add",view:()=>b`<album-add></album-add>`},{path:"/app/album/:albumId/edit",view:n=>b`<album-edit album-id=${n.albumId}></album-edit>`},{path:"/login",view:()=>b`<login-view></login-view>`},{path:"/register",view:()=>b`<register-view></register-view>`},{path:"/",redirect:"/app/songs"},{path:"*",redirect:"/app/songs"}];Y({"mu-auth":M.Provider,"mu-history":Cs.Provider,"mu-store":class extends Rs.Provider{constructor(){super(Yn,Wn,"musica:auth")}},"mu-switch":class extends wn.Element{constructor(){super(yo,"musica:history","musica:auth")}},"blazing-header":Le});
