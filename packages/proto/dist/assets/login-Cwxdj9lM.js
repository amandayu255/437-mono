import{i as d,a as l,x as p,r as u,n as c,d as f,b}from"./state-Cs85tckI.js";var g=Object.defineProperty,i=(h,s,t,o)=>{for(var e=void 0,r=h.length-1,m;r>=0;r--)(m=h[r])&&(e=m(s,t,e)||e);return e&&g(s,t,e),e};const n=class n extends d{constructor(){super(...arguments),this.formData={},this.redirect="/"}get canSubmit(){return!!(this.api&&this.formData.username&&this.formData.password)}render(){return p`
      <form
        @change=${s=>this.handleChange(s)}
        @submit=${s=>this.handleSubmit(s)}
      >
        <slot></slot>
        <slot name="button">
          <button type="submit" ?disabled=${!this.canSubmit}>Login</button>
        </slot>
        <p class="error">${this.error}</p>
      </form>
    `}handleChange(s){const t=s.target,o=t==null?void 0:t.name,e=t==null?void 0:t.value,r=this.formData;switch(o){case"username":this.formData={...r,username:e};break;case"password":this.formData={...r,password:e};break}}handleSubmit(s){s.preventDefault(),this.canSubmit&&fetch((this==null?void 0:this.api)||"",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(this.formData)}).then(t=>{if(t.status!==200)throw"Login failed";return t.json()}).then(t=>{const{token:o}=t,e=new CustomEvent("auth:message",{bubbles:!0,composed:!0,detail:["auth/signin",{token:o,redirect:this.redirect}]});console.log("dispatching message",e),this.dispatchEvent(e)}).catch(t=>{console.log(t),this.error=t.toString()})}};n.styles=l`
    form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      max-width: 300px;
      margin: auto;
    }

    .error {
      color: red;
    }
  `;let a=n;i([u()],a.prototype,"formData");i([c()],a.prototype,"api");i([c()],a.prototype,"redirect");i([u()],a.prototype,"error");customElements.define("login-form",a);f({"mu-auth":b.Provider,"login-form":a});
