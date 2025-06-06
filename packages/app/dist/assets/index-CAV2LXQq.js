(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))s(r);new MutationObserver(r=>{for(const o of r)if(o.type==="childList")for(const n of o.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&s(n)}).observe(document,{childList:!0,subtree:!0});function e(r){const o={};return r.integrity&&(o.integrity=r.integrity),r.referrerPolicy&&(o.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?o.credentials="include":r.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function s(r){if(r.ep)return;r.ep=!0;const o=e(r);fetch(r.href,o)}})();const gs=document.querySelector("#dark-mode-toggle input");gs.addEventListener("change",i=>{const t=i.target.checked,e=new CustomEvent("darkmode:toggle",{bubbles:!0,detail:{dark:t}});document.body.dispatchEvent(e)});document.body.addEventListener("darkmode:toggle",i=>{document.body.classList.toggle("dark-mode",i.detail.dark)});var Z,We;class mt extends Error{}mt.prototype.name="InvalidTokenError";function bs(i){return decodeURIComponent(atob(i).replace(/(.)/g,(t,e)=>{let s=e.charCodeAt(0).toString(16).toUpperCase();return s.length<2&&(s="0"+s),"%"+s}))}function vs(i){let t=i.replace(/-/g,"+").replace(/_/g,"/");switch(t.length%4){case 0:break;case 2:t+="==";break;case 3:t+="=";break;default:throw new Error("base64 string is not of the correct length")}try{return bs(t)}catch{return atob(t)}}function xr(i,t){if(typeof i!="string")throw new mt("Invalid token specified: must be a string");t||(t={});const e=t.header===!0?0:1,s=i.split(".")[e];if(typeof s!="string")throw new mt(`Invalid token specified: missing part #${e+1}`);let r;try{r=vs(s)}catch(o){throw new mt(`Invalid token specified: invalid base64 for part #${e+1} (${o.message})`)}try{return JSON.parse(r)}catch(o){throw new mt(`Invalid token specified: invalid json for part #${e+1} (${o.message})`)}}const ys="mu:context",ae=`${ys}:change`;class _s{constructor(t,e){this._proxy=$s(t,e)}get value(){return this._proxy}set value(t){Object.assign(this._proxy,t)}apply(t){this.value=t(this.value)}}class be extends HTMLElement{constructor(t){super(),console.log("Constructing context provider",this),this.context=new _s(t,this),this.style.display="contents"}attach(t){return this.addEventListener(ae,t),t}detach(t){this.removeEventListener(ae,t)}}function $s(i,t){return new Proxy(i,{get:(s,r,o)=>{if(r==="then")return;const n=Reflect.get(s,r,o);return console.log(`Context['${r}'] => `,n),n},set:(s,r,o,n)=>{const l=i[r];console.log(`Context['${r.toString()}'] <= `,o);const a=Reflect.set(s,r,o,n);if(a){let u=new CustomEvent(ae,{bubbles:!0,cancelable:!0,composed:!0});Object.assign(u,{property:r,oldValue:l,value:o}),t.dispatchEvent(u)}else console.log(`Context['${r}] was not set to ${o}`);return a}})}function ws(i,t){const e=Ar(t,i);return new Promise((s,r)=>{if(e){const o=e.localName;customElements.whenDefined(o).then(()=>s(e))}else r({context:t,reason:`No provider for this context "${t}:`})})}function Ar(i,t){const e=`[provides="${i}"]`;if(!t||t===document.getRootNode())return;const s=t.closest(e);if(s)return s;const r=t.getRootNode();if(r instanceof ShadowRoot)return Ar(i,r.host)}class xs extends CustomEvent{constructor(t,e="mu:message"){super(e,{bubbles:!0,composed:!0,detail:t})}}function kr(i="mu:message"){return(t,...e)=>t.dispatchEvent(new xs(e,i))}class ve{constructor(t,e,s="service:message",r=!0){this._pending=[],this._context=e,this._update=t,this._eventType=s,this._running=r}attach(t){t.addEventListener(this._eventType,e=>{e.stopPropagation();const s=e.detail;this.consume(s)})}start(){this._running||(console.log(`Starting ${this._eventType} service`),this._running=!0,this._pending.forEach(t=>this.process(t)))}apply(t){this._context.apply(t)}consume(t){this._running?this.process(t):(console.log(`Queueing ${this._eventType} message`,t),this._pending.push(t))}process(t){console.log(`Processing ${this._eventType} message`,t);const e=this._update(t,this.apply.bind(this));e&&e(this._context.value)}}function As(i){return t=>({...t,...i})}const le="mu:auth:jwt",Sr=class Er extends ve{constructor(t,e){super((s,r)=>this.update(s,r),t,Er.EVENT_TYPE),this._redirectForLogin=e}update(t,e){switch(t[0]){case"auth/signin":const{token:s,redirect:r}=t[1];return e(Ss(s)),ee(r);case"auth/signout":return e(Es()),ee(this._redirectForLogin);case"auth/redirect":return ee(this._redirectForLogin,{next:window.location.href});default:const o=t[0];throw new Error(`Unhandled Auth message "${o}"`)}}};Sr.EVENT_TYPE="auth:message";let Pr=Sr;const Cr=kr(Pr.EVENT_TYPE);function ee(i,t={}){if(!i)return;const e=window.location.href,s=new URL(i,e);return Object.entries(t).forEach(([r,o])=>s.searchParams.set(r,o)),()=>{console.log("Redirecting to ",i),window.location.assign(s)}}class ks extends be{get redirect(){return this.getAttribute("redirect")||void 0}constructor(){const t=st.authenticateFromLocalStorage();super({user:t,token:t.authenticated?t.token:void 0})}connectedCallback(){new Pr(this.context,this.redirect).attach(this)}}class rt{constructor(){this.authenticated=!1,this.username="anonymous"}static deauthenticate(t){return t.authenticated=!1,t.username="anonymous",localStorage.removeItem(le),t}}class st extends rt{constructor(t){super();const e=xr(t);console.log("Token payload",e),this.token=t,this.authenticated=!0,this.username=e.username}static authenticate(t){const e=new st(t);return localStorage.setItem(le,t),e}static authenticateFromLocalStorage(){const t=localStorage.getItem(le);return t?st.authenticate(t):new rt}}function Ss(i){return As({user:st.authenticate(i),token:i})}function Es(){return i=>{const t=i.user;return{user:t&&t.authenticated?rt.deauthenticate(t):t,token:""}}}function Ps(i){return i.authenticated?{Authorization:`Bearer ${i.token||"NO_TOKEN"}`}:{}}function Cs(i){return i.authenticated?xr(i.token||""):{}}const P=Object.freeze(Object.defineProperty({__proto__:null,AuthenticatedUser:st,Provider:ks,User:rt,dispatch:Cr,headers:Ps,payload:Cs},Symbol.toStringTag,{value:"Module"}));function ce(i,t,e){const s=i.target,r=new CustomEvent(t,{bubbles:!0,composed:!0,detail:e});console.log(`Relaying event from ${i.type}:`,r),s.dispatchEvent(r),i.stopPropagation()}function Ye(i,t="*"){return i.composedPath().find(s=>{const r=s;return r.tagName&&r.matches(t)})}function Or(i,...t){const e=i.map((r,o)=>o?[t[o-1],r]:[r]).flat().join("");let s=new CSSStyleSheet;return s.replaceSync(e),s}const Os=new DOMParser;function F(i,...t){const e=t.map(l),s=i.map((a,u)=>{if(u===0)return[a];const p=e[u-1];return p instanceof Node?[`<ins id="mu-html-${u-1}"></ins>`,a]:[p,a]}).flat().join(""),r=Os.parseFromString(s,"text/html"),o=r.head.childElementCount?r.head.children:r.body.children,n=new DocumentFragment;return n.replaceChildren(...o),e.forEach((a,u)=>{if(a instanceof Node){const p=n.querySelector(`ins#mu-html-${u}`);if(p){const d=p.parentNode;d==null||d.replaceChild(a,p)}else console.log("Missing insertion point:",`ins#mu-html-${u}`)}}),n;function l(a,u){if(a===null)return"";switch(typeof a){case"string":return Je(a);case"bigint":case"boolean":case"number":case"symbol":return Je(a.toString());case"object":if(a instanceof Node||a instanceof DocumentFragment)return a;if(Array.isArray(a)){const p=new DocumentFragment,d=a.map(l);return p.replaceChildren(...d),p}return new Text(a.toString());default:return new Comment(`[invalid parameter of type "${typeof a}"]`)}}}function Je(i){return i.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function Bt(i,t={mode:"open"}){const e=i.attachShadow(t),s={template:r,styles:o};return s;function r(n){const l=n.firstElementChild,a=l&&l.tagName==="TEMPLATE"?l:void 0;return a&&e.appendChild(a.content.cloneNode(!0)),s}function o(...n){e.adoptedStyleSheets=n}}let Ts=(Z=class extends HTMLElement{constructor(){super(),this._state={},Bt(this).template(Z.template).styles(Z.styles),this.addEventListener("change",i=>{const t=i.target;if(t){const e=t.name,s=t.value;e&&(this._state[e]=s)}}),this.form&&this.form.addEventListener("submit",i=>{i.preventDefault(),ce(i,"mu-form:submit",this._state)})}set init(i){this._state=i||{},Ms(this._state,this)}get form(){var i;return(i=this.shadowRoot)==null?void 0:i.querySelector("form")}},Z.template=F`
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
  `,Z.styles=Or`
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
  `,Z);function Ms(i,t){const e=Object.entries(i);for(const[s,r]of e){const o=t.querySelector(`[name="${s}"]`);if(o){const n=o;switch(n.type){case"checkbox":const l=n;l.checked=!!r;break;case"date":n.value=r.toISOString().substr(0,10);break;default:n.value=r;break}}}return i}const Rs=Object.freeze(Object.defineProperty({__proto__:null,Element:Ts},Symbol.toStringTag,{value:"Module"})),Tr=class Mr extends ve{constructor(t){super((e,s)=>this.update(e,s),t,Mr.EVENT_TYPE)}update(t,e){switch(t[0]){case"history/navigate":{const{href:s,state:r}=t[1];e(Us(s,r));break}case"history/redirect":{const{href:s,state:r}=t[1];e(js(s,r));break}}}};Tr.EVENT_TYPE="history:message";let ye=Tr;class Ke extends be{constructor(){super({location:document.location,state:{}}),this.addEventListener("click",t=>{const e=Is(t);if(e){const s=new URL(e.href);s.origin===this.context.value.location.origin&&(console.log("Preventing Click Event on <A>",t),t.preventDefault(),_e(e,"history/navigate",{href:s.pathname+s.search}))}}),window.addEventListener("popstate",t=>{console.log("Popstate",t.state),this.context.value={location:document.location,state:t.state}})}connectedCallback(){new ye(this.context).attach(this)}}function Is(i){const t=i.currentTarget,e=s=>s.tagName=="A"&&s.href;if(i.button===0)if(i.composed){const r=i.composedPath().find(e);return r||void 0}else{for(let s=i.target;s;s===t?null:s.parentElement)if(e(s))return s;return}}function Us(i,t={}){return history.pushState(t,"",i),()=>({location:document.location,state:history.state})}function js(i,t={}){return history.replaceState(t,"",i),()=>({location:document.location,state:history.state})}const _e=kr(ye.EVENT_TYPE),Rr=Object.freeze(Object.defineProperty({__proto__:null,HistoryProvider:Ke,Provider:Ke,Service:ye,dispatch:_e},Symbol.toStringTag,{value:"Module"}));class vt{constructor(t,e){this._effects=[],this._target=t,this._contextLabel=e}observe(t=void 0){return new Promise((e,s)=>{if(this._provider){const r=new Ze(this._provider,t);this._effects.push(r),e(r)}else ws(this._target,this._contextLabel).then(r=>{const o=new Ze(r,t);this._provider=r,this._effects.push(o),r.attach(n=>this._handleChange(n)),e(o)}).catch(r=>console.log(`Observer ${this._contextLabel}: ${r}`,r))})}_handleChange(t){console.log("Received change event for observers",t,this._effects),t.stopPropagation(),this._effects.forEach(e=>e.runEffect())}}class Ze{constructor(t,e){this._provider=t,e&&this.setEffect(e)}get context(){return this._provider.context}get value(){return this.context.value}setEffect(t){this._effectFn=t,this.runEffect()}runEffect(){this._effectFn&&this._effectFn(this.context.value)}}const Ir=class Ur extends HTMLElement{constructor(){super(),this._state={},this._user=new rt,this._authObserver=new vt(this,"blazing:auth"),Bt(this).template(Ur.template),this.form&&this.form.addEventListener("submit",t=>{if(t.preventDefault(),this.src||this.action){if(console.log("Submitting form",this._state),this.action)this.action(this._state);else if(this.src){const e=this.isNew?"POST":"PUT",s=this.isNew?"created":"updated",r=this.isNew?this.src.replace(/[/][$]new$/,""):this.src;Ns(r,this._state,e,this.authorization).then(o=>ht(o,this)).then(o=>{const n=`mu-rest-form:${s}`,l=new CustomEvent(n,{bubbles:!0,composed:!0,detail:{method:e,[s]:o,url:r}});this.dispatchEvent(l)}).catch(o=>{const n="mu-rest-form:error",l=new CustomEvent(n,{bubbles:!0,composed:!0,detail:{method:e,error:o,url:r,request:this._state}});this.dispatchEvent(l)})}}}),this.addEventListener("change",t=>{const e=t.target;if(e){const s=e.name,r=e.value;s&&(this._state[s]=r)}})}get src(){return this.getAttribute("src")}get isNew(){return this.hasAttribute("new")}set init(t){this._state=t||{},ht(this._state,this)}get form(){var t;return(t=this.shadowRoot)==null?void 0:t.querySelector("form")}get authorization(){var t;return(t=this._user)!=null&&t.authenticated?{Authorization:`Bearer ${this._user.token}`}:{}}connectedCallback(){this._authObserver.observe(({user:t})=>{t&&(this._user=t,this.src&&!this.isNew&&Qe(this.src,this.authorization).then(e=>{this._state=e,ht(e,this)}))})}attributeChangedCallback(t,e,s){switch(t){case"src":this.src&&s&&s!==e&&!this.isNew&&Qe(this.src,this.authorization).then(r=>{this._state=r,ht(r,this)});break;case"new":s&&(this._state={},ht({},this));break}}};Ir.observedAttributes=["src","new","action"];Ir.template=F`
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
  `;function Qe(i,t){return fetch(i,{headers:t}).then(e=>{if(e.status!==200)throw`Status: ${e.status}`;return e.json()}).catch(e=>console.log(`Failed to load form from ${i}:`,e))}function ht(i,t){const e=Object.entries(i);for(const[s,r]of e){const o=t.querySelector(`[name="${s}"]`);if(o){const n=o;switch(n.type){case"checkbox":const l=n;l.checked=!!r;break;default:n.value=r;break}}}return i}function Ns(i,t,e="PUT",s={}){return fetch(i,{method:e,headers:{"Content-Type":"application/json",...s},body:JSON.stringify(t)}).then(r=>{if(r.status!=200&&r.status!=201)throw`Form submission failed: Status ${r.status}`;return r.json()})}const jr=class Nr extends ve{constructor(t,e){super(e,t,Nr.EVENT_TYPE,!1)}};jr.EVENT_TYPE="mu:message";let Dr=jr;class Ds extends be{constructor(t,e,s){super(e),this._user=new rt,this._updateFn=t,this._authObserver=new vt(this,s)}connectedCallback(){const t=new Dr(this.context,(e,s)=>this._updateFn(e,s,this._user));t.attach(this),this._authObserver.observe(({user:e})=>{console.log("Store got auth",e),e&&(this._user=e),t.start()})}}const Ls=Object.freeze(Object.defineProperty({__proto__:null,Provider:Ds,Service:Dr},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Mt=globalThis,$e=Mt.ShadowRoot&&(Mt.ShadyCSS===void 0||Mt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,we=Symbol(),Xe=new WeakMap;let Lr=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==we)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if($e&&t===void 0){const s=e!==void 0&&e.length===1;s&&(t=Xe.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&Xe.set(e,t))}return t}toString(){return this.cssText}};const zs=i=>new Lr(typeof i=="string"?i:i+"",void 0,we),Hs=(i,...t)=>{const e=i.length===1?i[0]:t.reduce((s,r,o)=>s+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+i[o+1],i[0]);return new Lr(e,i,we)},Fs=(i,t)=>{if($e)i.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const s=document.createElement("style"),r=Mt.litNonce;r!==void 0&&s.setAttribute("nonce",r),s.textContent=e.cssText,i.appendChild(s)}},tr=$e?i=>i:i=>i instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return zs(e)})(i):i;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:qs,defineProperty:Bs,getOwnPropertyDescriptor:Gs,getOwnPropertyNames:Vs,getOwnPropertySymbols:Ws,getPrototypeOf:Ys}=Object,it=globalThis,er=it.trustedTypes,Js=er?er.emptyScript:"",rr=it.reactiveElementPolyfillSupport,ft=(i,t)=>i,It={toAttribute(i,t){switch(t){case Boolean:i=i?Js:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,t){let e=i;switch(t){case Boolean:e=i!==null;break;case Number:e=i===null?null:Number(i);break;case Object:case Array:try{e=JSON.parse(i)}catch{e=null}}return e}},xe=(i,t)=>!qs(i,t),sr={attribute:!0,type:String,converter:It,reflect:!1,hasChanged:xe};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),it.litPropertyMetadata??(it.litPropertyMetadata=new WeakMap);let X=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=sr){if(e.state&&(e.attribute=!1),this._$Ei(),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),r=this.getPropertyDescriptor(t,s,e);r!==void 0&&Bs(this.prototype,t,r)}}static getPropertyDescriptor(t,e,s){const{get:r,set:o}=Gs(this.prototype,t)??{get(){return this[e]},set(n){this[e]=n}};return{get(){return r==null?void 0:r.call(this)},set(n){const l=r==null?void 0:r.call(this);o.call(this,n),this.requestUpdate(t,l,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??sr}static _$Ei(){if(this.hasOwnProperty(ft("elementProperties")))return;const t=Ys(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(ft("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(ft("properties"))){const e=this.properties,s=[...Vs(e),...Ws(e)];for(const r of s)this.createProperty(r,e[r])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[s,r]of e)this.elementProperties.set(s,r)}this._$Eh=new Map;for(const[e,s]of this.elementProperties){const r=this._$Eu(e,s);r!==void 0&&this._$Eh.set(r,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const r of s)e.unshift(tr(r))}else t!==void 0&&e.push(tr(t));return e}static _$Eu(t,e){const s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((e=t.hostConnected)==null||e.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Fs(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostConnected)==null?void 0:s.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostDisconnected)==null?void 0:s.call(e)})}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$EC(t,e){var s;const r=this.constructor.elementProperties.get(t),o=this.constructor._$Eu(t,r);if(o!==void 0&&r.reflect===!0){const n=(((s=r.converter)==null?void 0:s.toAttribute)!==void 0?r.converter:It).toAttribute(e,r.type);this._$Em=t,n==null?this.removeAttribute(o):this.setAttribute(o,n),this._$Em=null}}_$AK(t,e){var s;const r=this.constructor,o=r._$Eh.get(t);if(o!==void 0&&this._$Em!==o){const n=r.getPropertyOptions(o),l=typeof n.converter=="function"?{fromAttribute:n.converter}:((s=n.converter)==null?void 0:s.fromAttribute)!==void 0?n.converter:It;this._$Em=o,this[o]=l.fromAttribute(e,n.type),this._$Em=null}}requestUpdate(t,e,s){if(t!==void 0){if(s??(s=this.constructor.getPropertyOptions(t)),!(s.hasChanged??xe)(this[t],e))return;this.P(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$ET())}P(t,e,s){this._$AL.has(t)||this._$AL.set(t,e),s.reflect===!0&&this._$Em!==t&&(this._$Ej??(this._$Ej=new Set)).add(t)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[o,n]of this._$Ep)this[o]=n;this._$Ep=void 0}const r=this.constructor.elementProperties;if(r.size>0)for(const[o,n]of r)n.wrapped!==!0||this._$AL.has(o)||this[o]===void 0||this.P(o,this[o],n)}let e=!1;const s=this._$AL;try{e=this.shouldUpdate(s),e?(this.willUpdate(s),(t=this._$EO)==null||t.forEach(r=>{var o;return(o=r.hostUpdate)==null?void 0:o.call(r)}),this.update(s)):this._$EU()}catch(r){throw e=!1,this._$EU(),r}e&&this._$AE(s)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(s=>{var r;return(r=s.hostUpdated)==null?void 0:r.call(s)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Ej&&(this._$Ej=this._$Ej.forEach(e=>this._$EC(e,this[e]))),this._$EU()}updated(t){}firstUpdated(t){}};X.elementStyles=[],X.shadowRootOptions={mode:"open"},X[ft("elementProperties")]=new Map,X[ft("finalized")]=new Map,rr==null||rr({ReactiveElement:X}),(it.reactiveElementVersions??(it.reactiveElementVersions=[])).push("2.0.4");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ut=globalThis,jt=Ut.trustedTypes,ir=jt?jt.createPolicy("lit-html",{createHTML:i=>i}):void 0,zr="$lit$",R=`lit$${Math.random().toFixed(9).slice(2)}$`,Hr="?"+R,Ks=`<${Hr}>`,B=document,yt=()=>B.createComment(""),_t=i=>i===null||typeof i!="object"&&typeof i!="function",Ae=Array.isArray,Zs=i=>Ae(i)||typeof(i==null?void 0:i[Symbol.iterator])=="function",re=`[ 	
\f\r]`,dt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,or=/-->/g,nr=/>/g,D=RegExp(`>|${re}(?:([^\\s"'>=/]+)(${re}*=${re}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),ar=/'/g,lr=/"/g,Fr=/^(?:script|style|textarea|title)$/i,Qs=i=>(t,...e)=>({_$litType$:i,strings:t,values:e}),ut=Qs(1),ot=Symbol.for("lit-noChange"),_=Symbol.for("lit-nothing"),cr=new WeakMap,z=B.createTreeWalker(B,129);function qr(i,t){if(!Ae(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return ir!==void 0?ir.createHTML(t):t}const Xs=(i,t)=>{const e=i.length-1,s=[];let r,o=t===2?"<svg>":t===3?"<math>":"",n=dt;for(let l=0;l<e;l++){const a=i[l];let u,p,d=-1,c=0;for(;c<a.length&&(n.lastIndex=c,p=n.exec(a),p!==null);)c=n.lastIndex,n===dt?p[1]==="!--"?n=or:p[1]!==void 0?n=nr:p[2]!==void 0?(Fr.test(p[2])&&(r=RegExp("</"+p[2],"g")),n=D):p[3]!==void 0&&(n=D):n===D?p[0]===">"?(n=r??dt,d=-1):p[1]===void 0?d=-2:(d=n.lastIndex-p[2].length,u=p[1],n=p[3]===void 0?D:p[3]==='"'?lr:ar):n===lr||n===ar?n=D:n===or||n===nr?n=dt:(n=D,r=void 0);const h=n===D&&i[l+1].startsWith("/>")?" ":"";o+=n===dt?a+Ks:d>=0?(s.push(u),a.slice(0,d)+zr+a.slice(d)+R+h):a+R+(d===-2?l:h)}return[qr(i,o+(i[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]};let he=class Br{constructor({strings:t,_$litType$:e},s){let r;this.parts=[];let o=0,n=0;const l=t.length-1,a=this.parts,[u,p]=Xs(t,e);if(this.el=Br.createElement(u,s),z.currentNode=this.el.content,e===2||e===3){const d=this.el.content.firstChild;d.replaceWith(...d.childNodes)}for(;(r=z.nextNode())!==null&&a.length<l;){if(r.nodeType===1){if(r.hasAttributes())for(const d of r.getAttributeNames())if(d.endsWith(zr)){const c=p[n++],h=r.getAttribute(d).split(R),m=/([.?@])?(.*)/.exec(c);a.push({type:1,index:o,name:m[2],strings:h,ctor:m[1]==="."?ei:m[1]==="?"?ri:m[1]==="@"?si:Gt}),r.removeAttribute(d)}else d.startsWith(R)&&(a.push({type:6,index:o}),r.removeAttribute(d));if(Fr.test(r.tagName)){const d=r.textContent.split(R),c=d.length-1;if(c>0){r.textContent=jt?jt.emptyScript:"";for(let h=0;h<c;h++)r.append(d[h],yt()),z.nextNode(),a.push({type:2,index:++o});r.append(d[c],yt())}}}else if(r.nodeType===8)if(r.data===Hr)a.push({type:2,index:o});else{let d=-1;for(;(d=r.data.indexOf(R,d+1))!==-1;)a.push({type:7,index:o}),d+=R.length-1}o++}}static createElement(t,e){const s=B.createElement("template");return s.innerHTML=t,s}};function nt(i,t,e=i,s){var r,o;if(t===ot)return t;let n=s!==void 0?(r=e.o)==null?void 0:r[s]:e.l;const l=_t(t)?void 0:t._$litDirective$;return(n==null?void 0:n.constructor)!==l&&((o=n==null?void 0:n._$AO)==null||o.call(n,!1),l===void 0?n=void 0:(n=new l(i),n._$AT(i,e,s)),s!==void 0?(e.o??(e.o=[]))[s]=n:e.l=n),n!==void 0&&(t=nt(i,n._$AS(i,t.values),n,s)),t}class ti{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,r=((t==null?void 0:t.creationScope)??B).importNode(e,!0);z.currentNode=r;let o=z.nextNode(),n=0,l=0,a=s[0];for(;a!==void 0;){if(n===a.index){let u;a.type===2?u=new Et(o,o.nextSibling,this,t):a.type===1?u=new a.ctor(o,a.name,a.strings,this,t):a.type===6&&(u=new ii(o,this,t)),this._$AV.push(u),a=s[++l]}n!==(a==null?void 0:a.index)&&(o=z.nextNode(),n++)}return z.currentNode=B,r}p(t){let e=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class Et{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this.v}constructor(t,e,s,r){this.type=2,this._$AH=_,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=r,this.v=(r==null?void 0:r.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=nt(this,t,e),_t(t)?t===_||t==null||t===""?(this._$AH!==_&&this._$AR(),this._$AH=_):t!==this._$AH&&t!==ot&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Zs(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==_&&_t(this._$AH)?this._$AA.nextSibling.data=t:this.T(B.createTextNode(t)),this._$AH=t}$(t){var e;const{values:s,_$litType$:r}=t,o=typeof r=="number"?this._$AC(t):(r.el===void 0&&(r.el=he.createElement(qr(r.h,r.h[0]),this.options)),r);if(((e=this._$AH)==null?void 0:e._$AD)===o)this._$AH.p(s);else{const n=new ti(o,this),l=n.u(this.options);n.p(s),this.T(l),this._$AH=n}}_$AC(t){let e=cr.get(t.strings);return e===void 0&&cr.set(t.strings,e=new he(t)),e}k(t){Ae(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,r=0;for(const o of t)r===e.length?e.push(s=new Et(this.O(yt()),this.O(yt()),this,this.options)):s=e[r],s._$AI(o),r++;r<e.length&&(this._$AR(s&&s._$AB.nextSibling,r),e.length=r)}_$AR(t=this._$AA.nextSibling,e){var s;for((s=this._$AP)==null?void 0:s.call(this,!1,!0,e);t&&t!==this._$AB;){const r=t.nextSibling;t.remove(),t=r}}setConnected(t){var e;this._$AM===void 0&&(this.v=t,(e=this._$AP)==null||e.call(this,t))}}class Gt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,r,o){this.type=1,this._$AH=_,this._$AN=void 0,this.element=t,this.name=e,this._$AM=r,this.options=o,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=_}_$AI(t,e=this,s,r){const o=this.strings;let n=!1;if(o===void 0)t=nt(this,t,e,0),n=!_t(t)||t!==this._$AH&&t!==ot,n&&(this._$AH=t);else{const l=t;let a,u;for(t=o[0],a=0;a<o.length-1;a++)u=nt(this,l[s+a],e,a),u===ot&&(u=this._$AH[a]),n||(n=!_t(u)||u!==this._$AH[a]),u===_?t=_:t!==_&&(t+=(u??"")+o[a+1]),this._$AH[a]=u}n&&!r&&this.j(t)}j(t){t===_?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class ei extends Gt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===_?void 0:t}}class ri extends Gt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==_)}}class si extends Gt{constructor(t,e,s,r,o){super(t,e,s,r,o),this.type=5}_$AI(t,e=this){if((t=nt(this,t,e,0)??_)===ot)return;const s=this._$AH,r=t===_&&s!==_||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,o=t!==_&&(s===_||r);r&&this.element.removeEventListener(this.name,this,s),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;typeof this._$AH=="function"?this._$AH.call(((e=this.options)==null?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}}class ii{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){nt(this,t)}}const hr=Ut.litHtmlPolyfillSupport;hr==null||hr(he,Et),(Ut.litHtmlVersions??(Ut.litHtmlVersions=[])).push("3.2.0");const oi=(i,t,e)=>{const s=(e==null?void 0:e.renderBefore)??t;let r=s._$litPart$;if(r===void 0){const o=(e==null?void 0:e.renderBefore)??null;s._$litPart$=r=new Et(t.insertBefore(yt(),o),o,void 0,e??{})}return r._$AI(i),r};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let et=class extends X{constructor(){super(...arguments),this.renderOptions={host:this},this.o=void 0}createRenderRoot(){var t;const e=super.createRenderRoot();return(t=this.renderOptions).renderBefore??(t.renderBefore=e.firstChild),e}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this.o=oi(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this.o)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this.o)==null||t.setConnected(!1)}render(){return ot}};et._$litElement$=!0,et.finalized=!0,(We=globalThis.litElementHydrateSupport)==null||We.call(globalThis,{LitElement:et});const dr=globalThis.litElementPolyfillSupport;dr==null||dr({LitElement:et});(globalThis.litElementVersions??(globalThis.litElementVersions=[])).push("4.1.0");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ni={attribute:!0,type:String,converter:It,reflect:!1,hasChanged:xe},ai=(i=ni,t,e)=>{const{kind:s,metadata:r}=e;let o=globalThis.litPropertyMetadata.get(r);if(o===void 0&&globalThis.litPropertyMetadata.set(r,o=new Map),o.set(e.name,i),s==="accessor"){const{name:n}=e;return{set(l){const a=t.get.call(this);t.set.call(this,l),this.requestUpdate(n,a,i)},init(l){return l!==void 0&&this.P(n,void 0,i),l}}}if(s==="setter"){const{name:n}=e;return function(l){const a=this[n];t.call(this,l),this.requestUpdate(n,a,i)}}throw Error("Unsupported decorator location: "+s)};function Gr(i){return(t,e)=>typeof e=="object"?ai(i,t,e):((s,r,o)=>{const n=r.hasOwnProperty(o);return r.constructor.createProperty(o,n?{...s,wrapped:!0}:s),n?Object.getOwnPropertyDescriptor(r,o):void 0})(i,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function Vr(i){return Gr({...i,state:!0,attribute:!1})}function li(i){return i&&i.__esModule&&Object.prototype.hasOwnProperty.call(i,"default")?i.default:i}function ci(i){throw new Error('Could not dynamically require "'+i+'". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.')}var Wr={};(function(i){var t=function(){var e=function(d,c,h,m){for(h=h||{},m=d.length;m--;h[d[m]]=c);return h},s=[1,9],r=[1,10],o=[1,11],n=[1,12],l=[5,11,12,13,14,15],a={trace:function(){},yy:{},symbols_:{error:2,root:3,expressions:4,EOF:5,expression:6,optional:7,literal:8,splat:9,param:10,"(":11,")":12,LITERAL:13,SPLAT:14,PARAM:15,$accept:0,$end:1},terminals_:{2:"error",5:"EOF",11:"(",12:")",13:"LITERAL",14:"SPLAT",15:"PARAM"},productions_:[0,[3,2],[3,1],[4,2],[4,1],[6,1],[6,1],[6,1],[6,1],[7,3],[8,1],[9,1],[10,1]],performAction:function(c,h,m,b,g,v,Kt){var k=v.length-1;switch(g){case 1:return new b.Root({},[v[k-1]]);case 2:return new b.Root({},[new b.Literal({value:""})]);case 3:this.$=new b.Concat({},[v[k-1],v[k]]);break;case 4:case 5:this.$=v[k];break;case 6:this.$=new b.Literal({value:v[k]});break;case 7:this.$=new b.Splat({name:v[k]});break;case 8:this.$=new b.Param({name:v[k]});break;case 9:this.$=new b.Optional({},[v[k-1]]);break;case 10:this.$=c;break;case 11:case 12:this.$=c.slice(1);break}},table:[{3:1,4:2,5:[1,3],6:4,7:5,8:6,9:7,10:8,11:s,13:r,14:o,15:n},{1:[3]},{5:[1,13],6:14,7:5,8:6,9:7,10:8,11:s,13:r,14:o,15:n},{1:[2,2]},e(l,[2,4]),e(l,[2,5]),e(l,[2,6]),e(l,[2,7]),e(l,[2,8]),{4:15,6:4,7:5,8:6,9:7,10:8,11:s,13:r,14:o,15:n},e(l,[2,10]),e(l,[2,11]),e(l,[2,12]),{1:[2,1]},e(l,[2,3]),{6:14,7:5,8:6,9:7,10:8,11:s,12:[1,16],13:r,14:o,15:n},e(l,[2,9])],defaultActions:{3:[2,2],13:[2,1]},parseError:function(c,h){if(h.recoverable)this.trace(c);else{let m=function(b,g){this.message=b,this.hash=g};throw m.prototype=Error,new m(c,h)}},parse:function(c){var h=this,m=[0],b=[null],g=[],v=this.table,Kt="",k=0,Be=0,us=2,Ge=1,ps=g.slice.call(arguments,1),y=Object.create(this.lexer),j={yy:{}};for(var Zt in this.yy)Object.prototype.hasOwnProperty.call(this.yy,Zt)&&(j.yy[Zt]=this.yy[Zt]);y.setInput(c,j.yy),j.yy.lexer=y,j.yy.parser=this,typeof y.yylloc>"u"&&(y.yylloc={});var Qt=y.yylloc;g.push(Qt);var ms=y.options&&y.options.ranges;typeof j.yy.parseError=="function"?this.parseError=j.yy.parseError:this.parseError=Object.getPrototypeOf(this).parseError;for(var fs=function(){var K;return K=y.lex()||Ge,typeof K!="number"&&(K=h.symbols_[K]||K),K},A,N,S,Xt,J={},Ot,T,Ve,Tt;;){if(N=m[m.length-1],this.defaultActions[N]?S=this.defaultActions[N]:((A===null||typeof A>"u")&&(A=fs()),S=v[N]&&v[N][A]),typeof S>"u"||!S.length||!S[0]){var te="";Tt=[];for(Ot in v[N])this.terminals_[Ot]&&Ot>us&&Tt.push("'"+this.terminals_[Ot]+"'");y.showPosition?te="Parse error on line "+(k+1)+`:
`+y.showPosition()+`
Expecting `+Tt.join(", ")+", got '"+(this.terminals_[A]||A)+"'":te="Parse error on line "+(k+1)+": Unexpected "+(A==Ge?"end of input":"'"+(this.terminals_[A]||A)+"'"),this.parseError(te,{text:y.match,token:this.terminals_[A]||A,line:y.yylineno,loc:Qt,expected:Tt})}if(S[0]instanceof Array&&S.length>1)throw new Error("Parse Error: multiple actions possible at state: "+N+", token: "+A);switch(S[0]){case 1:m.push(A),b.push(y.yytext),g.push(y.yylloc),m.push(S[1]),A=null,Be=y.yyleng,Kt=y.yytext,k=y.yylineno,Qt=y.yylloc;break;case 2:if(T=this.productions_[S[1]][1],J.$=b[b.length-T],J._$={first_line:g[g.length-(T||1)].first_line,last_line:g[g.length-1].last_line,first_column:g[g.length-(T||1)].first_column,last_column:g[g.length-1].last_column},ms&&(J._$.range=[g[g.length-(T||1)].range[0],g[g.length-1].range[1]]),Xt=this.performAction.apply(J,[Kt,Be,k,j.yy,S[1],b,g].concat(ps)),typeof Xt<"u")return Xt;T&&(m=m.slice(0,-1*T*2),b=b.slice(0,-1*T),g=g.slice(0,-1*T)),m.push(this.productions_[S[1]][0]),b.push(J.$),g.push(J._$),Ve=v[m[m.length-2]][m[m.length-1]],m.push(Ve);break;case 3:return!0}}return!0}},u=function(){var d={EOF:1,parseError:function(h,m){if(this.yy.parser)this.yy.parser.parseError(h,m);else throw new Error(h)},setInput:function(c,h){return this.yy=h||this.yy||{},this._input=c,this._more=this._backtrack=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match="",this.conditionStack=["INITIAL"],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this.options.ranges&&(this.yylloc.range=[0,0]),this.offset=0,this},input:function(){var c=this._input[0];this.yytext+=c,this.yyleng++,this.offset++,this.match+=c,this.matched+=c;var h=c.match(/(?:\r\n?|\n).*/g);return h?(this.yylineno++,this.yylloc.last_line++):this.yylloc.last_column++,this.options.ranges&&this.yylloc.range[1]++,this._input=this._input.slice(1),c},unput:function(c){var h=c.length,m=c.split(/(?:\r\n?|\n)/g);this._input=c+this._input,this.yytext=this.yytext.substr(0,this.yytext.length-h),this.offset-=h;var b=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1),this.matched=this.matched.substr(0,this.matched.length-1),m.length-1&&(this.yylineno-=m.length-1);var g=this.yylloc.range;return this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:m?(m.length===b.length?this.yylloc.first_column:0)+b[b.length-m.length].length-m[0].length:this.yylloc.first_column-h},this.options.ranges&&(this.yylloc.range=[g[0],g[0]+this.yyleng-h]),this.yyleng=this.yytext.length,this},more:function(){return this._more=!0,this},reject:function(){if(this.options.backtrack_lexer)this._backtrack=!0;else return this.parseError("Lexical error on line "+(this.yylineno+1)+`. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).
`+this.showPosition(),{text:"",token:null,line:this.yylineno});return this},less:function(c){this.unput(this.match.slice(c))},pastInput:function(){var c=this.matched.substr(0,this.matched.length-this.match.length);return(c.length>20?"...":"")+c.substr(-20).replace(/\n/g,"")},upcomingInput:function(){var c=this.match;return c.length<20&&(c+=this._input.substr(0,20-c.length)),(c.substr(0,20)+(c.length>20?"...":"")).replace(/\n/g,"")},showPosition:function(){var c=this.pastInput(),h=new Array(c.length+1).join("-");return c+this.upcomingInput()+`
`+h+"^"},test_match:function(c,h){var m,b,g;if(this.options.backtrack_lexer&&(g={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done},this.options.ranges&&(g.yylloc.range=this.yylloc.range.slice(0))),b=c[0].match(/(?:\r\n?|\n).*/g),b&&(this.yylineno+=b.length),this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:b?b[b.length-1].length-b[b.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+c[0].length},this.yytext+=c[0],this.match+=c[0],this.matches=c,this.yyleng=this.yytext.length,this.options.ranges&&(this.yylloc.range=[this.offset,this.offset+=this.yyleng]),this._more=!1,this._backtrack=!1,this._input=this._input.slice(c[0].length),this.matched+=c[0],m=this.performAction.call(this,this.yy,this,h,this.conditionStack[this.conditionStack.length-1]),this.done&&this._input&&(this.done=!1),m)return m;if(this._backtrack){for(var v in g)this[v]=g[v];return!1}return!1},next:function(){if(this.done)return this.EOF;this._input||(this.done=!0);var c,h,m,b;this._more||(this.yytext="",this.match="");for(var g=this._currentRules(),v=0;v<g.length;v++)if(m=this._input.match(this.rules[g[v]]),m&&(!h||m[0].length>h[0].length)){if(h=m,b=v,this.options.backtrack_lexer){if(c=this.test_match(m,g[v]),c!==!1)return c;if(this._backtrack){h=!1;continue}else return!1}else if(!this.options.flex)break}return h?(c=this.test_match(h,g[b]),c!==!1?c:!1):this._input===""?this.EOF:this.parseError("Lexical error on line "+(this.yylineno+1)+`. Unrecognized text.
`+this.showPosition(),{text:"",token:null,line:this.yylineno})},lex:function(){var h=this.next();return h||this.lex()},begin:function(h){this.conditionStack.push(h)},popState:function(){var h=this.conditionStack.length-1;return h>0?this.conditionStack.pop():this.conditionStack[0]},_currentRules:function(){return this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1]?this.conditions[this.conditionStack[this.conditionStack.length-1]].rules:this.conditions.INITIAL.rules},topState:function(h){return h=this.conditionStack.length-1-Math.abs(h||0),h>=0?this.conditionStack[h]:"INITIAL"},pushState:function(h){this.begin(h)},stateStackSize:function(){return this.conditionStack.length},options:{},performAction:function(h,m,b,g){switch(b){case 0:return"(";case 1:return")";case 2:return"SPLAT";case 3:return"PARAM";case 4:return"LITERAL";case 5:return"LITERAL";case 6:return"EOF"}},rules:[/^(?:\()/,/^(?:\))/,/^(?:\*+\w+)/,/^(?::+\w+)/,/^(?:[\w%\-~\n]+)/,/^(?:.)/,/^(?:$)/],conditions:{INITIAL:{rules:[0,1,2,3,4,5,6],inclusive:!0}}};return d}();a.lexer=u;function p(){this.yy={}}return p.prototype=a,a.Parser=p,new p}();typeof ci<"u"&&(i.parser=t,i.Parser=t.Parser,i.parse=function(){return t.parse.apply(t,arguments)})})(Wr);function Q(i){return function(t,e){return{displayName:i,props:t,children:e||[]}}}var Yr={Root:Q("Root"),Concat:Q("Concat"),Literal:Q("Literal"),Splat:Q("Splat"),Param:Q("Param"),Optional:Q("Optional")},Jr=Wr.parser;Jr.yy=Yr;var hi=Jr,di=Object.keys(Yr);function ui(i){return di.forEach(function(t){if(typeof i[t]>"u")throw new Error("No handler defined for "+t.displayName)}),{visit:function(t,e){return this.handlers[t.displayName].call(this,t,e)},handlers:i}}var Kr=ui,pi=Kr,mi=/[\-{}\[\]+?.,\\\^$|#\s]/g;function Zr(i){this.captures=i.captures,this.re=i.re}Zr.prototype.match=function(i){var t=this.re.exec(i),e={};if(t)return this.captures.forEach(function(s,r){typeof t[r+1]>"u"?e[s]=void 0:e[s]=decodeURIComponent(t[r+1])}),e};var fi=pi({Concat:function(i){return i.children.reduce((function(t,e){var s=this.visit(e);return{re:t.re+s.re,captures:t.captures.concat(s.captures)}}).bind(this),{re:"",captures:[]})},Literal:function(i){return{re:i.props.value.replace(mi,"\\$&"),captures:[]}},Splat:function(i){return{re:"([^?]*?)",captures:[i.props.name]}},Param:function(i){return{re:"([^\\/\\?]+)",captures:[i.props.name]}},Optional:function(i){var t=this.visit(i.children[0]);return{re:"(?:"+t.re+")?",captures:t.captures}},Root:function(i){var t=this.visit(i.children[0]);return new Zr({re:new RegExp("^"+t.re+"(?=\\?|$)"),captures:t.captures})}}),gi=fi,bi=Kr,vi=bi({Concat:function(i,t){var e=i.children.map((function(s){return this.visit(s,t)}).bind(this));return e.some(function(s){return s===!1})?!1:e.join("")},Literal:function(i){return decodeURI(i.props.value)},Splat:function(i,t){return t[i.props.name]?t[i.props.name]:!1},Param:function(i,t){return t[i.props.name]?t[i.props.name]:!1},Optional:function(i,t){var e=this.visit(i.children[0],t);return e||""},Root:function(i,t){t=t||{};var e=this.visit(i.children[0],t);return e?encodeURI(e):!1}}),yi=vi,_i=hi,$i=gi,wi=yi;Pt.prototype=Object.create(null);Pt.prototype.match=function(i){var t=$i.visit(this.ast),e=t.match(i);return e||!1};Pt.prototype.reverse=function(i){return wi.visit(this.ast,i)};function Pt(i){var t;if(this?t=this:t=Object.create(Pt.prototype),typeof i>"u")throw new Error("A route spec is required");return t.spec=i,t.ast=_i.parse(i),t}var xi=Pt,Ai=xi,ki=Ai;const Si=li(ki);var Ei=Object.defineProperty,Qr=(i,t,e,s)=>{for(var r=void 0,o=i.length-1,n;o>=0;o--)(n=i[o])&&(r=n(t,e,r)||r);return r&&Ei(t,e,r),r};const Xr=class extends et{constructor(t,e,s=""){super(),this._cases=[],this._fallback=()=>ut` <h1>Not Found</h1> `,this._cases=t.map(r=>({...r,route:new Si(r.path)})),this._historyObserver=new vt(this,e),this._authObserver=new vt(this,s)}connectedCallback(){this._historyObserver.observe(({location:t})=>{console.log("New location",t),t&&(this._match=this.matchRoute(t))}),this._authObserver.observe(({user:t})=>{this._user=t}),super.connectedCallback()}render(){return console.log("Rendering for match",this._match,this._user),ut` <main>${(()=>{const e=this._match;if(e){if("view"in e)return this._user?e.auth&&e.auth!=="public"&&this._user&&!this._user.authenticated?(Cr(this,"auth/redirect"),ut` <h1>Redirecting for Login</h1> `):(console.log("Loading view, ",e.params,e.query),e.view(e.params||{},e.query)):ut` <h1>Authenticating</h1> `;if("redirect"in e){const s=e.redirect;if(typeof s=="string")return this.redirect(s),ut` <h1>Redirecting to ${s}…</h1> `}}return this._fallback({})})()}</main> `}updated(t){t.has("_match")&&this.requestUpdate()}matchRoute(t){const{search:e,pathname:s}=t,r=new URLSearchParams(e),o=s+e;for(const n of this._cases){const l=n.route.match(o);if(l)return{...n,path:s,params:l,query:r}}}redirect(t){_e(this,"history/redirect",{href:t})}};Xr.styles=Hs`
    :host,
    main {
      display: contents;
    }
  `;let Nt=Xr;Qr([Vr()],Nt.prototype,"_user");Qr([Vr()],Nt.prototype,"_match");const Pi=Object.freeze(Object.defineProperty({__proto__:null,Element:Nt,Switch:Nt},Symbol.toStringTag,{value:"Module"})),Ci=class ts extends HTMLElement{constructor(){if(super(),Bt(this).template(ts.template),this.shadowRoot){const t=this.shadowRoot.querySelector("slot[name='actuator']");t&&t.addEventListener("click",()=>this.toggle())}}toggle(){this.hasAttribute("open")?this.removeAttribute("open"):this.setAttribute("open","open")}};Ci.template=F`
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
  `;const es=class de extends HTMLElement{constructor(){super(),this._array=[],Bt(this).template(de.template).styles(de.styles),this.addEventListener("input-array:add",t=>{t.stopPropagation(),this.append(rs("",this._array.length))}),this.addEventListener("input-array:remove",t=>{t.stopPropagation(),this.removeClosestItem(t.target)}),this.addEventListener("change",t=>{t.stopPropagation();const e=t.target;if(e&&e!==this){const s=new Event("change",{bubbles:!0}),r=e.value,o=e.closest("label");if(o){const n=Array.from(this.children).indexOf(o);this._array[n]=r,this.dispatchEvent(s)}}}),this.addEventListener("click",t=>{Ye(t,"button.add")?ce(t,"input-array:add"):Ye(t,"button.remove")&&ce(t,"input-array:remove")})}get name(){return this.getAttribute("name")}get value(){return this._array}set value(t){this._array=Array.isArray(t)?t:[t],Oi(this._array,this)}removeClosestItem(t){const e=t.closest("label");if(console.log("Removing closest item:",e,t),e){const s=Array.from(this.children).indexOf(e);this._array.splice(s,1),e.remove()}}};es.template=F`
    <template>
      <ul>
        <slot></slot>
      </ul>
      <button class="add">
        <slot name="label-add">Add one</slot>
        <style></style>
      </button>
    </template>
  `;es.styles=Or`
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
  `;function Oi(i,t){t.replaceChildren(),i.forEach((e,s)=>t.append(rs(e)))}function rs(i,t){const e=i===void 0?F`<input />`:F`<input value="${i}" />`;return F`
    <label>
      ${e}
      <button class="remove" type="button">Remove</button>
    </label>
  `}function C(i){return Object.entries(i).map(([t,e])=>{customElements.get(t)||customElements.define(t,e)}),customElements}var Ti=Object.defineProperty,Mi=Object.getOwnPropertyDescriptor,Ri=(i,t,e,s)=>{for(var r=Mi(t,e),o=i.length-1,n;o>=0;o--)(n=i[o])&&(r=n(t,e,r)||r);return r&&Ti(t,e,r),r};class E extends et{constructor(t){super(),this._pending=[],this._observer=new vt(this,t)}get model(){return this._lastModel=this._context?this._context.value:{},this._lastModel}connectedCallback(){var t;super.connectedCallback(),(t=this._observer)==null||t.observe().then(e=>{console.log("View effect (initial)",this,e),this._context=e.context,this._pending.length&&this._pending.forEach(([s,r])=>{console.log("Dispatching queued event",r,s),s.dispatchEvent(r)}),e.setEffect(()=>{var s;if(console.log("View effect",this,e,(s=this._context)==null?void 0:s.value),this._context)console.log("requesting update"),this.requestUpdate();else throw"View context not ready for effect"})})}dispatchMessage(t,e=this){const s=new CustomEvent("mu:message",{bubbles:!0,composed:!0,detail:t});this._context?(console.log("Dispatching message event",s),e.dispatchEvent(s)):(console.log("Queueing message event",s),this._pending.push([e,s]))}ref(t){return this.model?this.model[t]:void 0}}Ri([Gr()],E.prototype,"model");/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Rt=globalThis,ke=Rt.ShadowRoot&&(Rt.ShadyCSS===void 0||Rt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Se=Symbol(),ur=new WeakMap;let ss=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==Se)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(ke&&t===void 0){const s=e!==void 0&&e.length===1;s&&(t=ur.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&ur.set(e,t))}return t}toString(){return this.cssText}};const Ii=i=>new ss(typeof i=="string"?i:i+"",void 0,Se),w=(i,...t)=>{const e=i.length===1?i[0]:t.reduce((s,r,o)=>s+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+i[o+1],i[0]);return new ss(e,i,Se)},Ui=(i,t)=>{if(ke)i.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const s=document.createElement("style"),r=Rt.litNonce;r!==void 0&&s.setAttribute("nonce",r),s.textContent=e.cssText,i.appendChild(s)}},pr=ke?i=>i:i=>i instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return Ii(e)})(i):i;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:ji,defineProperty:Ni,getOwnPropertyDescriptor:Di,getOwnPropertyNames:Li,getOwnPropertySymbols:zi,getPrototypeOf:Hi}=Object,U=globalThis,mr=U.trustedTypes,Fi=mr?mr.emptyScript:"",se=U.reactiveElementPolyfillSupport,gt=(i,t)=>i,Dt={toAttribute(i,t){switch(t){case Boolean:i=i?Fi:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,t){let e=i;switch(t){case Boolean:e=i!==null;break;case Number:e=i===null?null:Number(i);break;case Object:case Array:try{e=JSON.parse(i)}catch{e=null}}return e}},Ee=(i,t)=>!ji(i,t),fr={attribute:!0,type:String,converter:Dt,reflect:!1,useDefault:!1,hasChanged:Ee};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),U.litPropertyMetadata??(U.litPropertyMetadata=new WeakMap);let tt=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=fr){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),r=this.getPropertyDescriptor(t,s,e);r!==void 0&&Ni(this.prototype,t,r)}}static getPropertyDescriptor(t,e,s){const{get:r,set:o}=Di(this.prototype,t)??{get(){return this[e]},set(n){this[e]=n}};return{get:r,set(n){const l=r==null?void 0:r.call(this);o==null||o.call(this,n),this.requestUpdate(t,l,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??fr}static _$Ei(){if(this.hasOwnProperty(gt("elementProperties")))return;const t=Hi(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(gt("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(gt("properties"))){const e=this.properties,s=[...Li(e),...zi(e)];for(const r of s)this.createProperty(r,e[r])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[s,r]of e)this.elementProperties.set(s,r)}this._$Eh=new Map;for(const[e,s]of this.elementProperties){const r=this._$Eu(e,s);r!==void 0&&this._$Eh.set(r,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const r of s)e.unshift(pr(r))}else t!==void 0&&e.push(pr(t));return e}static _$Eu(t,e){const s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((e=t.hostConnected)==null||e.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Ui(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostConnected)==null?void 0:s.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostDisconnected)==null?void 0:s.call(e)})}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){var o;const s=this.constructor.elementProperties.get(t),r=this.constructor._$Eu(t,s);if(r!==void 0&&s.reflect===!0){const n=(((o=s.converter)==null?void 0:o.toAttribute)!==void 0?s.converter:Dt).toAttribute(e,s.type);this._$Em=t,n==null?this.removeAttribute(r):this.setAttribute(r,n),this._$Em=null}}_$AK(t,e){var o,n;const s=this.constructor,r=s._$Eh.get(t);if(r!==void 0&&this._$Em!==r){const l=s.getPropertyOptions(r),a=typeof l.converter=="function"?{fromAttribute:l.converter}:((o=l.converter)==null?void 0:o.fromAttribute)!==void 0?l.converter:Dt;this._$Em=r,this[r]=a.fromAttribute(e,l.type)??((n=this._$Ej)==null?void 0:n.get(r))??null,this._$Em=null}}requestUpdate(t,e,s){var r;if(t!==void 0){const o=this.constructor,n=this[t];if(s??(s=o.getPropertyOptions(t)),!((s.hasChanged??Ee)(n,e)||s.useDefault&&s.reflect&&n===((r=this._$Ej)==null?void 0:r.get(t))&&!this.hasAttribute(o._$Eu(t,s))))return;this.C(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:r,wrapped:o},n){s&&!(this._$Ej??(this._$Ej=new Map)).has(t)&&(this._$Ej.set(t,n??e??this[t]),o!==!0||n!==void 0)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),r===!0&&this._$Em!==t&&(this._$Eq??(this._$Eq=new Set)).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var s;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[o,n]of this._$Ep)this[o]=n;this._$Ep=void 0}const r=this.constructor.elementProperties;if(r.size>0)for(const[o,n]of r){const{wrapped:l}=n,a=this[o];l!==!0||this._$AL.has(o)||a===void 0||this.C(o,void 0,n,a)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),(s=this._$EO)==null||s.forEach(r=>{var o;return(o=r.hostUpdate)==null?void 0:o.call(r)}),this.update(e)):this._$EM()}catch(r){throw t=!1,this._$EM(),r}t&&this._$AE(e)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(s=>{var r;return(r=s.hostUpdated)==null?void 0:r.call(s)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&(this._$Eq=this._$Eq.forEach(e=>this._$ET(e,this[e]))),this._$EM()}updated(t){}firstUpdated(t){}};tt.elementStyles=[],tt.shadowRootOptions={mode:"open"},tt[gt("elementProperties")]=new Map,tt[gt("finalized")]=new Map,se==null||se({ReactiveElement:tt}),(U.reactiveElementVersions??(U.reactiveElementVersions=[])).push("2.1.0");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const bt=globalThis,Lt=bt.trustedTypes,gr=Lt?Lt.createPolicy("lit-html",{createHTML:i=>i}):void 0,is="$lit$",I=`lit$${Math.random().toFixed(9).slice(2)}$`,os="?"+I,qi=`<${os}>`,G=document,$t=()=>G.createComment(""),wt=i=>i===null||typeof i!="object"&&typeof i!="function",Pe=Array.isArray,Bi=i=>Pe(i)||typeof(i==null?void 0:i[Symbol.iterator])=="function",ie=`[ 	
\f\r]`,pt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,br=/-->/g,vr=/>/g,L=RegExp(`>|${ie}(?:([^\\s"'>=/]+)(${ie}*=${ie}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),yr=/'/g,_r=/"/g,ns=/^(?:script|style|textarea|title)$/i,Gi=i=>(t,...e)=>({_$litType$:i,strings:t,values:e}),f=Gi(1),at=Symbol.for("lit-noChange"),$=Symbol.for("lit-nothing"),$r=new WeakMap,H=G.createTreeWalker(G,129);function as(i,t){if(!Pe(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return gr!==void 0?gr.createHTML(t):t}const Vi=(i,t)=>{const e=i.length-1,s=[];let r,o=t===2?"<svg>":t===3?"<math>":"",n=pt;for(let l=0;l<e;l++){const a=i[l];let u,p,d=-1,c=0;for(;c<a.length&&(n.lastIndex=c,p=n.exec(a),p!==null);)c=n.lastIndex,n===pt?p[1]==="!--"?n=br:p[1]!==void 0?n=vr:p[2]!==void 0?(ns.test(p[2])&&(r=RegExp("</"+p[2],"g")),n=L):p[3]!==void 0&&(n=L):n===L?p[0]===">"?(n=r??pt,d=-1):p[1]===void 0?d=-2:(d=n.lastIndex-p[2].length,u=p[1],n=p[3]===void 0?L:p[3]==='"'?_r:yr):n===_r||n===yr?n=L:n===br||n===vr?n=pt:(n=L,r=void 0);const h=n===L&&i[l+1].startsWith("/>")?" ":"";o+=n===pt?a+qi:d>=0?(s.push(u),a.slice(0,d)+is+a.slice(d)+I+h):a+I+(d===-2?l:h)}return[as(i,o+(i[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]};class xt{constructor({strings:t,_$litType$:e},s){let r;this.parts=[];let o=0,n=0;const l=t.length-1,a=this.parts,[u,p]=Vi(t,e);if(this.el=xt.createElement(u,s),H.currentNode=this.el.content,e===2||e===3){const d=this.el.content.firstChild;d.replaceWith(...d.childNodes)}for(;(r=H.nextNode())!==null&&a.length<l;){if(r.nodeType===1){if(r.hasAttributes())for(const d of r.getAttributeNames())if(d.endsWith(is)){const c=p[n++],h=r.getAttribute(d).split(I),m=/([.?@])?(.*)/.exec(c);a.push({type:1,index:o,name:m[2],strings:h,ctor:m[1]==="."?Yi:m[1]==="?"?Ji:m[1]==="@"?Ki:Vt}),r.removeAttribute(d)}else d.startsWith(I)&&(a.push({type:6,index:o}),r.removeAttribute(d));if(ns.test(r.tagName)){const d=r.textContent.split(I),c=d.length-1;if(c>0){r.textContent=Lt?Lt.emptyScript:"";for(let h=0;h<c;h++)r.append(d[h],$t()),H.nextNode(),a.push({type:2,index:++o});r.append(d[c],$t())}}}else if(r.nodeType===8)if(r.data===os)a.push({type:2,index:o});else{let d=-1;for(;(d=r.data.indexOf(I,d+1))!==-1;)a.push({type:7,index:o}),d+=I.length-1}o++}}static createElement(t,e){const s=G.createElement("template");return s.innerHTML=t,s}}function lt(i,t,e=i,s){var n,l;if(t===at)return t;let r=s!==void 0?(n=e._$Co)==null?void 0:n[s]:e._$Cl;const o=wt(t)?void 0:t._$litDirective$;return(r==null?void 0:r.constructor)!==o&&((l=r==null?void 0:r._$AO)==null||l.call(r,!1),o===void 0?r=void 0:(r=new o(i),r._$AT(i,e,s)),s!==void 0?(e._$Co??(e._$Co=[]))[s]=r:e._$Cl=r),r!==void 0&&(t=lt(i,r._$AS(i,t.values),r,s)),t}class Wi{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,r=((t==null?void 0:t.creationScope)??G).importNode(e,!0);H.currentNode=r;let o=H.nextNode(),n=0,l=0,a=s[0];for(;a!==void 0;){if(n===a.index){let u;a.type===2?u=new Ct(o,o.nextSibling,this,t):a.type===1?u=new a.ctor(o,a.name,a.strings,this,t):a.type===6&&(u=new Zi(o,this,t)),this._$AV.push(u),a=s[++l]}n!==(a==null?void 0:a.index)&&(o=H.nextNode(),n++)}return H.currentNode=G,r}p(t){let e=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class Ct{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this._$Cv}constructor(t,e,s,r){this.type=2,this._$AH=$,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=r,this._$Cv=(r==null?void 0:r.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=lt(this,t,e),wt(t)?t===$||t==null||t===""?(this._$AH!==$&&this._$AR(),this._$AH=$):t!==this._$AH&&t!==at&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Bi(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==$&&wt(this._$AH)?this._$AA.nextSibling.data=t:this.T(G.createTextNode(t)),this._$AH=t}$(t){var o;const{values:e,_$litType$:s}=t,r=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=xt.createElement(as(s.h,s.h[0]),this.options)),s);if(((o=this._$AH)==null?void 0:o._$AD)===r)this._$AH.p(e);else{const n=new Wi(r,this),l=n.u(this.options);n.p(e),this.T(l),this._$AH=n}}_$AC(t){let e=$r.get(t.strings);return e===void 0&&$r.set(t.strings,e=new xt(t)),e}k(t){Pe(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,r=0;for(const o of t)r===e.length?e.push(s=new Ct(this.O($t()),this.O($t()),this,this.options)):s=e[r],s._$AI(o),r++;r<e.length&&(this._$AR(s&&s._$AB.nextSibling,r),e.length=r)}_$AR(t=this._$AA.nextSibling,e){var s;for((s=this._$AP)==null?void 0:s.call(this,!1,!0,e);t&&t!==this._$AB;){const r=t.nextSibling;t.remove(),t=r}}setConnected(t){var e;this._$AM===void 0&&(this._$Cv=t,(e=this._$AP)==null||e.call(this,t))}}class Vt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,r,o){this.type=1,this._$AH=$,this._$AN=void 0,this.element=t,this.name=e,this._$AM=r,this.options=o,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=$}_$AI(t,e=this,s,r){const o=this.strings;let n=!1;if(o===void 0)t=lt(this,t,e,0),n=!wt(t)||t!==this._$AH&&t!==at,n&&(this._$AH=t);else{const l=t;let a,u;for(t=o[0],a=0;a<o.length-1;a++)u=lt(this,l[s+a],e,a),u===at&&(u=this._$AH[a]),n||(n=!wt(u)||u!==this._$AH[a]),u===$?t=$:t!==$&&(t+=(u??"")+o[a+1]),this._$AH[a]=u}n&&!r&&this.j(t)}j(t){t===$?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class Yi extends Vt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===$?void 0:t}}class Ji extends Vt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==$)}}class Ki extends Vt{constructor(t,e,s,r,o){super(t,e,s,r,o),this.type=5}_$AI(t,e=this){if((t=lt(this,t,e,0)??$)===at)return;const s=this._$AH,r=t===$&&s!==$||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,o=t!==$&&(s===$||r);r&&this.element.removeEventListener(this.name,this,s),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;typeof this._$AH=="function"?this._$AH.call(((e=this.options)==null?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}}class Zi{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){lt(this,t)}}const oe=bt.litHtmlPolyfillSupport;oe==null||oe(xt,Ct),(bt.litHtmlVersions??(bt.litHtmlVersions=[])).push("3.3.0");const Qi=(i,t,e)=>{const s=(e==null?void 0:e.renderBefore)??t;let r=s._$litPart$;if(r===void 0){const o=(e==null?void 0:e.renderBefore)??null;s._$litPart$=r=new Ct(t.insertBefore($t(),o),o,void 0,e??{})}return r._$AI(i),r};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const q=globalThis;class M extends tt{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var e;const t=super.createRenderRoot();return(e=this.renderOptions).renderBefore??(e.renderBefore=t.firstChild),t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Qi(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)==null||t.setConnected(!1)}render(){return at}}var wr;M._$litElement$=!0,M.finalized=!0,(wr=q.litElementHydrateSupport)==null||wr.call(q,{LitElement:M});const ne=q.litElementPolyfillSupport;ne==null||ne({LitElement:M});(q.litElementVersions??(q.litElementVersions=[])).push("4.2.0");const Xi={songs:[],playlists:[],albums:[],genres:[]};function to(i,t,e){switch(i[0]){case"songs/load":so(e).then(r=>t(o=>({...o,songs:r})));break;case"songs/set":t(r=>({...r,songs:i[1].songs}));break;case"song/select":{const{songId:r}=i[1];t(o=>{const n=o.songs.find(l=>l._id===r);return{...o,selectedSong:n}});break}case"songs/add":{eo(i[1],e).then(r=>t(o=>({...o,songs:[...o.songs,r]}))).then(()=>{var r,o;return(o=(r=i[1]).onSuccess)==null?void 0:o.call(r)}).catch(r=>{var o,n;return(n=(o=i[1]).onFailure)==null?void 0:n.call(o,r)});break}case"songs/save":{ro(i[1],e).then(r=>t(o=>({...o,songs:o.songs.map(n=>n._id===r._id?r:n)}))).then(()=>{var r,o;return(o=(r=i[1]).onSuccess)==null?void 0:o.call(r)}).catch(r=>{var o,n;return(n=(o=i[1]).onFailure)==null?void 0:n.call(o,r)});break}case"playlist/select":{const{playlistId:r}=i[1];io(r,e).then(o=>t(n=>({...n,selectedPlaylist:o})));break}case"playlist/save":{oo(i[1],e).then(r=>t(o=>({...o,selectedPlaylist:r}))).then(()=>{var r,o;return(o=(r=i[1]).onSuccess)==null?void 0:o.call(r)}).catch(r=>{var o,n;return(n=(o=i[1]).onFailure)==null?void 0:n.call(o,r)});break}case"genre/save":{no(i[1],e).then(r=>t(o=>({...o,genres:o.genres.map(n=>n._id===r._id?r:n)}))).then(()=>{var r,o;return(o=(r=i[1]).onSuccess)==null?void 0:o.call(r)}).catch(r=>{var o,n;return(n=(o=i[1]).onFailure)==null?void 0:n.call(o,r)});break}case"albums/load":fetch("/api/albums",{headers:P.headers(e)}).then(r=>r.json()).then(r=>t(o=>({...o,albums:r})));break;case"genres/load":fetch("/api/genres",{headers:P.headers(e)}).then(r=>r.json()).then(r=>t(o=>({...o,genres:r})));break;case"album/save":{ao(i[1],e).then(r=>t(o=>({...o,albums:o.albums.map(n=>n._id===r._id?r:n)}))).then(()=>{var r,o;return(o=(r=i[1]).onSuccess)==null?void 0:o.call(r)}).catch(r=>{var o,n;return(n=(o=i[1]).onFailure)==null?void 0:n.call(o,r)});break}default:const s=i[0];throw new Error(`Unhandled message: ${s}`)}}function eo(i,t){return fetch("/api/songs",{method:"POST",headers:{"Content-Type":"application/json",...P.headers(t)},body:JSON.stringify(i.song)}).then(e=>{if(e.status===201)return e.json();throw new Error("Failed to create new song")}).then(e=>e)}function ro(i,t){return fetch(`/api/songs/${i.songId}`,{method:"PUT",headers:{"Content-Type":"application/json",...P.headers(t)},body:JSON.stringify(i.song)}).then(e=>{if(e.status===200)return e.json();throw new Error(`Failed to save song for ${i.songId}`)}).then(e=>e)}function so(i){const t=P.headers(i);return console.log("Auth headers:",t),fetch("/api/songs",{headers:t}).then(e=>{if(e.status===403)throw new Error("Forbidden - check token");return e.ok?e.json():[]}).then(e=>e)}function io(i,t){return fetch(`/api/playlists/${i}`,{headers:P.headers(t)}).then(e=>e.ok?e.json():void 0).then(e=>e)}function oo(i,t){return fetch(`/api/playlists/${i.playlistId}`,{method:"PUT",headers:{"Content-Type":"application/json",...P.headers(t)},body:JSON.stringify(i.playlist)}).then(e=>{if(e.status===200)return e.json();throw new Error(`Failed to save playlist for ${i.playlistId}`)}).then(e=>e)}function no(i,t){return fetch(`/api/genres/${i.genreId}`,{method:"PUT",headers:{"Content-Type":"application/json",...P.headers(t)},body:JSON.stringify(i.genre)}).then(e=>{if(e.status===200)return e.json();throw new Error(`Failed to save genre for ${i.genreId}`)}).then(e=>e)}function ao(i,t){return fetch(`/api/albums/${i.albumId}`,{method:"PUT",headers:{"Content-Type":"application/json",...P.headers(t)},body:JSON.stringify(i.album)}).then(e=>{if(e.status===200)return e.json();throw new Error(`Failed to save album for ${i.albumId}`)}).then(e=>e)}const Oe=class Oe extends M{static initializeOnce(){}render(){return f`
      <header>
        <h1>🎵 Musica</h1>
        <slot name="actuator"></slot>
      </header>
    `}};Oe.styles=w`
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
  `;let zt=Oe;customElements.define("blazing-header",zt);/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ls=i=>(t,e)=>{e!==void 0?e.addInitializer(()=>{customElements.define(i,t)}):customElements.define(i,t)};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const lo={attribute:!0,type:String,converter:Dt,reflect:!1,hasChanged:Ee},co=(i=lo,t,e)=>{const{kind:s,metadata:r}=e;let o=globalThis.litPropertyMetadata.get(r);if(o===void 0&&globalThis.litPropertyMetadata.set(r,o=new Map),s==="setter"&&((i=Object.create(i)).wrapped=!0),o.set(e.name,i),s==="accessor"){const{name:n}=e;return{set(l){const a=t.get.call(this);t.set.call(this,l),this.requestUpdate(n,a,i)},init(l){return l!==void 0&&this.C(n,void 0,i,l),l}}}if(s==="setter"){const{name:n}=e;return function(l){const a=this[n];t.call(this,l),this.requestUpdate(n,a,i)}}throw Error("Unsupported decorator location: "+s)};function O(i){return(t,e)=>typeof e=="object"?co(i,t,e):((s,r,o)=>{const n=r.hasOwnProperty(o);return r.constructor.createProperty(o,s),n?Object.getOwnPropertyDescriptor(r,o):void 0})(i,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function x(i){return O({...i,state:!0,attribute:!1})}var ho=Object.defineProperty,Wt=(i,t,e,s)=>{for(var r=void 0,o=i.length-1,n;o>=0;o--)(n=i[o])&&(r=n(t,e,r)||r);return r&&ho(t,e,r),r};const Te=class Te extends M{constructor(){super(...arguments),this.formData={},this.redirect="/"}get canSubmit(){return!!(this.api&&this.formData.username&&this.formData.password)}render(){return f`
      <form
        @change=${t=>this.handleChange(t)}
        @submit=${t=>this.handleSubmit(t)}
      >
        <slot></slot>
        <slot name="button">
          <button type="submit" ?disabled=${!this.canSubmit}>Login</button>
        </slot>
        <p class="error">${this.error}</p>
      </form>
    `}handleChange(t){const e=t.target,s=e==null?void 0:e.name,r=e==null?void 0:e.value,o=this.formData;switch(s){case"username":this.formData={...o,username:r};break;case"password":this.formData={...o,password:r};break}}handleSubmit(t){t.preventDefault(),this.canSubmit&&fetch((this==null?void 0:this.api)||"",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(this.formData)}).then(e=>{if(e.status!==200)throw"Login failed";return e.json()}).then(e=>{const{token:s}=e,r=new CustomEvent("auth:message",{bubbles:!0,composed:!0,detail:["auth/signin",{token:s,redirect:this.redirect}]});console.log("dispatching message",r),this.dispatchEvent(new CustomEvent("auth:message",{bubbles:!0,composed:!0,detail:["auth/signin",{token:s,redirect:this.redirect}]}))}).catch(e=>{console.log(e),this.error=e.toString()})}};Te.styles=w`
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
  `;let V=Te;Wt([x()],V.prototype,"formData");Wt([O()],V.prototype,"api");Wt([O()],V.prototype,"redirect");Wt([x()],V.prototype,"error");customElements.define("login-form",V);var uo=Object.getOwnPropertyDescriptor,po=(i,t,e,s)=>{for(var r=s>1?void 0:s?uo(t,e):t,o=i.length-1,n;o>=0;o--)(n=i[o])&&(r=n(r)||r);return r};let ue=class extends M{render(){return f`
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
    `}};ue.styles=w`
    main {
      max-width: 500px;
      margin: auto;
      padding: 2rem;
    }
    h2 {
      text-align: center;
    }
  `;ue=po([ls("login-view")],ue);var mo=Object.defineProperty,Yt=(i,t,e,s)=>{for(var r=void 0,o=i.length-1,n;o>=0;o--)(n=i[o])&&(r=n(t,e,r)||r);return r&&mo(t,e,r),r};const Me=class Me extends M{constructor(){super(...arguments),this.formData={},this.redirect="/"}get canSubmit(){return!!(this.api&&this.formData.username&&this.formData.password)}render(){return f`
      <form
        @change=${t=>this.handleChange(t)}
        @submit=${t=>this.handleSubmit(t)}
      >
        <slot></slot>
        <slot name="button">
          <button type="submit" ?disabled=${!this.canSubmit}>Register</button>
        </slot>
        <p class="error">${this.error}</p>
      </form>
    `}handleChange(t){const e=t.target,s=e==null?void 0:e.name,r=e==null?void 0:e.value,o=this.formData;switch(s){case"username":this.formData={...o,username:r};break;case"password":this.formData={...o,password:r};break}}handleSubmit(t){t.preventDefault(),this.canSubmit&&fetch((this==null?void 0:this.api)||"",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(this.formData)}).then(e=>{if(e.status!==201)throw"Registration failed";return e.json()}).then(e=>{const{token:s}=e;this.dispatchEvent(new CustomEvent("auth:message",{bubbles:!0,composed:!0,detail:["auth/signin",{token:s,redirect:this.redirect}]}))}).catch(e=>{this.error=e.toString()})}};Me.styles=w`
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
  `;let W=Me;Yt([x()],W.prototype,"formData");Yt([O()],W.prototype,"api");Yt([O()],W.prototype,"redirect");Yt([x()],W.prototype,"error");customElements.define("register-form",W);var fo=Object.getOwnPropertyDescriptor,go=(i,t,e,s)=>{for(var r=s>1?void 0:s?fo(t,e):t,o=i.length-1,n;o>=0;o--)(n=i[o])&&(r=n(r)||r);return r};let pe=class extends M{render(){return f`
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
    `}};pe.styles=w`
    main {
      max-width: 500px;
      margin: auto;
      padding: 2rem;
    }
    h2 {
      text-align: center;
    }
  `;pe=go([ls("register-view")],pe);const Re=class Re extends E{constructor(){super("musica:model")}render(){var t,e;return f`
      <div class="container">
        <h2>Add New Song</h2>
        <form @submit=${this.addSong}>
          <input type="text" name="title" placeholder="Title" required />
          <input type="text" name="artist" placeholder="Artist" required />

          <select name="album">
            <option value="">Select Album (optional)</option>
            ${(t=this.model.albums)==null?void 0:t.map(s=>f`<option value=${s.name}>${s.name}</option>`)}
          </select>

          <select name="genre">
            <option value="">Select Genre (optional)</option>
            ${(e=this.model.genres)==null?void 0:e.map(s=>f`<option value=${s.name}>${s.name}</option>`)}
          </select>

          <input type="url" name="url" placeholder="Song URL (optional)" />
          <button type="submit">Add Song</button>
        </form>
        <p class="back-link"><a href="/app/songs">&#8592; Back to Songs</a></p>
      </div>
    `}addSong(t){var o,n,l,a,u,p;t.preventDefault();const e=t.target,s=new FormData(e),r={title:((o=s.get("title"))==null?void 0:o.toString())||"",artist:((n=s.get("artist"))==null?void 0:n.toString())||"",album:((l=s.get("album"))==null?void 0:l.toString())||"",genre:((a=s.get("genre"))==null?void 0:a.toString())||"",url:((u=s.get("url"))==null?void 0:u.toString())||"",cover:((p=s.get("cover"))==null?void 0:p.toString())||""};this.dispatchMessage(["songs/add",{song:r,onSuccess:()=>history.back()}])}};Re.styles=w`
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

    /* Style only the album and genre dropdowns */
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
  `;let me=Re;C({"song-add":me});var bo=Object.defineProperty,vo=(i,t,e,s)=>{for(var r=void 0,o=i.length-1,n;o>=0;o--)(n=i[o])&&(r=n(t,e,r)||r);return r&&bo(t,e,r),r};const Ie=class Ie extends E{constructor(){super("musica:model"),this.songId=""}render(){const t=this.model.songs.find(r=>r._id===this.songId),e=this.model.albums||[],s=this.model.genres||[];return f`
      <div class="container">
        <h2>Edit Song</h2>
        <form @submit=${this.save}>
          <input
            type="text"
            name="title"
            .value=${(t==null?void 0:t.title)||""}
            placeholder="Song title"
            required
          />
          <input
            type="text"
            name="artist"
            .value=${(t==null?void 0:t.artist)||""}
            placeholder="Artist"
            required
          />
          <select name="album">
            ${e.map(r=>f`<option
                value=${r.name}
                ?selected=${(t==null?void 0:t.album)===r.name}
              >
                ${r.name}
              </option>`)}
          </select>
          <select name="genre">
            ${s.map(r=>f`<option
                value=${r.name}
                ?selected=${(t==null?void 0:t.genre)===r.name}
              >
                ${r.name}
              </option>`)}
          </select>
          <input
            type="number"
            name="year"
            .value=${(t==null?void 0:t.year)||""}
            placeholder="Year"
          />
          <input
            type="text"
            name="url"
            .value=${(t==null?void 0:t.url)||""}
            placeholder="Audio URL"
          />
          <button type="submit">Save</button>
        </form>
        <p><a href="/app/songs">← Back to Songs</a></p>
      </div>
    `}save(t){var o,n,l,a,u;t.preventDefault();const e=t.target,s=new FormData(e),r={...this.model.songs.find(p=>p._id===this.songId),title:((o=s.get("title"))==null?void 0:o.toString())??"",artist:((n=s.get("artist"))==null?void 0:n.toString())??"",album:((l=s.get("album"))==null?void 0:l.toString())??"",genre:((a=s.get("genre"))==null?void 0:a.toString())??"",year:Number(s.get("year"))||void 0,url:((u=s.get("url"))==null?void 0:u.toString())??""};this.dispatchMessage(["songs/save",{songId:this.songId,song:r,onSuccess:()=>history.back()}])}};Ie.styles=w`
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
  `;let Ht=Ie;vo([O({attribute:"song-id"})],Ht.prototype,"songId");C({"song-edit":Ht});var yo=Object.defineProperty,Ce=(i,t,e,s)=>{for(var r=void 0,o=i.length-1,n;o>=0;o--)(n=i[o])&&(r=n(t,e,r)||r);return r&&yo(t,e,r),r};const Ue=class Ue extends E{constructor(){super("musica:model"),this.selectedAlbum="",this.selectedGenre="",this.darkMode=localStorage.getItem("dark-mode")==="true"}get songs(){return this.model.songs.filter(t=>(!this.selectedAlbum||t.album===this.selectedAlbum)&&(!this.selectedGenre||t.genre===this.selectedGenre))}connectedCallback(){super.connectedCallback(),this.dispatchMessage(["songs/load",{}]),this.dispatchMessage(["albums/load",{}]),this.dispatchMessage(["genres/load",{}])}logout(){localStorage.removeItem("token");const t=new CustomEvent("auth:message",{bubbles:!0,composed:!0,detail:["auth/signout",{redirect:"/login"}]});this.dispatchEvent(t)}toggleDarkMode(t){const e=t.target.checked;this.darkMode=e,document.body.classList.toggle("dark-mode",e),localStorage.setItem("dark-mode",String(e))}goToAddSong(){window.location.href="/app/songs/add"}goToEditSong(t){window.location.href=`/app/songs/edit/${t}`}goToAlbums(){window.location.href="/app/albums"}goToGenres(){window.location.href="/app/genres"}async deleteSong(t){if(confirm("Are you sure you want to delete this song?"))try{if(!(await fetch(`/api/songs/${t}`,{method:"DELETE"})).ok)throw new Error("Failed to delete song");this.dispatchMessage(["songs/load",{}])}catch(e){console.error("Delete error:",e)}}render(){var t,e;return f`
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
            ${(t=this.model.albums)==null?void 0:t.map(s=>f`<option
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
            ${(e=this.model.genres)==null?void 0:e.map(s=>f`<option
                  value=${s.name}
                  ?selected=${s.name===this.selectedGenre}
                >
                  ${s.name}
                </option>`)}
          </select>

          <button @click=${this.goToAddSong}>Add Song</button>
        </div>

        <div class="grid">
          ${this.songs.map(s=>f`
              <div class="card">
                <img
                  class="cover"
                  src=${s.cover||"/images/default.jpg"}
                  alt="Cover for ${s.title}"
                />
                <div class="info">
                  <div class="title">${s.title}</div>
                  <div class="artist">${s.artist}</div>
                </div>
                <div class="button-row">
                  <button
                    class="edit-btn"
                    @click=${()=>this.goToEditSong(s._id)}
                  >
                    Edit
                  </button>
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
    `}};Ue.styles=w`
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
  `;let ct=Ue;Ce([x()],ct.prototype,"selectedAlbum");Ce([x()],ct.prototype,"selectedGenre");Ce([x()],ct.prototype,"darkMode");customElements.define("songs-view",ct);var _o=Object.defineProperty,$o=Object.getOwnPropertyDescriptor,cs=(i,t,e,s)=>{for(var r=s>1?void 0:s?$o(t,e):t,o=i.length-1,n;o>=0;o--)(n=i[o])&&(r=(s?n(t,e,r):n(r))||r);return s&&r&&_o(t,e,r),r};const je=class je extends E{constructor(){super("musica:model"),this.playlistId=""}get songs(){var t,e;return((e=(t=this.model.selectedPlaylist)==null?void 0:t.songIds)==null?void 0:e.map(s=>this.model.songs.find(r=>{var o;return((o=r._id)==null?void 0:o.toString())===s})).filter(s=>!!s))??[]}connectedCallback(){super.connectedCallback(),this.dispatchMessage(["songs/load",{}]),this.playlistId&&this.dispatchMessage(["playlist/select",{playlistId:this.playlistId}])}attributeChangedCallback(t,e,s){super.attributeChangedCallback(t,e,s),t==="playlist-id"&&e!==s&&s&&this.dispatchMessage(["playlist/select",{playlistId:s}])}render(){var t;return f`
      <div class="container">
        <h2>
          Playlist: ${((t=this.model.selectedPlaylist)==null?void 0:t.name)??this.playlistId}
        </h2>
        ${this.songs.map(e=>f`
            <div class="song">
              <img src=${e.url??""} />
              <div class="song-details">
                <strong>${e.title}</strong>
                <span>${e.artist}</span>
              </div>
            </div>
          `)}
        <p><a href="/app">← Back</a></p>
      </div>
    `}};je.styles=w`
    .container {
      padding: 1rem;
    }

    .song {
      display: flex;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .song img {
      width: 64px;
      height: 64px;
      object-fit: cover;
    }

    .song-details {
      display: flex;
      flex-direction: column;
    }
  `;let At=je;cs([O({attribute:"playlist-id"})],At.prototype,"playlistId",2);cs([x()],At.prototype,"songs",1);C({"playlist-view":At});var wo=Object.defineProperty,xo=Object.getOwnPropertyDescriptor,hs=(i,t,e,s)=>{for(var r=s>1?void 0:s?xo(t,e):t,o=i.length-1,n;o>=0;o--)(n=i[o])&&(r=(s?n(t,e,r):n(r))||r);return s&&r&&wo(t,e,r),r};const Ne=class Ne extends E{constructor(){super("musica:model"),this.playlistId=""}get playlist(){return this.model.selectedPlaylist}connectedCallback(){super.connectedCallback(),this.playlistId&&this.dispatchMessage(["playlist/select",{playlistId:this.playlistId}])}render(){return f`
      <h2>Edit Playlist</h2>
      ${this.playlist?f`<mu-form
            .init=${this.playlist}
            @mu-form:submit=${this.handleSubmit}
          >
            <label>
              Name:
              <input name="name" .value=${this.playlist.name} required />
            </label>
            <label>
              Description:
              <input
                name="description"
                .value=${this.playlist.description??""}
              />
            </label>
            <button type="submit">Save</button>
          </mu-form>`:f`<p>Loading...</p>`}
    `}handleSubmit(t){this.dispatchMessage(["playlist/save",{playlistId:this.playlistId,playlist:t.detail,onSuccess:()=>Rr.dispatch(this,"history/navigate",{href:`/app/playlist/${this.playlistId}`}),onFailure:e=>console.error("Save failed:",e)}])}};Ne.uses=C({"mu-form":Rs.Element});let kt=Ne;hs([O({attribute:"playlist-id"})],kt.prototype,"playlistId",2);hs([x()],kt.prototype,"playlist",1);C({"playlist-edit":kt});var Ao=Object.defineProperty,ds=(i,t,e,s)=>{for(var r=void 0,o=i.length-1,n;o>=0;o--)(n=i[o])&&(r=n(t,e,r)||r);return r&&Ao(t,e,r),r};const De=class De extends E{constructor(){super("musica:model"),this.albums=[],this.darkMode=localStorage.getItem("dark-mode")==="true"}connectedCallback(){super.connectedCallback(),this.loadAlbums()}toggleDarkMode(t){const e=t.target.checked;this.darkMode=e,document.body.classList.toggle("dark-mode",e),localStorage.setItem("dark-mode",String(e))}async loadAlbums(){try{const t=await fetch("/api/albums");if(!t.ok)throw new Error("Failed to load albums");this.albums=await t.json()}catch(t){console.error("Error fetching albums:",t)}}async deleteAlbum(t){if(confirm("Are you sure you want to delete this album?"))try{if(!(await fetch(`/api/albums/${t}`,{method:"DELETE"})).ok)throw new Error("Failed to delete");this.loadAlbums()}catch(e){console.error("Delete error:",e)}}goToAddAlbum(){window.location.href="/app/albums/add"}goToEditAlbum(t){window.location.href=`/app/albums/edit/${t}`}render(){return f`
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
                @change=${t=>this.toggleDarkMode(t)}
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
          ${this.albums.map(t=>f`
              <div class="album-card">
                <img
                  class="cover"
                  src=${t.cover||"/images/default.jpeg"}
                  alt="Cover for ${t.name}"
                />
                <div class="title">${t.name}</div>
                <div class="artist">${t.artist||"Unknown Artist"}</div>
                <div class="button-row">
                  <button
                    class="edit-btn"
                    @click=${()=>this.goToEditAlbum(t._id)}
                  >
                    Edit
                  </button>
                  <button
                    class="delete-btn"
                    @click=${()=>this.deleteAlbum(t._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            `)}
        </div>
      </div>
    `}};De.styles=w`
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
  `;let St=De;ds([x()],St.prototype,"albums");ds([x()],St.prototype,"darkMode");customElements.define("album-view",St);const Le=class Le extends E{constructor(){super("musica:model")}render(){return f`
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
        <p class="back-link"><a href="/app/albums">&#8592; Back to Albums</a></p>
      </div>
    `}save(t){t.preventDefault(),console.log("submitting…");const e=t.target,s=new FormData(e);fetch("/api/albums",{method:"POST",body:s}).then(r=>{if(!r.ok)throw new Error("Failed to add album");history.back()}).catch(console.error)}};Le.styles=w`
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
  `;let fe=Le;C({"album-add":fe});var ko=Object.defineProperty,So=(i,t,e,s)=>{for(var r=void 0,o=i.length-1,n;o>=0;o--)(n=i[o])&&(r=n(t,e,r)||r);return r&&ko(t,e,r),r};const ze=class ze extends E{constructor(){super("musica:model"),this.albumId=""}render(){var e;const t=(e=this.model.albums)==null?void 0:e.find(s=>s._id===this.albumId);return f`
      <div class="container">
        <h2>Edit Album</h2>
        <form @submit=${this.save}>
          <input
            type="text"
            name="name"
            .value=${(t==null?void 0:t.name)||""}
            placeholder="Album name"
            required
          />
          <button type="submit">Save</button>
        </form>
        <p><a href="/app/albums">← Back to Albums</a></p>
      </div>
    `}save(t){var o,n;t.preventDefault();const e=t.target,s=new FormData(e),r={...(o=this.model.albums)==null?void 0:o.find(l=>l._id===this.albumId),name:((n=s.get("name"))==null?void 0:n.toString())??""};this.dispatchMessage(["album/save",{albumId:this.albumId,album:r,onSuccess:()=>history.back()}])}};ze.styles=w`
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
  `;let Ft=ze;So([O({attribute:"album-id"})],Ft.prototype,"albumId");C({"album-edit":Ft});var Eo=Object.defineProperty,Jt=(i,t,e,s)=>{for(var r=void 0,o=i.length-1,n;o>=0;o--)(n=i[o])&&(r=n(t,e,r)||r);return r&&Eo(t,e,r),r};const He=class He extends E{constructor(){super("musica:model"),this.genres=[],this.songs=[],this.albums=[],this.darkMode=localStorage.getItem("dark-mode")==="true"}connectedCallback(){super.connectedCallback(),this.loadGenres(),this.loadSongs(),this.loadAlbums()}toggleDarkMode(t){const e=t.target.checked;this.darkMode=e,document.body.classList.toggle("dark-mode",e),localStorage.setItem("dark-mode",String(e))}async loadGenres(){try{const t=await fetch("/api/genres");if(!t.ok)throw new Error("Failed to fetch genres");this.genres=await t.json()}catch(t){console.error("Error loading genres:",t)}}async loadSongs(){try{const t=await fetch("/api/songs");if(!t.ok)throw new Error("Failed to fetch songs");this.songs=await t.json()}catch(t){console.error("Error loading songs:",t)}}async loadAlbums(){try{const t=await fetch("/api/albums");if(!t.ok)throw new Error("Failed to fetch albums");this.albums=await t.json()}catch(t){console.error("Error loading albums:",t)}}getSongCountForGenre(t){return this.songs.filter(e=>e.genre===t).length}getAlbumCountForGenre(t){return this.albums.filter(e=>e.genre===t).length}async deleteGenre(t){if(confirm("Are you sure you want to delete this genre?"))try{if(!(await fetch(`/api/genres/${t}`,{method:"DELETE"})).ok)throw new Error("Failed to delete genre");this.loadGenres()}catch(e){console.error("Delete error:",e)}}goToAddGenre(){window.location.href="/app/genres/add"}goToEditGenre(t){window.location.href=`/app/genres/edit/${t}`}render(){return f`
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
                @change=${t=>this.toggleDarkMode(t)}
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
          ${this.genres.map(t=>f`
              <div class="genre-card">
                <div class="genre-title">${t.name}</div>
                <div class="genre-meta">
                  ${t.description?f`<p>${t.description}</p>`:""}
                  <p>${this.getSongCountForGenre(t.name)} song(s)</p>
                  <p>${this.getAlbumCountForGenre(t.name)} album(s)</p>
                </div>
                <div class="button-row">
                  <button
                    class="edit-btn"
                    @click=${()=>this.goToEditGenre(t._id)}
                  >
                    Edit
                  </button>
                  <button
                    class="delete-btn"
                    @click=${()=>this.deleteGenre(t._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            `)}
        </div>
      </div>
    `}};He.styles=w`
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
  `;let Y=He;Jt([x()],Y.prototype,"genres");Jt([x()],Y.prototype,"songs");Jt([x()],Y.prototype,"albums");Jt([x()],Y.prototype,"darkMode");customElements.define("genre-view",Y);const Fe=class Fe extends E{constructor(){super("musica:model")}render(){return f`
      <div class="container">
        <h2>Add Genre</h2>
        <form @submit=${this.save}>
          <input name="name" placeholder="Genre Name" required />
          <button type="submit">Add</button>
        </form>
        <p class="back-link"><a href="/app/genres">&#8592; Back to Genres</a></p>
      </div>
    `}save(t){t.preventDefault();const e=t.target,s=Object.fromEntries(new FormData(e));fetch("/api/genres",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(s)}).then(r=>{if(!r.ok)throw new Error("Failed to add genre");history.back()}).catch(console.error)}};Fe.styles=w`
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
  `;let ge=Fe;C({"genre-add":ge});var Po=Object.defineProperty,Co=(i,t,e,s)=>{for(var r=void 0,o=i.length-1,n;o>=0;o--)(n=i[o])&&(r=n(t,e,r)||r);return r&&Po(t,e,r),r};const qe=class qe extends E{constructor(){super("musica:model"),this.genreId=""}render(){var e;const t=(e=this.model.genres)==null?void 0:e.find(s=>s._id===this.genreId);return f`
      <div class="container">
        <h2>Edit Genre</h2>
        <form @submit=${this.save}>
          <input
            type="text"
            name="name"
            .value=${(t==null?void 0:t.name)||""}
            placeholder="Genre name"
            required
          />
          <button type="submit">Save</button>
        </form>
        <p><a href="/app/genres">← Back to Genres</a></p>
      </div>
    `}save(t){var o,n;t.preventDefault();const e=t.target,s=new FormData(e),r={...(o=this.model.genres)==null?void 0:o.find(l=>l._id===this.genreId),name:((n=s.get("name"))==null?void 0:n.toString())??""};this.dispatchMessage(["genre/save",{genreId:this.genreId,genre:r,onSuccess:()=>history.back()}])}};qe.styles=w`
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
  `;let qt=qe;Co([O({attribute:"genre-id"})],qt.prototype,"genreId");C({"genre-edit":qt});const Oo=[{path:"/app/songs",view:()=>f`<songs-view></songs-view>`},{path:"/app/songs/add",view:()=>f`<song-add></song-add>`},{path:"/app/songs/:songId/edit",view:i=>f`<song-edit song-id=${i.songId}></song-edit>`},{path:"/app/genres",view:()=>f`<genre-view></genre-view>`},{path:"/app/genres/add",view:()=>f`<genre-add></genre-add>`},{path:"/app/genre/:genreId/edit",view:i=>f`<genre-edit genre-id=${i.genreId}></genre-edit>`},{path:"/app/albums",view:()=>f`<album-view></album-view>`},{path:"/app/albums/add",view:()=>f`<album-add></album-add>`},{path:"/app/album/:albumId/edit",view:i=>f`<album-edit album-id=${i.albumId}></album-edit>`},{path:"/app/playlists",view:()=>f`<playlist-view></playlist-view>`},{path:"/app/playlist/:playlistId",view:i=>f`<playlist-view playlist-id=${i.playlistId}></playlist-view>`},{path:"/app/playlist/:playlistId/edit",view:i=>f`<playlist-edit playlist-id=${i.playlistId}></playlist-edit>`},{path:"/login",view:()=>f`<login-view></login-view>`},{path:"/register",view:()=>f`<register-view></register-view>`},{path:"/",redirect:"/app/songs"},{path:"*",redirect:"/app/songs"}];C({"mu-auth":P.Provider,"mu-history":Rr.Provider,"mu-store":class extends Ls.Provider{constructor(){super(to,Xi,"musica:auth")}},"mu-switch":class extends Pi.Element{constructor(){super(Oo,"musica:history","musica:auth")}},"blazing-header":zt});
